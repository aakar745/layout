import express from 'express';
import {
  getExhibitionAnalytics,
  getAnalyticsOverview
} from '../controllers/analytics.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get analytics overview for all exhibitions
router.get('/overview', getAnalyticsOverview);

// Get detailed analytics for a specific exhibition
router.get('/exhibition/:exhibitionId', getExhibitionAnalytics);

export default router; 