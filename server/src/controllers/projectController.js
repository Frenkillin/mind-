import Project from '../models/Project.js';
import { logActivity } from '../utils/activityLogger.js';
import { syncFromProject } from '../services/memory/memorySyncService.js';

export async function getProjects(_req, res) {
  const projects = await Project.find().sort({ updatedAt: -1 });
  res.json({ success: true, data: projects });
}

export async function getProject(req, res) {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, error: 'Progetto non trovato' });
  }
  res.json({ success: true, data: project });
}

export async function createProject(req, res) {
  const project = await Project.create(req.body);
  await logActivity({
    type: 'project_created',
    title: `Progetto creato: ${project.title}`,
    entityType: 'Project',
    entityId: project._id,
  });
  await syncFromProject(project).catch(() => {});
  res.status(201).json({ success: true, data: project });
}

export async function updateProject(req, res) {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) {
    return res.status(404).json({ success: false, error: 'Progetto non trovato' });
  }
  await logActivity({
    type: 'project_updated',
    title: `Progetto aggiornato: ${project.title}`,
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
