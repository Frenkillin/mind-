import { Link } from 'react-router-dom';
import { Plus, FolderKanban, CheckSquare, Lightbulb, Bot, StickyNote } from 'lucide-react';
import './QuickActions.css';

const actions = [
  { to: '/projects', icon: FolderKanban, label: 'Nuovo progetto', hint: 'Gestione progetti' },
  { to: '/tasks', icon: CheckSquare, label: 'Aggiungi task', hint: 'Kanban task' },
  { to: '/ideas', icon: Lightbulb, label: 'Salva idea', hint: 'Memoria' },
  { to: '/chat', icon: Bot, label: 'Chat AI', hint: 'Conversazioni' },
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
