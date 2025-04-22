import express from 'express';
import {
  getPublicExhibitions,
  getPublicExhibition,
  getPublicLayout,
  getPublicStallDetails,
  bookPublicStall,
  bookPublicMultipleStalls,
  searchExhibitors,
} from '../controllers/public.controller';
import Settings from '../models/settings.model';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/exhibitions', getPublicExhibitions);
router.get('/exhibitions/:id', getPublicExhibition);
router.get('/exhibitions/:id/layout', getPublicLayout);
router.get('/exhibitions/:id/stalls/:stallId', getPublicStallDetails);
router.post('/exhibitions/:id/stalls/:stallId/book', bookPublicStall);
router.post('/exhibitions/:id/stalls/book-multiple', bookPublicMultipleStalls);
router.get('/exhibitors/search', searchExhibitors);

// Public access to exhibition logo images
router.get('/images/:subfolder/:filename', (req, res) => {
  try {
    const { subfolder, filename } = req.params;
    
    // Only allow access to logos and sponsors subfolders for security
    if (subfolder !== 'logos' && subfolder !== 'sponsors') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Sanitize filename to prevent directory traversal attacks
    const sanitizedFilename = path.basename(filename);
    
    // Construct the file path
    const filePath = path.join(__dirname, '../../uploads', subfolder, sanitizedFilename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Set content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: {[key: string]: string} = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    };
    
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    
    // Return the file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving public image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public access to the site logo for login page
router.get('/logo', async (req, res) => {
  try {
    // Get the current logo path from settings
    const settings = await Settings.findOne();
    
    if (!settings || !settings.logo) {
      // If no logo in settings, return a 404
      return res.status(404).json({ message: 'Logo not found' });
    }
    
    // Construct the file path
    const filePath = path.join(__dirname, '../../uploads', settings.logo);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Logo file not found' });
    }
    
    // Set content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: {[key: string]: string} = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    };
    
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    
    // Return the file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving public logo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public access to basic site information
router.get('/site-info', async (req, res) => {
  try {
    // Get basic site information from settings
    const settings = await Settings.findOne().select('siteName footerText');
    
    if (!settings) {
      return res.status(404).json({ message: 'Site information not found' });
    }
    
    // Return just the necessary information
    res.json({
      siteName: settings.siteName || 'EXHIBITION MANAGER',
      footerText: settings.footerText || ''
    });
  } catch (error) {
    console.error('Error fetching site info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 