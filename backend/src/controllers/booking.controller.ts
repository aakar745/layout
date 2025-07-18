import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Booking from '../models/booking.model';
import Stall from '../models/stall.model';
import Invoice from '../models/invoice.model';
import Exhibition from '../models/exhibition.model';
import { createNotification } from './notification.controller';
import { NotificationType, NotificationPriority } from '../models/notification.model';
import { logActivity } from '../services/activity.service';
import { calculateStallArea } from '../utils/stallUtils';

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
 * Helper function to check if user has admin privileges
 */
const isAdminUser = (user: any): boolean => {
  if (!user?.role?.permissions) return false;
  
  const permissions = user.role.permissions;
  return permissions.includes('manage_all') ||
         permissions.includes('admin') ||
         permissions.includes('*') ||
         user.role.name?.toLowerCase() === 'admin';
};

/**
 * Get exhibitions accessible to the user
 */
const getUserAccessibleExhibitions = async (user: any) => {
  // Admin users can access all exhibitions
  if (isAdminUser(user)) {
    return await Exhibition.find().select('_id');
  }
  
  // Regular users can only access exhibitions they're assigned to
  return await Exhibition.find({ 
    assignedUsers: user._id 
  }).select('_id');
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

    // Check if exhibition is in a bookable state (published and active)
    if (exhibition.status !== 'published' || !exhibition.isActive) {
      return res.status(403).json({ 
        message: 'Cannot create booking for this exhibition',
        reason: exhibition.status !== 'published' 
          ? `Exhibition is in ${exhibition.status} status` 
          : 'Exhibition is inactive'
      });
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
      baseAmount: Math.round(stall.ratePerSqm * calculateStallArea(stall.dimensions) * 100) / 100
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
      
      // Log successful booking creation
      await logActivity(req, {
        action: 'booking_created',
        resource: 'booking',
        resourceId: booking._id.toString(),
        description: `Created booking for ${customerName} at ${exhibition.name}`,
        newValues: {
          customerName,
          companyName,
          stallIds: stallIds.length,
          amount: finalAmount,
          status: 'confirmed'
        },
        metadata: {
          exhibitionName: exhibition.name,
          stallCount: stallIds.length,
          totalAmount: finalAmount
        }
      });

      return res.status(201).json({
        ...bookingWithInvoice.toObject(),
        invoiceId: invoice._id // Add invoice ID to response
      });
    } catch (invoiceError) {
      console.error('Error creating invoice:', invoiceError);
      // Even if invoice creation fails, the booking was successful
      // Return success but with a warning
      
      // Log successful booking creation (even with invoice error)
      await logActivity(req, {
        action: 'booking_created',
        resource: 'booking',
        resourceId: booking._id.toString(),
        description: `Created booking for ${customerName} at ${exhibition.name} (invoice generation failed)`,
        newValues: {
          customerName,
          companyName,
          stallIds: stallIds.length,
          amount: finalAmount,
          status: 'confirmed'
        },
        metadata: {
          exhibitionName: exhibition.name,
          stallCount: stallIds.length,
          totalAmount: finalAmount,
          invoiceError: true
        }
      });

      return res.status(201).json({
        ...booking.toObject(),
        warning: 'Booking created successfully but invoice generation failed. Please try accessing your invoice later.'
      });
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    
    // Log failed booking creation
    await logActivity(req, {
      action: 'booking_created',
      resource: 'booking',
      description: `Failed to create booking for ${req.body.customerName}`,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      newValues: req.body
    });

    res.status(500).json({ message: 'Error creating booking', error });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    // Check for query parameters
    const { 
      exhibitionId, 
      includeDetails, 
      page = '1', 
      limit = '10',
      status,
      startDate,
      endDate,
      search
    } = req.query;
    
    // Parse pagination parameters
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    
    // Get accessible exhibitions for the current user
    const accessibleExhibitions = await getUserAccessibleExhibitions(req.user);
    const accessibleExhibitionIds = accessibleExhibitions.map(ex => ex._id);
    
    // Build query conditions
    const conditions: any = {};
    
    // Apply exhibition access control for non-admin users
    if (!isAdminUser(req.user)) {
      conditions.exhibitionId = { $in: accessibleExhibitionIds };
    }
    
    // Filter by specific exhibition ID (if provided and accessible)
    if (exhibitionId) {
      if (isAdminUser(req.user) || accessibleExhibitionIds.some(id => id.toString() === exhibitionId)) {
        conditions.exhibitionId = exhibitionId;
      } else {
        // User doesn't have access to this exhibition
        return res.status(403).json({ message: 'Access denied to this exhibition' });
      }
    }
    
    // Filter by status (can be an array)
    if (status) {
      if (Array.isArray(status)) {
        conditions.status = { $in: status };
      } else {
        conditions.status = status;
      }
    }
    
    // Filter by date range
    if (startDate && endDate) {
      conditions.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    } else if (startDate) {
      conditions.createdAt = { $gte: new Date(startDate as string) };
    } else if (endDate) {
      conditions.createdAt = { $lte: new Date(endDate as string) };
    }
    
    // Search by company name, customer name, or customer email
    if (search) {
      conditions.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } }
      ];
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
        .populate({
          path: 'stallIds',
          populate: {
            path: 'stallTypeId',
            select: 'name'
          }
        })
        .populate('exhibitorId', 'companyName contactPerson email phone')
        .populate({
          path: 'userId',
          select: 'username name email',
          populate: {
            path: 'role',
            select: 'name'
          }
        });
        
      // Transform stalls to include type from stallTypeId
      bookings = bookings.map(booking => {
        const bookingObj = booking.toObject();
        bookingObj.stallIds = bookingObj.stallIds.map((stall: any) => {
          if (stall.stallTypeId && typeof stall.stallTypeId === 'object') {
            // Add the type field based on stallTypeId name
            stall.type = stall.stallTypeId.name;
          }
          return stall;
        });
        return bookingObj;
      });
    } else {
      // Limited fields query with pagination for better performance
      bookings = await Booking.find(conditions)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('exhibitionId', 'name')
        .populate({
          path: 'stallIds',
          select: 'number dimensions ratePerSqm stallTypeId',
          populate: {
            path: 'stallTypeId',
            select: 'name'
          }
        })
        .populate({
          path: 'userId',
          select: 'username name email',
          populate: {
            path: 'role',
            select: 'name'
          }
        })
        .populate('exhibitorId', 'companyName contactPerson email phone')
        .select('_id exhibitionId stallIds userId exhibitorId customerName customerEmail customerPhone companyName amount calculations status createdAt bookingSource');
        
      // Transform stalls to include type from stallTypeId
      bookings = bookings.map(booking => {
        const bookingObj = booking.toObject();
        bookingObj.stallIds = bookingObj.stallIds.map((stall: any) => {
          if (stall.stallTypeId && typeof stall.stallTypeId === 'object') {
            // Add the type field based on stallTypeId name
            stall.type = stall.stallTypeId.name;
          }
          return stall;
        });
        return bookingObj;
      });
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
      .populate({
        path: 'userId',
        select: 'username name email',
        populate: {
          path: 'role',
          select: 'name'
        }
      })
      .populate('exhibitorId', 'companyName contactPerson email phone');

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
      .populate('exhibitionId', 'name')
      .populate('exhibitorId')
      .populate('stallIds', 'number');

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

    // Get stall numbers for activity logging
    const stallNumbers = (booking.stallIds as any[]).map(stall => stall.number).join(', ');
    const exhibitionName = (booking.exhibitionId as any)?.name || 'Unknown Exhibition';

    // Log booking status change
    await logActivity(req, {
      action: 'booking_updated',
      resource: 'booking',
      resourceId: booking._id.toString(),
      description: `Changed booking status from "${oldStatus}" to "${status}" for stall(s) ${stallNumbers} in exhibition "${exhibitionName}"${status === 'rejected' && rejectionReason ? ` (Reason: ${rejectionReason})` : ''}`,
      oldValues: { 
        status: oldStatus,
        stallNumbers,
        exhibitionName
      },
      newValues: { 
        status, 
        rejectionReason,
        stallNumbers,
        exhibitionName
      },
      metadata: {
        customerName: booking.customerName,
        companyName: booking.companyName,
        stallNumbers,
        exhibitionName,
        oldStatus,
        newStatus: status
      }
    });

    // Update all stalls status based on the new booking status
    if (status === 'confirmed' || status === 'approved') {
      await Stall.updateMany(
        { _id: { $in: booking.stallIds } },
        { status: status === 'confirmed' ? 'booked' : 'reserved' }
      );
      
      // When a booking is approved OR confirmed, check if an invoice exists - if not, create one
      if (status === 'approved' || status === 'confirmed') {
        const existingInvoice = await Invoice.findOne({ bookingId: booking._id });
        
        if (!existingInvoice) {
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

          // Notify exhibitor about booking approval/confirmation and invoice
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
                status === 'approved' ? 'Booking Approved' : 'Booking Confirmed',
                `Your booking request for "${exhibitionName}" has been ${status}.`,
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
    const { exhibitionId } = req.params;
    
    // Check if user has access to this exhibition
    if (!isAdminUser(req.user)) {
      const accessibleExhibitions = await getUserAccessibleExhibitions(req.user);
      const hasAccess = accessibleExhibitions.some(ex => ex._id.toString() === exhibitionId);
      
      if (!hasAccess) {
        return res.status(403).json({ message: 'Access denied to this exhibition' });
      }
    }
    
    const bookings = await Booking.find({ exhibitionId })
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
    const booking = await Booking.findById(req.params.id)
      .populate('exhibitionId', 'name')
      .populate('stallIds', 'number');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Get stall numbers for activity logging
    const stallNumbers = (booking.stallIds as any[]).map(stall => stall.number).join(', ');
    const exhibitionName = (booking.exhibitionId as any)?.name || 'Unknown Exhibition';

    // Update all stalls status back to available
    await Stall.updateMany(
      { _id: { $in: booking.stallIds } },
      { status: 'available' }
    );

    // Delete related invoice
    await Invoice.deleteOne({ bookingId: booking._id });

    // Log activity before deleting
    await logActivity(req, {
      action: 'booking_deleted',
      resource: 'booking',
      resourceId: booking._id.toString(),
      description: `Deleted booking for stall(s) ${stallNumbers} in exhibition "${exhibitionName}"`,
      oldValues: {
        customerName: booking.customerName,
        companyName: booking.companyName,
        stallNumbers,
        amount: booking.amount,
        status: booking.status,
        exhibitionName
      },
      success: true
    });

    // Delete the booking
    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    
    // Log failed deletion attempt
    await logActivity(req, {
      action: 'booking_deleted',
      resource: 'booking',
      resourceId: req.params.id,
      description: `Failed to delete booking`,
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Error deleting booking'
    });
    
    res.status(500).json({ message: 'Error deleting booking', error });
  }
};

/**
 * Get booking statistics
 * Returns counts for each booking status, total SQM and booked SQM
 * Supports exhibition filtering to show stats for specific exhibition
 */
export const getBookingStats = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.query;
    
    // Build base match conditions for bookings
    const bookingMatchConditions: any = {};
    if (exhibitionId) {
      bookingMatchConditions.exhibitionId = new mongoose.Types.ObjectId(exhibitionId as string);
    }

    // Get booking stats and booked SQM from bookings
    const bookingStats = await Booking.aggregate([
      {
        $match: bookingMatchConditions
      },
      {
        $facet: {
          // Get counts by status
          statusCounts: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          // Calculate booked SQM from confirmed and approved bookings
          bookedSQM: [
            {
              $match: {
                status: { $in: ['confirmed', 'approved'] }
              }
            },
            {
              $lookup: {
                from: 'stalls',
                localField: 'stallIds',
                foreignField: '_id',
                as: 'stalls'
              }
            },
            {
              $unwind: '$stalls'
            },
            {
              $addFields: {
                stallArea: {
                  $cond: {
                    if: { $eq: ['$stalls.dimensions.shapeType', 'l-shape'] },
                    then: {
                      $add: [
                        { $multiply: ['$stalls.dimensions.lShape.rect1Width', '$stalls.dimensions.lShape.rect1Height'] },
                        { $multiply: ['$stalls.dimensions.lShape.rect2Width', '$stalls.dimensions.lShape.rect2Height'] }
                      ]
                    },
                    else: { $multiply: ['$stalls.dimensions.width', '$stalls.dimensions.height'] }
                  }
                }
              }
            },
            {
              $group: {
                _id: null,
                total: { 
                  $sum: '$stallArea'
                }
              }
            }
          ],
          // Get total count
          total: [
            {
              $count: 'count'
            }
          ]
        }
      }
    ]);

    // Get total SQM - filter by exhibition if specified
    let totalSQMPipeline: any[] = [];
    
    if (exhibitionId) {
      // If exhibition is selected, get total SQM only for that exhibition's stalls
      totalSQMPipeline = [
        {
          $match: {
            exhibitionId: new mongoose.Types.ObjectId(exhibitionId as string)
          }
        },
        {
          $addFields: {
            stallArea: {
              $cond: {
                if: { $eq: ['$dimensions.shapeType', 'l-shape'] },
                then: {
                  $add: [
                    { $multiply: ['$dimensions.lShape.rect1Width', '$dimensions.lShape.rect1Height'] },
                    { $multiply: ['$dimensions.lShape.rect2Width', '$dimensions.lShape.rect2Height'] }
                  ]
                },
                else: { $multiply: ['$dimensions.width', '$dimensions.height'] }
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { 
              $sum: '$stallArea'
            }
          }
        }
      ];
    } else {
      // If no exhibition selected, get total SQM from all stalls
      totalSQMPipeline = [
        {
          $addFields: {
            stallArea: {
              $cond: {
                if: { $eq: ['$dimensions.shapeType', 'l-shape'] },
                then: {
                  $add: [
                    { $multiply: ['$dimensions.lShape.rect1Width', '$dimensions.lShape.rect1Height'] },
                    { $multiply: ['$dimensions.lShape.rect2Width', '$dimensions.lShape.rect2Height'] }
                  ]
                },
                else: { $multiply: ['$dimensions.width', '$dimensions.height'] }
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { 
              $sum: '$stallArea'
            }
          }
        }
      ];
    }

    const totalSQMResult = await Stall.aggregate(totalSQMPipeline);

    // Process the aggregation results
    const statusMap: Record<string, number> = {};
    if (bookingStats[0] && bookingStats[0].statusCounts) {
      bookingStats[0].statusCounts.forEach((item: { _id: string; count: number }) => {
        statusMap[item._id] = item.count;
      });
    }

    const totalSQM = totalSQMResult.length > 0 ? Math.round(totalSQMResult[0].total * 100) / 100 : 0;
    const bookedSQM = (bookingStats[0] && bookingStats[0].bookedSQM.length > 0) ? Math.round(bookingStats[0].bookedSQM[0].total * 100) / 100 : 0;
    const total = (bookingStats[0] && bookingStats[0].total.length > 0) ? bookingStats[0].total[0].count : 0;

    // Return the formatted statistics
    res.json({
      total,
      pending: statusMap['pending'] || 0,
      approved: statusMap['approved'] || 0,
      rejected: statusMap['rejected'] || 0,
      confirmed: statusMap['confirmed'] || 0,
      cancelled: statusMap['cancelled'] || 0,
      totalSQM,
      bookedSQM
    });
  } catch (error) {
    console.error('Error fetching booking statistics:', error);
    res.status(500).json({ message: 'Error fetching booking statistics', error });
  }
};

/**
 * Export bookings data without pagination limits
 * Supports all the same filters as getBookings but returns all matching records
 * Returns full booking objects with proper population for frontend processing
 */
export const exportBookings = async (req: Request, res: Response) => {
  try {
    const { exhibitionId, status, bookingSource, search, startDate, endDate } = req.query;
    
    // Build filter conditions (same as getBookings)
    const conditions: any = {};
    
    if (exhibitionId) {
      conditions.exhibitionId = exhibitionId;
    }
    
    if (status) {
      if (Array.isArray(status)) {
        conditions.status = { $in: status };
      } else {
        conditions.status = status;
      }
    }
    
    if (bookingSource) {
      conditions.bookingSource = bookingSource;
    }
    
    // Date range filter
    if (startDate || endDate) {
      conditions.createdAt = {};
      if (startDate) {
        conditions.createdAt.$gte = new Date(startDate as string);
      }
      if (endDate) {
        const endDateTime = new Date(endDate as string);
        endDateTime.setHours(23, 59, 59, 999);
        conditions.createdAt.$lte = endDateTime;
      }
    }
    
    // Search filter
    if (search) {
      conditions.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch bookings with full population (same as getBookings)
    const bookings = await Booking.find(conditions)
      .populate({
        path: 'exhibitionId',
        select: 'name status isActive invoicePrefix'
      })
      .populate({
        path: 'stallIds',
        select: 'number type dimensions stallTypeId',
        populate: {
          path: 'stallTypeId',
          select: 'name'
        }
      })
      .populate({
        path: 'userId',
        select: 'username name email',
        populate: {
          path: 'role',
          select: 'name'
        }
      })
      .populate('exhibitorId', 'companyName contactPerson email phone')
      .sort({ createdAt: -1 });

    // Return the full booking objects for frontend processing
    res.json(bookings);
  } catch (error) {
    console.error('Error exporting bookings:', error);
    res.status(500).json({ message: 'Error exporting bookings', error });
  }
}; 