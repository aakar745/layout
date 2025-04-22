import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Hall from '../models/hall.model';

export const createHall = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;
    
    if (!exhibitionId) {
      return res.status(400).json({ message: 'Exhibition ID is required' });
    }

    // Remove any existing _id, id, or timestamps from the request body
    const { _id, id, createdAt, updatedAt, ...hallData } = req.body;

    // Check for existing hall with the same name
    const existingHall = await Hall.findOne({
      exhibitionId: new mongoose.Types.ObjectId(exhibitionId),
      name: hallData.name
    });

    if (existingHall) {
      return res.status(409).json({
        message: 'A hall with this name already exists, duplicate creation is not allowed.',
        existingHall
      });
    }

    console.log('Creating hall with data:', {
      exhibitionId,
      body: hallData
    });

    // Create the hall with clean data
    const hall = await Hall.create({
      ...hallData,
      exhibitionId: new mongoose.Types.ObjectId(exhibitionId)
    });

    console.log('Hall created:', hall);
    res.status(201).json(hall);
  } catch (error: any) {
    console.error('Error creating hall:', error);
    res.status(500).json({ 
      message: 'Error creating hall', 
      error: error.message || String(error),
      data: req.body
    });
  }
};

export const getHalls = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;
    const halls = await Hall.find({ exhibitionId: new mongoose.Types.ObjectId(exhibitionId) })
      .sort({ createdAt: -1 });
    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching halls', error });
  }
};

export const getHall = async (req: Request, res: Response) => {
  try {
    const hall = await Hall.findById(req.params.id);
    
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }
    
    res.json(hall);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hall', error });
  }
};

export const updateHall = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;
    console.log('Updating hall with data:', {
      hallId: req.params.id,
      exhibitionId,
      body: req.body
    });

    const hall = await Hall.findOneAndUpdate(
      { 
        _id: req.params.id,
        exhibitionId: new mongoose.Types.ObjectId(exhibitionId)
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    console.log('Hall updated:', hall);
    res.json(hall);
  } catch (error: any) {
    console.error('Error updating hall:', error);
    res.status(500).json({ 
      message: 'Error updating hall', 
      error: error.message || String(error),
      data: req.body
    });
  }
};

export const deleteHall = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;
    const hallId = req.params.id;
    
    if (!exhibitionId || !hallId) {
      return res.status(400).json({ 
        message: 'Both Exhibition ID and Hall ID are required'
      });
    }

    console.log('Deleting hall with params:', {
      hallId,
      exhibitionId
    });

    const deletedHall = await Hall.findOneAndDelete({
      _id: hallId,
      exhibitionId: new mongoose.Types.ObjectId(exhibitionId)
    });

    if (!deletedHall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    console.log('Hall deleted:', deletedHall);
    res.json({ message: 'Hall deleted successfully', data: deletedHall });
  } catch (error: any) {
    console.error('Error deleting hall:', error);
    res.status(500).json({ 
      message: 'Error deleting hall', 
      error: error.message || String(error)
    });
  }
}; 