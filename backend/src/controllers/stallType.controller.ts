import { Request, Response } from 'express';
import StallType from '../models/stallType.model';

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