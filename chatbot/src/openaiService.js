import { config } from './config.js';
import { GRYP_KNOWLEDGE } from './knowledge.js';
import { memory } from './memory.js';

export async function generateBotResponse(userPhone, userMessage) {
  if (!config.openai.apiKey) {
    return {
      reply: '¡Hola! Gracias por comunicarte con Gryp. En este momento el servicio de IA está en configuración. En breve un asesor te responderá directamente.',
      handoff: false,
    };
  }

  // Detectar palabras clave directas de derivación
  const lowerMsg = userMessage.toLowerCase();
  const directHandoffKeywords = ['humano', 'persona real', 'asesor', 'hablar con alguien', 'operador'];
  const asksForHuman = directHandoffKeywords.some(kw => lowerMsg.includes(kw));

  if (asksForHuman) {
    memory.setHumanMode(userPhone, true);
    return {
      reply: '¡Entendido! Te estoy derivando en este momento con un asesor de Gryp para que te atienda personalmente. 👨‍💻 Un momento por favor.',
      handoff: true,
    };
  }

  // Guardar mensaje del usuario en el historial
  memory.addMessage(userPhone, 'user', userMessage);

  const systemPrompt = `
${GRYP_KNOWLEDGE}

INSTRUCCIONES CRÍTICAS:
- Eres el asistente oficial de Gryp en WhatsApp.
- Tu misión es resolver dudas sobre nuestros servicios de diseño web y chatbots con IA, orientar al cliente y conseguir que agende o pida cotización.
- Mantén respuestas directas, amigables y de no más de 2 o 3 párrafos breves.
- Si el usuario solicita explícitamente hablar con un humano o asesor, o si el caso requiere una negociación compleja de presupuesto, incluye al final de tu respuesta el comando especial: [DERIVAR_HUMANO].
`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...memory.getHistory(userPhone),
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openai.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.openai.model,
        messages,
        temperature: 0.7,
        max_tokens: 450,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[OpenAI] Error en llamada a la API:', response.status, errText);
      return {
        reply: 'Disculpa la molestia, tuve un pequeño inconveniente al procesar tu consulta. Ya le avisé a nuestro equipo para que te responda a la brevedad.',
        handoff: true,
      };
    }

    const data = await response.json();
    let replyText = data.choices?.[0]?.message?.content || '¿En qué te puedo ayudar hoy con respecto a tu sitio web o chatbot?';

    // Comprobar si el modelo decidió derivar
    let handoff = false;
    if (replyText.includes('[DERIVAR_HUMANO]')) {
      handoff = true;
      replyText = replyText.replace('[DERIVAR_HUMANO]', '').trim();
      memory.setHumanMode(userPhone, true);
    }

    // Guardar respuesta del bot en el historial
    memory.addMessage(userPhone, 'assistant', replyText);

    return { reply: replyText, handoff };
  } catch (error) {
    console.error('[OpenAI] Excepción al generar respuesta:', error);
    return {
      reply: '¡Hola! Recibimos tu mensaje. En breves instantes un asesor de Gryp se pondrá en contacto contigo.',
      handoff: true,
    };
  }
}
