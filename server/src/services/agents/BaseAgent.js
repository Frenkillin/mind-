import { chat, getPlaceholderMessage } from '../ai/aiProviderManager.js';

export class BaseAgent {
  constructor(type, systemPrompt) {
    this.type = type;
    this.systemPrompt = systemPrompt;
  }

  getSystemPrompt() {
    return this.systemPrompt;
  }

  async processMessage(message, history = []) {
    const conversationHistory = history
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const response = await chat(conversationHistory, this.systemPrompt);
      if (response) return response;
    } catch (error) {
      console.error(`AI Provider error (${this.type}):`, error.message);
    }

    return getPlaceholderMessage(this.type, message);
  }
}
