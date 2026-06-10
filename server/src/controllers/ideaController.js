import Idea from '../models/Idea.js';
import { logActivity } from '../utils/activityLogger.js';
import { syncFromIdea } from '../services/memory/memorySyncService.js';

export async function getIdeas(req, res) {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.starred === 'true') filter.starred = true;

  const ideas = await Idea.find(filter).sort({ updatedAt: -1 }).populate('projectId', 'title');
  res.json({ success: true, data: ideas });
}

export async function createIdea(req, res) {
  const idea = await Idea.create(req.body);
  await logActivity({
    type: 'idea_saved',
    title: `Idea salvata: ${idea.title}`,
    entityType: 'Idea',
    entityId: idea._id,
  });
  await syncFromIdea(idea).catch(() => {});
  res.status(201).json({ success: true, data: idea });
}

export async function updateIdea(req, res) {
  const idea = await Idea.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!idea) {
    return res.status(404).json({ success: false, error: 'Idea non trovata' });
  }
  await syncFromIdea(idea).catch(() => {});
  res.json({ success: true, data: idea });
}

export async function deleteIdea(req, res) {
  const idea = await Idea.findByIdAndDelete(req.params.id);
  if (!idea) {
    return res.status(404).json({ success: false, error: 'Idea non trovata' });
  }
  res.json({ success: true, data: idea });
}
