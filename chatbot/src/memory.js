/**
 * Almacenamiento en memoria para el historial de conversaciones y estado de derivación.
 * Para producción a gran escala se puede conectar a Redis o Supabase.
 */

class ConversationMemory {
  constructor() {
    this.sessions = new Map();
    // Expiración por inactividad: 24 horas (en ms)
    this.SESSION_TIMEOUT = 24 * 60 * 60 * 1000;
  }

  getSession(phone) {
    let session = this.sessions.get(phone);

    if (!session || (Date.now() - session.lastUpdated > this.SESSION_TIMEOUT)) {
      session = {
        phone,
        history: [],
        state: 'BOT_ACTIVE', // 'BOT_ACTIVE' | 'HUMAN_MODE'
        lead: {
          name: null,
          business: null,
          packageInterest: null,
        },
        createdAt: Date.now(),
        lastUpdated: Date.now(),
      };
      this.sessions.set(phone, session);
    } else {
      session.lastUpdated = Date.now();
    }

    return session;
  }

  addMessage(phone, role, content) {
    const session = this.getSession(phone);
    session.history.push({ role, content, timestamp: Date.now() });

    // Mantener solo los últimos 10 mensajes para no sobrecargar el prompt ni inflar costos
    if (session.history.length > 10) {
      session.history = session.history.slice(-10);
    }
  }

  getHistory(phone) {
    const session = this.getSession(phone);
    return session.history.map(m => ({ role: m.role, content: m.content }));
  }

  setHumanMode(phone, enabled = true) {
    const session = this.getSession(phone);
    session.state = enabled ? 'HUMAN_MODE' : 'BOT_ACTIVE';
    session.lastUpdated = Date.now();
  }

  isHumanMode(phone) {
    const session = this.getSession(phone);
    return session.state === 'HUMAN_MODE';
  }

  updateLeadInfo(phone, info) {
    const session = this.getSession(phone);
    session.lead = { ...session.lead, ...info };
  }
}

export const memory = new ConversationMemory();
