import { useState } from 'react';
import { Check, Sparkles, Bot, Zap } from 'lucide-react';
import { api } from '../../services/api';
import './AIProviderSelector.css';

const ICONS = {
  gemini: Sparkles,
  claude: Bot,
  openai: Zap,
};

export default function AIProviderSelector({ initialData, onUpdate }) {
  const [providers, setProviders] = useState(initialData?.providers || []);
  const [activeProvider, setActiveProvider] = useState(initialData?.activeProvider || 'gemini');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSelect(providerId) {
    setSaving(true);
    setError(null);
    try {
      const res = await api.ai.setProvider(providerId);
      setActiveProvider(res.data.activeProvider);
      setProviders(res.data.providers);
      onUpdate?.(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="settings-section card ai-provider-section">
      <h3 className="settings-title">
        <Sparkles size={18} />
        Provider AI
      </h3>
      <p className="settings-desc">
        Gemini è il provider predefinito di MIND. La scelta viene salvata nel database
        e usata per chat, memoria, ragionamento e automazioni.
      </p>

      <div className="ai-provider-grid">
        {providers.map((provider) => {
          const Icon = ICONS[provider.id] || Bot;
          const isActive = activeProvider === provider.id;
          const canSelect = provider.enabled !== false;

          return (
            <button
              key={provider.id}
              type="button"
              className={`ai-provider-card ${isActive ? 'active' : ''} ${!canSelect ? 'disabled' : ''}`}
              onClick={() => canSelect && handleSelect(provider.id)}
              disabled={saving || !canSelect}
            >
              <div className="ai-provider-card-header">
                <div className="ai-provider-icon">
                  <Icon size={20} />
                </div>
                <div className="ai-provider-badges">
                  {provider.isDefault && <span className="ai-badge default">Default</span>}
                  {isActive && <span className="ai-badge active">Attivo</span>}
                </div>
              </div>
              <span className="ai-provider-name">{provider.name}</span>
              <span className="ai-provider-desc">{provider.description}</span>
              <div className="ai-provider-status-row">
                <span className={`ai-status-dot ${provider.configured ? 'on' : 'off'}`} />
                <span>{provider.configured ? 'Configurato' : 'Non configurato'}</span>
                {provider.id === 'openai' && !provider.enabled && (
                  <span className="ai-disabled-label">Disattivato</span>
                )}
              </div>
              {isActive && (
                <div className="ai-provider-check">
                  <Check size={16} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {error && <p className="ai-provider-error">{error}</p>}

      <p className="settings-desc ai-provider-env-hint">
        Configura le chiavi in <code>server/.env</code>:
        <code>GEMINI_API_KEY</code>, <code>ANTHROPIC_API_KEY</code>, <code>OPENAI_API_KEY</code>
        (con <code>OPENAI_ENABLED=true</code> per attivare OpenAI).
      </p>
    </section>
  );
}
