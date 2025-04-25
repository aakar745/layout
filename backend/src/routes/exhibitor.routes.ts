import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  getAllExhibitors,
  updateExhibitorStatus,
  deleteExhibitor,
  updateExhibitorDetails,
  testRoute,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword
} from '../controllers/exhibitor.controller';
import { authenticateExhibitor } from '../middleware/exhibitorAuth';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Test route
router.get('/test', testRoute);

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected exhibitor routes (require exhibitor auth)
router.get('/profile', authenticateExhibitor, getProfile);
router.put('/profile', authenticateExhibitor, updateProfile);

// Admin routes (require admin auth)
router.get('/admin/exhibitors', authenticate, getAllExhibitors);
router.put('/admin/exhibitors/:id/status', authenticate, updateExhibitorStatus);
router.put('/admin/exhibitors/:id', authenticate, updateExhibitorDetails);
router.delete('/admin/exhibitors/:id', authenticate, deleteExhibitor);

// Additionally, add these routes at the root path for convenience
router.get('/', authenticate, getAllExhibitors);
router.put('/:id/status', authenticate, updateExhibitorStatus);
router.put('/:id', authenticate, updateExhibitorDetails);
router.delete('/:id', authenticate, deleteExhibitor);

export default router; 