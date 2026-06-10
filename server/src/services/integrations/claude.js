import { env } from '../../config/env.js';

class ClaudeService {
  isConfigured() {
    return Boolean(env.anthropicApiKey);
  }

  async chat(messages, system = '') {
    if (!this.isConfigured()) {
      throw new Error('ANTHROPIC_API_KEY non configurata');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system,
        messages: messages.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }
}

export const claudeService = new ClaudeService();
