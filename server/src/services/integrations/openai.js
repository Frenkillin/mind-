import { env } from '../../config/env.js';

class OpenAIService {
  isConfigured() {
    return Boolean(env.openaiApiKey);
  }

  async chat(messages, system = '') {
    if (!this.isConfigured()) {
      throw new Error('OPENAI_API_KEY non configurata');
    }

    const apiMessages = system
      ? [{ role: 'system', content: system }, ...messages]
      : messages;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: apiMessages,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

export const openaiService = new OpenAIService();
