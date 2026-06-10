import { Pin, Trash2, Edit, Link2 } from 'lucide-react';
import { MEMORY_TYPE_MAP, SOURCE_LABELS } from '../../config/memoryTypes';
import './MemoryDetail.css';

export default function MemoryDetail({ memory, onEdit, onDelete, onTogglePin }) {
  if (!memory) {
    return (
      <div className="memory-detail memory-detail-empty card">
        <p>Seleziona una memoria per vedere i dettagli</p>
      </div>
    );
  }

  const typeConfig = MEMORY_TYPE_MAP[memory.type] || { label: memory.type };

  return (
    <div className="memory-detail card">
      <div className="memory-detail-header">
        <span className={`badge badge-blue`}>{typeConfig.label}</span>
        <span className="badge badge-purple">Importanza {memory.importance}/10</span>
        <div className="memory-detail-actions">
          <button className="btn-icon" onClick={() => onTogglePin(memory)} title="Fissa">
            <Pin size={16} fill={memory.pinned ? 'currentColor' : 'none'} />
          </button>
          <button className="btn-icon" onClick={() => onEdit(memory)} title="Modifica">
            <Edit size={16} />
          </button>
          <button className="btn-icon" onClick={() => onDelete(memory)} title="Elimina">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h2>{memory.title}</h2>

      {memory.summary && (
        <div className="memory-detail-summary">
          <strong>Sintesi</strong>
          <p>{memory.summary}</p>
        </div>
      )}

      <div className="memory-detail-content">
        <strong>Contenuto</strong>
        <p>{memory.content || '—'}</p>
      </div>

      {memory.tags?.length > 0 && (
        <div className="memory-detail-tags">
          {memory.tags.map((tag) => (
            <span key={tag} className="badge badge-cyan">{tag}</span>
          ))}
        </div>
      )}

      <div className="memory-detail-meta">
        <div><span>Fonte</span><strong>{SOURCE_LABELS[memory.source] || memory.source}</strong></div>
        <div><span>Provider</span><strong>{memory.provider || 'mind'}</strong></div>
        <div><span>Accessi</span><strong>{memory.accessCount || 0}</strong></div>
        <div><span>Aggiornata</span><strong>{new Date(memory.updatedAt).toLocaleString('it-IT')}</strong></div>
      </div>

      {memory.refs?.entityType && (
        <div className="memory-detail-refs">
          <Link2 size={14} />
          <span>
            Collegata a {memory.refs.entityType}
            {memory.refs.entityId && ` · ${memory.refs.entityId}`}
          </span>
        </div>
      )}

      {memory.payload && Object.keys(memory.payload).length > 0 && (
        <details className="memory-detail-payload">
          <summary>Payload ({memory.type})</summary>
          <pre>{JSON.stringify(memory.payload, null, 2)}</pre>
        </details>
      )}
    </div>
  );
}
