import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ServiceCharge from '../models/serviceCharge.model';
import Exhibition from '../models/exhibition.model';
import { razorpayService } from '../services/razorpay.service';
import { phonePeService } from '../services/phonepe.service';
import { serviceChargeReceiptService } from '../services/serviceChargeReceipt.service';
import { serviceChargeNotificationService } from '../services/serviceChargeNotification.service';

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

    // Get payment gateway configuration
    const paymentGateway = exhibition.serviceChargeConfig.paymentGateway || 'phonepe';
    
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
          razorpayKeyId: exhibition.serviceChargeConfig.razorpayKeyId || razorpayService.getPublicKey(),
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

    // Validate that the service type exists in the exhibition config
    const serviceTypeConfig = exhibition.serviceChargeConfig.serviceTypes?.find(
      st => st.name === serviceType && st.isActive
    );

    if (!serviceTypeConfig) {
      return res.status(400).json({ 
        message: 'Invalid service type selected' 
      });
    }

    // Get payment gateway configuration
    const paymentGateway = exhibition.serviceChargeConfig.paymentGateway || 'phonepe';
    
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
      paymentGateway,
      paymentStatus: 'pending',
      status: 'submitted'
    });

    await serviceCharge.save();

    // Create payment order based on selected gateway
    try {
      if (paymentGateway === 'phonepe') {
        // Create PhonePe order
        // PhonePe redirects to the same URL for all states, we need to handle different outcomes
        const redirectUrl = `${process.env.FRONTEND_URL}/service-charge/payment-result?serviceChargeId=${serviceCharge._id}&gateway=phonepe`;
        const callbackUrl = `${process.env.BACKEND_URL}/api/public/service-charge/phonepe-callback`;
        
        console.log('[Public Service Charge] Creating PhonePe order with URLs:', {
          redirectUrl,
          callbackUrl,
          receiptNumber: serviceCharge.receiptNumber
        });
        
        const phonePeOrder = await phonePeService.createOrder({
          amount,
          receiptId: serviceCharge.receiptNumber!,
          redirectUrl,
          callbackUrl
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
      } else {
        // Create Razorpay order
        const razorpayOrder = await razorpayService.createOrder({
          amount,
          receiptId: serviceCharge.receiptNumber!,
          currency: 'INR'
        });

        // Update service charge with Razorpay order ID
        serviceCharge.razorpayOrderId = razorpayOrder.id;
        await serviceCharge.save();

        console.log('[Public Service Charge] Razorpay order created successfully:', {
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
            paymentGateway: 'razorpay',
            razorpayKeyId: razorpayService.getPublicKey(),
            exhibitionName: exhibition.name,
            description: `Service charge payment for ${exhibition.name}`
          }
        });
      }
    } catch (paymentError) {
      console.error(`[Public Service Charge] ${paymentGateway} order creation failed:`, paymentError);
      
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
 * Handle PhonePe payment callback
 */
export const handlePhonePeCallback = async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers;
    const responseBody = JSON.stringify(req.body);

    console.log('[PhonePe Callback] Received callback:', {
      authorization,
      body: req.body,
      headers: req.headers
    });

    // In development mode, simulate successful callback
    if (phonePeService.isInDevelopmentMode()) {
      console.log('[PhonePe Callback] Development mode - simulating successful callback');
      return res.status(200).json({
        success: true,
        message: 'Development mode callback processed'
      });
    }

    // Verify callback using PhonePe SDK
    try {
      const callbackResult = phonePeService.verifyCallback(
        process.env.PHONEPE_CALLBACK_USERNAME || '',
        process.env.PHONEPE_CALLBACK_PASSWORD || '',
        authorization as string,
        responseBody
      );

      console.log('[PhonePe Callback] Callback verification result:', callbackResult);

      if (callbackResult.success) {
        const { orderId, state, transactionId } = callbackResult.payload;

        // Find service charge by merchant transaction ID
        const serviceCharge = await ServiceCharge.findOne({
          phonePeMerchantTransactionId: orderId
        }).populate('exhibitionId');

        if (serviceCharge) {
          console.log('[PhonePe Callback] Found service charge for callback:', {
            serviceChargeId: serviceCharge._id,
            currentStatus: serviceCharge.paymentStatus,
            callbackState: state
          });

          // Update service charge based on payment state
          if (state === 'COMPLETED') {
            serviceCharge.paymentStatus = 'paid';
            serviceCharge.status = 'paid';
            serviceCharge.phonePeTransactionId = transactionId;
            serviceCharge.paidAt = new Date();
            await serviceCharge.save();

            console.log('[PhonePe Callback] Payment completed successfully via callback:', {
              serviceChargeId: serviceCharge._id,
              transactionId
            });

            // Generate receipt and send notifications in background
            setImmediate(async () => {
              try {
                const exhibition = serviceCharge.exhibitionId as any;
                
                // Generate receipt
                const receiptPath = await serviceChargeReceiptService.generateReceipt({
                  serviceCharge,
                  exhibition
                });

                serviceCharge.receiptPath = receiptPath;
                serviceCharge.receiptGenerated = true;
                await serviceCharge.save();

                // Send notifications
                await serviceChargeNotificationService.notifyNewServiceCharge(serviceCharge, exhibition);
                if (receiptPath) {
                  await serviceChargeNotificationService.sendReceiptToVendor(
                    serviceCharge,
                    exhibition,
                    receiptPath
                  );
                }
              } catch (bgError) {
                console.error('[PhonePe Callback] Background processing failed:', bgError);
              }
            });
          } else if (state === 'FAILED') {
            serviceCharge.paymentStatus = 'failed';
            serviceCharge.status = 'cancelled';
            await serviceCharge.save();

            console.log('[PhonePe Callback] Payment failed via callback:', {
              serviceChargeId: serviceCharge._id,
              state
            });
          } else {
            console.log('[PhonePe Callback] Payment state not final:', {
              serviceChargeId: serviceCharge._id,
              state
            });
          }
        } else {
          console.error('[PhonePe Callback] Service charge not found for order ID:', orderId);
        }
      } else {
        console.error('[PhonePe Callback] Callback verification failed');
      }
    } catch (verifyError) {
      console.error('[PhonePe Callback] Error verifying callback:', verifyError);
    }

    // Always return success to PhonePe to avoid retries
    return res.status(200).json({
      success: true,
      message: 'Callback processed'
    });
  } catch (error) {
    console.error('[PhonePe Callback] Error processing callback:', error);
    // Still return success to PhonePe to avoid retries
    return res.status(200).json({
      success: true,
      message: 'Callback processed with errors',
      error: (error as Error).message
    });
  }
};

