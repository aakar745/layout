import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Fixture from '../models/fixture.model';

export const createFixture = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;
    
    if (!exhibitionId) {
      return res.status(400).json({ message: 'Exhibition ID is required' });
    }

    // Remove any existing _id, id, or timestamps from the request body
    const { _id, id, createdAt, updatedAt, ...fixtureData } = req.body;

    // Handle icon URL - ensure it's a valid URL or path
    if (fixtureData.icon) {
      // If the icon is not a full URL but a relative path, normalize it
      if (!fixtureData.icon.startsWith('http') && !fixtureData.icon.startsWith('/api/uploads')) {
        fixtureData.icon = `/api/uploads/${fixtureData.icon.replace(/^\/+/, '')}`;
      }
    }

    console.log('Creating fixture with data:', {
      exhibitionId,
      body: fixtureData
    });

    // Create the fixture with clean data
    const fixture = await Fixture.create({
      ...fixtureData,
      exhibitionId: new mongoose.Types.ObjectId(exhibitionId)
    });

    console.log('Fixture created:', fixture);
    res.status(201).json(fixture);
  } catch (error: any) {
    console.error('Error creating fixture:', error);
    res.status(500).json({ 
      message: 'Error creating fixture', 
      error: error.message || String(error),
      data: req.body
    });
  }
};

export const getFixtures = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;
    const { type } = req.query;
    
    const query: any = { 
      exhibitionId: new mongoose.Types.ObjectId(exhibitionId)
    };
    
    // Filter by type if provided
    if (type) {
      query.type = type;
    }

    console.log('Fetching fixtures with query:', query);
    const fixtures = await Fixture.find(query)
      .sort({ zIndex: 1, type: 1, createdAt: -1 });
    
    res.json(fixtures);
  } catch (error: any) {
    console.error('Error fetching fixtures:', error);
    res.status(500).json({ 
      message: 'Error fetching fixtures', 
      error: error.message || String(error),
      query: req.query 
    });
  }
};

export const getFixture = async (req: Request, res: Response) => {
  try {
    const { exhibitionId, id } = req.params;
    const fixture = await Fixture.findOne({
      _id: id,
      exhibitionId: new mongoose.Types.ObjectId(exhibitionId)
    });
    
    if (!fixture) {
      return res.status(404).json({ message: 'Fixture not found' });
    }
    
    res.json(fixture);
  } catch (error: any) {
    console.error('Error fetching fixture:', error);
    res.status(500).json({ 
      message: 'Error fetching fixture', 
      error: error.message || String(error)
    });
  }
};

export const updateFixture = async (req: Request, res: Response) => {
  try {
    const { exhibitionId, id } = req.params;
    
    // Clean up the update data - remove any fields that shouldn't be updated directly
    const { _id, id: bodyId, createdAt, updatedAt, ...updateData } = req.body;
    
    // Handle showName explicitly to ensure it's a boolean
    if ('showName' in updateData) {
      updateData.showName = Boolean(updateData.showName);
    }
    
    // Handle icon URL - ensure it's a valid URL or path
    if (updateData.icon) {
      // If the icon is not a full URL but a relative path, normalize it
      if (!updateData.icon.startsWith('http') && !updateData.icon.startsWith('/api/uploads')) {
        updateData.icon = `/api/uploads/${updateData.icon.replace(/^\/+/, '')}`;
      }
    }
    
    const fixture = await Fixture.findOneAndUpdate(
      { 
        _id: id,
        exhibitionId: new mongoose.Types.ObjectId(exhibitionId)
      },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!fixture) {
      return res.status(404).json({ message: 'Fixture not found' });
    }
    
    res.json(fixture);
  } catch (error: any) {
    console.error('Error updating fixture:', error);
    res.status(500).json({ 
      message: 'Error updating fixture', 
      error: error.message || String(error),
      data: req.body 
    });
  }
};

export const deleteFixture = async (req: Request, res: Response) => {
  try {
    const { exhibitionId, id } = req.params;
    
    if (!exhibitionId || !id) {
      return res.status(400).json({ 
        message: 'Both Exhibition ID and Fixture ID are required'
      });
    }

    console.log('Deleting fixture with params:', { exhibitionId, id });

    const deletedFixture = await Fixture.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      exhibitionId: new mongoose.Types.ObjectId(exhibitionId)
    });

    if (!deletedFixture) {
      return res.status(404).json({ message: 'Fixture not found' });
    }

    console.log('Fixture deleted:', deletedFixture);
    res.json({ message: 'Fixture deleted successfully', data: deletedFixture });
  } catch (error: any) {
    console.error('Error deleting fixture:', error);
    res.status(500).json({ 
      message: 'Error deleting fixture', 
      error: error.message || String(error)
    });
  }
}; 