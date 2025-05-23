import express from 'express';
import {
  createExhibition,
  getExhibitions,
  getExhibition,
  updateExhibition,
  deleteExhibition,
  updateExhibitionStatus,
  getActiveExhibitions
} from '../controllers/exhibition.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import hallRoutes from './hall.routes';
import { upload, uploadMultiple, optimizeImage, deleteFile } from '../config/upload';
import path from 'path';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Handle sponsor logo uploads
router.post('/upload/sponsors', authorize('admin'), (req, res, next) => {
  req.params.type = 'sponsors'; // Force the type to be 'sponsors'
  next();
}, uploadMultiple.array('file', 10), optimizeImage, (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  
  // Return the paths relative to the uploads directory
  const paths = (req.files as Express.Multer.File[]).map(file => {
    const relativePath = file.path.split('uploads')[1].replace(/\\/g, '/');
    return relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  });
  
  // Include thumbnail paths in response
  const thumbnails = (req.files as Express.Multer.File[]).map((file: any) => {
    if (file.thumbnail) {
      return file.thumbnail.startsWith('/') ? file.thumbnail.substring(1) : file.thumbnail;
    }
    return null;
  }).filter(Boolean);
  
  res.json({ paths, thumbnails });
});

// Handle general file uploads
router.post('/upload/:type', authorize('admin'), upload.single('file'), optimizeImage, (req, res) => {
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

// Enable CORS for direct uploads
router.options('/upload/:type', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

router.options('/upload/sponsors', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

// Mount hall routes
router.use('/:exhibitionId/halls', hallRoutes);

router
  .route('/')
  .get(getExhibitions)
  .post(authorize('admin'), createExhibition);

router
  .route('/active')
  .get(getActiveExhibitions);

router
  .route('/:id')
  .get(getExhibition)
  .put(authorize('admin'), updateExhibition)
  .delete(authorize('admin'), deleteExhibition);

router
  .route('/:id/status')
  .patch(authorize('admin'), updateExhibitionStatus);

// Route to delete a file
router.delete('/file/:type/:filename', authorize('admin'), (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(type, filename);
    
    const deleted = deleteFile(filePath);
    
    if (deleted) {
      res.json({ success: true, message: 'File deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'File not found or could not be deleted' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting file', error });
  }
});

export default router; 