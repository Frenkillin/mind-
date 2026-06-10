import { env } from '../../config/env.js';

class GeminiService {
  isConfigured() {
    return Boolean(env.geminiApiKey);
  }

  async chat(messages, system = '') {
    if (!this.isConfigured()) {
      throw new Error('GEMINI_API_KEY non configurata');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`;

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const body = { contents };

    if (system) {
      body.systemInstruction = { parts: [{ text: system }] };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Gemini API: risposta vuota');
    }

    return text;
  }
}

export const geminiService = new GeminiService();
