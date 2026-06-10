import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import '../styles/shared.css';
import './Projects.css';

const statusOptions = ['planning', 'active', 'paused', 'completed', 'archived'];
const priorityOptions = ['low', 'medium', 'high', 'critical'];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', status: 'planning', priority: 'medium' });

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const res = await api.projects.list();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await api.projects.create(form);
      setForm({ title: '', description: '', status: 'planning', priority: 'medium' });
      setShowForm(false);
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Eliminare questo progetto?')) return;
    await api.projects.delete(id);
    loadProjects();
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header projects-header">
        <div>
          <h1>Progetti</h1>
          <p>Gestisci e monitora tutti i tuoi progetti</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
          Nuovo progetto
        </button>
      </div>

      {showForm && (
        <form className="card project-form" onSubmit={handleCreate}>
          <input
            className="input"
            placeholder="Titolo progetto"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="input"
            placeholder="Descrizione"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
          <div className="form-row">
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              {priorityOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Crea progetto</button>
        </form>
      )}

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project._id} className="card project-card">
            <div className="project-card-header">
              <div className="project-dot" style={{ background: project.color }} />
              <h3>{project.title}</h3>
              <button className="btn-icon" onClick={() => handleDelete(project._id)}>
                <Trash2 size={16} />
              </button>
            </div>
            {project.description && <p className="project-desc">{project.description}</p>}
            <div className="project-meta">
              <span className={`badge badge-blue`}>{project.status}</span>
              <span className={`badge badge-yellow`}>{project.priority}</span>
            </div>
            <div className="project-progress-bar">
              <div className="progress-fill" style={{ width: `${project.progress}%` }} />
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !showForm && (
        <div className="empty-state card">Nessun progetto. Creane uno per iniziare.</div>
      )}
    </div>
  );
}
