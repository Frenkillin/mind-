import { useState, useEffect } from 'react';
import { Plus, Star, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import '../styles/shared.css';
import './Ideas.css';

const categories = ['general', 'business', 'development', 'marketing', 'research'];

export default function Ideas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'general' });

  useEffect(() => {
    loadIdeas();
  }, []);

  async function loadIdeas() {
    try {
      const res = await api.ideas.list();
      setIdeas(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    await api.ideas.create(form);
    setForm({ title: '', content: '', category: 'general' });
    setShowForm(false);
    loadIdeas();
  }

  async function toggleStar(idea) {
    await api.ideas.update(idea._id, { starred: !idea.starred });
    loadIdeas();
  }

  async function handleDelete(id) {
    if (!confirm('Eliminare questa idea?')) return;
    await api.ideas.delete(id);
    loadIdeas();
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header projects-header">
        <div>
          <h1>Idee</h1>
          <p>Salva e organizza le tue idee creative</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
          Nuova idea
        </button>
      </div>

      {showForm && (
        <form className="card idea-form" onSubmit={handleCreate}>
          <input
            className="input"
            placeholder="Titolo idea"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="input"
            placeholder="Descrivi la tua idea..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={4}
          />
          <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" className="btn btn-primary">Salva idea</button>
        </form>
      )}

      <div className="ideas-grid">
        {ideas.map((idea) => (
          <div key={idea._id} className={`card idea-card ${idea.starred ? 'starred' : ''}`}>
            <div className="idea-header">
              <h3>{idea.title}</h3>
              <div className="idea-actions">
                <button className="btn-icon" onClick={() => toggleStar(idea)}>
                  <Star size={16} fill={idea.starred ? 'currentColor' : 'none'} />
                </button>
                <button className="btn-icon" onClick={() => handleDelete(idea._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {idea.content && <p className="idea-content">{idea.content}</p>}
            <span className="badge badge-cyan">{idea.category}</span>
          </div>
        ))}
      </div>

      {ideas.length === 0 && !showForm && (
        <div className="empty-state card">Nessuna idea salvata.</div>
      )}
    </div>
  );
}