/**
 * Verify PhonePe payment status
 */
export const verifyPhonePePayment = async (req: Request, res: Response) => {
  try {
    const { merchantTransactionId } = req.body;

    if (!merchantTransactionId) {
      return res.status(400).json({ 
        message: 'Missing merchant transaction ID' 
      });
    }

    console.log('[PhonePe Verification] Starting verification for:', merchantTransactionId);

    // Find service charge by merchant transaction ID or receipt number (fallback)
    let serviceCharge = await ServiceCharge.findOne({ 
      phonePeMerchantTransactionId: merchantTransactionId 
    });

    // If not found by merchant transaction ID, try by receipt number as fallback
    if (!serviceCharge) {
      console.log('[PhonePe Verification] Service charge not found by merchant transaction ID, trying receipt number fallback...');
      serviceCharge = await ServiceCharge.findOne({ 
        receiptNumber: merchantTransactionId 
      });
      
      if (serviceCharge) {
        console.log('[PhonePe Verification] Found service charge by receipt number, updating merchant transaction ID');
        // Update the merchant transaction ID if found by receipt number
        serviceCharge.phonePeMerchantTransactionId = merchantTransactionId;
        await serviceCharge.save();
      }
    }

    if (!serviceCharge) {
      console.error('[PhonePe Verification] Service charge not found for merchant transaction ID:', merchantTransactionId);
      return res.status(404).json({ 
        message: 'Service charge order not found' 
      });
    }

    console.log('[PhonePe Verification] Found service charge:', {
      serviceChargeId: serviceCharge._id,
      receiptNumber: serviceCharge.receiptNumber,
      phonePeMerchantTransactionId: serviceCharge.phonePeMerchantTransactionId,
      currentPaymentStatus: serviceCharge.paymentStatus,
      status: serviceCharge.status,
      createdAt: serviceCharge.createdAt
    });

    // Get exhibition details
    const exhibition = await Exhibition.findById(serviceCharge.exhibitionId);
    if (!exhibition) {
      return res.status(404).json({ 
        message: 'Exhibition not found' 
      });
    }

    // Check payment status with PhonePe
    console.log('[PhonePe Verification] Checking payment status with PhonePe...');
    const statusResponse = await phonePeService.getOrderStatus(merchantTransactionId);
    
    console.log('[PhonePe Verification] Status response:', {
      success: statusResponse.success,
      state: statusResponse.data?.state,
      code: statusResponse.code,
      message: statusResponse.message
    });

    if (statusResponse.success && statusResponse.data?.state === 'COMPLETED') {
      // Payment completed successfully
      console.log('[PhonePe Verification] Payment completed successfully, updating status...');
      
      serviceCharge.phonePeTransactionId = statusResponse.data.transactionId;
      serviceCharge.paymentStatus = 'paid';
      serviceCharge.status = 'paid';
      serviceCharge.paidAt = new Date();
      
      console.log('[PhonePe Verification] Updating payment status to paid:', {
        serviceChargeId: serviceCharge._id,
        merchantTransactionId: merchantTransactionId,
        transactionId: statusResponse.data.transactionId
      });
      
      await serviceCharge.save();

      // Generate receipt PDF
      let receiptPath: string | null = null;
      try {
        console.log('[PhonePe Verification] Generating receipt...');
        receiptPath = await serviceChargeReceiptService.generateReceipt({
          serviceCharge,
          exhibition
        });

        // Update service charge with receipt path
        serviceCharge.receiptPath = receiptPath;
        serviceCharge.receiptGenerated = true;
        await serviceCharge.save();

        console.log('[PhonePe Verification] Receipt generated successfully:', receiptPath);
      } catch (receiptError) {
        console.error('[PhonePe Verification] Receipt generation failed:', receiptError);
        // Continue without receipt - this is not a critical failure
      }

      // Send notifications
      try {
        console.log('[PhonePe Verification] Sending notifications...');
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
        console.error('[PhonePe Verification] Notification sending failed:', notificationError);
        // Continue without notifications - payment is already successful
      }

      console.log('[PhonePe Verification] Payment verified successfully:', {
        serviceChargeId: serviceCharge._id,
        receiptNumber: serviceCharge.receiptNumber,
        transactionId: statusResponse.data.transactionId,
        amount: serviceCharge.amount
      });

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          serviceChargeId: serviceCharge._id,
          receiptNumber: serviceCharge.receiptNumber,
          transactionId: statusResponse.data.transactionId,
          amount: serviceCharge.amount,
          paidAt: serviceCharge.paidAt,
          receiptGenerated: serviceCharge.receiptGenerated,
          receiptDownloadUrl: receiptPath ? `/api/public/service-charge/receipt/${serviceCharge._id}` : null,
          state: 'COMPLETED',
          code: 'PAYMENT_SUCCESS'
        }
      });
    } else if (statusResponse.data?.state === 'FAILED') {
      // Payment failed
      console.log('[PhonePe Verification] Payment failed, updating status...');
      serviceCharge.paymentStatus = 'failed';
      serviceCharge.status = 'cancelled';
      await serviceCharge.save();

      console.log('[PhonePe Verification] Payment failed:', {
        serviceChargeId: serviceCharge._id,
        merchantTransactionId: merchantTransactionId
      });

      // Notify admin about payment failure
      try {
        await serviceChargeNotificationService.notifyPaymentFailure(
          serviceCharge,
          exhibition,
          'PhonePe payment failed'
        );
      } catch (notificationError) {
        console.error('[PhonePe Verification] Failed to send failure notification:', notificationError);
      }

      return res.status(400).json({
        success: false,
        message: 'Payment failed',
        data: {
          state: 'FAILED',
          code: 'PAYMENT_ERROR',
          serviceChargeId: serviceCharge._id,
          receiptNumber: serviceCharge.receiptNumber
        }
      });
    } else if (statusResponse.data?.state === 'PENDING') {
      // Payment still pending
      console.log('[PhonePe Verification] Payment still pending:', {
        serviceChargeId: serviceCharge._id,
        merchantTransactionId: merchantTransactionId
      });

      return res.status(202).json({
        success: false,
        message: 'Payment is still being processed',
        data: {
          state: 'PENDING',
          code: 'PAYMENT_PENDING',
          serviceChargeId: serviceCharge._id,
          receiptNumber: serviceCharge.receiptNumber
        }
      });
    } else {
      // Unknown state or verification failed
      console.error('[PhonePe Verification] Unknown payment state or verification failed:', {
        success: statusResponse.success,
        state: statusResponse.data?.state,
        code: statusResponse.code,
        message: statusResponse.message
      });

      return res.status(500).json({
        success: false,
        message: statusResponse.message || 'Payment verification failed',
        data: {
          state: statusResponse.data?.state || 'UNKNOWN',
          code: statusResponse.code || 'INTERNAL_SERVER_ERROR',
          serviceChargeId: serviceCharge._id,
          receiptNumber: serviceCharge.receiptNumber
        }
      });
    }
  } catch (error) {
    console.error('[PhonePe Verification] Error verifying payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: (error as Error).message,
      data: {
        state: 'ERROR',
        code: 'INTERNAL_SERVER_ERROR'
      }
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

    console.log('[Public Service Charge] Returning service charge status:', {
      serviceChargeId: serviceCharge._id,
      receiptNumber: serviceCharge.receiptNumber,
      phonePeMerchantTransactionId: serviceCharge.phonePeMerchantTransactionId,
      phonePeOrderId: serviceCharge.phonePeOrderId,
      razorpayOrderId: serviceCharge.razorpayOrderId,
      paymentStatus: serviceCharge.paymentStatus,
      status: serviceCharge.status
    });

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
        receiptDownloadUrl: serviceCharge.receiptPath ? `/api/public/service-charge/receipt/${serviceCharge._id}` : null,
        // Include payment gateway specific fields
        phonePeMerchantTransactionId: serviceCharge.phonePeMerchantTransactionId,
        phonePeOrderId: serviceCharge.phonePeOrderId,
        phonePeTransactionId: serviceCharge.phonePeTransactionId,
        razorpayOrderId: serviceCharge.razorpayOrderId,
        razorpayPaymentId: serviceCharge.razorpayPaymentId
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