import MemoryCard from './MemoryCard';
import './MemoryList.css';

export default function MemoryList({ memories, selectedId, onSelect }) {
  if (!memories.length) {
    return (
      <div className="memory-list-empty card">
        <p>Nessuna memoria trovata.</p>
        <span>Crea una nuova memoria o sincronizza i dati esistenti.</span>
      </div>
    );
  }

  return (
    <div className="memory-list">
      {memories.map((memory) => (
        <MemoryCard
          key={memory._id}
          memory={memory}
          selected={selectedId === memory._id}
          onClick={onSelect}
        />
      ))}
    </div>
  );
}
