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
    const { hallId } = req.query;
    const query: any = { 
      exhibitionId: new mongoose.Types.ObjectId(exhibitionId)
    };
    
    if (hallId) {
      query.hallId = new mongoose.Types.ObjectId(hallId.toString());
    }

    console.log('Fetching stalls with query:', query);
    const stalls = await Stall.find(query)
      .populate<PopulatedStall>('stallTypeId', 'name description')
      .sort({ number: 1 });
    
    const transformedStalls = stalls.map(stall => {
      const stallData = stall.toObject();
      console.log('Original stall data:', stallData);
      
      return {
        ...stallData,
        stallType: {
          name: stallData.stallTypeId?.name || 'N/A',
          description: stallData.stallTypeId?.description
        },
        stallTypeId: stallData.stallTypeId?._id || stallData.stallTypeId
      };
    });

    console.log('Transformed stalls:', transformedStalls);
    res.json(transformedStalls);
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