import express from 'express';
import {
  createFixture,
  getFixtures,
  getFixture,
  updateFixture,
  deleteFixture
} from '../controllers/fixture.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { upload } from '../config/upload';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Exhibition fixture routes
router.route('/exhibitions/:exhibitionId/fixtures')
  .get(getFixtures)
  .post(authorize('admin'), createFixture);

router.route('/exhibitions/:exhibitionId/fixtures/:id')
  .get(getFixture)
  .put(authorize('admin'), updateFixture)
  .delete(authorize('admin'), deleteFixture);

// Upload fixture icon
router.post('/fixtures/upload/icons', authorize('admin'), (req, res, next) => {
  req.params.type = 'fixtures'; // Set upload type for proper directory
  next();
}, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Return the path relative to the uploads directory
  const relativePath = req.file.path.split('uploads')[1].replace(/\\/g, '/');
  return res.json({ 
    url: `/api/uploads${relativePath}`,
    success: true 
  });
});

export default router; 