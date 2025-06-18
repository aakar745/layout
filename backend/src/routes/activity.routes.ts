import express from 'express';
import { getAllActivities, getStats, getFilters, clearLogs } from '../controllers/activity.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication and admin permissions
router.use(protect);
router.use(authorize('admin', 'view_activities', '*'));

// GET /api/activities - Get all activities with filtering
router.get('/', getAllActivities);

// GET /api/activities/stats - Get activity statistics
router.get('/stats', getStats);

// GET /api/activities/filters - Get available filters
router.get('/filters', getFilters);

// DELETE /api/activities/clear - Clear activity logs (super admin only)
router.delete('/clear', authorize('admin', 'manage_system', '*'), clearLogs);

export default router; 