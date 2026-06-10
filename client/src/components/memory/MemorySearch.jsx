import { Search } from 'lucide-react';
import './MemorySearch.css';

export default function MemorySearch({ query, onChange, onSubmit }) {
  return (
    <form className="memory-search" onSubmit={onSubmit}>
      <Search size={18} />
      <input
        type="text"
        className="memory-search-input"
        placeholder="Cerca nelle memorie..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      {query && (
        <button type="button" className="memory-search-clear" onClick={() => onChange('')}>
          ×
        </button>
      )}
    </form>
  );
}
