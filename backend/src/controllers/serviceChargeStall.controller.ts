import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ServiceChargeStall from '../models/serviceChargeStall.model';
import Exhibition from '../models/exhibition.model';
import { logActivity } from '../services/activity.service';

/**
 * Get all service charge stalls for an exhibition
 */
export const getServiceChargeStalls = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;
    const { page = 1, limit = 10, search, active } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query: any = { exhibitionId };
    
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    if (search) {
      query.$or = [
        { stallNumber: { $regex: search, $options: 'i' } },
        { exhibitorCompanyName: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const totalCount = await ServiceChargeStall.countDocuments(query);

    // Get stalls
    const stalls = await ServiceChargeStall.find(query)
      .populate({
        path: 'exhibitionId',
        select: 'name venue startDate endDate'
      })
      .populate({
        path: 'createdBy',
        select: 'name email'
      })
      .sort({ stallNumber: 1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      data: stalls,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(totalCount / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching service charge stalls:', error);
    return res.status(500).json({
      message: 'Error fetching service charge stalls',
      error: (error as Error).message
    });
  }
};

/**
 * Create a new service charge stall
 */
export const createServiceChargeStall = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;
    const { stallNumber, exhibitorCompanyName, stallArea, dimensions } = req.body;

    // Validate required fields
    if (!stallNumber || !exhibitorCompanyName || !stallArea) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['stallNumber', 'exhibitorCompanyName', 'stallArea']
      });
    }

    // Check if exhibition exists
    const exhibition = await Exhibition.findById(exhibitionId);
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    // Check if stall number already exists for this exhibition
    const existingStall = await ServiceChargeStall.findOne({
      exhibitionId,
      stallNumber
    });

    if (existingStall) {
      return res.status(400).json({
        message: 'Stall number already exists for this exhibition'
      });
    }

    // Create new stall
    const stall = new ServiceChargeStall({
      exhibitionId,
      stallNumber: stallNumber.trim(),
      exhibitorCompanyName: exhibitorCompanyName.trim(),
      stallArea: parseFloat(stallArea),
      dimensions: dimensions && dimensions.width && dimensions.height ? {
        width: parseFloat(dimensions.width),
        height: parseFloat(dimensions.height)
      } : undefined,
      createdBy: req.user?._id
    });

    await stall.save();

    // Log activity
    await logActivity(req, {
      action: 'create_service_charge_stall',
      resource: 'service_charge_stall',
      resourceId: stall._id.toString(),
      description: `Created service charge stall ${stallNumber} for exhibition ${exhibition.name}`,
      metadata: {
        exhibitionId,
        stallNumber,
        exhibitorCompanyName,
        stallArea
      }
    });

    // Populate the response
    await stall.populate([
      { path: 'exhibitionId', select: 'name venue startDate endDate' },
      { path: 'createdBy', select: 'name email' }
    ]);

    return res.status(201).json({
      success: true,
      message: 'Service charge stall created successfully',
      data: stall
    });
  } catch (error) {
    console.error('Error creating service charge stall:', error);
    return res.status(500).json({
      message: 'Error creating service charge stall',
      error: (error as Error).message
    });
  }
};

/**
 * Update a service charge stall
 */
export const updateServiceChargeStall = async (req: Request, res: Response) => {
  try {
    const { stallId } = req.params;
    const { stallNumber, exhibitorCompanyName, stallArea, dimensions, isActive } = req.body;

    // Find the stall
    const stall = await ServiceChargeStall.findById(stallId);
    if (!stall) {
      return res.status(404).json({ message: 'Service charge stall not found' });
    }

    // Check if stall number is being changed and if it already exists
    if (stallNumber && stallNumber !== stall.stallNumber) {
      const existingStall = await ServiceChargeStall.findOne({
        exhibitionId: stall.exhibitionId,
        stallNumber,
        _id: { $ne: stallId }
      });

      if (existingStall) {
        return res.status(400).json({
          message: 'Stall number already exists for this exhibition'
        });
      }
    }

    // Update fields
    if (stallNumber) stall.stallNumber = stallNumber.trim();
    if (exhibitorCompanyName) stall.exhibitorCompanyName = exhibitorCompanyName.trim();
    if (stallArea) stall.stallArea = parseFloat(stallArea);
    if (dimensions && dimensions.width && dimensions.height) {
      stall.dimensions = {
        width: parseFloat(dimensions.width),
        height: parseFloat(dimensions.height)
      };
    }
    if (isActive !== undefined) stall.isActive = isActive;

    await stall.save();

    // Log activity
    await logActivity(req, {
      action: 'update_service_charge_stall',
      resource: 'service_charge_stall',
      resourceId: stall._id.toString(),
      description: `Updated service charge stall ${stall.stallNumber}`,
      metadata: {
        stallId,
        stallNumber: stall.stallNumber,
        exhibitorCompanyName: stall.exhibitorCompanyName,
        stallArea: stall.stallArea
      }
    });

    // Populate the response
    await stall.populate([
      { path: 'exhibitionId', select: 'name venue startDate endDate' },
      { path: 'createdBy', select: 'name email' }
    ]);

    return res.status(200).json({
      success: true,
      message: 'Service charge stall updated successfully',
      data: stall
    });
  } catch (error) {
    console.error('Error updating service charge stall:', error);
    return res.status(500).json({
      message: 'Error updating service charge stall',
      error: (error as Error).message
    });
  }
};

