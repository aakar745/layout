import express from 'express';
import {
  createStallType,
  getStallTypes,
  getStallType,
  updateStallType,
  deleteStallType,
} from '../controllers/stallType.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Stall type routes
router.route('/')
  .get(getStallTypes)
  .post(authorize('admin'), createStallType);

router.route('/:id')
  .get(getStallType)
  .put(authorize('admin'), updateStallType)
  .delete(authorize('admin'), deleteStallType);

export default router; 