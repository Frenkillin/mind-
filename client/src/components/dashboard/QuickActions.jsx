import { Link } from 'react-router-dom';
import { Plus, FolderKanban, CheckSquare, Lightbulb, Bot, StickyNote } from 'lucide-react';
import './QuickActions.css';

const actions = [
  { to: '/projects', icon: FolderKanban, label: 'Nuovo progetto', hint: 'Gestione progetti' },
  { to: '/projects', icon: CheckSquare, label: 'Aggiungi task', hint: 'Gestione task' },
  { to: '/ideas', icon: Lightbulb, label: 'Salva idea', hint: 'Memoria' },
  { to: '/agents', icon: Bot, label: 'Chat AI', hint: 'Agenti' },
  { to: '/', icon: StickyNote, label: 'Nota rapida', hint: 'Dashboard' },
];

export default function QuickActions() {
  return (
    <div className="card quick-actions">
      <div className="card-title">
        <Plus size={16} />
        Azioni rapide
      </div>
      <div className="quick-actions-grid">
        {actions.map(({ to, icon: Icon, label, hint }) => (
          <Link key={label} to={to} className="quick-action-btn">
            <Icon size={18} />
            <div>
              <span className="quick-action-label">{label}</span>
              <span className="quick-action-hint">{hint}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
