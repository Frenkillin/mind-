import { useState } from 'react';
import { Plus, Pin } from 'lucide-react';
import { api } from '../../services/api';

export default function QuickNotes({ notes = [], onUpdate }) {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;

    setSaving(true);
    try {
      await api.notes.create({ content: content.trim() });
      setContent('');
      onUpdate?.();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <div className="card-title">Note rapide</div>

      <form onSubmit={handleSubmit} className="note-form">
        <textarea
          className="input note-input"
          placeholder="Scrivi una nota veloce..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
        />
        <button type="submit" className="btn btn-primary note-submit" disabled={saving || !content.trim()}>
          <Plus size={16} />
          Aggiungi
        </button>
      </form>

      {notes.length > 0 && (
        <div className="notes-grid">
          {notes.map((note) => (
            <div
              key={note._id}
              className="note-card"
              style={{ borderLeftColor: note.color || '#3b82f6' }}
            >
              {note.pinned && <Pin size={12} className="note-pin" />}
              <p>{note.content}</p>
              <span className="note-date">
                {new Date(note.createdAt).toLocaleDateString('it-IT', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .note-form { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
        .note-input { resize: none; flex: 1; }
        .note-submit { flex-shrink: 0; align-self: flex-end; }
        .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem; }
        .note-card { background: var(--bg-input); border-radius: var(--radius-sm); padding: 0.75rem; border-left: 3px solid; position: relative; }
        .note-card p { font-size: 0.85rem; line-height: 1.5; margin-bottom: 0.5rem; }
        .note-date { font-size: 0.7rem; color: var(--text-muted); }
        .note-pin { position: absolute; top: 0.5rem; right: 0.5rem; color: var(--accent); }
      `}</style>
    </div>
  );
}
