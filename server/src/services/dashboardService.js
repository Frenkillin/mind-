import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Goal from '../models/Goal.js';
import Note from '../models/Note.js';
import Idea from '../models/Idea.js';
import Activity from '../models/Activity.js';
import AgentSession from '../models/AgentSession.js';
import { MIND_MODULES, getModuleStats } from '../config/modules.js';
import { geminiService } from './integrations/gemini.js';
import { claudeService } from './integrations/claude.js';
import { openaiService } from './integrations/openai.js';
import { getAiStatus } from './ai/aiProviderManager.js';
import { githubService } from './integrations/github.js';
import { replitService } from './integrations/replit.js';
import { env } from '../config/env.js';

const PRIORITY_ORDER = { urgent: 4, high: 3, medium: 2, low: 1 };

function sortByPriority(tasks) {
  return [...tasks].sort((a, b) => {
    const pDiff = (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0);
    if (pDiff !== 0) return pDiff;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });
}

export async function buildDashboardPayload() {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const [
    projects,
    allActiveProjects,
    pendingTasks,
    urgentTasks,
    goals,
    notes,
    recentIdeas,
    recentActivity,
    activeProjectsCount,
    totalProjectsCount,
    pendingTasksCount,
    overdueTasksCount,
    completedTodayCount,
    activeGoalsCount,
    totalIdeasCount,
    starredIdeasCount,
    recentSessionsCount,
    activitiesTodayCount,
  ] = await Promise.all([
    Project.find({ status: { $in: ['planning', 'active'] } })
      .sort({ updatedAt: -1 })
      .limit(6)
      .lean(),
    Project.find({ status: { $in: ['planning', 'active', 'paused'] } })
      .sort({ priority: -1, updatedAt: -1 })
      .limit(12)
      .lean(),
    Task.find({ completed: false })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('projectId', 'title color')
      .lean(),
    Task.find({
      completed: false,
      $or: [
        { priority: { $in: ['urgent', 'high'] } },
        { dueDate: { $lte: now } },
      ],
    })
      .populate('projectId', 'title color')
      .lean(),
    Goal.find({ completed: false })
      .sort({ targetDate: 1 })
      .limit(5)
      .lean(),
    Note.find()
      .sort({ pinned: -1, updatedAt: -1 })
      .limit(8)
      .lean(),
    Idea.find()
      .sort({ starred: -1, updatedAt: -1 })
      .limit(5)
      .lean(),
    Activity.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
    Project.countDocuments({ status: 'active' }),
    Project.countDocuments(),
    Task.countDocuments({ completed: false }),
    Task.countDocuments({ completed: false, dueDate: { $lt: now } }),
    Task.countDocuments({ completed: true, updatedAt: { $gte: startOfDay } }),
    Goal.countDocuments({ completed: false }),
    Idea.countDocuments(),
    Idea.countDocuments({ starred: true }),
    AgentSession.countDocuments({ active: true }),
    Activity.countDocuments({ createdAt: { $gte: startOfDay } }),
  ]);

  const aiStatus = await getAiStatus();

  const integrations = {
    gemini: geminiService.isConfigured(),
    claude: claudeService.isConfigured(),
    openai: openaiService.isConfigured(),
    github: githubService.isConfigured(),
    replit: replitService.isConfigured(),
    voice: env.voiceEnabled,
    database: mongoose.connection.readyState === 1,
  };

  const aiReady = aiStatus.aiReady;

  return {
    meta: {
      generatedAt: now.toISOString(),
      greeting: getGreeting(now),
    },
    system: {
      status: integrations.database ? 'online' : 'degraded',
      integrations,
      modules: MIND_MODULES,
      moduleStats: getModuleStats(),
      aiReady,
      activeAiProvider: aiStatus.activeProvider,
      defaultAiProvider: aiStatus.defaultProvider,
    },
    stats: {
      activeProjects: activeProjectsCount,
      totalProjects: totalProjectsCount,
      pendingTasks: pendingTasksCount,
      overdueTasks: overdueTasksCount,
      completedToday: completedTodayCount,
      activeGoals: activeGoalsCount,
      totalIdeas: totalIdeasCount,
      starredIdeas: starredIdeasCount,
      activeChatSessions: recentSessionsCount,
      activitiesToday: activitiesTodayCount,
    },
    projects,
    projectBoard: allActiveProjects,
    pendingTasks: sortByPriority(pendingTasks).slice(0, 10),
    urgentTasks: sortByPriority(urgentTasks).slice(0, 6),
    goals,
    notes,
    recentIdeas,
    recentActivity,
  };
}

function getGreeting(date) {
  const hour = date.getHours();
  if (hour < 12) return 'Buongiorno';
  if (hour < 18) return 'Buon pomeriggio';
  return 'Buonasera';
}
