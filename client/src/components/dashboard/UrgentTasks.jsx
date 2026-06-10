import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Calendar } from 'lucide-react';
import { api } from '../../services/api';
import './UrgentTasks.css';

const priorityLabels = {
  urgent: 'Urgente',
  high: 'Alta',
  medium: 'Media',
  low: 'Bassa',
};

export default function UrgentTasks({ tasks = [], onUpdate }) {
  async function toggleTask(task) {
    try {
      const newStatus = task.status === 'done' ? 'todo' : 'done';
      await api.tasks.update(task._id, { status: newStatus });
      onUpdate?.();
    } catch (error) {
      console.error(error);
    }
  }

  const isOverdue = (task) => task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div className="card urgent-tasks">
      <div className="card-title">
        <AlertTriangle size={16} />
        Priorità e scadenze
        <Link to="/projects" className="urgent-link">
          Vedi task <ArrowRight size={14} />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state urgent-empty">
          Nessun task urgente — ottimo lavoro!
        </div>
      ) : (
        <div className="urgent-list">
          {tasks.map((task) => (
            <div key={task._id} className={`urgent-item ${isOverdue(task) ? 'overdue' : ''}`}>
              <button className="urgent-check" onClick={() => toggleTask(task)} aria-label="Completa" />
              <div className="urgent-content">
                <span className="urgent-title">{task.title}</span>
                <div className="urgent-meta">
                  {(task.projectId?.name || task.projectId?.title) && (
                    <span className="urgent-project">{task.projectId.name || task.projectId.title}</span>
                  )}
                  {task.dueDate && (
                    <span className="urgent-due">
                      <Calendar size={12} />
                      {new Date(task.dueDate).toLocaleDateString('it-IT')}
                    </span>
                  )}
                </div>
              </div>
              <span className={`badge ${task.priority === 'urgent' ? 'badge-yellow' : 'badge-blue'}`}>
                {priorityLabels[task.priority] || task.priority}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
