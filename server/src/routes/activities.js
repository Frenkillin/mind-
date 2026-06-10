import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as controller from '../controllers/activityController.js';

const router = Router();

router.get('/', asyncHandler(controller.getActivities));

export default router;
