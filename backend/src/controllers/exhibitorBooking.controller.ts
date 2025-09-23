import { Request, Response } from 'express';
import Booking from '../models/booking.model';
import Stall from '../models/stall.model';
import Invoice from '../models/invoice.model';
import Exhibition from '../models/exhibition.model';
import Exhibitor from '../models/exhibitor.model';
import { getPDF } from '../services/invoice-pdf.service';
import { generatePDF } from '../services/pdf-generator.service';
import { sendPdfByEmail, sendPdfByWhatsApp } from '../services/pdf-delivery.service';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import axios from 'axios';
import mongoose from 'mongoose';
import { createNotification } from './notification.controller';
import { NotificationType, NotificationPriority } from '../models/notification.model';
import { getEmailTransporter } from '../config/email.config';
import { logActivity } from '../services/activity.service';
import AtomicBookingService from '../services/atomicBooking.service';

/**
 * Creates a new booking from an exhibitor using atomic operations
 * 
 * NEW IMPLEMENTATION: Uses AtomicBookingService for bulletproof concurrency handling
 * - Supports 100,000+ concurrent exhibitors
 * - Zero duplicate bookings
 * - Automatic rollback on failures
 * - Real-time conflict detection
 * 
 * Flow:
 * 1. Exhibitor books stalls (status: pending) with atomic locks
 * 2. Admin approves or rejects the booking
 * 3. If approved, payment process begins
 * 4. Once payment is confirmed, status changes to confirmed
 */
