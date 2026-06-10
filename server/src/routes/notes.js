import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as controller from '../controllers/noteController.js';

const router = Router();

router.get('/', asyncHandler(controller.getNotes));
router.post('/', asyncHandler(controller.createNote));
router.put('/:id', asyncHandler(controller.updateNote));
router.delete('/:id', asyncHandler(controller.deleteNote));

export default router;
