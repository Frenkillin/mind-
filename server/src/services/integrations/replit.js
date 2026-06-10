import { env } from '../../config/env.js';

class ReplitService {
  isConfigured() {
    return Boolean(env.replitApiKey);
  }

  async listRepls() {
    if (!this.isConfigured()) {
      return { configured: false, repls: [] };
    }

    // Placeholder per integrazione Replit GraphQL API
    return {
      configured: true,
      repls: [],
      message: 'Integrazione Replit pronta — configura REPLIT_API_KEY per attivarla',
    };
  }

  async createRepl(_options) {
    if (!this.isConfigured()) {
      throw new Error('REPLIT_API_KEY non configurata');
    }

    throw new Error('Integrazione Replit in fase di implementazione');
  }
}

export const replitService = new ReplitService();
