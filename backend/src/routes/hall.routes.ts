import express from 'express';
import {
  createHall,
  getHalls,
  getHall,
  updateHall,
  deleteHall,
} from '../controllers/hall.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router({ mergeParams: true });

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getHalls)
  .post(authorize('admin'), createHall);

router.route('/:id')
  .get(getHall)
  .put(authorize('admin'), updateHall)
  .delete(authorize('admin'), deleteHall);

export default router; 