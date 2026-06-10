import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Lightbulb,
  Bot,
  Brain,
  Settings,
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Progetti' },
  { to: '/ideas', icon: Lightbulb, label: 'Idee' },
  { to: '/agents', icon: Bot, label: 'Agenti AI' },
  { to: '/memory', icon: Brain, label: 'Memoria' },
  { to: '/settings', icon: Settings, label: 'Impostazioni' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Brain size={24} />
        </div>
        <div>
          <span className="sidebar-title">MIND</span>
          <span className="sidebar-subtitle">Cervello AI</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className="status-dot" />
          Sistema attivo
        </div>
      </div>
    </aside>
  );
}
