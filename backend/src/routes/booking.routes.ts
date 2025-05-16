import express from 'express';
import {
  createBooking,
  getBookings,
  getBooking,
  updateBookingStatus,
  getBookingsByExhibition,
  deleteBooking,
  getBookingStats,
  exportBookings
} from '../controllers/booking.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

router
  .route('/')
  .get(authorize('view_bookings', 'bookings_view'), getBookings)
  .post(authorize('bookings_create', 'create_booking'), createBooking);

router
  .route('/export')
  .get(authorize('view_bookings', 'bookings_view'), exportBookings);

router
  .route('/stats')
  .get(authorize('view_bookings', 'bookings_view'), getBookingStats);

router
  .route('/:id')
  .get(authorize('view_bookings', 'bookings_view'), getBooking)
  .patch(authorize('bookings_edit', 'edit_booking'), updateBookingStatus)
  .delete(authorize('bookings_delete', 'delete_booking'), deleteBooking);

router
  .route('/exhibition/:exhibitionId')
  .get(authorize('view_bookings', 'bookings_view'), getBookingsByExhibition);

export default router; 