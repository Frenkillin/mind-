import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as controller from '../controllers/taskController.js';

const router = Router();

router.get('/', asyncHandler(controller.getTasks));
router.post('/', asyncHandler(controller.createTask));
router.put('/:id', asyncHandler(controller.updateTask));
router.delete('/:id', asyncHandler(controller.deleteTask));

export default router;
