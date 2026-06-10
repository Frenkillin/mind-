import { MEMORY_TYPE_MAP } from '../../config/memoryTypes';
import './MemoryStats.css';

export default function MemoryStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="memory-stats-bar">
      <div className="memory-stat-total card">
        <span className="memory-stat-value">{stats.total}</span>
        <span className="memory-stat-label">Memorie totali</span>
      </div>
      {Object.entries(MEMORY_TYPE_MAP).map(([type, config]) => (
        <div key={type} className="memory-stat-item card" style={{ '--type-color': config.color }}>
          <span className="memory-stat-value">{stats.byType?.[type] ?? 0}</span>
          <span className="memory-stat-label">{config.label}</span>
        </div>
      ))}
      <div className="memory-stat-meta card">
        <div>
          <span className="memory-stat-value">{stats.pinned ?? 0}</span>
          <span className="memory-stat-label">Fissate</span>
        </div>
        <div>
          <span className="memory-stat-value">{stats.highImportance ?? 0}</span>
          <span className="memory-stat-label">Alta priorità</span>
        </div>
      </div>
    </div>
  );
}
