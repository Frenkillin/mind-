import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { api } from '../services/api';
import '../styles/shared.css';
import './Tasks.css';

const COLUMNS = [
  { id: 'todo', label: 'Todo', color: '#64748b' },
  { id: 'doing', label: 'Doing', color: '#3b82f6' },
  { id: 'review', label: 'Review', color: '#f59e0b' },
  { id: 'done', label: 'Done', color: '#10b981' },
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', projectId: '', assignedAgent: '', status: 'todo',
  });

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const [tasksRes, projectsRes, agentsRes] = await Promise.all([
        api.tasks.list(),
        api.projects.list(),
        api.agents.list(),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setAgents(agentsRes.data.filter((a) => a.active));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    const body = { ...form };
    if (!body.projectId) delete body.projectId;
    if (!body.assignedAgent) delete body.assignedAgent;
    await api.tasks.create(body);
    setForm({ title: '', description: '', projectId: '', assignedAgent: '', status: 'todo' });
    setShowForm(false);
    loadAll();
  }

  async function moveTask(taskId, newStatus) {
    await api.tasks.update(taskId, { status: newStatus });
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
  }

  function handleDragStart(e, taskId) {
    setDraggedId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  async function handleDrop(e, status) {
    e.preventDefault();
    if (draggedId) {
      await moveTask(draggedId, status);
      setDraggedId(null);
    }
  }

  function getColumnTasks(status) {
    return tasks.filter((t) => t.status === status);
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page tasks-page">
      <div className="page-header projects-header">
        <div>
          <h1>Task</h1>
          <p>Kanban board — trascina i task tra le colonne</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Nuovo task
        </button>
      </div>

      {showForm && (
        <form className="card task-form" onSubmit={handleCreate}>
          <div className="form-header">
            <h3>Nuovo task</h3>
            <button type="button" className="btn-icon" onClick={() => setShowForm(false)}><X size={18} /></button>
          </div>
          <input className="input" placeholder="Titolo" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input" placeholder="Descrizione" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          <div className="form-row">
            <select className="input" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
              <option value="">Nessun progetto</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name || p.title}</option>
              ))}
            </select>
            <select className="input" value={form.assignedAgent} onChange={(e) => setForm({ ...form, assignedAgent: e.target.value })}>
              <option value="">Nessun agente</option>
              {agents.map((a) => (
                <option key={a._id} value={a._id}>{a.name} ({a.provider})</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Crea task</button>
        </form>
      )}

      <div className="kanban-board">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="kanban-column-header" style={{ borderColor: col.color }}>
              <span>{col.label}</span>
              <span className="kanban-count">{getColumnTasks(col.id).length}</span>
            </div>
            <div className="kanban-cards">
              {getColumnTasks(col.id).map((task) => (
                <div
                  key={task._id}
                  className="kanban-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task._id)}
                >
                  <h4>{task.title}</h4>
                  {task.description && <p>{task.description}</p>}
                  <div className="kanban-card-meta">
                    {(task.projectId?.name || task.projectId?.title) && (
                      <span className="badge badge-blue">{task.projectId.name || task.projectId.title}</span>
                    )}
                    {task.assignedAgent && (
                      <span className="badge badge-purple">{task.assignedAgent.name}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
