import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import MemoryHeader from '../components/memory/MemoryHeader';
import MemoryStats from '../components/memory/MemoryStats';
import MemoryTabs from '../components/memory/MemoryTabs';
import MemorySearch from '../components/memory/MemorySearch';
import MemoryList from '../components/memory/MemoryList';
import MemoryDetail from '../components/memory/MemoryDetail';
import MemoryForm from '../components/memory/MemoryForm';
import '../styles/shared.css';
import './Memory.css';

export default function Memory() {
  const [memories, setMemories] = useState([]);
  const [stats, setStats] = useState(null);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);

  const loadMemories = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.set('type', activeTab);
      params.set('limit', '50');

      const [listRes, statsRes] = await Promise.all([
        searchQuery
          ? api.memory.search(searchQuery, activeTab !== 'all' ? activeTab : undefined)
          : api.memory.list(params.toString() ? `?${params}` : ''),
        api.memory.stats(),
      ]);

      const items = listRes.data.items || listRes.data;
      setMemories(items);
      setStats(statsRes.data);
      setSelected((prev) => {
        if (!prev) return null;
        return items.find((m) => m._id === prev._id) || null;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  async function handleSelect(memory) {
    setSelected(memory);
    try {
      await api.memory.access(memory._id);
    } catch {
      // non-blocking
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      await api.memory.sync();
      await loadMemories();
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  }

  async function handleSave(data, id) {
    if (id) {
      await api.memory.update(id, data);
    } else {
      await api.memory.create(data);
    }
    await loadMemories();
  }

  async function handleDelete(memory) {
    if (!confirm(`Eliminare la memoria "${memory.title}"?`)) return;
    await api.memory.delete(memory._id);
    setSelected(null);
    await loadMemories();
  }

  async function handleTogglePin(memory) {
    await api.memory.update(memory._id, { pinned: !memory.pinned });
    await loadMemories();
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadMemories();
  }

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>;
  }

  return (
    <div className="page memory-page">
      <MemoryHeader
        onCreate={() => { setEditingMemory(null); setFormOpen(true); }}
        onSync={handleSync}
        syncing={syncing}
      />

      <MemoryStats stats={stats} />

      <MemorySearch
        query={searchQuery}
        onChange={setSearchQuery}
        onSubmit={handleSearchSubmit}
      />

      <MemoryTabs
        active={activeTab}
        onChange={(tab) => { setActiveTab(tab); setSelected(null); }}
        counts={stats?.byType}
      />

      <div className="memory-layout">
        <MemoryList
          memories={memories}
          selectedId={selected?._id}
          onSelect={handleSelect}
        />
        <MemoryDetail
          memory={selected}
          onEdit={(m) => { setEditingMemory(m); setFormOpen(true); }}
          onDelete={handleDelete}
          onTogglePin={handleTogglePin}
        />
      </div>

      <MemoryForm
        open={formOpen}
        memory={editingMemory}
        onClose={() => { setFormOpen(false); setEditingMemory(null); }}
        onSave={handleSave}
      />
    </div>
  );
}
