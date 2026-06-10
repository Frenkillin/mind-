import { Database, Bot, Github, Cloud, Mic, Plug } from 'lucide-react';
import './SystemStatus.css';

const integrationConfig = [
  { key: 'database', label: 'MongoDB', icon: Database },
  { key: 'gemini', label: 'Gemini', icon: Bot },
  { key: 'claude', label: 'Claude', icon: Bot },
  { key: 'openai', label: 'OpenAI', icon: Bot },
  { key: 'github', label: 'GitHub', icon: Github },
  { key: 'replit', label: 'Replit', icon: Cloud },
  { key: 'voice', label: 'Voce', icon: Mic },
];

export default function SystemStatus({ system }) {
  const integrations = system?.integrations || {};
  const moduleStats = system?.moduleStats || {};

  return (
    <div className="card system-status">
      <div className="card-title">Stato sistema</div>

      <div className="system-ai-banner">
        <Bot size={18} />
        <div>
          <span className="system-ai-label">Motore AI</span>
          <span className={`system-ai-value ${system?.aiReady ? 'ready' : 'pending'}`}>
            {system?.aiReady ? 'Configurato' : 'Non configurato'}
          </span>
          <span className="system-ai-provider">
            Provider: {system?.activeAiProvider || 'gemini'} (default: gemini)
          </span>
        </div>
      </div>

      <div className="integration-list">
        {integrationConfig.map(({ key, label, icon: Icon }) => {
          const active = integrations[key];
          return (
            <div key={key} className="integration-row">
              <Icon size={16} />
              <span>{label}</span>
              <span className={`integration-dot ${active ? 'on' : 'off'}`} />
            </div>
          );
        })}
      </div>

      <div className="system-modules-summary">
        <div className="summary-item">
          <span className="summary-value">{moduleStats.active}</span>
          <span className="summary-label">Attivi</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{moduleStats.scaffold}</span>
          <span className="summary-label">In sviluppo</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{moduleStats.planned}</span>
          <span className="summary-label">Pianificati</span>
        </div>
      </div>

      <div className="mcp-placeholder">
        <Plug size={14} />
        <span>Sistema MCP — modulo pianificato</span>
      </div>
    </div>
  );
}
