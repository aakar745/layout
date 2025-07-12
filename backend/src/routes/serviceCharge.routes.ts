import express from 'express';
import { 
  getServiceCharges,
  getServiceChargesByExhibition,
  updateServiceChargeConfig,
  updateServiceChargeStatus,
  getServiceChargeStats,
  exportServiceCharges,
  downloadReceipt,
  deleteServiceCharge,
  deleteAllServiceCharges,
  getCounterStatus
} from '../controllers/serviceCharge.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

/**
 * @route   GET /api/service-charges
 * @desc    Get all service charges with pagination and filtering
 * @access  Admin with service charge permissions
 */
router.get('/', authorize('dashboard_view'), getServiceCharges);

/**
 * @route   GET /api/service-charges/exhibition/:exhibitionId
 * @desc    Get service charges by exhibition
 * @access  Admin with access to specific exhibition
 */
router.get('/exhibition/:exhibitionId', getServiceChargesByExhibition);

/**
 * @route   PUT /api/service-charges/config/:exhibitionId
 * @desc    Update service charge configuration for an exhibition
 * @access  Admin with exhibition edit permissions
 */
router.put('/config/:exhibitionId', authorize('dashboard_view'), updateServiceChargeConfig);

/**
 * @route   PUT /api/service-charges/:serviceChargeId/status
 * @desc    Update service charge status
 * @access  Admin with service charge permissions
 */
router.put('/:serviceChargeId/status', authorize('dashboard_view'), updateServiceChargeStatus);

/**
 * @route   GET /api/service-charges/stats
 * @desc    Get service charge statistics
 * @access  Admin with service charge permissions
 */
router.get('/stats', authorize('dashboard_view'), getServiceChargeStats);

/**
 * @route   GET /api/service-charges/export
 * @desc    Export service charges to CSV
 * @access  Admin with service charge permissions
 */
router.get('/export', authorize('dashboard_view'), exportServiceCharges);

/**
 * @route   GET /api/service-charges/:serviceChargeId/receipt
 * @desc    Download service charge receipt
 * @access  Admin with service charge permissions
 */
router.get('/:serviceChargeId/receipt', downloadReceipt);

/**
 * @route   DELETE /api/service-charges/:serviceChargeId
 * @desc    Delete a single service charge
 * @access  Admin with service charge permissions
 */
router.delete('/:serviceChargeId', authorize('dashboard_view'), deleteServiceCharge);

/**
 * @route   DELETE /api/service-charges
 * @desc    Delete all service charges (bulk delete)
 * @access  Admin with advanced permissions
 */
router.delete('/', authorize('dashboard_view'), deleteAllServiceCharges);

/**
 * @route   GET /api/service-charges/counter-status
 * @desc    Get counter status for monitoring
 * @access  Admin with service charge permissions
 */
router.get('/counter-status', authorize('dashboard_view'), getCounterStatus);

export default router; 