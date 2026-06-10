import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as controller from '../controllers/ideaController.js';

const router = Router();

router.get('/', asyncHandler(controller.getIdeas));
router.post('/', asyncHandler(controller.createIdea));
router.put('/:id', asyncHandler(controller.updateIdea));
router.delete('/:id', asyncHandler(controller.deleteIdea));

export default router;
