import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Stall from '../models/stall.model';
import StallType from '../models/stallType.model';
import Exhibition from '../models/exhibition.model';

interface PopulatedStall extends mongoose.Document {
  stallTypeId: {
    name: string;
    description?: string;
  };
}

export const createStall = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;
    const { hallId, ...stallData } = req.body;

    console.log('Creating stall with data:', {
      exhibitionId,
      hallId,
      body: stallData
    });

    const stall = await Stall.create({
      ...stallData,
      exhibitionId: new mongoose.Types.ObjectId(exhibitionId),
      hallId: new mongoose.Types.ObjectId(hallId)
    });

    console.log('Stall created:', stall);
    res.status(201).json(stall);
  } catch (error: any) {
    console.error('Error creating stall:', error);
    res.status(500).json({ 
      message: 'Error creating stall', 
      error: error.message || String(error),
      data: req.body
    });
  }
};

export const getStalls = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;
    const { 
      hallId, 
      page = '1', 
      limit = '50', 
      search, 
      status, 
      sortBy = 'number', 
      sortOrder = 'asc',
      minPrice,
      maxPrice
    } = req.query;

    // Build base query
    const query: any = { 
      exhibitionId: new mongoose.Types.ObjectId(exhibitionId)
    };
    
    if (hallId) {
      query.hallId = new mongoose.Types.ObjectId(hallId.toString());
    }

    // Add search filter
    if (search) {
      query.number = { $regex: search, $options: 'i' };
    }

    // Add status filter
    if (status) {
      query.status = status;
    }

    // Convert pagination parameters
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortObj: any = {};
    if (sortBy === 'number') {
      sortObj.number = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'ratePerSqm') {
      sortObj.ratePerSqm = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'createdAt') {
      sortObj.createdAt = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortObj.number = 1; // Default sort
    }

    console.log('Fetching stalls with query:', query);
    console.log('Pagination:', { page: pageNum, limit: limitNum, skip });
    console.log('Sort:', sortObj);

    // Get total count for pagination
    const totalCount = await Stall.countDocuments(query);

    // Fetch paginated stalls
    const stalls = await Stall.find(query)
      .populate<PopulatedStall>('stallTypeId', 'name description')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);
    
    const transformedStalls = stalls.map(stall => {
      const stallData = stall.toObject();
      
      // Calculate total price for filtering
      const totalPrice = stallData.ratePerSqm * stallData.dimensions.width * stallData.dimensions.height;
      
      return {
        ...stallData,
        stallType: {
          name: stallData.stallTypeId?.name || 'N/A',
          description: stallData.stallTypeId?.description
        },
        stallTypeId: stallData.stallTypeId?._id || stallData.stallTypeId,
        totalPrice // Include calculated price for frontend use
      };
    });

    // Apply price filtering on transformed data if needed
    let filteredStalls = transformedStalls;
    if (minPrice || maxPrice) {
      filteredStalls = transformedStalls.filter(stall => {
        const price = stall.totalPrice;
        const min = minPrice ? parseFloat(minPrice as string) : 0;
        const max = maxPrice ? parseFloat(maxPrice as string) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    console.log('Transformed stalls count:', filteredStalls.length);
    
    // Return paginated response
    res.json({
      stalls: filteredStalls,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        pageSize: limitNum,
        hasNextPage,
        hasPrevPage,
        startIndex: skip + 1,
        endIndex: Math.min(skip + limitNum, totalCount)
      }
    });
  } catch (error: any) {
    console.error('Error fetching stalls:', error);
    res.status(500).json({ 
      message: 'Error fetching stalls', 
      error: error.message || String(error),
      query: req.query 
    });
  }
};

export const getStall = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { exhibitionId } = req.query;

    // Find stall by ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid stall ID' });
    }

    // If exhibition ID or slug is provided, resolve it
    let resolvedExhibitionId = exhibitionId;
    if (exhibitionId && typeof exhibitionId === 'string' && !mongoose.Types.ObjectId.isValid(exhibitionId)) {
      // It's likely a slug, resolve to ID
      const exhibition = await Exhibition.findOne({ slug: exhibitionId });
      if (exhibition) {
        resolvedExhibitionId = exhibition._id;
      }
    }

    // Create query using the resolved exhibition ID if available
    const query: any = { _id: id };
    if (resolvedExhibitionId) {
      query.exhibitionId = resolvedExhibitionId;
    }

    const stall = await Stall.findOne(query)
      .populate('stallTypeId', 'name color')
      .populate('hallId', 'name')
      .populate('exhibitionId', 'name');

    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    res.json(stall);
  } catch (error) {
    res.status(500).json({ message: 'Error getting stall', error });
  }
};

export const updateStall = async (req: Request, res: Response) => {
  try {
    const { exhibitionId, id } = req.params;
    const { _id, id: stallId, ...updateData } = req.body;  // Remove _id and id from update data
    
    console.log('Updating stall with params:', { exhibitionId, id });
    console.log('Update data:', updateData);

    // Convert exhibitionId to ObjectId
    const exhibitionObjectId = new mongoose.Types.ObjectId(exhibitionId);

    const stall = await Stall.findOneAndUpdate(
      { 
        _id: new mongoose.Types.ObjectId(id),
        exhibitionId: exhibitionObjectId 
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!stall) {
      console.log('Stall not found with params:', { exhibitionId, id });
      return res.status(404).json({ message: 'Stall not found' });
    }

    console.log('Stall updated successfully:', stall);
    res.json(stall);
  } catch (error: any) {
    console.error('Error updating stall:', error);
    res.status(500).json({ 
      message: 'Error updating stall', 
      error: error.message || String(error),
      details: {
        params: req.params,
        body: req.body
      }
    });
  }
};

export const deleteStall = async (req: Request, res: Response) => {
  try {
    const { exhibitionId, id } = req.params;
    const stall = await Stall.findOneAndDelete({
      _id: id,
      exhibitionId
    });
    
    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    res.json({ message: 'Stall deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting stall', error });
  }
};

export const updateStallStatus = async (req: Request, res: Response) => {
  try {
    const { exhibitionId, id } = req.params;
    const { status } = req.body;
    const stall = await Stall.findOneAndUpdate(
      { _id: id, exhibitionId },
      { status },
      { new: true, runValidators: true }
    );

    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    res.json(stall);
  } catch (error) {
    res.status(500).json({ message: 'Error updating stall status', error });
  }
};

export const getStallsByHall = async (req: Request, res: Response) => {
  try {
    const { hallId } = req.params;
    const stalls = await Stall.find({ hallId })
      .sort({ number: 1 });
    res.json(stalls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hall stalls', error });
  }
}; 