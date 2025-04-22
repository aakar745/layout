import express from 'express';
import {
  createStall,
  getStalls,
  getStall,
  updateStall,
  deleteStall,
  updateStallStatus,
  getStallsByHall
} from '../controllers/stall.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Exhibition stall routes
router.route('/exhibitions/:exhibitionId/stalls')
  .get(getStalls)
  .post(authorize('admin'), createStall);

router.route('/exhibitions/:exhibitionId/stalls/:id')
  .get(getStall)
  .put(authorize('admin'), updateStall)
  .delete(authorize('admin'), deleteStall);

router.route('/exhibitions/:exhibitionId/stalls/:id/status')
  .patch(authorize('admin'), updateStallStatus);

router.route('/halls/:hallId/stalls')
  .get(getStallsByHall);

export default router; 