/**
 * Delete a service charge stall
 */
export const deleteServiceChargeStall = async (req: Request, res: Response) => {
  try {
    const { stallId } = req.params;

    // Find the stall
    const stall = await ServiceChargeStall.findById(stallId);
    if (!stall) {
      return res.status(404).json({ message: 'Service charge stall not found' });
    }

    // Delete the stall
    await ServiceChargeStall.findByIdAndDelete(stallId);

    // Log activity
    await logActivity(req, {
      action: 'delete_service_charge_stall',
      resource: 'service_charge_stall',
      resourceId: stallId,
      description: `Deleted service charge stall ${stall.stallNumber}`,
      metadata: {
        stallId,
        stallNumber: stall.stallNumber,
        exhibitorCompanyName: stall.exhibitorCompanyName
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Service charge stall deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service charge stall:', error);
    return res.status(500).json({
      message: 'Error deleting service charge stall',
      error: (error as Error).message
    });
  }
};

/**
 * Import service charge stalls from Excel/CSV
 */
export const importServiceChargeStalls = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;
    const { stalls } = req.body;

    // Check if exhibition exists
    const exhibition = await Exhibition.findById(exhibitionId);
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    // Validate stalls array
    if (!Array.isArray(stalls) || stalls.length === 0) {
      return res.status(400).json({
        message: 'Invalid stalls data',
        error: 'Stalls must be a non-empty array'
      });
    }

    // Validate each stall
    const validationErrors: string[] = [];
    const validatedStalls: any[] = [];

    for (let i = 0; i < stalls.length; i++) {
      const stall = stalls[i];
      const rowNum = i + 1;

      // Check required fields
      if (!stall.stallNumber) {
        validationErrors.push(`Row ${rowNum}: Stall number is required`);
        continue;
      }
      if (!stall.exhibitorCompanyName) {
        validationErrors.push(`Row ${rowNum}: Exhibitor company name is required`);
        continue;
      }
      if (!stall.stallArea || stall.stallArea <= 0) {
        validationErrors.push(`Row ${rowNum}: Stall area must be greater than 0`);
        continue;
      }

      // Check for duplicate stall numbers in the same exhibition
      const existingStall = await ServiceChargeStall.findOne({
        exhibitionId,
        stallNumber: stall.stallNumber
      });

      if (existingStall) {
        validationErrors.push(`Row ${rowNum}: Stall number ${stall.stallNumber} already exists for this exhibition`);
        continue;
      }

      // Check for duplicate stall numbers in current import
      const duplicateInImport = validatedStalls.find(s => s.stallNumber === stall.stallNumber);
      if (duplicateInImport) {
        validationErrors.push(`Row ${rowNum}: Duplicate stall number ${stall.stallNumber} in import data`);
        continue;
      }

      validatedStalls.push({
        exhibitionId,
        stallNumber: stall.stallNumber.trim(),
        exhibitorCompanyName: stall.exhibitorCompanyName.trim(),
        stallArea: parseFloat(stall.stallArea),
        dimensions: stall.dimensions && stall.dimensions.width && stall.dimensions.height ? {
          width: parseFloat(stall.dimensions.width),
          height: parseFloat(stall.dimensions.height)
        } : undefined,
        isActive: true,
        createdBy: req.user?._id
      });
    }

    // Return validation errors if any
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors,
        totalRows: stalls.length,
        validRows: validatedStalls.length,
        errorRows: validationErrors.length
      });
    }

    // Create stalls
    const createdStalls = await ServiceChargeStall.insertMany(validatedStalls);

    // Log activity
    await logActivity(req, {
      action: 'import_service_charge_stalls',
      resource: 'exhibition',
      resourceId: exhibitionId,
      description: `Imported ${createdStalls.length} service charge stalls`,
      metadata: {
        exhibitionId,
        importedCount: createdStalls.length
      }
    });

    return res.status(201).json({
      success: true,
      message: `Successfully imported ${createdStalls.length} service charge stalls`,
      data: {
        imported: createdStalls.length,
        stalls: createdStalls
      }
    });
  } catch (error) {
    console.error('Error importing service charge stalls:', error);
    return res.status(500).json({
      message: 'Error importing service charge stalls',
      error: (error as Error).message
    });
  }
};

/**
 * Get active service charge stalls for public form (for auto-fill)
 */
export const getActiveServiceChargeStalls = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;

    // Support both slug and ID lookups
    let exhibition;
    if (mongoose.Types.ObjectId.isValid(exhibitionId)) {
      exhibition = await Exhibition.findOne({ 
        _id: exhibitionId,
        isActive: true
      });
    } else {
      exhibition = await Exhibition.findOne({ 
        slug: exhibitionId,
        isActive: true
      });
    }

    if (!exhibition) {
      return res.status(404).json({ 
        message: 'Exhibition not found or not available' 
      });
    }

    // Get active stalls
    const stalls = await ServiceChargeStall.find({
      exhibitionId: exhibition._id,
      isActive: true
    }).select('stallNumber exhibitorCompanyName stallArea dimensions').sort({ stallNumber: 1 });

    return res.status(200).json({
      success: true,
      data: stalls
    });
  } catch (error) {
    console.error('Error fetching active service charge stalls:', error);
    return res.status(500).json({
      message: 'Error fetching active service charge stalls',
      error: (error as Error).message
    });
  }
}; 