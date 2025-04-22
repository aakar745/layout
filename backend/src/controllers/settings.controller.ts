import { Request, Response } from 'express';
import Settings from '../models/settings.model';
import { deleteFile } from '../config/upload';

// Get settings (retrieves or creates default settings if not exist)
export const getSettings = async (req: Request, res: Response) => {
  try {
    // Try to find existing settings
    let settings = await Settings.findOne().populate('createdBy', 'username');
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await Settings.create({
        siteName: 'Exhibition Management System',
        adminEmail: 'admin@example.com',
        language: 'en',
        timezone: 'UTC',
        emailNotifications: true,
        createdBy: req.user?._id,
      });
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ message: 'Error getting settings', error });
  }
};

// Update settings
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    
    // Find existing settings
    const currentSettings = await Settings.findOne();
    
    if (!currentSettings) {
      // Create new settings if not exist
      const newSettings = new Settings({
        ...updateData,
        createdBy: req.user?._id,
      });
      
      await newSettings.save();
      res.status(201).json(newSettings);
    } else {
      // Handle logo deletion
      if (updateData.logo === null && currentSettings.logo) {
        deleteFile(currentSettings.logo);
        updateData.logo = '';
      }
      
      // Update existing settings
      const updatedSettings = await Settings.findByIdAndUpdate(
        currentSettings._id,
        updateData,
        { new: true, runValidators: true }
      ).populate('createdBy', 'username');
      
      res.json(updatedSettings);
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings', error });
  }
}; 