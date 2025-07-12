import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ServiceCharge from '../models/serviceCharge.model';
import Exhibition from '../models/exhibition.model';
import { phonePeService } from '../services/phonepe.service';
import { serviceChargeReceiptService } from '../services/serviceChargeReceipt.service';
import { serviceChargeNotificationService } from '../services/serviceChargeNotification.service';
import { paymentQueueService } from '../services/paymentQueue.service';

/**
 * Get exhibition service charge configuration
 */
export const getExhibitionServiceChargeConfig = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;

    // Support both slug and ID lookups for user-friendly URLs
    let exhibition;
    if (mongoose.Types.ObjectId.isValid(exhibitionId)) {
      // It's a valid ObjectId, search by _id
      exhibition = await Exhibition.findOne({ 
        _id: exhibitionId,
        isActive: true
      }).select('name venue startDate endDate serviceChargeConfig slug');
    } else {
      // It's likely a slug, search by slug
      exhibition = await Exhibition.findOne({ 
        slug: exhibitionId,
        isActive: true
      }).select('name venue startDate endDate serviceChargeConfig slug');
    }

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

    // Get payment gateway configuration (PhonePe only)
    const paymentGateway = 'phonepe';
    
    return res.status(200).json({
      success: true,
      data: {
        _id: exhibition._id,
        slug: exhibition.slug, // Include slug for frontend URL generation
        name: exhibition.name,
        venue: exhibition.venue,
        startDate: exhibition.startDate,
        endDate: exhibition.endDate,
        config: {
          isEnabled: exhibition.serviceChargeConfig.isEnabled,
          title: exhibition.serviceChargeConfig.title,
          description: exhibition.serviceChargeConfig.description,
          serviceTypes: mappedServiceTypes,
          paymentGateway,
          phonePeConfig: {
            clientId: exhibition.serviceChargeConfig.phonePeConfig?.clientId || phonePeService.getPublicKey(),
            env: exhibition.serviceChargeConfig.phonePeConfig?.env || 'SANDBOX'
          }
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
      companyName,
      exhibitorCompanyName,
      stallNumber,
      stallArea,
      serviceType,
      amount,
      uploadedImage
    } = req.body;

    // Validate required fields
    if (!vendorName || !vendorPhone || !companyName || !stallNumber || !amount) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['vendorName', 'vendorPhone', 'companyName', 'stallNumber', 'amount']
      });
    }

    // Find exhibition - support both slug and ID lookups
    let exhibition;
    if (mongoose.Types.ObjectId.isValid(exhibitionId)) {
      // It's a valid ObjectId, search by _id
      exhibition = await Exhibition.findOne({ 
        _id: exhibitionId,
        isActive: true
      });
    } else {
      // It's likely a slug, search by slug
      exhibition = await Exhibition.findOne({ 
        slug: exhibitionId,
        isActive: true
      });
    }

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

    // Validate service type for legacy systems or use stall-based pricing
    let serviceTypeConfig;
    const isStallBasedPricing = stallArea && stallArea > 0;
    
    console.log('[Service Charge Order] Processing payment:', {
      isStallBasedPricing,
      stallArea,
      serviceType,
      amount,
      exhibitionId: exhibition._id
    });
    
    if (isStallBasedPricing) {
      // For stall-based pricing, create a virtual service type
      serviceTypeConfig = {
        name: serviceType || 'Stall Service Charge',
        amount: parseFloat(amount),
        isActive: true
      };
      console.log('[Service Charge Order] Using stall-based pricing:', serviceTypeConfig);
    } else {
      // For legacy service type system
      serviceTypeConfig = exhibition.serviceChargeConfig.serviceTypes?.find(
        st => st.name === serviceType && st.isActive
      );

      if (!serviceTypeConfig) {
        return res.status(400).json({ 
          message: 'Invalid service type selected' 
        });
      }
    }

    // Handle uploaded image path
    let uploadedImagePath = null;
    if (uploadedImage && typeof uploadedImage === 'string' && uploadedImage.trim() !== '') {
      uploadedImagePath = uploadedImage;
    }

    // Create service charge record (PhonePe only)
    const serviceCharge = new ServiceCharge({
      exhibitionId: exhibition._id,
      vendorName: vendorName.trim(),
      vendorPhone: vendorPhone.trim(),
      companyName: companyName.trim(),
      exhibitorCompanyName: exhibitorCompanyName?.trim(),
      stallNumber: stallNumber.trim(),
      stallArea: stallArea || null,
      uploadedImage: uploadedImagePath,
      serviceType: serviceTypeConfig.name,
      amount,
      paymentGateway: 'phonepe',
      paymentStatus: 'pending',
      status: 'submitted'
    });

    await serviceCharge.save();

    // Create PhonePe payment order using QUEUE SYSTEM for 100+ users
    try {
      const paymentId = serviceCharge.receiptNumber!;
      console.log('[Payment Queue] Queuing payment order creation for:', paymentId);
      
      // Get queue status
      const queueStatus = paymentQueueService.getQueueStatus();
      console.log('[Payment Queue] Current status:', queueStatus);
      
      // Process payment through queue system
      const phonePeOrder = await paymentQueueService.processPayment(paymentId, async () => {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        
        const redirectUrl = `${frontendUrl}/service-charge/payment-result?serviceChargeId=${serviceCharge._id}&gateway=phonepe`;
        const callbackUrl = `${backendUrl}/api/public/service-charge/phonepe-callback`;
        
        console.log('[Public Service Charge] Creating PhonePe order with URLs:', {
          redirectUrl,
          callbackUrl,
          receiptNumber: serviceCharge.receiptNumber,
          frontendUrl,
          backendUrl
        });
        
        return await phonePeService.createOrder({
          amount,
          receiptId: serviceCharge.receiptNumber!,
          redirectUrl,
          callbackUrl
        });
      });

      // Update service charge with PhonePe order details
      serviceCharge.phonePeMerchantTransactionId = serviceCharge.receiptNumber!;
      if (phonePeOrder.data?.merchantTransactionId) {
        serviceCharge.phonePeOrderId = phonePeOrder.data.merchantTransactionId;
      }
      
      console.log('[Public Service Charge] Saving PhonePe merchant transaction ID:', {
        serviceChargeId: serviceCharge._id,
        receiptNumber: serviceCharge.receiptNumber,
        phonePeMerchantTransactionId: serviceCharge.phonePeMerchantTransactionId,
        phonePeOrderId: serviceCharge.phonePeOrderId
      });
      
      await serviceCharge.save();
      
      console.log('[Public Service Charge] PhonePe merchant transaction ID saved successfully');

      console.log('[Public Service Charge] PhonePe order created successfully:', {
        serviceChargeId: serviceCharge._id,
        receiptNumber: serviceCharge.receiptNumber,
        merchantTransactionId: serviceCharge.phonePeMerchantTransactionId,
        amount,
        redirectUrl: phonePeOrder.data?.instrumentResponse?.redirectInfo?.url
      });

      return res.status(200).json({
        success: true,
        data: {
          serviceChargeId: serviceCharge._id,
          orderId: serviceCharge.phonePeMerchantTransactionId,
          amount,
          currency: 'INR',
          receiptNumber: serviceCharge.receiptNumber,
          paymentGateway: 'phonepe',
          redirectUrl: phonePeOrder.data?.instrumentResponse?.redirectInfo?.url,
          exhibitionName: exhibition.name,
          description: `Service charge payment for ${exhibition.name}`
        }
      });
    } catch (paymentError) {
      console.error('[Public Service Charge] PhonePe order creation failed:', paymentError);
      
      // Clean up service charge record if payment order creation fails
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
 * Handle PhonePe payment callback
 */
export const handlePhonePeCallback = async (req: Request, res: Response) => {
  try {
    console.log('[PhonePe Callback] Received callback:', req.body);
    
    const { response } = req.body;
    
    if (!response) {
      console.error('[PhonePe Callback] Missing response in callback');
      return res.status(400).json({ message: 'Missing response data' });
    }

    // PhonePe sends base64 encoded response
    let decodedResponse;
    try {
      decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString());
      console.log('[PhonePe Callback] Decoded response:', decodedResponse);
    } catch (decodeError) {
      console.error('[PhonePe Callback] Failed to decode response:', decodeError);
      return res.status(400).json({ message: 'Invalid response format' });
    }

    const { merchantTransactionId, transactionId, amount, state, responseCode } = decodedResponse;

    if (!merchantTransactionId) {
      console.error('[PhonePe Callback] Missing merchant transaction ID');
      return res.status(400).json({ message: 'Missing merchant transaction ID' });
    }

    // Find service charge by merchant transaction ID
    const serviceCharge = await ServiceCharge.findOne({ 
      phonePeMerchantTransactionId: merchantTransactionId 
    });

    if (!serviceCharge) {
      console.error('[PhonePe Callback] Service charge not found for merchant transaction ID:', merchantTransactionId);
      return res.status(404).json({ message: 'Service charge not found' });
    }

    // Update service charge with callback data
    serviceCharge.phonePeTransactionId = transactionId;
    
    if (state === 'COMPLETED' && responseCode === 'SUCCESS') {
      serviceCharge.paymentStatus = 'paid';
      serviceCharge.status = 'paid';
      serviceCharge.paidAt = new Date();
      
      console.log('[PhonePe Callback] Payment successful for service charge:', serviceCharge._id);
    } else {
      serviceCharge.paymentStatus = 'failed';
      serviceCharge.status = 'cancelled';
      
      console.log('[PhonePe Callback] Payment failed for service charge:', serviceCharge._id, 'State:', state, 'Code:', responseCode);
    }

    await serviceCharge.save();

    // If payment is successful, handle post-payment processing
    if (serviceCharge.paymentStatus === 'paid') {
      try {
        const exhibition = await Exhibition.findById(serviceCharge.exhibitionId);
        
        if (exhibition) {
          // Generate receipt PDF
          try {
            const receiptPath = await serviceChargeReceiptService.generateReceipt({
              serviceCharge,
              exhibition
            });

            // Update service charge with receipt path
            serviceCharge.receiptPath = receiptPath;
            serviceCharge.receiptGenerated = true;
            await serviceCharge.save();

            console.log('[PhonePe Callback] Receipt generated successfully:', receiptPath);
          } catch (receiptError) {
            console.error('[PhonePe Callback] Receipt generation failed:', receiptError);
          }

          // Send notifications - EMAIL DISABLED for fast payment processing
          try {
            // Only notify admin about new payment (no email)
            await serviceChargeNotificationService.notifyNewServiceCharge(serviceCharge, exhibition);

            // REMOVED: Receipt email to vendor - no email notifications for fast processing
            console.log('[PhonePe Callback] Email notifications disabled for fast payment processing');
          } catch (notificationError) {
            console.error('[PhonePe Callback] Notification sending failed:', notificationError);
          }
        }
      } catch (postProcessingError) {
        console.error('[PhonePe Callback] Post-payment processing failed:', postProcessingError);
      }
    }

    return res.status(200).json({ message: 'Callback processed successfully' });
  } catch (error) {
    console.error('[PhonePe Callback] Error processing callback:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Verify PhonePe payment status
 */
export const verifyPhonePePayment = async (req: Request, res: Response) => {
  try {
    const { merchantTransactionId } = req.body;

    console.log('[PhonePe Verify] Verifying payment for merchant transaction ID:', merchantTransactionId);

    if (!merchantTransactionId) {
      return res.status(400).json({ 
        message: 'Missing merchant transaction ID' 
      });
    }

    // Find service charge by merchant transaction ID
    const serviceCharge = await ServiceCharge.findOne({ 
      phonePeMerchantTransactionId: merchantTransactionId 
    });

    if (!serviceCharge) {
      console.error('[PhonePe Verify] Service charge not found for merchant transaction ID:', merchantTransactionId);
      return res.status(404).json({ 
        message: 'Service charge order not found' 
      });
    }

    console.log('[PhonePe Verify] Found service charge:', {
      id: serviceCharge._id,
      receiptNumber: serviceCharge.receiptNumber,
      paymentStatus: serviceCharge.paymentStatus,
      status: serviceCharge.status
    });

    // Get exhibition details
    const exhibition = await Exhibition.findById(serviceCharge.exhibitionId);
    if (!exhibition) {
      return res.status(404).json({ 
        message: 'Exhibition not found' 
      });
    }

    // Check payment status via PhonePe API
    try {
      const paymentStatus = await phonePeService.getOrderStatus(merchantTransactionId);
      
      console.log('[PhonePe Verify] Payment status from PhonePe:', paymentStatus);

      // Update service charge based on PhonePe response
      if (paymentStatus.success && paymentStatus.data?.state === 'COMPLETED') {
        if (serviceCharge.paymentStatus !== 'paid') {
          serviceCharge.paymentStatus = 'paid';
          serviceCharge.status = 'paid';
          serviceCharge.paidAt = new Date();
          serviceCharge.phonePeTransactionId = paymentStatus.data.transactionId;
          await serviceCharge.save();

          console.log('[PhonePe Verify] Payment status updated to paid');

          // Generate receipt if not already generated
          if (!serviceCharge.receiptGenerated) {
            try {
              const receiptPath = await serviceChargeReceiptService.generateReceipt({
                serviceCharge,
                exhibition
              });

              serviceCharge.receiptPath = receiptPath;
              serviceCharge.receiptGenerated = true;
              await serviceCharge.save();

              console.log('[PhonePe Verify] Receipt generated successfully:', receiptPath);
            } catch (receiptError) {
              console.error('[PhonePe Verify] Receipt generation failed:', receiptError);
            }

            // Send notifications - EMAIL DISABLED for fast payment processing
            try {
              // Only notify admin about new payment (no email)
              await serviceChargeNotificationService.notifyNewServiceCharge(serviceCharge, exhibition);

              // REMOVED: Receipt email to vendor - no email notifications for fast processing
              console.log('[PhonePe Verify] Email notifications disabled for fast payment processing');
            } catch (notificationError) {
              console.error('[PhonePe Verify] Notification sending failed:', notificationError);
            }
          }
        }

        return res.status(200).json({
          success: true,
          message: 'Payment verified successfully',
          data: {
            serviceChargeId: serviceCharge._id,
            receiptNumber: serviceCharge.receiptNumber,
            paymentId: serviceCharge.phonePeTransactionId,
            amount: serviceCharge.amount,
            paidAt: serviceCharge.paidAt,
            receiptGenerated: serviceCharge.receiptGenerated,
            receiptDownloadUrl: serviceCharge.receiptPath ? `/api/public/service-charge/receipt/${serviceCharge._id}` : null,
            state: paymentStatus.data.state,
            code: paymentStatus.data.responseCode
          }
        });
                    } else {
        // Payment failed or pending
        const paymentState = paymentStatus.data?.state;
        const errorMessage = paymentStatus.data?.responseCode || 'Payment verification failed';
        
        console.error('[PhonePe Verify] Payment verification failed:', {
          merchantTransactionId,
          state: paymentState,
          code: paymentStatus.data?.responseCode,
          message: paymentStatus.message
        });

        // Update service charge status based on payment state
        if (paymentState === 'FAILED') {
          // Payment explicitly failed - update status to failed
          serviceCharge.paymentStatus = 'failed';
          serviceCharge.status = 'cancelled';
          await serviceCharge.save();
          
          console.log('[PhonePe Verify] Service charge status updated to failed for:', serviceCharge._id);
        }
        // If state is 'PENDING', keep the current pending status

        return res.status(400).json({
          success: false,
          message: paymentState === 'FAILED' ? 'Payment failed' : 'Payment verification failed',
          error: errorMessage,
          data: {
            serviceChargeId: serviceCharge._id,
            state: paymentState,
            code: paymentStatus.data?.responseCode,
            paymentStatus: serviceCharge.paymentStatus,
            status: serviceCharge.status
          }
        });
      }
    } catch (verifyError) {
      console.error('[PhonePe Verify] Error verifying with PhonePe API:', verifyError);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to verify payment with PhonePe',
        error: (verifyError as Error).message
      });
    }
  } catch (error) {
    console.error('[PhonePe Verify] Error verifying payment:', error);
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

    if (!serviceChargeId || !mongoose.Types.ObjectId.isValid(serviceChargeId)) {
      return res.status(400).json({ 
        message: 'Invalid service charge ID' 
      });
    }

    const serviceCharge = await ServiceCharge.findById(serviceChargeId)
      .populate('exhibitionId', 'name venue startDate endDate');

    if (!serviceCharge) {
      return res.status(404).json({ 
        message: 'Service charge not found' 
      });
    }

    return res.status(200).json({
      success: true,
      data: serviceCharge
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
 * Download receipt for service charge
 */
export const downloadReceipt = async (req: Request, res: Response) => {
  try {
    const { serviceChargeId } = req.params;

    if (!serviceChargeId || !mongoose.Types.ObjectId.isValid(serviceChargeId)) {
      return res.status(400).json({ 
        message: 'Invalid service charge ID' 
      });
    }

    const serviceCharge = await ServiceCharge.findById(serviceChargeId);

    if (!serviceCharge) {
      return res.status(404).json({ 
        message: 'Service charge not found' 
      });
    }

    if (!serviceCharge.receiptPath) {
      return res.status(404).json({ 
        message: 'Receipt not available' 
      });
    }

    // Serve the receipt file
    return res.download(serviceCharge.receiptPath, `receipt-${serviceCharge.receiptNumber}.pdf`);
  } catch (error) {
    console.error('Error downloading receipt:', error);
    return res.status(500).json({
      message: 'Error downloading receipt',
      error: (error as Error).message
    });
  }
};

/**
 * Handle payment failure
 */
export const handlePaymentFailure = async (req: Request, res: Response) => {
  try {
    const { serviceChargeId, reason } = req.body;

    if (!serviceChargeId || !mongoose.Types.ObjectId.isValid(serviceChargeId)) {
      return res.status(400).json({ 
        message: 'Invalid service charge ID' 
      });
    }

    const serviceCharge = await ServiceCharge.findById(serviceChargeId);

    if (!serviceCharge) {
      return res.status(404).json({ 
        message: 'Service charge not found' 
      });
    }

    // Update service charge status
    serviceCharge.paymentStatus = 'failed';
    serviceCharge.adminNotes = reason || 'Payment failed';
    await serviceCharge.save();

    console.log('[Payment Failure] Payment failed for service charge:', serviceChargeId, 'Reason:', reason);

    return res.status(200).json({
      success: true,
      message: 'Payment failure recorded'
    });
  } catch (error) {
    console.error('Error handling payment failure:', error);
    return res.status(500).json({
      message: 'Error handling payment failure',
      error: (error as Error).message
    });
  }
};

/**
 * Get payment queue status - for monitoring 100+ concurrent users
 */
export const getPaymentQueueStatus = async (req: Request, res: Response) => {
  try {
    const queueStatus = paymentQueueService.getQueueStatus();
    
    return res.status(200).json({
      success: true,
      data: {
        ...queueStatus,
        utilizationPercentage: Math.round((queueStatus.active / queueStatus.capacity) * 100),
        isAtCapacity: queueStatus.active >= queueStatus.capacity,
        estimatedWaitTime: queueStatus.queued > 0 ? Math.ceil(queueStatus.queued / 10) : 0 // Estimated minutes
      }
    });
  } catch (error) {
    console.error('Error getting payment queue status:', error);
    return res.status(500).json({
      message: 'Error getting queue status',
      error: (error as Error).message
    });
  }
}; 