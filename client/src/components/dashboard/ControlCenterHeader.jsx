import { Activity, RefreshCw } from 'lucide-react';
import './ControlCenterHeader.css';

export default function ControlCenterHeader({ meta, system, onRefresh, refreshing }) {
  const isOnline = system?.status === 'online';

  return (
    <header className="cc-header">
      <div className="cc-header-main">
        <div className="cc-header-badge">Centro di controllo</div>
        <h1>{meta?.greeting || 'Bentornato'} in MIND</h1>
        <p>Panoramica unificata di tutti i tuoi progetti, task e sistemi connessi</p>
      </div>

      <div className="cc-header-side">
        <div className={`cc-system-pill ${isOnline ? 'online' : 'degraded'}`}>
          <Activity size={14} />
          <span>{isOnline ? 'Sistema online' : 'Sistema degradato'}</span>
        </div>
        <button
          className="btn btn-ghost cc-refresh"
          onClick={onRefresh}
          disabled={refreshing}
          title="Aggiorna dashboard"
        >
          <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
          Aggiorna
        </button>
      </div>
    </header>
  );
}
