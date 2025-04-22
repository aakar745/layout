import express from 'express';
import {
  createExhibitorBooking,
  getExhibitorBookings,
  getExhibitorBooking,
  cancelExhibitorBooking,
  getExhibitorBookingInvoice,
  downloadExhibitorBookingInvoice,
  shareInvoiceViaEmail,
  shareInvoiceViaWhatsApp
} from '../controllers/exhibitorBooking.controller';
import { authenticateExhibitor } from '../middleware/exhibitorAuth';

const router = express.Router();

// All routes require exhibitor authentication
router.use(authenticateExhibitor);

// Get all bookings for the current exhibitor
router.get('/my-bookings', getExhibitorBookings);

// Get booking details by ID
router.get('/:id', getExhibitorBooking);

// Get the invoice for a booking
router.get('/:id/invoice', getExhibitorBookingInvoice);

// Download invoice PDF
router.get('/:id/invoice/download', downloadExhibitorBookingInvoice);

// Share invoice via email
router.post('/:id/invoice/share/email', shareInvoiceViaEmail);

// Share invoice via WhatsApp
router.post('/:id/invoice/share/whatsapp', shareInvoiceViaWhatsApp);

// Create a new booking (supports slug or id in exhibitionId)
router.post('/:exhibitionId', createExhibitorBooking);

// Cancel a booking
router.patch('/:id/cancel', cancelExhibitorBooking);

export default router; 