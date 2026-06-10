import { Pin, Star } from 'lucide-react';
import { MEMORY_TYPE_MAP, SOURCE_LABELS } from '../../config/memoryTypes';
import './MemoryCard.css';

export default function MemoryCard({ memory, selected, onClick }) {
  const typeConfig = MEMORY_TYPE_MAP[memory.type] || { label: memory.type, color: '#64748b' };
  const preview = memory.summary || memory.content || 'Nessun contenuto';

  return (
    <button
      className={`memory-card ${selected ? 'selected' : ''}`}
      onClick={() => onClick(memory)}
      style={{ '--type-color': typeConfig.color }}
    >
      <div className="memory-card-top">
        <span className="memory-card-type">{typeConfig.label}</span>
        <div className="memory-card-badges">
          {memory.pinned && <Pin size={12} className="memory-pin" />}
          {memory.importance >= 8 && <Star size={12} className="memory-star" fill="currentColor" />}
        </div>
      </div>
      <h3 className="memory-card-title">{memory.title}</h3>
      <p className="memory-card-preview">{preview}</p>
      <div className="memory-card-footer">
        <span className="memory-card-source">{SOURCE_LABELS[memory.source] || memory.source}</span>
        <span className="memory-card-date">
          {new Date(memory.updatedAt).toLocaleDateString('it-IT')}
        </span>
      </div>
    </button>
  );
}
