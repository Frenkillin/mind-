import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as controller from '../controllers/aiController.js';

const router = Router();

router.get('/providers', asyncHandler(controller.getProviders));
router.post('/provider', asyncHandler(controller.setProvider));
router.post('/chat', asyncHandler(controller.chat));

export default router;