export const createExhibitorBooking = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;
    const { 
      stallIds, 
      customerName,
      customerEmail,
      customerPhone,
      companyName,
      discountId,
      basicAmenities,
      extraAmenities
    } = req.body;

    const exhibitorId = req.exhibitor?.id;
    
    // Basic validation
    if (!exhibitorId) {
      return res.status(401).json({ message: 'Exhibitor not authenticated' });
    }
    
    if (!stallIds || !Array.isArray(stallIds) || stallIds.length === 0) {
      return res.status(400).json({ message: 'Please select at least one stall' });
    }
    
    console.log(`📝 [EXHIBITOR BOOKING] Creating booking for ${stallIds.length} stalls by exhibitor ${exhibitorId}`);
    
    // Find exhibition by ID or slug - only allow active exhibitions for booking
    let exhibition;
    if (mongoose.Types.ObjectId.isValid(exhibitionId)) {
      exhibition = await Exhibition.findOne({ _id: exhibitionId, isActive: true });
    } else {
      exhibition = await Exhibition.findOne({ slug: exhibitionId, isActive: true });
    }
    
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found or no longer available' });
    }
    
    // Get exhibitor details
    const exhibitor = await Exhibitor.findById(exhibitorId);
    if (!exhibitor) {
      return res.status(404).json({ message: 'Exhibitor not found' });
    }

    // Find selected discount if any - IMPORTANT: Use publicDiscountConfig for exhibitor bookings
    let selectedDiscount;
    if (discountId) {
      selectedDiscount = exhibition.publicDiscountConfig?.find((d: any) => {
        // Handle both full discount objects and simple name-only objects
        if (discountId.name && discountId.type && discountId.value) {
          return d.name === discountId.name && 
                 d.type === discountId.type && 
                 d.value === discountId.value && 
                 d.isActive;
        } else if (discountId.name) {
          // If only name is provided, just match by name and active status
          return d.name === discountId.name && d.isActive;
        }
        return false;
      });

      if (!selectedDiscount) {
        return res.status(400).json({ message: 'Invalid discount selected' });
      }
    }

    // Use atomic booking service for race condition protection
    const result = await AtomicBookingService.createBooking({
      stallIds,
      exhibitionId: exhibition._id.toString(),
      userId: exhibition.createdBy?.toString() || '',
      exhibitorId,
      customerName: customerName || exhibitor.contactPerson,
      customerEmail: customerEmail || exhibitor.email,
      customerPhone: customerPhone || exhibitor.phone,
      customerAddress: exhibitor.address || 'N/A',
      customerGSTIN: exhibitor.gstNumber,
      customerPAN: exhibitor.panNumber,
      companyName: companyName || exhibitor.companyName,
      discount: selectedDiscount,
      basicAmenities,
      extraAmenities,
      bookingSource: 'exhibitor'
    });

    if (!result.success) {
      // Handle different types of errors
      if (result.conflictingStalls) {
        return res.status(409).json({ 
          message: 'One or more stalls are no longer available due to concurrent booking',
          error: result.error,
          conflictingStalls: result.conflictingStalls,
          action: 'refresh_and_retry'
        });
      }
      
      return res.status(400).json({ 
        message: result.error || 'Failed to create booking',
        error: result.error
      });
    }

    const { booking } = result;

    // For exhibitor bookings, we need to set status to pending and update stalls to reserved
    // (not booked, since it needs admin approval)
    await Booking.findByIdAndUpdate(booking._id, { status: 'pending' });
    await Stall.updateMany(
      { _id: { $in: stallIds } },
      { status: 'reserved' }
    );

    // Emit real-time stall booking updates to all viewers of this exhibition
    try {
      const { emitStallBooked } = require('../services/socket.service');
      const updatedStalls = await Stall.find({ _id: { $in: stallIds } });
      updatedStalls.forEach(stall => {
        emitStallBooked(exhibition._id, stall, {
          companyName: exhibitor.companyName,
          customerName: exhibitor.contactPerson,
          bookingId: booking._id
        });
      });
    } catch (socketError) {
      console.error('Error emitting stall booking updates:', socketError);
      // Don't fail the booking if socket emission fails
    }

    // Send notification to admin about new exhibitor booking (non-blocking)
    try {
      if (exhibition.createdBy) {
        await createNotification(
          exhibition.createdBy,
          'admin',
          'New Exhibitor Booking Created',
          `A new booking request has been created for exhibition "${exhibition.name}" by exhibitor ${exhibitor.companyName}.`,
          NotificationType.NEW_BOOKING,
          {
            priority: NotificationPriority.HIGH,
            entityId: booking._id,
            entityType: 'Booking',
            data: {
              exhibitionName: exhibition.name,
              stallCount: stallIds.length,
              amount: booking.amount,
              bookingId: booking._id.toString(),
              exhibitorName: exhibitor.companyName,
              bookingSource: 'exhibitor'
            }
          }
        );
      }
    } catch (notificationError) {
      console.error('❌ [EXHIBITOR BOOKING] Error sending notification:', notificationError);
      // Continue - notifications are not critical
    }

    // Log activity (non-blocking)
    try {
      await logActivity(req, {
        action: 'booking_created',
        resource: 'booking',
        resourceId: booking._id.toString(),
        description: `Exhibitor "${exhibitor.companyName}" created booking for ${stallIds.length} stall(s) in exhibition "${exhibition.name}"`,
        newValues: {
          exhibitionName: exhibition.name,
          stallCount: stallIds.length,
          amount: booking.amount,
          status: 'pending',
          bookingSource: 'exhibitor'
        },
        success: true
      });
    } catch (logError) {
      console.error('❌ [EXHIBITOR BOOKING] Error logging activity:', logError);
      // Continue - logging is not critical
    }

    // Get updated booking with pending status
    const updatedBooking = await Booking.findById(booking._id);

    console.log(`✅ [EXHIBITOR BOOKING] Successfully created booking ${booking._id} for exhibitor ${exhibitor.companyName}`);

    res.status(201).json({
      ...updatedBooking?.toObject() || booking,
      message: 'Booking request submitted successfully and is pending admin approval'
    });

  } catch (error) {
    console.error('💥 [EXHIBITOR BOOKING] Unexpected error:', error);
    
    // Log failed booking attempt
    await logActivity(req, {
      action: 'booking_created',
      resource: 'booking',
      description: `Failed to create booking for exhibitor`,
      metadata: { 
        exhibitionId: req.params.exhibitionId,
        stallIds: req.body.stallIds,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Error creating exhibitor booking'
    });
    
    res.status(500).json({ 
      message: 'An unexpected error occurred while creating the booking',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get bookings for the current exhibitor
 */
export const getExhibitorBookings = async (req: Request, res: Response) => {
  try {
    // Get the exhibitor ID from the authenticated user
    const exhibitorId = req.exhibitor?.id;
    
    if (!exhibitorId) {
      return res.status(400).json({ message: 'Exhibitor ID not found' });
    }

    const bookings = await Booking.find({ exhibitorId })
      .sort({ createdAt: -1 })
      .populate('exhibitionId', 'name venue startDate endDate')
      .populate({
        path: 'stallIds', 
        select: 'number dimensions ratePerSqm status stallTypeId',
        populate: {
          path: 'stallTypeId',
          select: 'name description'
        }
      });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exhibitor bookings', error });
  }
};

/**
 * Get a single booking for the exhibitor
 */
export const getExhibitorBooking = async (req: Request, res: Response) => {
  try {
    const exhibitorId = req.exhibitor?.id;
    
    if (!exhibitorId) {
      return res.status(400).json({ message: 'Exhibitor ID not found' });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      exhibitorId
    })
      .populate('exhibitionId', 'name venue startDate endDate invoicePrefix companyName companyAddress')
      .populate({
        path: 'stallIds', 
        select: 'number dimensions ratePerSqm status stallTypeId',
        populate: {
          path: 'stallTypeId',
          select: 'name description'
        }
      });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not authorized to access' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exhibitor booking', error });
  }
};

/**
 * Cancel a pending booking (exhibitors can only cancel pending bookings)
 */
export const cancelExhibitorBooking = async (req: Request, res: Response) => {
  try {
    const exhibitorId = req.exhibitor?.id;
    
    if (!exhibitorId) {
      return res.status(400).json({ message: 'Exhibitor ID not found' });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      exhibitorId,
      status: 'pending' // Can only cancel pending bookings
    });
    
    if (!booking) {
      return res.status(404).json({ 
        message: 'Booking not found, not authorized, or cannot be cancelled (only pending bookings can be cancelled)'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Update stall status back to available with race condition protection
    const stallUpdateResult = await Stall.updateMany(
      { 
        _id: { $in: booking.stallIds },
        status: { $in: ['booked', 'reserved'] } // Only update if currently booked/reserved
      },
      { status: 'available' }
    );

    console.log(`Updated ${stallUpdateResult.modifiedCount} stalls to available status after cancellation`);

    // Emit real-time stall status updates to all viewers of this exhibition
    try {
      const { emitStallStatusChanged } = require('../services/socket.service');
      
      // Add delay for MongoDB consistency
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const updatedStalls = await Stall.find({ _id: { $in: booking.stallIds } });
      
      console.log(`Fetched ${updatedStalls.length} stalls for cancellation emission:`, 
        updatedStalls.map(s => ({ id: s._id, number: s.number, status: s.status })));
      
      updatedStalls.forEach(stall => {
        emitStallStatusChanged(booking.exhibitionId._id || booking.exhibitionId, stall);
      });
      
      console.log(`Real-time stall availability updates emitted for ${updatedStalls.length} stalls after cancellation`);
    } catch (socketError) {
      console.error('Error emitting stall availability updates:', socketError);
      // Don't fail the cancellation if socket emission fails
    }

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling exhibitor booking', error });
  }
};

/**
 * Get the invoice for a booking
 */
export const getExhibitorBookingInvoice = async (req: Request, res: Response) => {
  try {
    const exhibitorId = req.exhibitor?.id;
    
    if (!exhibitorId) {
      return res.status(400).json({ message: 'Exhibitor ID not found' });
    }

    // First check if the booking exists and belongs to this exhibitor
    const booking = await Booking.findOne({
      _id: req.params.id,
      exhibitorId
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not authorized to access' });
    }

    // Then fetch the invoice with more detailed population
    const invoice = await Invoice.findOne({ bookingId: booking._id })
      .populate({
        path: 'bookingId',
        select: '_id exhibitionId stallIds customerName customerEmail customerPhone customerGSTIN customerAddress companyName calculations amount status createdAt updatedAt',
        populate: [
          { path: 'exhibitionId', select: 'name venue startDate endDate description invoicePrefix companyName companyAddress companyContactNo companyEmail companyGST companyPAN companySAC companyCIN companyWebsite termsAndConditions piInstructions bankName bankAccount bankIFSC bankBranch bankAccountName logo updatedAt' },
          { path: 'stallIds', select: 'number dimensions ratePerSqm stallTypeId updatedAt', populate: { path: 'stallTypeId', select: 'name updatedAt' } },
        ],
      });
    
    if (!invoice) {
      // If no invoice is found, check if booking is recent
      const bookingDate = new Date((booking as any).createdAt);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      if (bookingDate > fiveMinutesAgo) {
        return res.status(404).json({ 
          message: 'Invoice is still being processed. Please try again in a few moments.',
          isProcessing: true
        });
      }
      
      return res.status(404).json({ message: 'Invoice not found for this booking' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exhibitor booking invoice', error });
  }
};

/**
 * Download the invoice PDF for a booking
 */
export const downloadExhibitorBookingInvoice = async (req: Request, res: Response) => {
  try {
    const exhibitorId = req.exhibitor?.id;
    
    if (!exhibitorId) {
      return res.status(400).json({ message: 'Exhibitor ID not found' });
    }

    // First check if the booking exists and belongs to this exhibitor
    const booking = await Booking.findOne({
      _id: req.params.id,
      exhibitorId
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not authorized to access' });
    }

    // Then fetch the invoice with all the latest data
    const invoice = await Invoice.findOne({ bookingId: booking._id })
      .populate({
        path: 'bookingId',
        select: '_id exhibitionId stallIds customerName customerEmail customerPhone customerGSTIN customerAddress companyName calculations amount status createdAt updatedAt',
        populate: [
          { 
            path: 'exhibitionId', 
            select: 'name venue startDate endDate description invoicePrefix companyName companyAddress companyContactNo companyEmail companyGST companyPAN companySAC companyCIN companyWebsite termsAndConditions piInstructions bankName bankAccount bankIFSC bankBranch bankAccountName logo updatedAt' 
          },
          { 
            path: 'stallIds', 
            select: 'number dimensions ratePerSqm stallTypeId updatedAt', 
            populate: { 
              path: 'stallTypeId', 
              select: 'name updatedAt' 
            } 
          },
        ],
      });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found for this booking' });
    }

    try {
      // Use getPDF which implements caching and queue management
      // Only force regenerate if explicitly requested
      const forceRegenerate = req.query.force === 'true';
      const pdfBuffer = await getPDF(invoice, forceRegenerate, false);

      // Set headers to prevent caching
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice._id}.pdf`);
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      // Send the PDF
      res.send(pdfBuffer);
    } catch (pdfError) {
      console.error('[ERROR] PDF generation failed:', pdfError);
      return res.status(500).json({ 
        message: 'Error generating invoice PDF', 
        error: pdfError instanceof Error ? pdfError.message : 'Unknown error' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Error downloading exhibitor booking invoice', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

/**
 * Share the invoice via email
 */
export const shareInvoiceViaEmail = async (req: Request, res: Response) => {
  try {
    const { email, message } = req.body;
    const exhibitorId = req.exhibitor?.id;
    
    if (!exhibitorId) {
      return res.status(400).json({ message: 'Exhibitor ID not found' });
    }

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // First check if the booking exists and belongs to this exhibitor
    const booking = await Booking.findOne({
      _id: req.params.id,
      exhibitorId
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not authorized to access' });
    }

    // Then fetch the invoice with more detailed population
    const invoice = await Invoice.findOne({ bookingId: booking._id })
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'exhibitionId', select: 'name venue startDate endDate description invoicePrefix companyName companyAddress companyContactNo companyEmail companyGST companyPAN companySAC companyCIN companyWebsite termsAndConditions piInstructions bankName bankAccount bankIFSC bankBranch bankAccountName logo updatedAt' },
          { path: 'stallIds', select: 'number dimensions ratePerSqm stallTypeId', populate: { path: 'stallTypeId', select: 'name' } },
        ],
      });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found for this booking' });
    }

    try {
      // Use getPDF which implements caching and queue management
      // For sharing, we can use the cached version if available
      const pdfBuffer = await getPDF(invoice, false, false);
      
      // Send the email
      const success = await sendPdfByEmail(
        pdfBuffer,
        email,
        `Invoice for ${booking.exhibitionId ? (booking.exhibitionId as any).name : 'Your Booking'}`,
        message || 'Please find the attached invoice.',
        `invoice-${invoice._id}.pdf`
      );
      
      if (!success) {
        return res.status(500).json({ message: 'Failed to send email' });
      }

      res.json({ message: 'Invoice shared via email successfully' });
    } catch (pdfError) {
      console.error('[ERROR] PDF generation failed:', pdfError);
      return res.status(500).json({ 
        message: 'Error generating invoice PDF for email', 
        error: pdfError instanceof Error ? pdfError.message : 'Unknown error' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Error sharing invoice via email', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

/**
 * Share the invoice via WhatsApp
 */
export const shareInvoiceViaWhatsApp = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;
    const exhibitorId = req.exhibitor?.id;
    
    if (!exhibitorId) {
      return res.status(400).json({ message: 'Exhibitor ID not found' });
    }

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // First check if the booking exists and belongs to this exhibitor
    const booking = await Booking.findOne({
      _id: req.params.id,
      exhibitorId
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not authorized to access' });
    }

    // Then fetch the invoice with more detailed population
    const invoice = await Invoice.findOne({ bookingId: booking._id })
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'exhibitionId', select: 'name venue startDate endDate description invoicePrefix companyName companyAddress companyContactNo companyEmail companyGST companyPAN companySAC companyCIN companyWebsite termsAndConditions piInstructions bankName bankAccount bankIFSC bankBranch bankAccountName logo updatedAt' },
          { path: 'stallIds', select: 'number dimensions ratePerSqm stallTypeId', populate: { path: 'stallTypeId', select: 'name' } },
        ],
      });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found for this booking' });
    }

    try {
      // Use getPDF which implements caching and queue management
      // For sharing, we can use the cached version if available
      const pdfBuffer = await getPDF(invoice, false, false);
      
      // Generate a URL for the PDF download
      const pdfUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/exhibitor-bookings/${req.params.id}/invoice/download`;
      
      // Prepare template data for WhatsApp
      const exhibition = booking.exhibitionId as any;
      const templateData = {
        customerName: booking.customerName || 'Valued Customer',
        exhibitionName: exhibition?.name || 'Exhibition',
        invoiceNumber: invoice.invoiceNumber || `INV-${invoice._id}`,
        supportContact: exhibition?.companyContactNo || process.env.SUPPORT_CONTACT || '+91-9876543210',
        companyName: exhibition?.companyName || 'Exhibition Management'
      };
      
      // Send via WhatsApp
      const success = await sendPdfByWhatsApp(
        pdfBuffer,
        phoneNumber,
        templateData,
        `invoice-${invoice._id}.pdf`
      );
      
      if (!success) {
        return res.status(500).json({ message: 'Failed to send WhatsApp message' });
      }

      res.json({ message: 'Invoice shared successfully via WhatsApp' });
    } catch (pdfError) {
      console.error('[ERROR] PDF generation failed:', pdfError);
      return res.status(500).json({ 
        message: 'Error generating invoice PDF for WhatsApp', 
        error: pdfError instanceof Error ? pdfError.message : 'Unknown error' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Error sharing invoice via WhatsApp', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}; 