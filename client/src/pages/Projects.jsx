import { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Search, Edit, X } from 'lucide-react';
import { api } from '../services/api';
import '../styles/shared.css';
import './Projects.css';

const STATUS_OPTIONS = ['idea', 'planning', 'development', 'testing', 'completed'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'critical'];

const STATUS_LABELS = {
  idea: 'Idea',
  planning: 'Pianificazione',
  development: 'Sviluppo',
  testing: 'Testing',
  completed: 'Completato',
};

const emptyForm = { name: '', description: '', status: 'idea', priority: 'medium' };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    loadProjects();
  }, [statusFilter]);

  async function loadProjects() {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('q', search);
      const res = await api.projects.list(params.toString() ? `?${params}` : '');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function openDetail(id) {
    const res = await api.projects.get(id);
    setDetail(res.data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      await api.projects.update(editingId, form);
    } else {
      await api.projects.create(form);
    }
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
    loadProjects();
  }

  function startEdit(project) {
    setEditingId(project._id);
    setForm({
      name: project.name || project.title,
      description: project.description || '',
      status: project.status,
      priority: project.priority,
    });
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm('Eliminare questo progetto?')) return;
    await api.projects.delete(id);
    if (detail?.project?._id === id) setDetail(null);
    loadProjects();
  }

  const filtered = useMemo(() => {
    if (!search) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        (p.name || p.title || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
    );
  }, [projects, search]);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page projects-page">
      <div className="page-header projects-header">
        <div>
          <h1>Progetti</h1>
          <p>Centro operativo — gestisci tutti i tuoi progetti</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}>
          <Plus size={18} /> Nuovo progetto
        </button>
      </div>

      <div className="projects-toolbar">
        <div className="projects-search">
          <Search size={18} />
          <input
            className="input"
            placeholder="Cerca progetti..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input projects-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Tutti gli stati</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <button className="btn btn-ghost" onClick={loadProjects}>Applica filtri</button>
      </div>

      {showForm && (
        <form className="card project-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>{editingId ? 'Modifica progetto' : 'Nuovo progetto'}</h3>
            <button type="button" className="btn-icon" onClick={() => { setShowForm(false); setEditingId(null); }}>
              <X size={18} />
            </button>
          </div>
          <input className="input" placeholder="Nome progetto" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <textarea className="input" placeholder="Descrizione" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          <div className="form-row">
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
            <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">{editingId ? 'Salva' : 'Crea progetto'}</button>
        </form>
      )}

      <div className="projects-layout">
        <div className="projects-grid">
          {filtered.map((project) => (
            <div
              key={project._id}
              className={`card project-card ${detail?.project?._id === project._id ? 'selected' : ''}`}
              onClick={() => openDetail(project._id)}
            >
              <div className="project-card-header">
                <div className="project-dot" style={{ background: project.color }} />
                <h3>{project.name || project.title}</h3>
                <div className="project-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-icon" onClick={() => startEdit(project)}><Edit size={16} /></button>
                  <button className="btn-icon" onClick={() => handleDelete(project._id)}><Trash2 size={16} /></button>
                </div>
              </div>
              {project.description && <p className="project-desc">{project.description}</p>}
              <div className="project-meta">
                <span className="badge badge-blue">{STATUS_LABELS[project.status] || project.status}</span>
                <span className="badge badge-purple">{project.priority}</span>
              </div>
              <div className="project-progress-bar">
                <div className="progress-fill" style={{ width: `${project.progress || 0}%` }} />
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="empty-state card">Nessun progetto trovato.</div>}
        </div>

        {detail && (
          <aside className="card project-detail">
            <h3>{detail.project.name || detail.project.title}</h3>
            <p>{detail.project.description || 'Nessuna descrizione'}</p>
            <div className="detail-stats">
              <span>{detail.counts.tasks} task</span>
              <span>{detail.counts.memories} memorie</span>
              <span>{detail.counts.ideas} idee</span>
            </div>
            {detail.tasks?.length > 0 && (
              <div className="detail-section">
                <h4>Task collegati</h4>
                {detail.tasks.slice(0, 5).map((t) => (
                  <div key={t._id} className="detail-item">{t.title} — {t.status}</div>
                ))}
              </div>
            )}
            {detail.memories?.length > 0 && (
              <div className="detail-section">
                <h4>Memorie collegate</h4>
                {detail.memories.slice(0, 5).map((m) => (
                  <div key={m._id} className="detail-item">{m.title}</div>
                ))}
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
