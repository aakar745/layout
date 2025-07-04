import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ServiceCharge from '../models/serviceCharge.model';
import Exhibition from '../models/exhibition.model';
import { razorpayService } from '../services/razorpay.service';
import { serviceChargeReceiptService } from '../services/serviceChargeReceipt.service';
import { serviceChargeNotificationService } from '../services/serviceChargeNotification.service';

/**
 * Get exhibition service charge configuration
 */
export const getExhibitionServiceChargeConfig = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;

    const exhibition = await Exhibition.findOne({ 
      _id: exhibitionId,
      isActive: true
    }).select('name venue startDate endDate serviceChargeConfig');

    if (!exhibition) {
      return res.status(404).json({ 
        message: 'Exhibition not found or not available' 
      });
    }

    if (!exhibition.serviceChargeConfig?.isEnabled) {
      return res.status(403).json({ 
        message: 'Service charges are not enabled for this exhibition' 
      });
    }

    // Map service types from backend 'name' field to frontend 'type' field
    const mappedServiceTypes = exhibition.serviceChargeConfig.serviceTypes?.map(st => ({
      type: st.name,
      amount: st.amount,
      description: st.description
    })) || [];

    return res.status(200).json({
      success: true,
      data: {
        _id: exhibition._id,
        name: exhibition.name,
        venue: exhibition.venue,
        startDate: exhibition.startDate,
        endDate: exhibition.endDate,
        config: {
          isEnabled: exhibition.serviceChargeConfig.isEnabled,
          title: exhibition.serviceChargeConfig.title,
          description: exhibition.serviceChargeConfig.description,
          serviceTypes: mappedServiceTypes,
          razorpayKeyId: razorpayService.getPublicKey()
        }
      }
    });
  } catch (error) {
    console.error('Error fetching exhibition service charge config:', error);
    return res.status(500).json({
      message: 'Error fetching exhibition configuration',
      error: (error as Error).message
    });
  }
};

/**
 * Create service charge order and initiate payment
 */
export const createServiceChargeOrder = async (req: Request, res: Response) => {
  try {
    const {
      exhibitionId,
      vendorName,
      vendorPhone,
      vendorEmail,
      companyName,
      exhibitorCompanyName,
      stallNumber,
      vendorAddress,
      serviceType,
      description,
      amount
    } = req.body;

    // Validate required fields
    if (!vendorName || !vendorPhone || !companyName || !stallNumber || !serviceType || !amount) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['vendorName', 'vendorPhone', 'companyName', 'stallNumber', 'serviceType', 'amount']
      });
    }

    // Find exhibition
    const exhibition = await Exhibition.findOne({ 
      _id: exhibitionId,
      isActive: true
    });

    if (!exhibition) {
      return res.status(404).json({ 
        message: 'Exhibition not found or not available' 
      });
    }

    if (!exhibition.serviceChargeConfig?.isEnabled) {
      return res.status(403).json({ 
        message: 'Service charges are not enabled for this exhibition' 
      });
    }

    // Validate that the service type exists in the exhibition config
    const serviceTypeConfig = exhibition.serviceChargeConfig.serviceTypes?.find(
      st => st.name === serviceType && st.isActive
    );

    if (!serviceTypeConfig) {
      return res.status(400).json({ 
        message: 'Invalid service type selected' 
      });
    }

    // Create service charge record
    const serviceCharge = new ServiceCharge({
      exhibitionId: exhibition._id,
      vendorName: vendorName.trim(),
      vendorPhone: vendorPhone.trim(),
      vendorEmail: vendorEmail?.trim().toLowerCase(),
      companyName: companyName.trim(),
      exhibitorCompanyName: exhibitorCompanyName?.trim(),
      stallNumber: stallNumber.trim(),
      vendorAddress: vendorAddress?.trim(),
      serviceType,
      description: description?.trim() || serviceTypeConfig.description,
      amount,
      paymentStatus: 'pending',
      status: 'submitted'
    });

    await serviceCharge.save();

    // Create Razorpay order
    try {
      const razorpayOrder = await razorpayService.createOrder({
        amount,
        receiptId: serviceCharge.receiptNumber!,
        currency: 'INR'
      });

      // Update service charge with Razorpay order ID
      serviceCharge.razorpayOrderId = razorpayOrder.id;
      await serviceCharge.save();

      console.log('[Public Service Charge] Order created successfully:', {
        serviceChargeId: serviceCharge._id,
        receiptNumber: serviceCharge.receiptNumber,
        razorpayOrderId: razorpayOrder.id,
        amount
      });

      return res.status(200).json({
        success: true,
        data: {
          serviceChargeId: serviceCharge._id,
          orderId: razorpayOrder.id,
          amount,
          currency: 'INR',
          receiptNumber: serviceCharge.receiptNumber,
          razorpayKeyId: razorpayService.getPublicKey(),
          exhibitionName: exhibition.name,
          description: `Service charge payment for ${exhibition.name}`
        }
      });
    } catch (razorpayError) {
      console.error('[Public Service Charge] Razorpay order creation failed:', razorpayError);
      
      // Clean up service charge record if Razorpay order creation fails
      await ServiceCharge.findByIdAndDelete(serviceCharge._id);
      
      return res.status(500).json({
        message: 'Failed to create payment order',
        error: 'Payment gateway error'
      });
    }
  } catch (error) {
    console.error('Error creating service charge order:', error);
    return res.status(500).json({
      message: 'Error creating service charge order',
      error: (error as Error).message
    });
  }
};

