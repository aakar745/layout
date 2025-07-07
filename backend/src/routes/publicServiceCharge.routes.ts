import express from 'express';
import { 
  getExhibitionServiceChargeConfig,
  createServiceChargeOrder,
  verifyPayment,
  handlePhonePeCallback,
  verifyPhonePePayment,
  getServiceChargeStatus,
  downloadReceipt,
  getServiceChargeByOrderId,
  handlePaymentFailure
} from '../controllers/publicServiceCharge.controller';

const router = express.Router();

/**
 * @route   GET /api/public/service-charge/config/:exhibitionId
 * @desc    Get exhibition service charge configuration
 * @access  Public
 */
router.get('/config/:exhibitionId', getExhibitionServiceChargeConfig);

/**
 * @route   POST /api/public/service-charge/create-order
 * @desc    Create service charge order and initiate payment
 * @access  Public
 */
router.post('/create-order', createServiceChargeOrder);

/**
 * @route   POST /api/public/service-charge/verify-payment
 * @desc    Verify payment and complete the service charge (Razorpay)
 * @access  Public
 */
router.post('/verify-payment', verifyPayment);

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
 * @route   GET /api/public/service-charge/order/:orderId
 * @desc    Get service charge by order ID
 * @access  Public
 */
router.get('/order/:orderId', getServiceChargeByOrderId);

/**
 * @route   GET /api/public/service-charge/receipt/:serviceChargeId
 * @desc    Download service charge receipt
 * @access  Public
 */
router.get('/receipt/:serviceChargeId', downloadReceipt);

export default router; 