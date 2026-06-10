import { useState } from 'react';
import { X } from 'lucide-react';
import { MEMORY_TYPES } from '../../config/memoryTypes';
import './MemoryForm.css';

const formTypes = MEMORY_TYPES.filter((t) => t.id !== 'all');

const defaultPayload = {
  conversation: { sessionId: '', agentType: '', messageCount: 0 },
  project: { status: 'active', progress: 0 },
  idea: { category: 'general', status: 'draft' },
  document: { fileName: '', mimeType: 'text/plain', url: '' },
  contact: { name: '', email: '', company: '', role: '' },
};

export default function MemoryForm({ open, memory, onClose, onSave }) {
  const isEdit = Boolean(memory?._id);
  const initial = memory || {
    type: 'idea',
    title: '',
    content: '',
    summary: '',
    tags: [],
    importance: 5,
    payload: defaultPayload.idea,
  };

  const [type, setType] = useState(initial.type);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const tagsRaw = form.get('tags');
    const selectedType = form.get('type');

    const data = {
      type: selectedType,
      title: form.get('title'),
      content: form.get('content'),
      summary: form.get('summary'),
      importance: parseInt(form.get('importance'), 10),
      tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [],
      source: 'manual',
      provider: 'mind',
      payload: buildPayload(selectedType, form),
    };

    await onSave(data, isEdit ? memory._id : null);
    onClose();
  }

  return (
    <div className="memory-form-overlay" onClick={onClose}>
      <div className="memory-form-modal card" onClick={(e) => e.stopPropagation()}>
        <div className="memory-form-header">
          <h3>{isEdit ? 'Modifica memoria' : 'Nuova memoria'}</h3>
          <button type="button" className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="memory-form">
          <div className="memory-form-row">
            <label>
              Tipo
              <select
                name="type"
                className="input"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {formTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </label>
            <label>
              Importanza (1-10)
              <input name="importance" type="number" className="input" min={1} max={10} defaultValue={initial.importance} />
            </label>
          </div>

          <label>
            Titolo
            <input name="title" className="input" required defaultValue={initial.title} />
          </label>

          <label>
            Sintesi
            <input name="summary" className="input" defaultValue={initial.summary} />
          </label>

          <label>
            Contenuto
            <textarea name="content" className="input" rows={5} defaultValue={initial.content} />
          </label>

          <label>
            Tag (separati da virgola)
            <input name="tags" className="input" defaultValue={initial.tags?.join(', ')} />
          </label>

          <TypeFields type={type} payload={initial.payload} />

          <div className="memory-form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Annulla</button>
            <button type="submit" className="btn btn-primary">{isEdit ? 'Salva' : 'Crea memoria'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TypeFields({ type, payload = {} }) {
  if (type === 'document') {
    return (
      <div className="memory-form-type-fields">
        <label>Nome file <input name="fileName" className="input" defaultValue={payload.fileName} /></label>
        <label>URL <input name="url" className="input" defaultValue={payload.url} /></label>
      </div>
    );
  }

  if (type === 'contact') {
    return (
      <div className="memory-form-type-fields">
        <label>Nome <input name="contactName" className="input" defaultValue={payload.name} /></label>
        <label>Email <input name="email" className="input" defaultValue={payload.email} /></label>
        <label>Azienda <input name="company" className="input" defaultValue={payload.company} /></label>
        <label>Ruolo <input name="role" className="input" defaultValue={payload.role} /></label>
      </div>
    );
  }

  return null;
}

function buildPayload(type, form) {
  if (type === 'document') {
    return {
      fileName: form.get('fileName') || '',
      mimeType: 'text/plain',
      url: form.get('url') || '',
      extractedText: form.get('content') || '',
    };
  }
  if (type === 'contact') {
    return {
      name: form.get('contactName') || '',
      email: form.get('email') || '',
      company: form.get('company') || '',
      role: form.get('role') || '',
      notes: form.get('content') || '',
    };
  }
  return defaultPayload[type] || {};
}
