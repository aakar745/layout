import express from 'express';
import {
  getExhibitionServiceChargeConfig,
  createServiceChargeOrder,
  handlePhonePeCallback,
  verifyPhonePePayment,
  getServiceChargeStatus,
  downloadReceipt,
  handlePaymentFailure,
  getPaymentQueueStatus,
  lookupServiceCharge
} from '../controllers/publicServiceCharge.controller';
import { getActiveServiceChargeStalls } from '../controllers/serviceChargeStall.controller';
import { upload, optimizeImage } from '../config/upload';

const router = express.Router();

/**
 * @route   GET /api/public/service-charge/config/:exhibitionId
 * @desc    Get exhibition service charge configuration
 * @access  Public
 */
router.get('/config/:exhibitionId', getExhibitionServiceChargeConfig);

/**
 * @route   GET /api/public/service-charge/stalls/:exhibitionId
 * @desc    Get active service charge stalls for auto-fill
 * @access  Public
 */
router.get('/stalls/:exhibitionId', getActiveServiceChargeStalls);

/**
 * @route   POST /api/public/service-charge/upload
 * @desc    Upload image for service charge
 * @access  Public
 */
router.post('/upload', (req, res, next) => {
  req.params.type = 'service-charges'; // Set upload type for proper directory
  next();
}, (req, res, next) => {
  // Handle multer upload with error catching
  upload.single('uploadedImage')(req, res, (err) => {
    if (err) {
      console.error('[Upload Error]:', err);
      
      // Handle specific multer errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          success: false, 
          message: 'File too large. Maximum size is 10MB.',
          error: 'LIMIT_FILE_SIZE'
        });
      }
      
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ 
          success: false, 
          message: 'Unexpected field name. Please use "uploadedImage" as the field name.',
          error: 'LIMIT_UNEXPECTED_FILE'
        });
      }
      
      if (err.message && err.message.includes('Invalid upload type')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid file type. Please upload a valid image file (JPG, PNG, GIF, SVG, HEIC).',
          error: 'INVALID_FILE_TYPE'
        });
      }
      
      // Generic error handling
      return res.status(400).json({ 
        success: false, 
        message: 'Upload failed. Please check your file and try again.',
        error: err.message || 'UPLOAD_ERROR'
      });
    }
    
    // No error, continue to next middleware
    next();
  });
}, optimizeImage, (req, res) => {
  console.log('[Upload Success] File processed:', req.file?.originalname);
  
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  // Return the path relative to the uploads directory
  const relativePath = req.file.path.split('uploads')[1].replace(/\\/g, '/');
  const path = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  
  res.json({ 
    success: true, 
    path: path,
    url: `/api/public/uploads/${path}`,
    message: 'File uploaded successfully',
    fileInfo: {
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

/**
 * @route   GET /api/public/service-charge/test-counter
 * @desc    Test counter service (for debugging production issues)
 * @access  Public
 */
router.get('/test-counter', async (req, res) => {
  try {
    const CounterService = require('../services/counter.service').default;
    
    // Test counter service
    const receiptNumber = await CounterService.generateReceiptNumber();
    const counterStatus = await CounterService.getCounterStatus('serviceCharge');
    
    res.json({
      success: true,
      data: {
        receiptNumber,
        counterStatus,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Counter service test failed:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message,
      stack: (error as Error).stack
    });
  }
});

/**
 * @route   POST /api/public/service-charge/create-order
 * @desc    Create service charge order and initiate payment
 * @access  Public
 */
router.post('/create-order', createServiceChargeOrder);

/**
 * @route   POST /api/public/service-charge/phonepe-callback
 * @desc    Handle PhonePe payment callback
 * @access  Public
 */
router.post('/phonepe-callback', handlePhonePeCallback);

/**
 * @route   POST /api/public/service-charge/verify-phonepe-payment
 * @desc    Verify PhonePe payment status
 * @access  Public
 */
router.post('/verify-phonepe-payment', verifyPhonePePayment);

/**
 * @route   POST /api/public/service-charge/payment-failure
 * @desc    Handle payment failure
 * @access  Public
 */
router.post('/payment-failure', handlePaymentFailure);

/**
 * @route   GET /api/public/service-charge/status/:serviceChargeId
 * @desc    Get service charge status by ID
 * @access  Public
 */
router.get('/status/:serviceChargeId', getServiceChargeStatus);

/**
 * @route   GET /api/public/service-charge/receipt/:serviceChargeId
 * @desc    Download service charge receipt
 * @access  Public
 */
router.get('/receipt/:serviceChargeId', downloadReceipt);

/**
 * @route   GET /api/public/service-charge/queue-status
 * @desc    Get payment queue status for monitoring 100+ concurrent users
 * @access  Public
 */
router.get('/queue-status', getPaymentQueueStatus);

/**
 * @route   POST /api/public/service-charge/lookup/:exhibitionId
 * @desc    Lookup service charge by phone number or stall number
 * @access  Public
 */
router.post('/lookup/:exhibitionId', lookupServiceCharge);

export default router; 