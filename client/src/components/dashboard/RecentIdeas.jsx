import { Link } from 'react-router-dom';
import { Lightbulb, ArrowRight, Star } from 'lucide-react';
import './RecentIdeas.css';

export default function RecentIdeas({ ideas = [] }) {
  return (
    <div className="card recent-ideas">
      <div className="card-title">
        <Lightbulb size={16} />
        Idee recenti
        <Link to="/ideas" className="ideas-link">
          Archivio <ArrowRight size={14} />
        </Link>
      </div>

      {ideas.length === 0 ? (
        <div className="empty-state">Nessuna idea salvata</div>
      ) : (
        <div className="ideas-list">
          {ideas.map((idea) => (
            <div key={idea._id} className="idea-row">
              {idea.starred && <Star size={12} className="idea-star" fill="currentColor" />}
              <div className="idea-row-content">
                <span className="idea-row-title">{idea.title}</span>
                <span className="badge badge-cyan">{idea.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
