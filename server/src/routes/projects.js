import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as controller from '../controllers/projectController.js';

const router = Router();

router.get('/', asyncHandler(controller.getProjects));
router.get('/:id', asyncHandler(controller.getProject));
router.post('/', asyncHandler(controller.createProject));
router.put('/:id', asyncHandler(controller.updateProject));
router.delete('/:id', asyncHandler(controller.deleteProject));

export default router;
