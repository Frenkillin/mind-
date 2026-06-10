import Project from '../models/Project.js';
import Memory from '../models/Memory.js';
import Task from '../models/Task.js';
import Idea from '../models/Idea.js';
import { logActivity } from '../utils/activityLogger.js';
import { syncFromProject } from '../services/memory/memorySyncService.js';

function normalizeProjectBody(body) {
  const data = { ...body };
  if (data.title && !data.name) data.name = data.title;
  delete data.title;
  return data;
}

function buildProjectFilter(query) {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.q) {
    const regex = new RegExp(query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: regex }, { description: regex }, { tags: regex }];
  }
  return filter;
}

export async function getProjects(req, res) {
  const filter = buildProjectFilter(req.query);
  const projects = await Project.find(filter).sort({ updatedAt: -1 });
  res.json({ success: true, data: projects });
}

export async function getProject(req, res) {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, error: 'Progetto non trovato' });
  }

  const [tasks, memories, ideas] = await Promise.all([
    Task.find({ projectId: project._id }).populate('assignedAgent', 'name provider role'),
    Memory.find({ projectId: project._id }).sort({ updatedAt: -1 }).limit(20),
    Idea.find({ projectId: project._id }).sort({ updatedAt: -1 }).limit(10),
  ]);

  res.json({
    success: true,
    data: {
      project,
      tasks,
      memories,
      ideas,
      counts: { tasks: tasks.length, memories: memories.length, ideas: ideas.length },
    },
  });
}

export async function createProject(req, res) {
  const project = await Project.create(normalizeProjectBody(req.body));
  await logActivity({
    type: 'project_created',
    title: `Progetto creato: ${project.name}`,
    entityType: 'Project',
    entityId: project._id,
  });
  await syncFromProject(project).catch(() => {});
  res.status(201).json({ success: true, data: project });
}

export async function updateProject(req, res) {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    normalizeProjectBody(req.body),
    { new: true, runValidators: true }
  );
  if (!project) {
    return res.status(404).json({ success: false, error: 'Progetto non trovato' });
  }
  await logActivity({
    type: 'project_updated',
    title: `Progetto aggiornato: ${project.name}`,
    entityType: 'Project',
    entityId: project._id,
  });
  await syncFromProject(project).catch(() => {});
  res.json({ success: true, data: project });
}

export async function deleteProject(req, res) {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, error: 'Progetto non trovato' });
  }
  res.json({ success: true, data: project });
}
