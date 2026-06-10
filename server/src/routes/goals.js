import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as controller from '../controllers/goalController.js';

const router = Router();

router.get('/', asyncHandler(controller.getGoals));
router.post('/', asyncHandler(controller.createGoal));
router.put('/:id', asyncHandler(controller.updateGoal));
router.delete('/:id', asyncHandler(controller.deleteGoal));

export default router;
