import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './ProjectsOverview.css';

const statusLabels = {
  idea: 'Idea',
  planning: 'Pianificazione',
  development: 'Sviluppo',
  testing: 'Testing',
  completed: 'Completato',
};

const priorityLabels = {
  low: 'Bassa',
  medium: 'Media',
  high: 'Alta',
  critical: 'Critica',
};

export default function ProjectsOverview({ projects = [] }) {
  return (
    <div className="card projects-overview">
      <div className="card-title">
        Progetti in corso
        <Link to="/projects" className="projects-link">
          Gestisci <ArrowRight size={14} />
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          Nessun progetto attivo.
          <Link to="/projects" className="empty-cta">Crea il primo progetto</Link>
        </div>
      ) : (
        <div className="project-board">
          {projects.map((project) => (
            <Link
              key={project._id}
              to="/projects"
              className="project-board-card"
              style={{ '--project-color': project.color || '#3b82f6' }}
            >
              <div className="project-board-header">
                <span className="project-board-dot" />
                <span className="project-board-title">{project.name || project.title}</span>
              </div>
              {project.description && (
                <p className="project-board-desc">{project.description}</p>
              )}
              <div className="project-board-meta">
                <span className="badge badge-blue">{statusLabels[project.status]}</span>
                <span className="badge badge-purple">{priorityLabels[project.priority]}</span>
              </div>
              <div className="project-board-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${project.progress}%` }} />
                </div>
                <span>{project.progress}%</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
