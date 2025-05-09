/**
 * Invoice PDF Service
 * 
 * Main coordinator service that handles PDF generation, caching, and delivery
 * for invoices. This service composes functionality from specialized services:
 * - pdf-generator.service.ts: Core PDF generation with Puppeteer
 * - pdf-cache.service.ts: PDF caching and management
 * - pdf-delivery.service.ts: Delivery via email and WhatsApp
 */

import { Request, Response } from 'express';
import Invoice from '../models/invoice.model';
import User from '../models/user.model';
import { IRole } from '../models/role.model';
import { join } from 'path';
import { writeFileSync, unlinkSync } from 'fs';

// Import from specialized services
import { generatePDF } from './pdf-generator.service';
import { 
  initializeCache, 
  generateCacheKey, 
  getCachedPDF, 
  cachePDF, 
  queuePdfGeneration
} from './pdf-cache.service';
import { 
  sendPdfByEmail, 
  sendPdfByWhatsApp 
} from './pdf-delivery.service';

// Initialize the cache on module load
initializeCache();

/**
 * Get a PDF for an invoice, with caching and fallback
 */
export const getPDF = async (invoice: any, forceRegenerate = false, isAdmin = false): Promise<Buffer> => {
  try {
    // Try to get from cache first if not forcing regeneration
    if (!forceRegenerate) {
      const cacheKey = generateCacheKey(invoice);
      const cachedPDF = getCachedPDF(cacheKey, invoice, true);
      if (cachedPDF) {
        console.log(`[DEBUG] Using cached PDF for invoice ${invoice._id}`);
        return cachedPDF;
      }
    }
    
    // Generate new PDF
    console.log(`[DEBUG] Generating new PDF for invoice ${invoice._id}`);
    
    // Use the queue system to prevent too many concurrent PDF generations
    try {
      // First attempt with full rendering
      console.log('[DEBUG] Attempting PDF generation with full rendering');
      return await queuePdfGeneration(async () => {
        try {
          const pdfBuffer = await generatePDF(invoice, isAdmin);
          
          // Cache the newly generated PDF
          const cacheKey = generateCacheKey(invoice);
          cachePDF(cacheKey, pdfBuffer, invoice);
          
          return pdfBuffer;
        } catch (err) {
          console.error('[ERROR] Full rendering PDF generation failed:', err);
          throw err; // Let the queue system handle this error
        }
      });
    } catch (primaryError) {
      // If we get here, the primary generation method failed
      console.log('[DEBUG] Primary PDF generation failed, attempting fallback mechanism');
      
      // Log the error for debugging
      console.error('[ERROR] Primary PDF generation failed:', primaryError);
      
      // See if we have a cached version we can use as a last resort, even if forceRegenerate was true
      console.log('[DEBUG] Checking for any cached version as a last resort');
      const cacheKey = generateCacheKey(invoice);
      const cachedPDF = getCachedPDF(cacheKey, invoice, true); // true = ignore timestamp
      
      if (cachedPDF) {
        console.log('[DEBUG] Using outdated cached PDF as fallback');
        return cachedPDF;
      }
      
      // If still no success, we have to report the error
      console.error('[ERROR] No fallback PDF available, must report failure');
      throw new Error(`Failed to generate PDF: ${primaryError instanceof Error ? primaryError.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('[ERROR] Failed to get or generate PDF:', error);
    if (error instanceof Error) {
      console.error('[ERROR] Stack trace:', error.stack);
    }
    throw error;
  }
};

/**
 * Controller function to download an invoice as PDF
 */
export const downloadInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if user is authenticated
    if (!req.user?._id) {
      return res.status(401).json({
        message: 'Authentication required',
        error: 'No user found in request'
      });
    }
    
    // Get invoice and populate booking
    const invoice = await Invoice.findById(id)
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'exhibitionId' },
          { path: 'stallIds', populate: { path: 'stallTypeId' } },
        ],
      });

    if (!invoice) {
      console.log(`[ERROR] Invoice ${id} not found in database`);
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Check if user has permissions to view any invoice
    let hasViewAllAccess = false;
    
    if (req.user) {
      // Populate user with role to check permissions
      const user = await User.findById(req.user._id).populate('role');
      
      if (user && user.role) {
        // Type assertion to handle the populated role
        const userRole = user.role as unknown as IRole;
        
        // Check for view_bookings, view_invoices, or admin permission
        if (userRole.permissions) {
          hasViewAllAccess = userRole.permissions.some(permission => 
            permission === 'view_bookings' || 
            permission === 'bookings_view' ||
            permission === 'view_invoices' || 
            permission === 'invoices_view' ||
            permission === 'admin' ||
            permission === '*'
          );
        }
      }
    }
    
    // If user doesn't have view all access, check if the invoice belongs to them
    if (!hasViewAllAccess && invoice.userId?.toString() !== req.user._id.toString()) {
      console.log(`[ERROR] User ${req.user._id} doesn't have permission to view invoice ${id} (owned by ${invoice.userId})`);
      return res.status(403).json({ message: 'You do not have permission to view this invoice' });
    }

    // Check for force regeneration parameter - always regenerate to ensure latest data
    const forceRegenerate = true; // Always force regeneration to ensure latest data
    
    try {
      // Get PDF (from cache if available)
      const pdfBuffer = await getPDF(invoice, forceRegenerate, true);

      // Set response headers and send PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${id}.pdf`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (pdfError) {
      console.error(`[ERROR] PDF generation failed:`, pdfError);
      if (pdfError instanceof Error) {
        console.error('[ERROR] Stack trace:', pdfError.stack);
      }
      res.status(500).json({ 
        message: 'Error generating invoice PDF', 
        error: pdfError instanceof Error ? pdfError.message : 'Unknown error' 
      });
    }
  } catch (error) {
    console.error('[ERROR] Invoice download error:', error);
    if (error instanceof Error) {
      console.error('[ERROR] Stack trace:', error.stack);
    }
    res.status(500).json({ 
      message: 'Error retrieving invoice data', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

/**
 * Controller function to share invoice via email
 */
export const shareViaEmail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, message } = req.body;

    // Validate
    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    // Get invoice
    const invoice = await Invoice.findById(id)
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'exhibitionId' },
          { path: 'stallIds', populate: { path: 'stallTypeId' } },
        ],
      });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Get PDF (from cache if available)
    const pdfBuffer = await getPDF(invoice, false, true);
    
    // Send email with PDF
    const success = await sendPdfByEmail(
      pdfBuffer,
      email,
      `Invoice - ${invoice.invoiceNumber}`,
      message || `Please find attached the invoice ${invoice.invoiceNumber}.`,
      `invoice-${invoice.invoiceNumber}.pdf`
    );
    
    if (!success) {
      return res.status(500).json({ message: 'Failed to send email' });
    }

    res.json({ message: 'Invoice shared via email successfully' });
  } catch (error) {
    console.error('Email sharing error:', error);
    res.status(500).json({ 
      message: 'Error sharing invoice via email', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

/**
 * Controller function to share invoice via WhatsApp
 */
export const shareViaWhatsApp = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { phoneNumber } = req.body;

    const invoice = await Invoice.findById(id).populate({
      path: 'bookingId',
      populate: [
        { path: 'exhibitionId', select: 'name venue startDate endDate description invoicePrefix companyName companyAddress companyContactNo companyEmail companyGST companyPAN companySAC companyCIN companyWebsite termsAndConditions piInstructions bankName bankAccount bankIFSC bankBranch bankAccountName' },
        { path: 'stallIds', select: 'number dimensions ratePerSqm stallTypeId', populate: { path: 'stallTypeId', select: 'name' } },
      ],
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Get PDF (from cache if available)
    const pdfBuffer = await getPDF(invoice, false, true);
    
    // Create temporary file for message context
    const pdfPath = join(process.cwd(), `temp/invoice-${id}.pdf`);
    writeFileSync(pdfPath, pdfBuffer);

    // Generate a public URL for the invoice
    // This would ideally be implemented with your file storage
    const pdfUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/invoices/${id}/download`;
    
    // Send WhatsApp message
    const success = await sendPdfByWhatsApp(
      pdfBuffer,
      phoneNumber,
      `Here's your invoice`,
      pdfUrl
    );
    
    // Clean up temporary file
    unlinkSync(pdfPath);
    
    if (!success) {
      return res.status(500).json({ message: 'Failed to send WhatsApp message' });
    }

    res.json({ message: 'Invoice shared successfully via WhatsApp' });
  } catch (error) {
    console.error('WhatsApp sharing error:', error);
    res.status(500).json({ 
      message: 'Error sharing invoice via WhatsApp', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// Re-export generatePDF for backwards compatibility with exhibitorBooking.controller
export { generatePDF }; 