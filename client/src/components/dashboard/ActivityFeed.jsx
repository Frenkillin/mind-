import { Clock } from 'lucide-react';

const typeIcons = {
  project_created: '📁',
  project_updated: '📝',
  task_completed: '✅',
  task_created: '📋',
  idea_saved: '💡',
  goal_updated: '🎯',
  note_created: '📌',
  agent_interaction: '🤖',
  integration_used: '🔗',
};

export default function ActivityFeed({ activities = [] }) {
  return (
    <div className="card">
      <div className="card-title">
        <Clock size={16} />
        Attività recenti
      </div>

      {activities.length === 0 ? (
        <div className="empty-state">Nessuna attività registrata</div>
      ) : (
        <div className="activity-list">
          {activities.map((activity) => (
            <div key={activity._id} className="activity-item">
              <span className="activity-icon">{typeIcons[activity.type] || '•'}</span>
              <div className="activity-content">
                <span className="activity-title">{activity.title}</span>
                <span className="activity-time">
                  {new Date(activity.createdAt).toLocaleString('it-IT', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .activity-list { display: flex; flex-direction: column; gap: 0.5rem; max-height: 320px; overflow-y: auto; }
        .activity-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.5rem; border-radius: var(--radius-sm); }
        .activity-item:hover { background: var(--bg-card-hover); }
        .activity-icon { font-size: 1rem; flex-shrink: 0; }
        .activity-content { flex: 1; min-width: 0; }
        .activity-title { display: block; font-size: 0.85rem; }
        .activity-time { font-size: 0.7rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
