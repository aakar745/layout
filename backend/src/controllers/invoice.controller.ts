import { Request, Response } from 'express';
import Invoice from '../models/invoice.model';
import Booking from '../models/booking.model';
import User from '../models/user.model';
import { IRole } from '../models/role.model';

// Import PDF generation related functions from service
export { downloadInvoice, shareViaEmail, shareViaWhatsApp } from '../services/invoice-pdf.service';

/**
 * Get all invoices with pagination
 */
export const getInvoices = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.user?._id) {
      return res.status(401).json({ 
        message: 'Authentication required',
        error: 'No user found in request'
      });
    }

    // Parse pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Check if user has admin access or booking permissions to view all invoices
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

    // Create query based on permissions - if user has access, don't filter by userId
    const query = hasViewAllAccess ? {} : { userId: req.user._id };
    
    // Get total count for pagination metadata
    const totalCount = await Invoice.countDocuments(query);

    // Get invoices with proper population and pagination
    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'bookingId',
        select: '_id customerName customerEmail customerPhone companyName calculations amount status createdAt updatedAt',
        populate: [
          { 
            path: 'exhibitionId',
            select: 'name venue startDate endDate description invoicePrefix companyName companyAddress companyContactNo companyEmail companyGST companyPAN companySAC companyCIN companyWebsite termsAndConditions piInstructions bankName bankAccount bankIFSC bankBranch bankAccountName'
          },
          { 
            path: 'stallIds',
            select: 'number dimensions ratePerSqm stallTypeId',
            populate: {
              path: 'stallTypeId',
              select: 'name'
            }
          }
        ]
      })
      .lean();

    // Filter out any null bookings and transform the data
    const validInvoices = invoices
      .filter(invoice => {
        if (!invoice.bookingId) {
          console.warn(`Invoice ${invoice._id} has no booking reference`);
          return false;
        }
        return true;
      })
      .map(invoice => ({
        ...invoice,
        bookingId: {
          ...invoice.bookingId,
          _id: invoice.bookingId._id.toString()
        }
      }));

    return res.status(200).json({
      success: true,
      data: validInvoices,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({
      message: 'Error fetching invoices',
      error: (error as Error).message
    });
  }
};

/**
 * Get invoice by ID
 */
export const getInvoice = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.user?._id) {
      return res.status(401).json({
        message: 'Authentication required',
        error: 'No user found in request'
      });
    }

    // Check if user has permission to view any invoice
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

    const invoice = await Invoice.findById(req.params.id)
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'exhibitionId', select: 'name venue startDate endDate description invoicePrefix companyName companyAddress companyContactNo companyEmail companyGST companyPAN companySAC companyCIN companyWebsite termsAndConditions piInstructions bankName bankAccount bankIFSC bankBranch bankAccountName' },
          { path: 'stallIds', select: 'number dimensions ratePerSqm stallTypeId updatedAt', populate: { path: 'stallTypeId', select: 'name updatedAt' } },
        ],
      });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // If user doesn't have view all access, check if the invoice belongs to them
    if (!hasViewAllAccess && invoice.userId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'You do not have permission to view this invoice',
        error: 'Access denied'
      });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ 
      message: 'Error fetching invoice', 
      error: (error as Error).message
    });
  }
};

/**
 * Update invoice status
 */
export const updateInvoiceStatus = async (req: Request, res: Response) => {
  try {
    const { status, paymentDetails } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Update invoice status and payment details
    invoice.status = status;
    if (status === 'paid' && paymentDetails) {
      invoice.paymentDetails = {
        ...paymentDetails,
        paidAt: new Date(),
      };
    }
    await invoice.save();

    // If invoice is paid, update booking payment status
    if (status === 'paid') {
      await Booking.findByIdAndUpdate(invoice.bookingId, {
        paymentStatus: 'paid',
        paymentDetails: invoice.paymentDetails,
      });
    }

    // If invoice is refunded, update booking payment status
    if (status === 'refunded') {
      await Booking.findByIdAndUpdate(invoice.bookingId, {
        paymentStatus: 'refunded',
      });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating invoice status', 
      error: (error as Error).message 
    });
  }
};

/**
 * Get invoices by exhibition
 */
export const getInvoicesByExhibition = async (req: Request, res: Response) => {
  try {
    const invoices = await Invoice.find()
      .populate({
        path: 'bookingId',
        match: { exhibitionId: req.params.exhibitionId },
        populate: [
          { path: 'userId', select: 'username' },
          { path: 'stallId', select: 'number' },
        ],
      })
      .sort({ createdAt: -1 });

    // Filter out invoices where bookingId is null (not matching exhibitionId)
    const filteredInvoices = invoices.filter(invoice => invoice.bookingId);

    res.json(filteredInvoices);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching exhibition invoices', 
      error: (error as Error).message 
    });
  }
}; 

