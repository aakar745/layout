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
import { authenticate } from '../middleware/auth';

const router = Router();

// Get all invoices
router.get('/', authenticate, getInvoices);

// Get invoice by ID
router.get('/:id', authenticate, getInvoice);

// Download invoice as PDF
router.get('/:id/download', authenticate, downloadInvoice);

// Share invoice via email
router.post('/:id/share/email', authenticate, shareViaEmail);

// Share invoice via WhatsApp
router.post('/:id/share/whatsapp', authenticate, shareViaWhatsApp);

// Update invoice status
router.patch('/:id/status', authenticate, updateInvoiceStatus);

// Get invoices by exhibition
router.get('/exhibition/:exhibitionId', authenticate, getInvoicesByExhibition);

export default router; 