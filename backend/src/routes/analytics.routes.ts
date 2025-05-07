import express from 'express';
import {
  getDashboardStats,
  getBookingTrends,
  getRevenueByExhibition,
  getBookingsByStatus,
  getRecentBookings
} from '../controllers/analytics.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Analytics routes - require dashboard_view permission
router.get('/dashboard', authorize('dashboard_view'), getDashboardStats);
router.get('/booking-trends', authorize('dashboard_view'), getBookingTrends);
router.get('/revenue-by-exhibition', authorize('dashboard_view'), getRevenueByExhibition);
router.get('/bookings-by-status', authorize('dashboard_view'), getBookingsByStatus);
router.get('/recent-bookings', authorize('dashboard_view'), getRecentBookings);

export default router; 