import { Link } from 'react-router-dom';
import {
  FolderKanban,
  CheckSquare,
  Loader,
  CheckCircle,
  Bot,
  ArrowRight,
} from 'lucide-react';
import './OperationalCenter.css';

const cards = [
  { key: 'totalProjects', label: 'Progetti', icon: FolderKanban, to: '/projects', color: 'blue' },
  { key: 'totalTasks', label: 'Task totali', icon: CheckSquare, to: '/tasks', color: 'cyan' },
  { key: 'tasksInProgress', label: 'In corso', icon: Loader, to: '/tasks', color: 'amber' },
  { key: 'tasksCompleted', label: 'Completati', icon: CheckCircle, to: '/tasks', color: 'green' },
  { key: 'activeAgents', label: 'Agenti attivi', icon: Bot, to: '/agents', color: 'purple' },
];

export default function OperationalCenter({ operational = {} }) {
  return (
    <div className="card operational-center">
      <div className="card-title operational-center-title">
        Centro Operativo
        <Link to="/projects" className="operational-link">
          Gestisci <ArrowRight size={14} />
        </Link>
      </div>

      <div className="operational-grid">
        {cards.map(({ key, label, icon: Icon, to, color }) => (
          <Link key={key} to={to} className={`operational-card op-${color}`}>
            <Icon size={20} />
            <div>
              <span className="operational-value">{operational[key] ?? 0}</span>
              <span className="operational-label">{label}</span>
            </div>
          </Link>
        ))}
      </div>

      {(operational.tasksByStatus || operational.projectsByStatus) && (
        <div className="operational-breakdown">
          {operational.tasksByStatus && (
            <div className="breakdown-group">
              <span className="breakdown-title">Task per stato</span>
              <div className="breakdown-tags">
                {Object.entries(operational.tasksByStatus).map(([status, count]) => (
                  <span key={status} className="badge badge-blue">{status}: {count}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
