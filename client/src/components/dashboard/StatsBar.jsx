import {
  FolderKanban,
  CheckSquare,
  Target,
  Lightbulb,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import './StatsBar.css';

const statConfig = [
  { key: 'activeProjects', label: 'Progetti attivi', icon: FolderKanban, color: 'blue' },
  { key: 'pendingTasks', label: 'Task aperti', icon: CheckSquare, color: 'cyan' },
  { key: 'overdueTasks', label: 'Task scaduti', icon: AlertTriangle, color: 'amber', alert: true },
  { key: 'activeGoals', label: 'Obiettivi', icon: Target, color: 'purple' },
  { key: 'totalIdeas', label: 'Idee salvate', icon: Lightbulb, color: 'green' },
  { key: 'activitiesToday', label: 'Attività oggi', icon: Zap, color: 'blue' },
];

export default function StatsBar({ stats = {} }) {
  return (
    <div className="stats-bar">
      {statConfig.map(({ key, label, icon: Icon, color, alert }) => {
        const value = stats[key] ?? 0;
        const isAlert = alert && value > 0;
        return (
          <div
            key={key}
            className={`stat-card stat-${color} ${isAlert ? 'stat-alert' : ''}`}
          >
            <div className="stat-icon">
              <Icon size={20} />
            </div>
            <div>
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
