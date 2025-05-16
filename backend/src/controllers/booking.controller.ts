import { Request, Response } from 'express';
import Booking from '../models/booking.model';
import Stall from '../models/stall.model';
import Invoice from '../models/invoice.model';
import Exhibition from '../models/exhibition.model';
import { createNotification } from './notification.controller';
import { NotificationType, NotificationPriority } from '../models/notification.model';

/**
 * Interface defining the structure of a discount configuration
 */
interface DiscountConfig {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
}

/**
 * Calculates the discount amount for a stall based on its base amount and the selected discount
 * @param baseAmount - The base amount of the stall
 * @param totalBaseAmount - Total base amount of all stalls (used for fixed discount distribution)
 * @param discount - The selected discount configuration
 * @returns The calculated discount amount, rounded to 2 decimal places
 */
const calculateDiscount = (baseAmount: number, totalBaseAmount: number, discount: DiscountConfig | null | undefined) => {
  if (!discount || !discount.isActive) return 0;
  
  let amount = 0;
  if (discount.type === 'percentage') {
    // For percentage discounts, calculate as a percentage of the base amount
    const percentage = Math.min(Math.max(0, discount.value), 100);
    amount = Math.round((baseAmount * percentage / 100) * 100) / 100;
  } else if (discount.type === 'fixed') {
    // For fixed discounts, calculate proportional amount based on the total base amount
    const proportionalAmount = (baseAmount / totalBaseAmount) * discount.value;
    amount = Math.round(Math.min(proportionalAmount, baseAmount) * 100) / 100;
  }
  return amount;
};

/**
 * Distributes a fixed discount amount across multiple stalls proportionally
 * @param stalls - Array of stalls with their base amounts
 * @param totalDiscount - Total fixed discount amount to distribute
 * @returns Array of distributed discount amounts for each stall
 */
const distributeFixedDiscount = (
  stalls: Array<{ baseAmount: number }>,
  totalDiscount: number
): number[] => {
  const totalBaseAmount = stalls.reduce((sum, stall) => sum + stall.baseAmount, 0);
  return stalls.map(stall => {
    const proportionalAmount = (stall.baseAmount / totalBaseAmount) * totalDiscount;
    return Math.round(Math.min(proportionalAmount, stall.baseAmount) * 100) / 100;
  });
};

