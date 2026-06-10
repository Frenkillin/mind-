import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as controller from '../controllers/agentController.js';

const router = Router();

router.get('/', asyncHandler(controller.getAgents));
router.get('/sessions', asyncHandler(controller.getSessions));
router.get('/sessions/:id', asyncHandler(controller.getSession));
router.post('/sessions', asyncHandler(controller.createSession));
router.post('/sessions/:id/message', asyncHandler(controller.sendMessage));
router.delete('/sessions/:id', asyncHandler(controller.deleteSession));

export default router;
