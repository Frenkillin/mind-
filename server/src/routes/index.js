import { Router } from 'express';
import projectRoutes from './projects.js';
import ideaRoutes from './ideas.js';
import taskRoutes from './tasks.js';
import goalRoutes from './goals.js';
import noteRoutes from './notes.js';
import activityRoutes from './activities.js';
import agentRoutes from './agents.js';
import dashboardRoutes from './dashboard.js';
import integrationRoutes from './integrations.js';
import memoryRoutes from './memory.js';

const router = Router();

router.use('/dashboard', dashboardRoutes);
router.use('/projects', projectRoutes);
router.use('/ideas', ideaRoutes);
router.use('/tasks', taskRoutes);
router.use('/goals', goalRoutes);
router.use('/notes', noteRoutes);
router.use('/activities', activityRoutes);
router.use('/agents', agentRoutes);
router.use('/integrations', integrationRoutes);
router.use('/memory', memoryRoutes);

export default router;
