import { Request, Response } from 'express';
import Booking from '../models/booking.model';
import Stall from '../models/stall.model';
import Invoice from '../models/invoice.model';
import Exhibition from '../models/exhibition.model';
import Exhibitor from '../models/exhibitor.model';
import { generatePDF } from './invoice.controller';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import axios from 'axios';
import mongoose from 'mongoose';
import { createNotification } from './notification.controller';
import { NotificationType, NotificationPriority } from '../models/notification.model';
import { getEmailTransporter } from '../config/email.config';

/**
 * Creates a new booking from an exhibitor with pending status
 * This follows a different flow than admin bookings:
 * 1. Exhibitor books stalls (status: pending)
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
      discountId 
    } = req.body;

    const exhibitorId = req.exhibitor?.id;
    
    if (!exhibitorId) {
      return res.status(401).json({ message: 'Exhibitor not authenticated' });
    }
    
    if (!stallIds || !Array.isArray(stallIds) || stallIds.length === 0) {
      return res.status(400).json({ message: 'Please select at least one stall' });
    }
    
    // Find exhibition by ID or slug
    let exhibition;
    if (mongoose.Types.ObjectId.isValid(exhibitionId)) {
      exhibition = await Exhibition.findById(exhibitionId);
    } else {
      exhibition = await Exhibition.findOne({ slug: exhibitionId });
    }
    
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }
    
    // Get exhibitor details
    const exhibitor = await Exhibitor.findById(exhibitorId);
    
    if (!exhibitor) {
      return res.status(404).json({ message: 'Exhibitor not found' });
    }

    // Find selected discount if any - IMPORTANT: Use publicDiscountConfig for exhibitor bookings from frontend
    const selectedDiscount = discountId ? exhibition.publicDiscountConfig?.find(
      d => {
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
      }
    ) : undefined;

    if (discountId && !selectedDiscount) {
      return res.status(400).json({ message: 'Invalid discount selected' });
    }

    // Check if all stalls are available
    const stalls = await Stall.find({ _id: { $in: stallIds } });
    if (stalls.length !== stallIds.length) {
      return res.status(404).json({ message: 'One or more stalls not found' });
    }

    const unavailableStalls = stalls.filter(stall => stall.status !== 'available');
    if (unavailableStalls.length > 0) {
      return res.status(400).json({ 
        message: 'Some stalls are not available',
        unavailableStalls: unavailableStalls.map(s => s.number)
      });
    }

    // Calculate base amounts for all stalls
    const stallsWithBase = stalls.map(stall => ({
      stall,
      baseAmount: Math.round(stall.ratePerSqm * stall.dimensions.width * stall.dimensions.height * 100) / 100
    }));

    const totalBaseAmount = stallsWithBase.reduce((sum, s) => sum + s.baseAmount, 0);

    // Calculate discount amounts
    const calculateDiscount = (baseAmount: number, totalBaseAmount: number, discount: any) => {
      if (!discount || !discount.isActive) return 0;
      
      let amount = 0;
      if (discount.type === 'percentage') {
        const percentage = Math.min(Math.max(0, discount.value), 100);
        amount = Math.round((baseAmount * percentage / 100) * 100) / 100;
      } else if (discount.type === 'fixed') {
        const proportionalAmount = (baseAmount / totalBaseAmount) * discount.value;
        amount = Math.round(Math.min(proportionalAmount, baseAmount) * 100) / 100;
      }
      return amount;
    };

    // Calculate amounts for each stall including discounts if applicable
    const stallCalculations = stallsWithBase.map(({ stall, baseAmount }) => {
      const discountAmount = calculateDiscount(baseAmount, totalBaseAmount, selectedDiscount);
      const amountAfterDiscount = Math.round((baseAmount - discountAmount) * 100) / 100;

      return {
        stallId: stall._id,
        number: stall.number,
        baseAmount,
        discount: selectedDiscount ? {
          name: selectedDiscount.name,
          type: selectedDiscount.type,
          value: selectedDiscount.value,
          amount: discountAmount
        } : null,
        amountAfterDiscount
      };
    });

    // Calculate total amounts including discounts and taxes
    const totalDiscountAmount = stallCalculations.reduce((sum, stall) => sum + (stall.discount?.amount || 0), 0);
    const totalAmountAfterDiscount = Math.round((totalBaseAmount - totalDiscountAmount) * 100) / 100;

    // Apply taxes from exhibition configuration
    const taxes = exhibition.taxConfig
      ?.filter(tax => tax.isActive)
      .map(tax => ({
        name: tax.name,
        rate: tax.rate,
        amount: Math.round((totalAmountAfterDiscount * tax.rate / 100) * 100) / 100
      })) || [];

    const totalTaxAmount = taxes.reduce((sum, tax) => sum + tax.amount, 0);
    const finalAmount = Math.round((totalAmountAfterDiscount + totalTaxAmount) * 100) / 100;

    // Create booking record with 'pending' status for exhibitor bookings
    const booking = await Booking.create({
      exhibitionId,
      stallIds,
      exhibitorId: exhibitorId,
      userId: exhibition.createdBy,
      customerName: customerName || exhibitor.contactPerson,
      customerEmail: customerEmail || exhibitor.email,
      customerPhone: customerPhone || exhibitor.phone,
      customerAddress: exhibitor.address || 'N/A',
      customerGSTIN: exhibitor.gstNumber || 'N/A',
      customerPAN: exhibitor.panNumber || 'N/A',
      companyName: companyName || exhibitor.companyName,
      status: 'pending',
      amount: finalAmount,
      calculations: {
        stalls: stallCalculations,
        totalBaseAmount,
        totalDiscountAmount,
        totalAmountAfterDiscount,
        taxes,
        totalTaxAmount,
        totalAmount: finalAmount
      },
      bookingSource: 'exhibitor'
    });

    // Update stall status to reserved (not sold, as they're just pending)
    await Stall.updateMany(
      { _id: { $in: stallIds } },
      { status: 'reserved' }
    );

    // Send notification to admin about new exhibitor booking
    try {
      // If there's a creator/owner for the exhibition, notify them
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
              stallNumbers: stallCalculations.map(s => s.number).join(', '),
              amount: finalAmount,
              bookingId: booking._id.toString(),
              exhibitorName: exhibitor.companyName,
              bookingSource: 'exhibitor'
            }
          }
        );
      }
    } catch (notificationError) {
      console.error('Error sending notification for exhibitor booking:', notificationError);
      // Continue even if notification fails
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating exhibitor booking', error });
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

    // Update stall status back to available
    await Stall.updateMany(
      { _id: { $in: booking.stallIds } },
      { status: 'available' }
    );

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
          { path: 'exhibitionId', select: 'name venue startDate endDate description invoicePrefix companyName companyAddress companyContactNo companyEmail companyGST companyPAN companySAC companyCIN companyWebsite termsAndConditions piInstructions bankName bankAccount bankIFSC bankBranch bankAccountName' },
          { path: 'stallIds', select: 'number dimensions ratePerSqm stallTypeId', populate: { path: 'stallTypeId', select: 'name' } },
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

    // Then fetch the invoice
    const invoice = await Invoice.findOne({ bookingId: booking._id })
      .populate({
        path: 'bookingId',
        select: '_id exhibitionId stallIds customerName customerEmail customerPhone customerGSTIN customerAddress companyName calculations amount status createdAt updatedAt',
        populate: [
          { path: 'exhibitionId', select: 'name venue startDate endDate description invoicePrefix companyName companyAddress companyContactNo companyEmail companyGST companyPAN companySAC companyCIN companyWebsite termsAndConditions piInstructions bankName bankAccount bankIFSC bankBranch bankAccountName' },
          { path: 'stallIds', select: 'number dimensions ratePerSqm stallTypeId', populate: { path: 'stallTypeId', select: 'name' } },
        ],
      });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found for this booking' });
    }

    // Generate the PDF using the same function used for admin invoices
    const pdfBuffer = await generatePDF(invoice, false);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice._id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading exhibitor booking invoice', error });
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
          { path: 'exhibitionId', select: 'name venue startDate endDate description invoicePrefix companyName companyAddress companyContactNo companyEmail companyGST companyPAN companySAC companyCIN companyWebsite termsAndConditions piInstructions bankName bankAccount bankIFSC bankBranch bankAccountName' },
          { path: 'stallIds', select: 'number dimensions ratePerSqm stallTypeId', populate: { path: 'stallTypeId', select: 'name' } },
        ],
      });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found for this booking' });
    }

    // Generate the PDF and send email
    const pdfBuffer = await generatePDF(invoice, false);
    const pdfPath = join(__dirname, `../temp/invoice-${invoice._id}.pdf`);
    writeFileSync(pdfPath, pdfBuffer);

    // Get the email transporter that works for OTPs
    const { transporter, isTestMode, getTestMessageUrl } = await getEmailTransporter();

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Exhibition Management" <no-reply@exhibition-management.com>',
      to: email,
      subject: `Invoice for ${booking.exhibitionId ? (booking.exhibitionId as any).name : 'Your Booking'}`,
      text: message || 'Please find the attached invoice.',
      attachments: [{
        filename: `invoice-${invoice._id}.pdf`,
        path: pdfPath
      }]
    });

    // Log test message URL if in test mode
    if (isTestMode && getTestMessageUrl) {
      console.log('Preview URL: %s', getTestMessageUrl(info));
    }

    unlinkSync(pdfPath);
    res.json({ message: 'Invoice shared via email successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sharing invoice via email', error });
  }
};

/**
 * Share the invoice via WhatsApp
 */
