import { Request, Response } from 'express';
import StallType from '../models/stallType.model';
import Stall from '../models/stall.model';
import Booking from '../models/booking.model';
import Invoice from '../models/invoice.model';
import { existsSync, unlinkSync, readdirSync } from 'fs';
import { join } from 'path';

// Cache directory for PDFs - must match the one in other controllers
const PDF_CACHE_DIR = join(process.cwd(), 'pdf-cache');

// @desc    Create a new stall type
// @route   POST /api/stall-types
// @access  Private/Admin
export const createStallType = async (req: Request, res: Response) => {
  try {
    const stallType = await StallType.create(req.body);
    res.status(201).json(stallType);
  } catch (error) {
    res.status(500).json({ message: 'Error creating stall type', error });
  }
};

// @desc    Get all stall types
// @route   GET /api/stall-types
// @access  Private
export const getStallTypes = async (req: Request, res: Response) => {
  try {
    const stallTypes = await StallType.find();
    res.json(stallTypes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stall types', error });
  }
};

// @desc    Get single stall type
// @route   GET /api/stall-types/:id
// @access  Private
export const getStallType = async (req: Request, res: Response) => {
  try {
    const stallType = await StallType.findById(req.params.id);
    if (!stallType) {
      return res.status(404).json({ message: 'Stall type not found' });
    }
    res.json(stallType);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stall type', error });
  }
};

// @desc    Update stall type
// @route   PUT /api/stall-types/:id
// @access  Private/Admin
export const updateStallType = async (req: Request, res: Response) => {
  try {
    const stallType = await StallType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!stallType) {
      return res.status(404).json({ message: 'Stall type not found' });
    }
    
    // Invalidate PDF cache for all invoices related to stalls of this type
    // This ensures that when stallType data (like name) changes,
    // the PDFs reflect the latest information
    try {
      console.log(`[INFO] StallType ${req.params.id} updated, invalidating related PDF caches`);
      
      // Find all stalls of this type
      const stalls = await Stall.find({ stallTypeId: stallType._id });
      console.log(`[INFO] Found ${stalls.length} stalls for stallType ${req.params.id}`);
      
      // Find all bookings that include these stalls
      const stallIds = stalls.map(stall => stall._id);
      const bookings = await Booking.find({ stallIds: { $in: stallIds } });
      console.log(`[INFO] Found ${bookings.length} bookings for stallType ${req.params.id}`);
      
      // Find all invoices for these bookings and remove their cached PDFs
      for (const booking of bookings) {
        const invoices = await Invoice.find({ bookingId: booking._id });
        
        for (const invoice of invoices) {
          // Check if cache directory exists
          if (existsSync(PDF_CACHE_DIR)) {
            // Remove any cached files for this invoice
            const files = readdirSync(PDF_CACHE_DIR);
            
            for (const file of files) {
              if (file.includes(invoice._id.toString()) || file.includes(invoice.invoiceNumber)) {
                try {
                  const filePath = join(PDF_CACHE_DIR, file);
                  unlinkSync(filePath);
                  console.log(`[INFO] Removed cached file: ${file}`);
                } catch (err) {
                  console.error(`[ERROR] Failed to remove cached file: ${file}`, err);
                }
              }
            }
          }
        }
      }
      
      console.log(`[INFO] PDF cache invalidation completed for stallType ${req.params.id}`);
    } catch (error) {
      console.error(`[ERROR] Failed to invalidate PDF cache for stallType ${req.params.id}:`, error);
      // Continue without failing the update operation
    }
    
    res.json(stallType);
  } catch (error) {
    res.status(500).json({ message: 'Error updating stall type', error });
  }
};

// @desc    Delete stall type
// @route   DELETE /api/stall-types/:id
// @access  Private/Admin
export const deleteStallType = async (req: Request, res: Response) => {
  try {
    const stallType = await StallType.findByIdAndDelete(req.params.id);
    if (!stallType) {
      return res.status(404).json({ message: 'Stall type not found' });
    }
    res.json({ message: 'Stall type removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting stall type', error });
  }
}; 