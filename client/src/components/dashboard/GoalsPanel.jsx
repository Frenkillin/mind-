import { Target } from 'lucide-react';

const categoryLabels = {
  personal: 'Personale',
  business: 'Business',
  learning: 'Apprendimento',
  health: 'Salute',
  other: 'Altro',
};

export default function GoalsPanel({ goals = [] }) {
  return (
    <div className="card">
      <div className="card-title">
        <Target size={16} />
        Obiettivi
      </div>

      {goals.length === 0 ? (
        <div className="empty-state">Nessun obiettivo attivo</div>
      ) : (
        <div className="goals-list">
          {goals.map((goal) => (
            <div key={goal._id} className="goal-item">
              <div className="goal-header">
                <span className="goal-title">{goal.title}</span>
                <span className="badge badge-purple">{categoryLabels[goal.category]}</span>
              </div>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill goal-fill"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <span className="progress-text">{goal.progress}%</span>
              </div>
              {goal.targetDate && (
                <span className="goal-date">
                  Scadenza: {new Date(goal.targetDate).toLocaleDateString('it-IT')}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .goals-list { display: flex; flex-direction: column; gap: 1rem; }
        .goal-item { padding: 0.75rem; background: var(--bg-input); border-radius: var(--radius-sm); }
        .goal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
        .goal-title { font-weight: 500; font-size: 0.9rem; }
        .goal-progress { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
        .progress-bar { flex: 1; height: 6px; background: var(--bg-card); border-radius: 3px; overflow: hidden; }
        .goal-fill { background: linear-gradient(90deg, var(--accent), var(--purple)); }
        .progress-text { font-size: 0.75rem; color: var(--text-muted); }
        .goal-date { font-size: 0.7rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
