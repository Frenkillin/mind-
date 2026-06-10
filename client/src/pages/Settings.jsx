import { useState, useEffect } from 'react';
import { Check, X, Mic } from 'lucide-react';
import { api } from '../services/api';
import '../styles/shared.css';
import './Settings.css';

const integrations = [
  { key: 'claude', name: 'Claude (Anthropic)', env: 'ANTHROPIC_API_KEY', description: 'AI conversazionale avanzata' },
  { key: 'openai', name: 'OpenAI', env: 'OPENAI_API_KEY', description: 'GPT-4o e modelli OpenAI' },
  { key: 'github', name: 'GitHub', env: 'GITHUB_TOKEN', description: 'Integrazione repository e codice' },
  { key: 'replit', name: 'Replit', env: 'REPLIT_API_KEY', description: 'Deploy e sviluppo cloud' },
  { key: 'voice', name: 'Controllo vocale', env: 'VOICE_ENABLED', description: 'Comandi vocali e speech-to-text' },
];

export default function Settings() {
  const [status, setStatus] = useState({});

  useEffect(() => {
    api.integrations.status()
      .then((res) => setStatus(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Impostazioni</h1>
        <p>Configura integrazioni e preferenze di MIND</p>
      </div>

      <section className="settings-section card">
        <h3 className="settings-title">Integrazioni</h3>
        <p className="settings-desc">
          Configura le chiavi API nel file <code>server/.env</code> per attivare le integrazioni.
        </p>

        <div className="integrations-list">
          {integrations.map((item) => {
            const isActive = status[item.key];
            return (
              <div key={item.key} className="integration-item">
                <div className="integration-info">
                  <span className="integration-name">{item.name}</span>
                  <span className="integration-desc">{item.description}</span>
                  <code className="integration-env">{item.env}</code>
                </div>
                <div className={`integration-status ${isActive ? 'active' : 'inactive'}`}>
                  {isActive ? <Check size={16} /> : <X size={16} />}
                  {isActive ? 'Attivo' : 'Non configurato'}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="settings-section card">
        <h3 className="settings-title">
          <Mic size={18} />
          Controllo vocale
        </h3>
        <p className="settings-desc">
          L&apos;architettura è pronta per il controllo vocale. Abilita VOICE_ENABLED=true nel file .env
          e configura il modulo voice nel frontend per attivare speech-to-text e text-to-speech.
        </p>
        <div className="voice-preview">
          <button className="btn btn-ghost voice-preview-btn" disabled>
            <Mic size={20} />
            Prossimamente
          </button>
        </div>
      </section>

      <section className="settings-section card">
        <h3 className="settings-title">Informazioni sistema</h3>
        <div className="system-info">
          <div className="info-row">
            <span>Versione</span>
            <span>1.0.0</span>
          </div>
          <div className="info-row">
            <span>Backend</span>
            <span>Node.js + Express</span>
          </div>
          <div className="info-row">
            <span>Database</span>
            <span>MongoDB</span>
          </div>
          <div className="info-row">
            <span>Frontend</span>
            <span>React + Vite</span>
          </div>
        </div>
      </section>
    </div>
  );
}
