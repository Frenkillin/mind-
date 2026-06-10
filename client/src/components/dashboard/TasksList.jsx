import { Check, Circle } from 'lucide-react';
import { api } from '../../services/api';

const priorityColors = {
  urgent: 'badge-yellow',
  high: 'badge-yellow',
  medium: 'badge-blue',
  low: 'badge-green',
};

export default function TasksList({ tasks = [], onUpdate }) {
  async function toggleTask(task) {
    try {
      await api.tasks.update(task._id, { completed: !task.completed });
      onUpdate?.();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="card">
      <div className="card-title">Attività da completare</div>

      {tasks.length === 0 ? (
        <div className="empty-state">Nessuna attività in sospeso</div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <button className="task-check" onClick={() => toggleTask(task)}>
                {task.completed ? <Check size={16} /> : <Circle size={16} />}
              </button>
              <div className="task-content">
                <span className="task-title">{task.title}</span>
                {task.projectId?.title && (
                  <span className="task-project">{task.projectId.title}</span>
                )}
              </div>
              <span className={`badge ${priorityColors[task.priority] || 'badge-blue'}`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .task-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .task-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem; border-radius: var(--radius-sm); transition: background var(--transition); }
        .task-item:hover { background: var(--bg-card-hover); }
        .task-item.completed .task-title { text-decoration: line-through; color: var(--text-muted); }
        .task-check { color: var(--text-muted); padding: 0; display: flex; }
        .task-check:hover { color: var(--accent); }
        .task-content { flex: 1; min-width: 0; }
        .task-title { display: block; font-size: 0.9rem; }
        .task-project { font-size: 0.75rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
