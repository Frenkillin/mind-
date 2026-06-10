import Goal from '../models/Goal.js';
import { logActivity } from '../utils/activityLogger.js';

export async function getGoals(req, res) {
  const filter = {};
  if (req.query.completed !== undefined) filter.completed = req.query.completed === 'true';

  const goals = await Goal.find(filter).sort({ targetDate: 1 });
  res.json({ success: true, data: goals });
}

export async function createGoal(req, res) {
  const goal = await Goal.create(req.body);
  res.status(201).json({ success: true, data: goal });
}

export async function updateGoal(req, res) {
  const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!goal) {
    return res.status(404).json({ success: false, error: 'Obiettivo non trovato' });
  }
  await logActivity({
    type: 'goal_updated',
    title: `Obiettivo aggiornato: ${goal.title}`,
    entityType: 'Goal',
    entityId: goal._id,
  });
  res.json({ success: true, data: goal });
}

export async function deleteGoal(req, res) {
  const goal = await Goal.findByIdAndDelete(req.params.id);
  if (!goal) {
    return res.status(404).json({ success: false, error: 'Obiettivo non trovato' });
  }
  res.json({ success: true, data: goal });
}
