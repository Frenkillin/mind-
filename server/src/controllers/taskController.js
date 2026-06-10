import Task from '../models/Task.js';
import { logActivity } from '../utils/activityLogger.js';

export async function getTasks(req, res) {
  const filter = {};
  if (req.query.completed !== undefined) filter.completed = req.query.completed === 'true';
  if (req.query.projectId) filter.projectId = req.query.projectId;

  const tasks = await Task.find(filter).sort({ createdAt: -1 }).populate('projectId', 'title');
  res.json({ success: true, data: tasks });
}

export async function createTask(req, res) {
  const task = await Task.create(req.body);
  await logActivity({
    type: 'task_created',
    title: `Attività creata: ${task.title}`,
    entityType: 'Task',
    entityId: task._id,
  });
  res.status(201).json({ success: true, data: task });
}

export async function updateTask(req, res) {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    return res.status(404).json({ success: false, error: 'Attività non trovata' });
  }
  if (task.completed) {
    await logActivity({
      type: 'task_completed',
      title: `Attività completata: ${task.title}`,
      entityType: 'Task',
      entityId: task._id,
    });
  }
  res.json({ success: true, data: task });
}

export async function deleteTask(req, res) {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, error: 'Attività non trovata' });
  }
  res.json({ success: true, data: task });
}
