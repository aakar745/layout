import express from 'express';
import {
  createBooking,
  getBookings,
  getBooking,
  updateBookingStatus,
  getBookingsByExhibition,
  deleteBooking
} from '../controllers/booking.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

router
  .route('/')
  .get(getBookings)
  .post(createBooking);

router
  .route('/:id')
  .get(getBooking)
  .patch(authorize('admin'), updateBookingStatus)
  .delete(authorize('admin'), deleteBooking);

router
  .route('/exhibition/:exhibitionId')
  .get(authorize('admin'), getBookingsByExhibition);

export default router; 