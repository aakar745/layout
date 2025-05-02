import { Router } from 'express';
import {
  getInvoices,
  getInvoice,
  updateInvoiceStatus,
  getInvoicesByExhibition,
  downloadInvoice,
  shareViaEmail,
  shareViaWhatsApp
} from '../controllers/invoice.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication for all routes
router.use(protect);

// Get all invoices - requires view_invoices or view_bookings permission
router.get('/', authorize('view_invoices', 'invoices_view', 'view_bookings', 'bookings_view'), getInvoices);

// Get invoice by ID - requires view_invoices or view_bookings permission
router.get('/:id', authorize('view_invoices', 'invoices_view', 'view_bookings', 'bookings_view'), getInvoice);

// Download invoice - requires view_invoices or view_bookings permission
router.get('/:id/download', authorize('view_invoices', 'invoices_view', 'view_bookings', 'bookings_view'), downloadInvoice);

// Update invoice status - requires edit_invoices permission
router.patch('/:id', authorize('edit_invoices', 'invoices_edit'), updateInvoiceStatus);

// Share invoice via email - requires view_invoices or view_bookings permission
router.post('/:id/share/email', authorize('view_invoices', 'invoices_view', 'view_bookings', 'bookings_view'), shareViaEmail);

// Share invoice via WhatsApp - requires view_invoices or view_bookings permission
router.post('/:id/share/whatsapp', authorize('view_invoices', 'invoices_view', 'view_bookings', 'bookings_view'), shareViaWhatsApp);

// Get invoices by exhibition - requires view_invoices or view_bookings permission
router.get('/exhibition/:exhibitionId', authorize('view_invoices', 'invoices_view', 'view_bookings', 'bookings_view'), getInvoicesByExhibition);

export default router; 