import { env } from '../../config/env.js';

class VoiceService {
  getStatus() {
    return {
      enabled: env.voiceEnabled,
      supported: typeof globalThis.SpeechRecognition !== 'undefined' ||
        typeof globalThis.webkitSpeechRecognition !== 'undefined',
      features: {
        speechToText: env.voiceEnabled,
        textToSpeech: env.voiceEnabled,
        wakeWord: false,
      },
      message: env.voiceEnabled
        ? 'Controllo vocale abilitato'
        : 'Imposta VOICE_ENABLED=true per abilitare il controllo vocale',
    };
  }

  // Endpoint placeholder per comandi vocali futuri
  async processVoiceCommand(transcript) {
    return {
      transcript,
      intent: 'unknown',
      action: null,
      message: 'Elaborazione comandi vocali in fase di implementazione',
    };
  }
}

export const voiceService = new VoiceService();
