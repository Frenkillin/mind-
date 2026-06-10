import { MEMORY_TYPES } from '../../config/memoryTypes';
import './MemoryTabs.css';

export default function MemoryTabs({ active, onChange, counts = {} }) {
  return (
    <div className="memory-type-tabs">
      {MEMORY_TYPES.map(({ id, label }) => (
        <button
          key={id}
          className={`memory-type-tab ${active === id ? 'active' : ''}`}
          onClick={() => onChange(id)}
        >
          {label}
          {id !== 'all' && counts[id] != null && (
            <span className="memory-tab-count">{counts[id]}</span>
          )}
        </button>
      ))}
    </div>
  );
}
