import { Request, Response } from 'express';
import Exhibition from '../models/exhibition.model';
import Hall from '../models/hall.model';
import Stall from '../models/stall.model';
import Booking from '../models/booking.model';
import Invoice from '../models/invoice.model';
import Fixture from '../models/fixture.model';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { logActivity } from '../services/activity.service';

export const getPublicExhibitions = async (req: Request, res: Response) => {
  try {
    const exhibitions = await Exhibition.find({ 
      status: 'published',
      isActive: true 
    })
      .select('name description startDate endDate venue slug headerLogo')
      .sort({ startDate: 1 });
    res.json(exhibitions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exhibitions', error });
  }
};

export const getPublicExhibition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let query = {};
    
    // If id is a valid ObjectId, search by _id, otherwise search by slug
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id, status: 'published', isActive: true };
    } else {
      query = { slug: id, status: 'published', isActive: true };
    }
    
    const exhibition = await Exhibition.findOne(query)
      .select('name description startDate endDate venue headerTitle headerSubtitle headerDescription headerLogo sponsorLogos slug amenities basicAmenities');

    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found or no longer available' });
    }

    res.json(exhibition);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exhibition', error });
  }
};

export const getPublicLayout = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let query = {};
    
    // If id is a valid ObjectId, search by _id, otherwise search by slug
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id, status: 'published', isActive: true };
    } else {
      query = { slug: id, status: 'published', isActive: true };
    }
    
    // Get exhibition
    const exhibition = await Exhibition.findOne(query)
      .select('name description startDate endDate dimensions taxConfig publicDiscountConfig venue headerLogo slug amenities basicAmenities');

    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found or no longer available' });
    }

    // Get halls with their stalls
    const halls = await Hall.find({ exhibitionId: exhibition._id })
      .select('_id name dimensions');
    const stalls = await Stall.find({ exhibitionId: exhibition._id })
      .select('_id number dimensions status ratePerSqm hallId stallTypeId')
      .populate('stallTypeId', 'name');
    
    // Get all bookings to find company names for booked stalls
    const bookings = await Booking.find({
      exhibitionId: exhibition._id,
      stallIds: { $in: stalls.map(stall => stall._id) }
    }).select('stallIds companyName');
    
    // Map stallId to company name for quick lookup
    const stallCompanyMap = new Map();
    bookings.forEach(booking => {
      booking.stallIds.forEach(stallId => {
        stallCompanyMap.set(stallId.toString(), booking.companyName);
      });
    });
      
    // Get fixtures for navigation
    const fixtures = await Fixture.find({ 
      exhibitionId: exhibition._id,
      isActive: true
    })
    .select('_id name type position dimensions rotation color icon showName borderColor borderRadius')
    .sort({ zIndex: 1 });

    // Group stalls by hall
    const hallsWithStalls = halls.map(hall => ({
      id: hall._id.toString(),
      name: hall.name,
      dimensions: hall.dimensions,
      stalls: stalls
        .filter(stall => stall.hallId.toString() === hall._id.toString())
        .map(stall => {
          const stallId = stall._id.toString();
          const companyName = stallCompanyMap.get(stallId);
          
          return {
            id: stallId,
            stallNumber: stall.number,
            type: stall.stallTypeId ? (stall.stallTypeId as any).name : 'Standard',
            dimensions: {
              width: stall.dimensions.width,
              height: stall.dimensions.height
            },
            position: {
              x: stall.dimensions.x,
              y: stall.dimensions.y
            },
            status: stall.status,
            ratePerSqm: stall.ratePerSqm,
            price: stall.ratePerSqm * stall.dimensions.width * stall.dimensions.height,
            // Include company name if stall is booked/reserved/sold
            companyName: stall.status !== 'available' ? companyName : undefined
          };
        })
    }));

    res.json({
      exhibition,
      layout: hallsWithStalls,
      fixtures: fixtures.map(fixture => ({
        id: fixture._id.toString(),
        name: fixture.name,
        type: fixture.type,
        position: fixture.position,
        dimensions: fixture.dimensions,
        rotation: fixture.rotation || 0,
        color: fixture.color,
        icon: fixture.icon,
        showName: fixture.showName,
        borderColor: fixture.borderColor,
        borderRadius: fixture.borderRadius
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching layout', error });
  }
};

export const getPublicStallDetails = async (req: Request, res: Response) => {
  try {
    const { id: exhibitionId, stallId } = req.params;
    
    // Query based on whether we have an ID or a slug
    let query = {};
    if (mongoose.Types.ObjectId.isValid(exhibitionId)) {
      query = { _id: exhibitionId, status: 'published', isActive: true };
    } else {
      query = { slug: exhibitionId, status: 'published', isActive: true };
    }
    
    // Find the exhibition first
    const exhibition = await Exhibition.findOne(query);
    
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found or no longer available' });
    }
    
    const stall = await Stall.findOne({
      _id: stallId,
      exhibitionId: exhibition._id
    })
    .select('_id number dimensions status ratePerSqm stallTypeId')
    .populate<{ hallId: { name: string } }>('hallId', 'name')
    .populate('stallTypeId', 'name');

    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    res.json({
      id: stall._id.toString(),
      number: stall.number,
      stallNumber: stall.number,
      type: stall.stallTypeId ? (stall.stallTypeId as any).name : 'Standard',
      dimensions: {
        width: stall.dimensions.width,
        height: stall.dimensions.height
      },
      position: {
        x: stall.dimensions.x,
        y: stall.dimensions.y
      },
      status: stall.status,
      ratePerSqm: stall.ratePerSqm,
      price: stall.ratePerSqm * stall.dimensions.width * stall.dimensions.height,
      hallName: stall.hallId?.name
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stall details', error });
  }
};

interface DiscountConfig {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
}

const calculateDiscount = (baseAmount: number, discount: DiscountConfig | null | undefined) => {
  if (!discount || !discount.isActive) return 0;
  
  if (discount.type === 'percentage') {
    return baseAmount * (Math.min(Math.max(0, discount.value), 100) / 100);
  } else {
    return Math.min(Math.max(0, discount.value), baseAmount);
  }
};

export const bookPublicStall = async (req: Request, res: Response) => {
  try {
    const { id: exhibitionId, stallId } = req.params;
    const { customerName, customerEmail, customerPhone, companyName, discountId } = req.body;

    // Query based on whether we have an ID or a slug
    let query = {};
    if (mongoose.Types.ObjectId.isValid(exhibitionId)) {
      query = { _id: exhibitionId, status: 'published', isActive: true };
    } else {
      query = { slug: exhibitionId, status: 'published', isActive: true };
    }

    // Check if exhibition exists and is published
    const exhibition = await Exhibition.findOne(query);

    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found or no longer available' });
    }

    // Find selected discount if any
    const selectedDiscount = exhibition.publicDiscountConfig?.find(
      d => d.name === discountId && d.isActive
    );

    // Check if stall is available
    const stall = await Stall.findOne({
      _id: stallId,
      exhibitionId: exhibition._id, // Use the actual ObjectId
      status: 'available'
    });

    if (!stall) {
      return res.status(400).json({ message: 'Stall is not available' });
    }

    // Calculate amounts
    const baseAmount = stall.ratePerSqm * stall.dimensions.width * stall.dimensions.height;
    const discountAmount = calculateDiscount(baseAmount, selectedDiscount);
    const amountAfterDiscount = baseAmount - discountAmount;

    // Calculate taxes from exhibition config
    const taxes = exhibition.taxConfig
      ?.filter(tax => tax.isActive)
      .map(tax => ({
        name: tax.name,
        rate: tax.rate,
        amount: amountAfterDiscount * (tax.rate / 100)
      })) || [];

    const totalTaxAmount = taxes.reduce((sum, tax) => sum + tax.amount, 0);
    const totalAmount = amountAfterDiscount + totalTaxAmount;

    // Create booking
    const booking = await Booking.create({
      exhibitionId,
      stallIds: [stallId],
      customerName,
      customerEmail,
      customerPhone,
      companyName,
      amount: totalAmount,
      calculations: {
        stalls: [{
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
        }],
        totalBaseAmount: baseAmount,
        totalDiscountAmount: discountAmount,
        totalAmountAfterDiscount: amountAfterDiscount,
        taxes,
        totalTaxAmount,
        totalAmount
      },
      status: 'pending'
    });

    // Update stall status
    await Stall.findByIdAndUpdate(stallId, { status: 'booked' });

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

    // Create invoice
    await Invoice.create({
      bookingId: booking._id,
      customerName,
      customerEmail,
      amount: totalAmount,
      invoiceNumber,
      items: [{
        description: `Stall ${stall.number} Booking`,
        amount: baseAmount,
        discount: selectedDiscount ? {
          name: selectedDiscount.name,
          type: selectedDiscount.type,
          value: selectedDiscount.value,
          amount: discountAmount
        } : null,
        taxes: taxes.map(tax => ({
          name: tax.name,
          rate: tax.rate,
          amount: (amountAfterDiscount * tax.rate) / 100
        }))
      }],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'pending'
    });

    // Log activity
    await logActivity(req, {
      action: 'booking_created',
      resource: 'booking',
      resourceId: booking._id.toString(),
      description: `Public booking created for stall ${stall.number} in exhibition "${exhibition.name}" by ${customerName}`,
      newValues: {
        exhibitionName: exhibition.name,
        customerName,
        companyName,
        stallNumber: stall.number,
        amount: totalAmount,
        status: booking.status,
        bookingSource: 'public'
      },
      success: true
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error booking stall:', error);
    
    // Log failed booking attempt
    await logActivity(req, {
      action: 'booking_created',
      resource: 'booking',
      description: `Failed to create public booking for ${req.body.customerName || 'unknown customer'}`,
      metadata: { 
        exhibitionId: req.params.id,
        stallId: req.params.stallId,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Error booking stall'
    });
    
    res.status(500).json({ message: 'Error booking stall', error });
  }
};

/**
 * Books multiple stalls at once
 * Validates stall availability, calculates pricing, creates booking and invoice
 */
export const bookPublicMultipleStalls = async (req: Request, res: Response) => {
  try {
    const { id: exhibitionId } = req.params;
    const { 
      stallIds, 
      customerName, 
      customerEmail, 
      customerPhone, 
      customerAddress,
      companyName,
      discountId
    } = req.body;

    // Validate required fields
    if (!stallIds || !Array.isArray(stallIds) || stallIds.length === 0) {
      return res.status(400).json({ message: 'At least one stall ID must be provided' });
    }
    
    if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
      return res.status(400).json({ message: 'Customer information is required (name, email, phone, and address)' });
    }

    console.log('Processing multiple stall booking:', { 
      exhibitionId, stallIds, customerName, customerEmail 
    });

    // Extract exhibitor info from token if available
    let exhibitorId = null;
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'exhibitor_default_secret');
        
        if (decoded && typeof decoded === 'object' && decoded.id) {
          exhibitorId = decoded.id;
          console.log('Booking associated with exhibitor ID:', exhibitorId);
          console.log('Full token payload:', decoded);
        }
      } catch (error) {
        console.log('Token verification failed, continuing without exhibitor association:', error);
        // Continue without exhibitor ID - the booking will still work
      }
    }

    // Query based on whether we have an ID or a slug
    let query = {};
    if (mongoose.Types.ObjectId.isValid(exhibitionId)) {
      query = { _id: exhibitionId, status: 'published', isActive: true };
    } else {
      query = { slug: exhibitionId, status: 'published', isActive: true };
    }

    // Check if exhibition exists and is published
    const exhibition = await Exhibition.findOne(query);

    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found or no longer available' });
    }

    // Find selected discount if any
    const selectedDiscount = discountId ? exhibition.publicDiscountConfig?.find(
      d => d.name === discountId && d.isActive
    ) : undefined;

    // Check if all stalls are available
    const stalls = await Stall.find({
      _id: { $in: stallIds },
      exhibitionId: exhibition._id, // Use the actual ObjectId
      status: 'available'
    });

    if (stalls.length !== stallIds.length) {
      // Find which stalls are unavailable
      const foundStallIds = stalls.map(s => s._id.toString());
      const unavailableStallIds = stallIds.filter(id => !foundStallIds.includes(id.toString()));
      
      return res.status(400).json({ 
        message: 'Some stalls are not available or do not exist', 
        unavailableStallIds 
      });
    }

    // Calculate amounts for each stall
    const stallCalculations = stalls.map(stall => {
      // Calculate base amount based on rate per square meter and dimensions
      const baseAmount = stall.ratePerSqm * stall.dimensions.width * stall.dimensions.height;
      
      // Apply discount to this stall
      const discountAmount = selectedDiscount 
        ? (selectedDiscount.type === 'percentage' 
          ? baseAmount * (selectedDiscount.value / 100) 
          : selectedDiscount.value / stallIds.length) // Distribute fixed discount evenly
        : 0;
        
      const amountAfterDiscount = baseAmount - discountAmount;
      
      return {
        stallId: stall._id,
        number: stall.number,
        baseAmount,
        discount: selectedDiscount ? {
          name: selectedDiscount.name,
          type: selectedDiscount.type,
          value: selectedDiscount.type === 'percentage' 
            ? selectedDiscount.value 
            : selectedDiscount.value / stallIds.length,
          amount: discountAmount
        } : null,
        amountAfterDiscount
      };
    });

    // Calculate totals
    const totalBaseAmount = stallCalculations.reduce((sum, calc) => sum + calc.baseAmount, 0);
    const totalDiscountAmount = stallCalculations.reduce(
      (sum, calc) => sum + (calc.discount ? calc.discount.amount : 0), 
      0
    );
    const totalAmountAfterDiscount = totalBaseAmount - totalDiscountAmount;

    // Calculate taxes from exhibition config
    const taxes = exhibition.taxConfig
      ?.filter(tax => tax.isActive)
      .map(tax => ({
        name: tax.name,
        rate: tax.rate,
        amount: totalAmountAfterDiscount * (tax.rate / 100)
      })) || [];

    const totalTaxAmount = taxes.reduce((sum, tax) => sum + tax.amount, 0);
    const totalAmount = totalAmountAfterDiscount + totalTaxAmount;

    // Create booking
    const booking = await Booking.create({
      exhibitionId,
      stallIds: stalls.map(s => s._id),
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      companyName,
      amount: totalAmount,
      calculations: {
        stalls: stallCalculations,
        totalBaseAmount,
        totalDiscountAmount,
        totalAmountAfterDiscount,
        taxes,
        totalTaxAmount,
        totalAmount
      },
      status: 'pending'
    });

    // Update all stall statuses to booked
    await Stall.updateMany(
      { _id: { $in: stalls.map(s => s._id) } },
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

    // Create invoice
    await Invoice.create({
      bookingId: booking._id,
      customerName,
      customerEmail,
      amount: totalAmount,
      invoiceNumber,
      items: stalls.map(stall => {
        const calculation = stallCalculations.find(calc => 
          calc.stallId.toString() === stall._id.toString()
        );
        
        return {
          description: `Stall ${stall.number} Booking`,
          amount: calculation?.baseAmount || 0,
          discount: calculation?.discount || null,
          taxes: taxes.map(tax => ({
            name: tax.name,
            rate: tax.rate,
            amount: ((calculation?.amountAfterDiscount || 0) * tax.rate) / 100
          }))
        };
      }),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'pending'
    });

    // Log activity
    await logActivity(req, {
      action: 'booking_created',
      resource: 'booking',
      resourceId: booking._id.toString(),
      description: `Public booking created for ${stallIds.length} stall(s) in exhibition "${exhibition.name}" by ${customerName}`,
      newValues: {
        exhibitionName: exhibition.name,
        customerName,
        companyName,
        stallCount: stallIds.length,
        stallNumbers: stallCalculations.map(s => s.number).join(', '),
        amount: totalAmount,
        status: booking.status,
        bookingSource: 'public'
      },
      success: true
    });

    // Return booking data with reference ID
    res.status(201).json({
      success: true,
      bookingId: booking._id,
      stalls: stalls.map(s => s.number).join(', '),
      amount: totalAmount
    });
  } catch (error) {
    console.error('Error booking multiple stalls:', error);
    
    // Log failed booking attempt
    await logActivity(req, {
      action: 'booking_created',
      resource: 'booking',
      description: `Failed to create public booking for ${req.body.customerName || 'unknown customer'}`,
      metadata: { 
        exhibitionId: req.params.id,
        stallIds: req.body.stallIds,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Error booking stalls'
    });
    
    res.status(500).json({ message: 'Error booking stalls', error });
  }
};

export const searchExhibitors = async (req: Request, res: Response) => {
  try {
    // Return empty array since exhibitor functionality was removed
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Error searching exhibitors', error });
  }
}; 