/**
 * Verify payment and complete the service charge
 */
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        message: 'Missing payment verification parameters' 
      });
    }

    // Find service charge by order ID
    const serviceCharge = await ServiceCharge.findOne({ 
      razorpayOrderId: razorpay_order_id 
    });

    if (!serviceCharge) {
      return res.status(404).json({ 
        message: 'Service charge order not found' 
      });
    }

    // Get exhibition details
    const exhibition = await Exhibition.findById(serviceCharge.exhibitionId);
    if (!exhibition) {
      return res.status(404).json({ 
        message: 'Exhibition not found' 
      });
    }

    // Verify payment signature
    const isValidSignature = razorpayService.verifySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    });

    if (!isValidSignature) {
      console.error('[Public Service Charge] Invalid payment signature:', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
      });

      // Notify admin about payment failure
      await serviceChargeNotificationService.notifyPaymentFailure(
        serviceCharge,
        exhibition,
        'Invalid payment signature'
      );

      return res.status(400).json({ 
        message: 'Payment verification failed',
        error: 'Invalid signature'
      });
    }

    // Get payment details from Razorpay
    let paymentDetails;
    try {
      paymentDetails = await razorpayService.getPaymentDetails(razorpay_payment_id);
    } catch (error) {
      console.error('[Public Service Charge] Failed to fetch payment details:', error);
    }

    // Update service charge with payment details
    serviceCharge.razorpayPaymentId = razorpay_payment_id;
    serviceCharge.razorpaySignature = razorpay_signature;
    serviceCharge.paymentStatus = 'paid';
    serviceCharge.status = 'paid';
    serviceCharge.paidAt = new Date();
    await serviceCharge.save();

    // Generate receipt PDF
    let receiptPath: string | null = null;
    try {
      receiptPath = await serviceChargeReceiptService.generateReceipt({
        serviceCharge,
        exhibition
      });

      // Update service charge with receipt path
      serviceCharge.receiptPath = receiptPath;
      serviceCharge.receiptGenerated = true;
      await serviceCharge.save();

      console.log('[Public Service Charge] Receipt generated successfully:', receiptPath);
    } catch (receiptError) {
      console.error('[Public Service Charge] Receipt generation failed:', receiptError);
      // Continue without receipt - this is not a critical failure
    }

    // Send notifications
    try {
      // Notify admin about new payment
      await serviceChargeNotificationService.notifyNewServiceCharge(serviceCharge, exhibition);

      // Send receipt email to vendor
      if (receiptPath) {
        await serviceChargeNotificationService.sendReceiptToVendor(
          serviceCharge,
          exhibition,
          receiptPath
        );
      }
    } catch (notificationError) {
      console.error('[Public Service Charge] Notification sending failed:', notificationError);
      // Continue without notifications - payment is already successful
    }

    console.log('[Public Service Charge] Payment verified successfully:', {
      serviceChargeId: serviceCharge._id,
      receiptNumber: serviceCharge.receiptNumber,
      paymentId: razorpay_payment_id,
      amount: serviceCharge.amount
    });

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        serviceChargeId: serviceCharge._id,
        receiptNumber: serviceCharge.receiptNumber,
        paymentId: razorpay_payment_id,
        amount: serviceCharge.amount,
        paidAt: serviceCharge.paidAt,
        receiptGenerated: serviceCharge.receiptGenerated,
        receiptDownloadUrl: receiptPath ? `/api/public/service-charge/receipt/${serviceCharge._id}` : null
      }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      message: 'Error verifying payment',
      error: (error as Error).message
    });
  }
};

/**
 * Get service charge status by ID
 */
