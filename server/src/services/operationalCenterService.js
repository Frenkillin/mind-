import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Agent from '../models/Agent.js';
import Idea from '../models/Idea.js';
import Memory from '../models/Memory.js';

export async function getOperationalStats() {
  const [
    totalProjects,
    totalTasks,
    tasksInProgress,
    tasksCompleted,
    activeAgents,
    totalIdeas,
    linkedMemories,
  ] = await Promise.all([
    Project.countDocuments(),
    Task.countDocuments(),
    Task.countDocuments({ status: { $in: ['doing', 'review'] } }),
    Task.countDocuments({ status: 'done' }),
    Agent.countDocuments({ active: true }),
    Idea.countDocuments(),
    Memory.countDocuments({ projectId: { $ne: null } }),
  ]);

  const projectsByStatus = await Project.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const tasksByStatus = await Task.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  return {
    totalProjects,
    totalTasks,
    tasksInProgress,
    tasksCompleted,
    tasksTodo: await Task.countDocuments({ status: 'todo' }),
    activeAgents,
    totalIdeas,
    linkedMemories,
    projectsByStatus: Object.fromEntries(projectsByStatus.map((s) => [s._id, s.count])),
    tasksByStatus: Object.fromEntries(tasksByStatus.map((s) => [s._id, s.count])),
  };
}
