import { claudeService } from '../integrations/claude.js';
import { openaiService } from '../integrations/openai.js';

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

    if (claudeService.isConfigured()) {
      return claudeService.chat(conversationHistory, this.systemPrompt);
    }

    if (openaiService.isConfigured()) {
      return openaiService.chat(conversationHistory, this.systemPrompt);
    }

    return this.getPlaceholderResponse(message);
  }

  getPlaceholderResponse(message) {
    return `[${this.type} Agent] Ho ricevuto il tuo messaggio: "${message}". Configura ANTHROPIC_API_KEY o OPENAI_API_KEY per attivare le risposte AI reali.`;
  }
}
