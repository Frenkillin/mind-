import {
  getProvidersStatus,
  setActiveProvider,
  getAiStatus,
  chatWithProvider,
  getActiveProvider,
} from '../services/ai/aiProviderManager.js';

export async function getProviders(_req, res) {
  const status = await getAiStatus();
  res.json({
    success: true,
    data: {
      activeProvider: status.activeProvider,
      defaultProvider: status.defaultProvider,
      providers: status.providers,
      aiReady: status.aiReady,
    },
  });
}

export async function setProvider(req, res) {
  const { provider } = req.body;

  if (!provider) {
    return res.status(400).json({ success: false, error: 'Campo provider richiesto' });
  }

  const settings = await setActiveProvider(provider);
  const providers = await getProvidersStatus();

  res.json({
    success: true,
    data: {
      activeProvider: settings.activeProvider,
      providers,
    },
  });
}

export async function chat(req, res) {
  const { messages, system, provider } = req.body;
  const active = provider || (await getActiveProvider());
  const response = await chatWithProvider(active, messages, system);
  res.json({ success: true, data: { response, provider: active } });
}
