import AiSettings, { AI_PROVIDERS, DEFAULT_AI_PROVIDER } from '../../models/AiSettings.js';
import { geminiService } from '../integrations/gemini.js';
import { claudeService } from '../integrations/claude.js';
import { openaiService } from '../integrations/openai.js';

const PROVIDER_META = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Provider AI predefinito per chat, memoria e automazioni',
    envKey: 'GEMINI_API_KEY',
    isDefault: true,
  },
  claude: {
    id: 'claude',
    name: 'Claude (Anthropic)',
    description: 'Modello conversazionale Anthropic',
    envKey: 'ANTHROPIC_API_KEY',
    isDefault: false,
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o — opzionale, disattivato di default',
    envKey: 'OPENAI_API_KEY',
    isDefault: false,
  },
};

const SERVICE_MAP = {
  gemini: geminiService,
  claude: claudeService,
  openai: openaiService,
};

const FALLBACK_ORDER = ['gemini', 'claude', 'openai'];

export async function ensureAiSettings() {
  let settings = await AiSettings.findOne({ key: 'global' });
  if (!settings) {
    settings = await AiSettings.create({ key: 'global', activeProvider: DEFAULT_AI_PROVIDER });
  }
  return settings;
}

export async function getActiveProvider() {
  const settings = await ensureAiSettings();
  return settings.activeProvider;
}

export async function setActiveProvider(provider) {
  if (!AI_PROVIDERS.includes(provider)) {
    throw new Error(`Provider non valido: ${provider}`);
  }

  const settings = await ensureAiSettings();
  settings.activeProvider = provider;
  await settings.save();
  return settings;
}

function isProviderAvailable(provider) {
  const service = SERVICE_MAP[provider];
  if (!service) return false;
  if (provider === 'openai' && !openaiService.isEnabled()) return false;
  return service.isConfigured();
}

export async function getProvidersStatus() {
  const settings = await ensureAiSettings();
  const activeProvider = settings.activeProvider;

  return AI_PROVIDERS.map((id) => {
    const meta = PROVIDER_META[id];
    const configured = isProviderAvailable(id);
    const enabled = id === 'openai' ? openaiService.isEnabled() : true;

    return {
      ...meta,
      configured,
      enabled,
      isActive: activeProvider === id,
      available: configured && enabled,
    };
  });
}

function resolveProvider(preferred) {
  if (preferred && isProviderAvailable(preferred)) {
    return preferred;
  }

  for (const id of FALLBACK_ORDER) {
    if (isProviderAvailable(id)) return id;
  }

  return null;
}

export async function chat(messages, system = '') {
  const activeProvider = await getActiveProvider();
  const provider = resolveProvider(activeProvider);

  if (!provider) {
    return null;
  }

  return SERVICE_MAP[provider].chat(messages, system);
}

export async function chatWithProvider(provider, messages, system = '') {
  const resolved = resolveProvider(provider);
  if (!resolved) {
    throw new Error('Nessun provider AI configurato');
  }
  return SERVICE_MAP[resolved].chat(messages, system);
}

export function getPlaceholderMessage(agentType, message) {
  return (
    `[${agentType} Agent] Ho ricevuto il tuo messaggio: "${message}". ` +
    'Configura GEMINI_API_KEY in server/.env per attivare le risposte AI. ' +
    'Gemini è il provider predefinito di MIND.'
  );
}

export async function getAiStatus() {
  const settings = await ensureAiSettings();
  const providers = await getProvidersStatus();
  const anyAvailable = providers.some((p) => p.available);

  return {
    activeProvider: settings.activeProvider,
    defaultProvider: DEFAULT_AI_PROVIDER,
    providers,
    aiReady: anyAvailable,
    openaiEnabled: openaiService.isEnabled(),
  };
}
