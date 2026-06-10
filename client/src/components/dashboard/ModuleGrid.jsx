import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Brain,
  FolderKanban,
  CheckSquare,
  FileArchive,
  MessageSquare,
  Mic,
  Plug,
  Github,
  Cloud,
} from 'lucide-react';
import { MODULE_STATUS } from '../../config/modules';
import './ModuleGrid.css';

const iconComponents = {
  'layout-dashboard': LayoutDashboard,
  brain: Brain,
  'folder-kanban': FolderKanban,
  'check-square': CheckSquare,
  'file-archive': FileArchive,
  'message-square': MessageSquare,
  mic: Mic,
  plug: Plug,
  github: Github,
  cloud: Cloud,
};

export default function ModuleGrid({ modules = [], moduleStats = {} }) {
  return (
    <div className="card module-grid-card">
      <div className="card-title module-grid-title">
        Moduli MIND
        <span className="module-grid-count">
          {moduleStats.active}/{moduleStats.total} attivi
        </span>
      </div>

      <div className="module-grid">
        {modules.map((mod) => {
          const Icon = iconComponents[mod.icon] || LayoutDashboard;
          const status = MODULE_STATUS[mod.status] || MODULE_STATUS.planned;
          const isNavigable = mod.status !== 'planned';

          const content = (
            <>
              <div className={`module-icon module-icon-${mod.status}`}>
                <Icon size={18} />
              </div>
              <div className="module-info">
                <span className="module-name">{mod.name}</span>
                <span className="module-desc">{mod.description}</span>
              </div>
              <span className={`module-status ${status.className}`}>{status.label}</span>
            </>
          );

          if (isNavigable) {
            return (
              <Link key={mod.id} to={mod.route} className="module-item module-link">
                {content}
              </Link>
            );
          }

          return (
            <div key={mod.id} className="module-item module-disabled">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
