import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit, MessageSquare, X, Bot } from 'lucide-react';
import { api } from '../services/api';
import '../styles/shared.css';
import './Agents.css';

const PROVIDERS = ['gemini', 'claude', 'openai'];
const PROVIDER_LABELS = { gemini: 'Gemini', claude: 'Claude', openai: 'OpenAI' };

const emptyForm = {
  name: '', role: '', provider: 'gemini', capabilities: '', active: true, description: '',
};

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    try {
      const res = await api.agents.list();
      setAgents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const body = {
      ...form,
      capabilities: form.capabilities.split(',').map((c) => c.trim()).filter(Boolean),
      active: form.active === true || form.active === 'true',
    };
    if (editingId) {
      await api.agents.update(editingId, body);
    } else {
      await api.agents.create(body);
    }
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
    loadAgents();
  }

  function startEdit(agent) {
    setEditingId(agent._id);
    setForm({
      name: agent.name,
      role: agent.role,
      provider: agent.provider,
      capabilities: (agent.capabilities || []).join(', '),
      active: agent.active,
      description: agent.description || '',
    });
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm('Eliminare questo agente?')) return;
    await api.agents.delete(id);
    loadAgents();
  }

  async function toggleActive(agent) {
    await api.agents.update(agent._id, { active: !agent.active });
    loadAgents();
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page agents-registry-page">
      <div className="page-header projects-header">
        <div>
          <h1>Agenti AI</h1>
          <p>Registro agenti — assegna task e avvia conversazioni</p>
        </div>
        <div className="agents-header-actions">
          <Link to="/chat" className="btn btn-ghost">
            <MessageSquare size={18} /> Chat agenti
          </Link>
          <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}>
            <Plus size={18} /> Nuovo agente
          </button>
        </div>
      </div>

      {showForm && (
        <form className="card agent-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>{editingId ? 'Modifica agente' : 'Nuovo agente'}</h3>
            <button type="button" className="btn-icon" onClick={() => { setShowForm(false); setEditingId(null); }}><X size={18} /></button>
          </div>
          <input className="input" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" placeholder="Ruolo" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
          <textarea className="input" placeholder="Descrizione" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          <select className="input" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })}>
            {PROVIDERS.map((p) => <option key={p} value={p}>{PROVIDER_LABELS[p]}</option>)}
          </select>
          <input className="input" placeholder="Capacità (separate da virgola)" value={form.capabilities} onChange={(e) => setForm({ ...form, capabilities: e.target.value })} />
          <label className="agent-active-label">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Agente attivo
          </label>
          <button type="submit" className="btn btn-primary">{editingId ? 'Salva' : 'Crea agente'}</button>
        </form>
      )}

      <div className="agents-registry-grid">
        {agents.map((agent) => (
          <div key={agent._id} className={`card agent-registry-card ${!agent.active ? 'inactive' : ''}`}>
            <div className="agent-registry-header">
              <div className="agent-registry-icon" style={{ background: `${agent.color}22`, color: agent.color }}>
                <Bot size={22} />
              </div>
              <div className="agent-registry-actions">
                <button className="btn-icon" onClick={() => startEdit(agent)}><Edit size={16} /></button>
                <button className="btn-icon" onClick={() => handleDelete(agent._id)}><Trash2 size={16} /></button>
              </div>
            </div>
            <h3>{agent.name}</h3>
            <p className="agent-role">{agent.role}</p>
            {agent.description && <p className="agent-desc">{agent.description}</p>}
            <div className="agent-registry-meta">
              <span className={`badge ${agent.provider === 'gemini' ? 'badge-blue' : 'badge-cyan'}`}>
                {PROVIDER_LABELS[agent.provider]}
              </span>
              <button
                className={`badge ${agent.active ? 'badge-green' : 'badge-yellow'}`}
                onClick={() => toggleActive(agent)}
              >
                {agent.active ? 'Attivo' : 'Inattivo'}
              </button>
            </div>
            {agent.capabilities?.length > 0 && (
              <div className="agent-caps">
                {agent.capabilities.map((c) => (
                  <span key={c} className="cap-tag">{c}</span>
                ))}
              </div>
            )}
            <div className="agent-scaffold-note">
              Pronto per: ricevere task · usare Gemini · consultare memoria
            </div>
            {agent.slug && (
              <Link to={`/chat/${agent.slug}`} className="btn btn-ghost agent-chat-link">
                <MessageSquare size={16} /> Avvia chat
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
