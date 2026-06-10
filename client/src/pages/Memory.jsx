import { useState, useEffect } from 'react';
import { Clock, FolderKanban, Lightbulb, CheckSquare } from 'lucide-react';
import { api } from '../services/api';
import '../styles/shared.css';
import './Memory.css';

const typeConfig = {
  project_created: { icon: FolderKanban, label: 'Progetto' },
  project_updated: { icon: FolderKanban, label: 'Progetto' },
  idea_saved: { icon: Lightbulb, label: 'Idea' },
  task_completed: { icon: CheckSquare, label: 'Attività' },
  task_created: { icon: CheckSquare, label: 'Attività' },
  goal_updated: { icon: Clock, label: 'Obiettivo' },
  note_created: { icon: Clock, label: 'Nota' },
  agent_interaction: { icon: Clock, label: 'Agente' },
  integration_used: { icon: Clock, label: 'Integrazione' },
};

export default function Memory() {
  const [activities, setActivities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('history');

  useEffect(() => {
    Promise.all([
      api.activities.list(100),
      api.projects.list(),
      api.ideas.list(),
    ])
      .then(([actRes, projRes, ideaRes]) => {
        setActivities(actRes.data);
        setProjects(projRes.data);
        setIdeas(ideaRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Memoria</h1>
        <p>Cronologia persistente di progetti, idee e attività</p>
      </div>

      <div className="memory-tabs">
        <button className={`memory-tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
          Cronologia
        </button>
        <button className={`memory-tab ${tab === 'projects' ? 'active' : ''}`} onClick={() => setTab('projects')}>
          Progetti ({projects.length})
        </button>
        <button className={`memory-tab ${tab === 'ideas' ? 'active' : ''}`} onClick={() => setTab('ideas')}>
          Idee ({ideas.length})
        </button>
      </div>

      {tab === 'history' && (
        <div className="memory-timeline">
          {activities.length === 0 ? (
            <div className="empty-state card">Nessuna attività registrata.</div>
          ) : (
            activities.map((activity) => {
              const config = typeConfig[activity.type] || { icon: Clock, label: 'Evento' };
              const Icon = config.icon;
              return (
                <div key={activity._id} className="timeline-item">
                  <div className="timeline-dot">
                    <Icon size={14} />
                  </div>
                  <div className="timeline-content card">
                    <div className="timeline-header">
                      <span className="badge badge-blue">{config.label}</span>
                      <span className="timeline-date">
                        {new Date(activity.createdAt).toLocaleString('it-IT')}
                      </span>
                    </div>
                    <h4>{activity.title}</h4>
                    {activity.description && <p>{activity.description}</p>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === 'projects' && (
        <div className="memory-grid">
          {projects.map((p) => (
            <div key={p._id} className="card memory-item">
              <h4>{p.title}</h4>
              <p>{p.description || 'Nessuna descrizione'}</p>
              <span className="memory-date">
                Creato: {new Date(p.createdAt).toLocaleDateString('it-IT')}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'ideas' && (
        <div className="memory-grid">
          {ideas.map((idea) => (
            <div key={idea._id} className="card memory-item">
              <h4>{idea.title}</h4>
              <p>{idea.content || 'Nessun contenuto'}</p>
              <span className="badge badge-cyan">{idea.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
