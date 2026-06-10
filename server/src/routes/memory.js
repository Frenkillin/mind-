import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as controller from '../controllers/memoryController.js';

const router = Router();

router.get('/stats', asyncHandler(controller.getMemoryStatsHandler));
router.get('/search', asyncHandler(controller.searchMemory));
router.get('/context', asyncHandler(controller.getMemoryContext));
router.post('/sync', asyncHandler(controller.syncMemories));

router.get('/', asyncHandler(controller.getMemories));
router.post('/', asyncHandler(controller.createMemoryHandler));
router.get('/:id', asyncHandler(controller.getMemory));
router.put('/:id', asyncHandler(controller.updateMemoryHandler));
router.delete('/:id', asyncHandler(controller.deleteMemoryHandler));
router.post('/:id/access', asyncHandler(controller.recordMemoryAccess));

export default router;