export const getServiceChargeStatus = async (req: Request, res: Response) => {
  try {
    const { serviceChargeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceChargeId)) {
      return res.status(400).json({ message: 'Invalid service charge ID' });
    }

    const serviceCharge = await ServiceCharge.findById(serviceChargeId)
      .populate('exhibitionId', 'name venue startDate endDate')
      .select('-razorpaySignature'); // Don't expose signature

    if (!serviceCharge) {
      return res.status(404).json({ 
        message: 'Service charge not found' 
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: serviceCharge._id,
        receiptNumber: serviceCharge.receiptNumber,
        vendorName: serviceCharge.vendorName,
        companyName: serviceCharge.companyName,
        serviceType: serviceCharge.serviceType,
        amount: serviceCharge.amount,
        paymentStatus: serviceCharge.paymentStatus,
        status: serviceCharge.status,
        paidAt: serviceCharge.paidAt,
        createdAt: serviceCharge.createdAt,
        exhibition: serviceCharge.exhibitionId,
        receiptGenerated: serviceCharge.receiptGenerated,
        receiptDownloadUrl: serviceCharge.receiptPath ? `/api/public/service-charge/receipt/${serviceCharge._id}` : null
      }
    });
  } catch (error) {
    console.error('Error fetching service charge status:', error);
    return res.status(500).json({
      message: 'Error fetching service charge status',
      error: (error as Error).message
    });
  }
};

/**
 * Download receipt (public access)
 */
export const downloadReceipt = async (req: Request, res: Response) => {
  try {
    const { serviceChargeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceChargeId)) {
      return res.status(400).json({ message: 'Invalid service charge ID' });
    }

    const serviceCharge = await ServiceCharge.findById(serviceChargeId);

    if (!serviceCharge) {
      return res.status(404).json({ message: 'Service charge not found' });
    }

    if (serviceCharge.paymentStatus !== 'paid') {
      return res.status(403).json({ 
        message: 'Receipt not available - payment not completed' 
      });
    }

    if (!serviceCharge.receiptPath) {
      return res.status(404).json({ message: 'Receipt not available' });
    }

    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(serviceCharge.receiptPath)) {
      console.error('[Public Service Charge] Receipt file not found:', serviceCharge.receiptPath);
      return res.status(404).json({ message: 'Receipt file not found' });
    }

    // Set appropriate headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Receipt-${serviceCharge.receiptNumber}.pdf"`);

    // Send file
    res.download(serviceCharge.receiptPath, `Receipt-${serviceCharge.receiptNumber}.pdf`, (err) => {
      if (err) {
        console.error('[Public Service Charge] Error downloading receipt:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error downloading receipt' });
        }
      }
    });
  } catch (error) {
    console.error('Error downloading receipt:', error);
    if (!res.headersSent) {
      return res.status(500).json({
        message: 'Error downloading receipt',
        error: (error as Error).message
      });
    }
  }
};

/**
 * Get service charge by order ID (for status checking)
 */
export const getServiceChargeByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const serviceCharge = await ServiceCharge.findOne({ 
      razorpayOrderId: orderId 
    })
      .populate('exhibitionId', 'name venue')
      .select('-razorpaySignature');

    if (!serviceCharge) {
      return res.status(404).json({ 
        message: 'Service charge order not found' 
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: serviceCharge._id,
        receiptNumber: serviceCharge.receiptNumber,
        vendorName: serviceCharge.vendorName,
        amount: serviceCharge.amount,
        paymentStatus: serviceCharge.paymentStatus,
        status: serviceCharge.status,
        createdAt: serviceCharge.createdAt,
        exhibition: serviceCharge.exhibitionId
      }
    });
  } catch (error) {
    console.error('Error fetching service charge by order ID:', error);
    return res.status(500).json({
      message: 'Error fetching service charge',
      error: (error as Error).message
    });
  }
};

/**
 * Handle payment failure
 */
export const handlePaymentFailure = async (req: Request, res: Response) => {
  try {
    const { orderId, error: paymentError } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const serviceCharge = await ServiceCharge.findOne({ 
      razorpayOrderId: orderId 
    });

    if (!serviceCharge) {
      return res.status(404).json({ 
        message: 'Service charge order not found' 
      });
    }

    // Update status to failed (keep the record for tracking)
    serviceCharge.paymentStatus = 'failed';
    serviceCharge.status = 'cancelled';
    await serviceCharge.save();

    // Get exhibition for notifications
    const exhibition = await Exhibition.findById(serviceCharge.exhibitionId);
    if (exhibition) {
      // Notify admin about payment failure
      await serviceChargeNotificationService.notifyPaymentFailure(
        serviceCharge,
        exhibition,
        paymentError || 'Payment failed'
      );
    }

    console.log('[Public Service Charge] Payment failed:', {
      serviceChargeId: serviceCharge._id,
      orderId,
      error: paymentError
    });

    return res.status(200).json({
      success: false,
      message: 'Payment failed',
      data: {
        serviceChargeId: serviceCharge._id,
        receiptNumber: serviceCharge.receiptNumber,
        status: serviceCharge.status,
        paymentStatus: serviceCharge.paymentStatus
      }
    });
  } catch (error) {
    console.error('Error handling payment failure:', error);
    return res.status(500).json({
      message: 'Error handling payment failure',
      error: (error as Error).message
    });
  }
}; 