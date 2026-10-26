import express from 'express';
import { config, validateConfig } from './config.js';
import { memory } from './memory.js';
import { generateBotResponse } from './openaiService.js';
import { sendWhatsAppMessage, markMessageAsRead, notifyAgentHandoff } from './whatsappService.js';

const app = express();
app.use(express.json());

// Validar credenciales al iniciar
validateConfig();

// Cache para evitar procesar mensajes duplicados de Meta
const processedMessages = new Set();

/**
 * 1. Verificación del Webhook por Meta
 * Meta envía una petición GET con query params para validar el webhook.
 */
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === config.meta.verifyToken) {
      console.log('[Webhook] ✅ Webhook verificado exitosamente por Meta.');
      return res.status(200).send(challenge);
    } else {
      console.warn('[Webhook] ❌ Token de verificación incorrecto.');
      return res.sendStatus(403);
    }
  }

  res.sendStatus(400);
});

/**
 * 2. Recepción de Eventos y Mensajes de WhatsApp
 * Meta envía una petición POST cada vez que un usuario escribe.
 */
app.post('/webhook', async (req, res) => {
  const body = req.body;

  // Responder 200 OK inmediatamente a Meta para evitar reintentos innecesarios
  res.status(200).send('EVENT_RECEIVED');

  if (body.object !== 'whatsapp_business_account') {
    return;
  }

  try {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) {
      // Notificaciones de estado (delivered, read, sent), se ignoran
      return;
    }

    const message = messages[0];
    const messageId = message.id;
    const fromPhone = message.from; // Número del cliente en formato internacional

    // Evitar procesar el mismo mensaje dos veces
    if (processedMessages.has(messageId)) {
      return;
    }
    processedMessages.add(messageId);
    // Limpiar caché de IDs para no crecer indefinidamente
    if (processedMessages.size > 2000) {
      const firstItems = Array.from(processedMessages).slice(0, 500);
      firstItems.forEach(id => processedMessages.delete(id));
    }

    // Marcar como leído en WhatsApp (dos tildes azules)
    markMessageAsRead(messageId).catch(() => {});

    // Procesar únicamente mensajes de texto por el momento
    if (message.type !== 'text') {
      console.log(`[Webhook] Mensaje de tipo "${message.type}" recibido de ${fromPhone}. Solo se procesa texto actualmente.`);
      await sendWhatsAppMessage(
        fromPhone,
        '¡Hola! Por el momento solo puedo procesar mensajes de texto. Si nos envías un audio o archivo, un asesor humano lo revisará a la brevedad.'
      );
      return;
    }

    const userText = message.text.body.trim();
    console.log(`[Webhook] 📩 Mensaje de +${fromPhone}: "${userText}"`);

    // Comando especial para reiniciar el bot si estaba en modo humano
    if (userText.toLowerCase() === '/bot' || userText.toLowerCase() === '/activar') {
      memory.setHumanMode(fromPhone, false);
      await sendWhatsAppMessage(fromPhone, '🤖 *Asistente reactivado.* ¿En qué más puedo ayudarte?');
      return;
    }

    // Si el usuario está en modo atención humana, el bot guarda silencio
    if (memory.isHumanMode(fromPhone)) {
      console.log(`[Webhook] 👤 +${fromPhone} está en Modo Asesor Humano. El bot no interfiere.`);
      return;
    }

    // Generar respuesta inteligente con OpenAI y base de conocimiento Gryp
    const { reply, handoff } = await generateBotResponse(fromPhone, userText);

    // Enviar respuesta al usuario
    await sendWhatsAppMessage(fromPhone, reply);

    // Si hubo derivación, alertar al asesor
    if (handoff) {
      await notifyAgentHandoff(fromPhone, userText);
    }
  } catch (error) {
    console.error('[Webhook] Error crítico al procesar evento:', error);
  }
});

/**
 * 3. Endpoint de salud
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Gryp WhatsApp Chatbot',
    timestamp: new Date().toISOString(),
    sessionsActive: memory.sessions.size,
  });
});

/**
 * 4. Endpoint administrativo para reiniciar estado de un número
 */
app.post('/admin/reset/:phone', (req, res) => {
  const phone = req.params.phone;
  memory.setHumanMode(phone, false);
  res.json({ success: true, message: `Sesión de ${phone} reiniciada a BOT_ACTIVE.` });
});

// Iniciar servidor
app.listen(config.port, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Gryp WhatsApp Chatbot Server iniciado en puerto ${config.port}`);
  console.log(`📡 Webhook URL: http://localhost:${config.port}/webhook`);
  console.log(`🩺 Health check: http://localhost:${config.port}/health`);
  console.log(`======================================================\n`);
});
