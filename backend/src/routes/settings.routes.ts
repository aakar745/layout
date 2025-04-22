import express from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { upload, optimizeImage } from '../config/upload';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get settings
router.get('/', getSettings);

// Update settings
router.put('/', authorize('admin'), updateSettings);

// Upload logo
router.post('/upload/logo', authorize('admin'), upload.single('file'), optimizeImage, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Return the path relative to the uploads directory
  const relativePath = req.file.path.split('uploads')[1].replace(/\\/g, '/');
  const path = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  
  // Include thumbnail path if available
  const thumbnail = (req.file as any).thumbnail;
  const thumbPath = thumbnail ? (thumbnail.startsWith('/') ? thumbnail.substring(1) : thumbnail) : null;
  
  res.json({ path, thumbnail: thumbPath });
});

export default router; 