export const shareInvoiceViaWhatsApp = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;
    const exhibitorId = req.exhibitor?.id;
    const whatsappApiUrl = process.env.WHATSAPP_API_URL;
    const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;
    
    if (!exhibitorId) {
      return res.status(400).json({ message: 'Exhibitor ID not found' });
    }

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    if (!whatsappApiUrl || !whatsappApiToken) {
      throw new Error('WhatsApp API configuration missing');
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
          { path: 'exhibitionId', select: 'name venue startDate endDate description invoicePrefix companyName companyAddress companyContactNo companyEmail companyGST companyPAN companySAC companyCIN companyWebsite termsAndConditions piInstructions bankName bankAccount bankIFSC bankBranch bankAccountName' },
          { path: 'stallIds', select: 'number dimensions ratePerSqm stallTypeId', populate: { path: 'stallTypeId', select: 'name' } },
        ],
      });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found for this booking' });
    }

    // Generate the PDF and save temporarily
    const pdfBuffer = await generatePDF(invoice, false);
    const pdfPath = join(__dirname, `../temp/invoice-${invoice._id}.pdf`);
    writeFileSync(pdfPath, pdfBuffer);

    // TODO: Implement file storage and get public URL
    const pdfUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/exhibitor-bookings/${req.params.id}/invoice/download`;

    await axios.post(whatsappApiUrl, {
      phone: phoneNumber,
      message: `Here's your invoice: ${pdfUrl}`,
    }, {
      headers: {
        'Authorization': `Bearer ${whatsappApiToken}`
      }
    });

    unlinkSync(pdfPath);
    res.json({ message: 'Invoice shared successfully via WhatsApp' });
  } catch (error) {
    res.status(500).json({ message: 'Error sharing invoice via WhatsApp', error });
  }
}; 