/**
 * Creates a new booking with the following workflow:
 * 1. Validates input data and exhibitor
 * 2. Checks exhibition existence and stall availability
 * 3. Applies discounts if specified
 * 4. Calculates amounts including taxes
 * 5. Creates booking record
 * 6. Updates stall status
 * 7. Generates invoice
 */
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { 
      stallIds, 
      exhibitionId, 
      exhibitorId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerGSTIN,
      customerPAN,
      companyName,
      discount,
      basicAmenities,
      extraAmenities
    } = req.body;

    if (!exhibitorId) {
      return res.status(400).json({ message: 'Exhibitor ID is required' });
    }

    // Get the exhibition data
    const exhibition = await Exhibition.findById(exhibitionId);
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    // Find selected discount if any
    // Discounts are optional - if not provided or not found, no discount will be applied
    const selectedDiscount = discount ? exhibition.discountConfig?.find(
      d => d.name === discount.name && d.type === discount.type && d.value === discount.value && d.isActive
    ) : undefined;

    if (discount && !selectedDiscount) {
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

    // Calculate amounts for each stall including discounts if applicable
    const stallCalculations = stallsWithBase.map(({ stall, baseAmount }) => {
      const discountAmount = calculateDiscount(baseAmount, totalBaseAmount, selectedDiscount);
      const amountAfterDiscount = Math.round((baseAmount - discountAmount) * 100) / 100;

      return {
        stallId: stall._id,
        number: stall.number,
        baseAmount,
        // Include discount details only if a discount is selected and applied
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

    // Create booking record
    const booking = await Booking.create({
      exhibitionId,
      stallIds,
      userId: req.user?._id,
      exhibitorId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress: req.body.customerAddress || 'N/A',
      customerGSTIN: req.body.customerGSTIN || 'N/A',
      customerPAN: req.body.customerPAN || 'N/A',
      companyName,
      status: 'confirmed',
      amount: finalAmount,
      // Include amenities if provided
      ...(basicAmenities && basicAmenities.length > 0 && { basicAmenities }),
      ...(extraAmenities && extraAmenities.length > 0 && { extraAmenities }),
      calculations: {
        stalls: stallCalculations,
        totalBaseAmount,
        totalDiscountAmount,
        totalAmountAfterDiscount,
        taxes,
        totalTaxAmount,
        totalAmount: finalAmount
      }
    });

    // Update stall status to booked
    await Stall.updateMany(
      { _id: { $in: stallIds } },
      { status: 'booked' }
    );

    // Generate invoice number
    const prefix = exhibition.invoicePrefix || 'INV';
    const year = new Date().getFullYear();
    
    // Find the count of existing invoices for this exhibition in this year to generate sequence
    const invoiceCount = await Invoice.countDocuments({
      invoiceNumber: new RegExp(`^${prefix}/${year}/`)
    });
    
    // Generate sequence number (1-based, padded to 2 digits)
    const sequence = (invoiceCount + 1).toString().padStart(2, '0');
    
    // Create the invoice number
    const invoiceNumber = `${prefix}/${year}/${sequence}`;

    // Generate invoice for the booking
    try {
      console.log(`[INFO] Generating invoice for booking ${booking._id}`);
      const invoice = await Invoice.create({
        bookingId: booking._id,
        userId: req.user?._id,
        status: 'pending',
        amount: finalAmount,
        invoiceNumber, // Add the generated invoice number
        items: stallCalculations.map(stall => ({
          description: `Stall ${stall.number} Booking`,
          amount: stall.baseAmount,
          discount: stall.discount,
          taxes: taxes.map(tax => ({
            name: tax.name,
            rate: tax.rate,
            amount: (stall.amountAfterDiscount * tax.rate) / 100
          }))
        })),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      });
      console.log(`[INFO] Invoice ${invoice._id} created successfully for booking ${booking._id}`);
      
      // Send notification to admin about new booking
      try {
        // If there's a creator/owner for the exhibition, notify them
        if (exhibition.createdBy) {
          await createNotification(
            exhibition.createdBy,
            'admin',
            'New Booking Created',
            `A new booking has been created for exhibition "${exhibition.name}" by ${companyName || customerName}.`,
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
                bookingId: booking._id.toString()
              }
            }
          );
        }
        
        // Also send invoice notification
        await createNotification(
          req.user?.id,
          'admin',
          'Invoice Generated',
          `Invoice #${invoiceNumber} has been generated for booking #${booking._id}.`,
          NotificationType.INVOICE_GENERATED,
          {
            priority: NotificationPriority.MEDIUM,
            entityId: invoice._id,
            entityType: 'Invoice',
            data: {
              invoiceNumber,
              bookingId: booking._id.toString(),
              amount: finalAmount
            }
          }
        );
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
        // Continue even if notification fails
      }
      
      // Include the invoice ID in response for immediate access
      const bookingWithInvoice = await Booking.findById(booking._id)
        .populate('exhibitionId', 'name')
        .populate('stallIds', 'number dimensions ratePerSqm');
        
      if (!bookingWithInvoice) {
        // Unlikely, but handle the case where booking can't be found
        return res.status(201).json({
          ...booking.toObject(),
          invoiceId: invoice._id
        });
      }
      
      return res.status(201).json({
        ...bookingWithInvoice.toObject(),
        invoiceId: invoice._id // Add invoice ID to response
      });
    } catch (invoiceError) {
      console.error('Error creating invoice:', invoiceError);
      // Even if invoice creation fails, the booking was successful
      // Return success but with a warning
      return res.status(201).json({
        ...booking.toObject(),
        warning: 'Booking created successfully but invoice generation failed. Please try accessing your invoice later.'
      });
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking', error });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    // Check for query parameters
    const { exhibitionId, includeDetails, page = '1', limit = '10' } = req.query;
    
    // Parse pagination parameters
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    
    // Build query conditions
    const conditions: any = {};
    if (exhibitionId) {
      conditions.exhibitionId = exhibitionId;
    }
    
    // Get total count for pagination info
    const totalCount = await Booking.countDocuments(conditions);
    
    let bookings;
    
    // Use different query approaches based on the includeDetails flag
    if (includeDetails === 'true') {
      // Full details query with pagination
      bookings = await Booking.find(conditions)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('exhibitionId')
        .populate('stallIds')
        .populate('exhibitorId')
        .populate('userId');
    } else {
      // Limited fields query with pagination for better performance
      bookings = await Booking.find(conditions)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('exhibitionId', 'name')
        .populate('stallIds', 'number dimensions ratePerSqm')
        .select('_id exhibitionId stallIds customerName customerEmail customerPhone companyName amount calculations status createdAt');
    }
    
    // Return paginated results with metadata
    res.json({
      data: bookings,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(totalCount / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};

export const getBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('exhibitionId', 'name venue invoicePrefix companyName companyAddress companyContactNo companyEmail companyGST companyPAN companySAC')
      .populate('stallIds', 'number dimensions ratePerSqm')
      .populate('userId', 'username');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking', error });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status, rejectionReason } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('exhibitionId')
      .populate('exhibitorId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Validate the status transition
    const validStatuses = ['pending', 'approved', 'rejected', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // If status is being set to rejected, require a rejection reason
    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required when rejecting a booking' });
    }

    // Save old status for comparison
    const oldStatus = booking.status;

    // Update booking status and rejection reason if applicable
    booking.status = status;
    if (status === 'rejected') {
      booking.rejectionReason = rejectionReason;
    }
    await booking.save();

    // Update all stalls status based on the new booking status
    if (status === 'confirmed' || status === 'approved') {
      await Stall.updateMany(
        { _id: { $in: booking.stallIds } },
        { status: status === 'confirmed' ? 'booked' : 'reserved' }
      );
      
      // When a booking is approved, check if an invoice exists - if not, create one
      if (status === 'approved') {
        const existingInvoice = await Invoice.findOne({ bookingId: booking._id });
        
        if (!existingInvoice) {
          console.log(`Creating invoice for approved booking ${booking._id}`);
          
          // Get the exhibition's creator as the userId (admin)
          const exhibitionData = await Exhibition.findById(booking.exhibitionId);
          if (!exhibitionData) {
            return res.status(404).json({ message: 'Exhibition not found' });
          }
          
          const userId = exhibitionData.createdBy;
          
          if (!userId) {
            console.error('Could not find userId for invoice creation');
            return res.status(500).json({ message: 'Error creating invoice - missing userId' });
          }

          // Generate invoice number
          const prefix = exhibitionData.invoicePrefix || 'INV';
          const year = new Date().getFullYear();
          
          // Find the count of existing invoices for this exhibition in this year to generate sequence
          const invoiceCount = await Invoice.countDocuments({
            invoiceNumber: new RegExp(`^${prefix}/${year}/`)
          });
          
          // Generate sequence number (1-based, padded to 2 digits)
          const sequence = (invoiceCount + 1).toString().padStart(2, '0');
          
          // Create the invoice number
          const invoiceNumber = `${prefix}/${year}/${sequence}`;
          
          // Create invoice with proper data
          const invoice = await Invoice.create({
            bookingId: booking._id,
            userId: userId,
            status: 'pending',
            amount: booking.amount,
            invoiceNumber, // Add the generated invoice number
            items: booking.calculations.stalls.map(stall => ({
              description: `Stall ${stall.number} Booking`,
              amount: stall.baseAmount,
              discount: stall.discount,
              taxes: booking.calculations.taxes.map(tax => ({
                name: tax.name,
                rate: tax.rate,
                amount: (stall.amountAfterDiscount * tax.rate) / 100
              }))
            })),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          });
          
          console.log(`Invoice created successfully for booking ${booking._id}`);

          // Notify exhibitor about booking approval and invoice
          if (booking.exhibitorId) {
            try {
              // Get exhibition name safely
              const exhibitionName = booking.exhibitionId ? 
                (booking.exhibitionId as any).name || 'your exhibition' : 
                'your exhibition';
                
              // Send booking status change notification
              await createNotification(
                booking.exhibitorId,
                'exhibitor',
                'Booking Approved',
                `Your booking request for "${exhibitionName}" has been approved.`,
                NotificationType.BOOKING_CONFIRMED,
                {
                  priority: NotificationPriority.HIGH,
                  entityId: booking._id,
                  entityType: 'Booking',
                  data: {
                    exhibitionName,
                    bookingId: booking._id.toString(),
                    amount: booking.amount
                  }
                }
              );

              // Send invoice notification
              await createNotification(
                booking.exhibitorId,
                'exhibitor',
                'Invoice Generated',
                `Invoice #${invoiceNumber} has been generated for your booking.`,
                NotificationType.INVOICE_GENERATED,
                {
                  priority: NotificationPriority.MEDIUM,
                  entityId: invoice._id,
                  entityType: 'Invoice',
                  data: {
                    invoiceNumber,
                    bookingId: booking._id.toString(),
                    amount: booking.amount
                  }
                }
              );
            } catch (notificationError) {
              console.error('Error sending notification to exhibitor:', notificationError);
              // Continue even if notification fails
            }
          }
        }
      }
    } else if (status === 'cancelled' || status === 'rejected') {
      await Stall.updateMany(
        { _id: { $in: booking.stallIds } },
        { status: 'available' }
      );
      
      // Update invoice status if status is cancelled
      if (status === 'cancelled') {
        await Invoice.findOneAndUpdate(
          { bookingId: booking._id },
          { status: 'cancelled' }
        );
      }

      // If the booking was rejected and has an exhibitor ID, notify the exhibitor
      if (status === 'rejected' && booking.exhibitorId && oldStatus !== 'rejected') {
        try {
          // Get exhibition name safely
          const exhibitionName = booking.exhibitionId ? 
            (booking.exhibitionId as any).name || 'your exhibition' : 
            'your exhibition';
            
          await createNotification(
            booking.exhibitorId,
            'exhibitor',
            'Booking Rejected',
            `Your booking request for "${exhibitionName}" has been rejected. Reason: ${rejectionReason}`,
            NotificationType.BOOKING_CANCELLED,
            {
              priority: NotificationPriority.HIGH,
              entityId: booking._id,
              entityType: 'Booking',
              data: {
                exhibitionName,
                bookingId: booking._id.toString(),
                rejectionReason
              }
            }
          );
        } catch (notificationError) {
          console.error('Error sending rejection notification to exhibitor:', notificationError);
          // Continue even if notification fails
        }
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error });
  }
};

export const getBookingsByExhibition = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ exhibitionId: req.params.exhibitionId })
      .sort({ createdAt: -1 })
      .populate('stallId', 'number')
      .populate('userId', 'username');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exhibition bookings', error });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update all stalls status back to available
    await Stall.updateMany(
      { _id: { $in: booking.stallIds } },
      { status: 'available' }
    );

    // Delete related invoice
    await Invoice.deleteOne({ bookingId: booking._id });

    // Delete the booking
    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error });
  }
}; 