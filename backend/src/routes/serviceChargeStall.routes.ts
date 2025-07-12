import express from 'express';
import { 
  getServiceChargeStalls,
  createServiceChargeStall,
  updateServiceChargeStall,
  deleteServiceChargeStall,
  importServiceChargeStalls
} from '../controllers/serviceChargeStall.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

/**
 * @route   GET /api/service-charge-stalls/:exhibitionId
 * @desc    Get all service charge stalls for an exhibition
 * @access  Admin with dashboard view permissions
 */
router.get('/:exhibitionId', authorize('dashboard_view'), getServiceChargeStalls);

/**
 * @route   POST /api/service-charge-stalls/:exhibitionId
 * @desc    Create a new service charge stall
 * @access  Admin with dashboard view permissions
 */
router.post('/:exhibitionId', authorize('dashboard_view'), createServiceChargeStall);

/**
 * @route   PUT /api/service-charge-stalls/stall/:stallId
 * @desc    Update a service charge stall
 * @access  Admin with dashboard view permissions
 */
router.put('/stall/:stallId', authorize('dashboard_view'), updateServiceChargeStall);

/**
 * @route   DELETE /api/service-charge-stalls/stall/:stallId
 * @desc    Delete a service charge stall
 * @access  Admin with dashboard view permissions
 */
router.delete('/stall/:stallId', authorize('dashboard_view'), deleteServiceChargeStall);

/**
 * @route   POST /api/service-charge-stalls/:exhibitionId/import
 * @desc    Import service charge stalls from Excel/CSV
 * @access  Admin with dashboard view permissions
 */
router.post('/:exhibitionId/import', authorize('dashboard_view'), importServiceChargeStalls);

export default router; 