import Note from '../models/Note.js';
import { logActivity } from '../utils/activityLogger.js';

export async function getNotes(_req, res) {
  const notes = await Note.find().sort({ pinned: -1, updatedAt: -1 });
  res.json({ success: true, data: notes });
}

export async function createNote(req, res) {
  const note = await Note.create(req.body);
  await logActivity({
    type: 'note_created',
    title: 'Nota rapida creata',
    entityType: 'Note',
    entityId: note._id,
  });
  res.status(201).json({ success: true, data: note });
}

export async function updateNote(req, res) {
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!note) {
    return res.status(404).json({ success: false, error: 'Nota non trovata' });
  }
  res.json({ success: true, data: note });
}

export async function deleteNote(req, res) {
  const note = await Note.findByIdAndDelete(req.params.id);
  if (!note) {
    return res.status(404).json({ success: false, error: 'Nota non trovata' });
  }
  res.json({ success: true, data: note });
}
