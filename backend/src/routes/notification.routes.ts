import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { authenticateExhibitor } from '../middleware/exhibitorAuth';
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  deleteAllNotifications
} from '../controllers/notification.controller';

const router = express.Router();

// Admin routes
router.get('/admin', protect, getNotifications);
router.put('/admin/mark-read/:notificationId', protect, markAsRead);
router.put('/admin/mark-all-read', protect, markAllAsRead);
router.delete('/admin/delete-all', protect, deleteAllNotifications);
router.delete('/admin/:notificationId', protect, deleteNotification);

// Exhibitor routes
router.get('/exhibitor', authenticateExhibitor, getNotifications);
router.put('/exhibitor/mark-read/:notificationId', authenticateExhibitor, markAsRead);
router.put('/exhibitor/mark-all-read', authenticateExhibitor, markAllAsRead);
router.delete('/exhibitor/delete-all', authenticateExhibitor, deleteAllNotifications);
router.delete('/exhibitor/:notificationId', authenticateExhibitor, deleteNotification);

export default router; 