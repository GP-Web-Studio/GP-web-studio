import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  meta: {
    verifyToken: process.env.META_VERIFY_TOKEN || 'gryp_secure_verify_token_2025',
    accessToken: process.env.META_ACCESS_TOKEN || '',
    phoneNumberId: process.env.META_PHONE_NUMBER_ID || '',
    graphVersion: process.env.META_GRAPH_VERSION || 'v21.0',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },
  agentAlertPhone: process.env.AGENT_ALERT_PHONE || '59899259908',
};

export function validateConfig() {
  const missing = [];
  if (!config.meta.accessToken) missing.push('META_ACCESS_TOKEN');
  if (!config.meta.phoneNumberId) missing.push('META_PHONE_NUMBER_ID');
  if (!config.openai.apiKey) missing.push('OPENAI_API_KEY');

  if (missing.length > 0) {
    console.warn(`[Config] ⚠️  Variables faltantes en .env: ${missing.join(', ')}`);
    console.warn(`[Config] ℹ️  El servidor arrancará, pero las respuestas con IA o envíos a WhatsApp requerirán estos tokens.`);
  } else {
    console.log(`[Config] ✅ Configuración cargada correctamente.`);
  }
}
