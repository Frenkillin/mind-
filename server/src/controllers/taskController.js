import Task from '../models/Task.js';
import Project from '../models/Project.js';
import Agent from '../models/Agent.js';
import { logActivity } from '../utils/activityLogger.js';
import { createExecutor } from '../services/agents/agentExecutor.js';

function buildTaskFilter(query) {
  const filter = {};
  if (query.projectId) filter.projectId = query.projectId;
  if (query.status) filter.status = query.status;
  if (query.assignedAgent) filter.assignedAgent = query.assignedAgent;
  if (query.completed === 'true') filter.status = 'done';
  if (query.completed === 'false') filter.status = { $ne: 'done' };
  return filter;
}

export async function getTasks(req, res) {
  const filter = buildTaskFilter(req.query);
  const tasks = await Task.find(filter)
    .sort({ createdAt: -1 })
    .populate('projectId', 'name color status')
    .populate('assignedAgent', 'name provider role active');
  res.json({ success: true, data: tasks });
}

export async function getTask(req, res) {
  const task = await Task.findById(req.params.id)
    .populate('projectId', 'name color status')
    .populate('assignedAgent', 'name provider role capabilities');
  if (!task) {
    return res.status(404).json({ success: false, error: 'Task non trovato' });
  }
  res.json({ success: true, data: task });
}

export async function createTask(req, res) {
  const task = await Task.create(req.body);
  await logActivity({
    type: 'task_created',
    title: `Task creato: ${task.title}`,
    entityType: 'Task',
    entityId: task._id,
  });
  const populated = await Task.findById(task._id)
    .populate('projectId', 'name')
    .populate('assignedAgent', 'name provider role');
  res.status(201).json({ success: true, data: populated });
}

export async function updateTask(req, res) {
  const previous = await Task.findById(req.params.id);
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('projectId', 'name color')
    .populate('assignedAgent', 'name provider role');

  if (!task) {
    return res.status(404).json({ success: false, error: 'Task non trovato' });
  }

  if (task.status === 'done' && previous?.status !== 'done') {
    await logActivity({
      type: 'task_completed',
      title: `Task completato: ${task.title}`,
      entityType: 'Task',
      entityId: task._id,
    });
  }

  res.json({ success: true, data: task });
}

export async function deleteTask(req, res) {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, error: 'Task non trovato' });
  }
  res.json({ success: true, data: task });
}

export async function assistTask(req, res) {
  const task = await Task.findById(req.params.id).populate('assignedAgent');
  if (!task) {
    return res.status(404).json({ success: false, error: 'Task non trovato' });
  }

  const agent = task.assignedAgent || (await Agent.findOne({ active: true }));
  if (!agent) {
    return res.status(400).json({ success: false, error: 'Nessun agente disponibile' });
  }

  const project = task.projectId ? await Project.findById(task.projectId) : null;
  const executor = createExecutor(agent);
  const result = await executor.assistWithTask(task, project);

  res.json({ success: true, data: result });
}
