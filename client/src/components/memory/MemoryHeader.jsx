import { Brain, Plus, RefreshCw } from 'lucide-react';
import './MemoryHeader.css';

export default function MemoryHeader({ onCreate, onSync, syncing }) {
  return (
    <header className="memory-header">
      <div>
        <div className="memory-header-badge">
          <Brain size={14} />
          Modulo 2
        </div>
        <h1>Memoria Permanente</h1>
        <p>Archivio semantico unificato — powered by Gemini, Claude, OpenAI e MCP</p>
      </div>
      <div className="memory-header-actions">
        <button className="btn btn-ghost" onClick={onSync} disabled={syncing}>
          <RefreshCw size={16} className={syncing ? 'spinning' : ''} />
          Sincronizza
        </button>
        <button className="btn btn-primary" onClick={onCreate}>
          <Plus size={18} />
          Nuova memoria
        </button>
      </div>
    </header>
  );
}
