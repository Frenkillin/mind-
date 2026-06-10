import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as sessionController from '../controllers/agentController.js';
import * as registryController from '../controllers/agentRegistryController.js';

const router = Router();

// Chat sessions (compatibilità)
router.get('/sessions', asyncHandler(sessionController.getSessions));
router.get('/sessions/:id', asyncHandler(sessionController.getSession));
router.post('/sessions', asyncHandler(sessionController.createSession));
router.post('/sessions/:id/message', asyncHandler(sessionController.sendMessage));
router.delete('/sessions/:id', asyncHandler(sessionController.deleteSession));

// Registry agenti — CRUD
router.get('/', asyncHandler(registryController.listAgents));
router.post('/', asyncHandler(registryController.createAgent));
router.get('/:id/scaffold', asyncHandler(registryController.getAgentExecutionScaffold));
router.get('/:id', asyncHandler(registryController.getAgent));
router.put('/:id', asyncHandler(registryController.updateAgent));
router.delete('/:id', asyncHandler(registryController.deleteAgent));

export default router;
