import { config } from './config.js';

export async function sendWhatsAppMessage(toPhone, textBody) {
  if (!config.meta.accessToken || !config.meta.phoneNumberId) {
    console.warn('[WhatsApp] ⚠️  No se puede enviar mensaje: faltan META_ACCESS_TOKEN o META_PHONE_NUMBER_ID.');
    console.log(`[WhatsApp Simulado] Para ${toPhone}: "${textBody}"`);
    return { success: false, simulated: true };
  }

  const endpoint = `https://graph.facebook.com/${config.meta.graphVersion}/${config.meta.phoneNumberId}/messages`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.meta.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: toPhone,
        type: 'text',
        text: {
          preview_url: false,
          body: textBody,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[WhatsApp] Error al enviar mensaje:', response.status, data);
      return { success: false, error: data };
    }

    console.log(`[WhatsApp] Mensaje enviado a ${toPhone} (ID: ${data.messages?.[0]?.id})`);
    return { success: true, data };
  } catch (err) {
    console.error('[WhatsApp] Excepción al enviar mensaje:', err);
    return { success: false, error: err };
  }
}

export async function markMessageAsRead(messageId) {
  if (!config.meta.accessToken || !config.meta.phoneNumberId) return;

  const endpoint = `https://graph.facebook.com/${config.meta.graphVersion}/${config.meta.phoneNumberId}/messages`;

  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.meta.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      }),
    });
  } catch (err) {
    console.warn('[WhatsApp] No se pudo marcar como leído:', err.message);
  }
}

export async function notifyAgentHandoff(userPhone, lastMessage) {
  if (!config.agentAlertPhone) return;

  const alertText = `🚨 *Alerta Gryp - Derivación a Humano*\n\nEl usuario con número *+${userPhone}* ha solicitado atención con un asesor o requiere cotización especial.\n\n*Último mensaje recibido:*\n"${lastMessage}"\n\n_El bot ha pausado sus respuestas automáticas para este número._`;

  console.log(`[WhatsApp] Notificando al asesor en ${config.agentAlertPhone}...`);
  await sendWhatsAppMessage(config.agentAlertPhone, alertText);
}
