import { Request, Response } from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import ServiceCharge from '../models/serviceCharge.model';
import Exhibition from '../models/exhibition.model';
import { phonePeService } from '../services/phonepe.service';
import { serviceChargeReceiptService } from '../services/serviceChargeReceipt.service';
import { serviceChargeNotificationService } from '../services/serviceChargeNotification.service';
import { paymentQueueService } from '../services/paymentQueue.service';
import { webhookDeduplicationService } from '../services/webhookDeduplication.service';

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
          // Include pricing rules for stall-based pricing
          pricingRules: exhibition.serviceChargeConfig.pricingRules,
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
  console.log('🏗️ [ORDER CREATION] ===== CREATE ORDER ENDPOINT CALLED =====');
  console.log('🏗️ [ORDER CREATION] Request Method:', req.method);
  console.log('🏗️ [ORDER CREATION] Request URL:', req.originalUrl);
  console.log('🏗️ [ORDER CREATION] Request Headers:', JSON.stringify(req.headers, null, 2));
  console.log('🏗️ [ORDER CREATION] Request Body:', JSON.stringify(req.body, null, 2));
  
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
    console.log('🔍 [ORDER CREATION] Finding exhibition with ID/slug:', exhibitionId);
    let exhibition;
    if (mongoose.Types.ObjectId.isValid(exhibitionId)) {
      // It's a valid ObjectId, search by _id
      console.log('🔍 [ORDER CREATION] Valid ObjectId, searching by _id');
      exhibition = await Exhibition.findOne({ 
        _id: exhibitionId,
        isActive: true
      });
    } else {
      // It's likely a slug, search by slug
      console.log('🔍 [ORDER CREATION] Not an ObjectId, searching by slug');
      exhibition = await Exhibition.findOne({ 
        slug: exhibitionId,
        isActive: true
      });
    }

    if (!exhibition) {
      console.error('❌ [ORDER CREATION] Exhibition not found!');
      console.error('❌ [ORDER CREATION] Searched for:', exhibitionId);
      return res.status(404).json({ 
        message: 'Exhibition not found or not available' 
      });
    }

    console.log('✅ [ORDER CREATION] Exhibition found:', {
      id: exhibition._id,
      name: exhibition.name,
      slug: exhibition.slug,
      serviceChargeEnabled: exhibition.serviceChargeConfig?.isEnabled
    });

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
    console.log('💾 [ORDER CREATION] Creating service charge record...');
    const serviceChargeData = {
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
    };
    
    console.log('💾 [ORDER CREATION] Service charge data:', JSON.stringify(serviceChargeData, null, 2));
    
    const serviceCharge = new ServiceCharge(serviceChargeData);
    await serviceCharge.save();
    
    console.log('✅ [ORDER CREATION] Service charge saved successfully:', {
      id: serviceCharge._id,
      receiptNumber: serviceCharge.receiptNumber,
      amount: serviceCharge.amount,
      paymentGateway: serviceCharge.paymentGateway
    });

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
      console.log('📱 [ORDER CREATION] Updating service charge with PhonePe order details...');
      console.log('📱 [ORDER CREATION] PhonePe Order Response:', JSON.stringify(phonePeOrder, null, 2));
      
      serviceCharge.phonePeMerchantTransactionId = serviceCharge.receiptNumber!;
      if (phonePeOrder.data?.merchantTransactionId) {
        serviceCharge.phonePeOrderId = phonePeOrder.data.merchantTransactionId;
      }
      
      console.log('📱 [ORDER CREATION] Updating service charge fields:', {
        serviceChargeId: serviceCharge._id,
        receiptNumber: serviceCharge.receiptNumber,
        phonePeMerchantTransactionId: serviceCharge.phonePeMerchantTransactionId,
        phonePeOrderId: serviceCharge.phonePeOrderId
      });
      
      await serviceCharge.save();
      
      console.log('✅ [ORDER CREATION] Service charge updated with PhonePe details successfully');

      console.log('🎯 [ORDER CREATION] PhonePe order creation completed successfully!');
      
      const responseData = {
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
      };
      
      console.log('📤 [ORDER CREATION] Sending response to frontend:', JSON.stringify(responseData, null, 2));
      console.log('🏗️ [ORDER CREATION] ===== ORDER CREATION COMPLETED =====');
      
      return res.status(200).json(responseData);
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
 * Validate PhonePe webhook authentication
 * Implements both Basic Auth and SHA256 signature verification for 2025 compliance
 */
const validateWebhookAuthentication = (authHeader: string | undefined, requestBody: any): boolean => {
  // ✅ SECURITY FIX: Require authentication header
  if (!authHeader) {
    console.error('❌ [WEBHOOK] No authorization header provided - webhook rejected');
    return false;
  }

  // ✅ SECURITY FIX: Require environment variables (no hardcoded fallbacks)
  const webhookUsername = process.env.PHONEPE_WEBHOOK_USERNAME;
  const webhookPassword = process.env.PHONEPE_WEBHOOK_PASSWORD;
  
  if (!webhookUsername || !webhookPassword) {
    console.error('❌ [WEBHOOK] Webhook credentials not configured in environment variables');
    return false;
  }

  console.log('🔐 [WEBHOOK] Authorization header found:', authHeader.substring(0, 20) + '...');
  
  // Handle Basic Auth (legacy format)
  if (authHeader.startsWith('Basic ')) {
    console.log('🔐 [WEBHOOK] Basic Auth detected, verifying...');
    
    try {
      const [scheme, credentials] = authHeader.split(' ');
      const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');
      
      const isValidBasicAuth = username === webhookUsername && password === webhookPassword;
      
      if (!isValidBasicAuth) {
        console.error('❌ [WEBHOOK] Basic Auth validation failed:', { 
          providedUsername: username,
          expectedUsername: webhookUsername 
        });
        return false;
      }
      
      console.log('✅ [WEBHOOK] Basic Authentication successful');
      return true;
      
    } catch (error) {
      console.error('❌ [WEBHOOK] Basic Auth parsing error:', error);
      return false;
    }
  }
  
  // Handle SHA256 signature-based auth (PhonePe 2025 format)
  else {
    console.log('🔐 [WEBHOOK] SHA256 signature-based auth detected (PhonePe 2025)');
    
    try {
      // Create expected signature using SHA256(username:password)
      const expectedSignature = crypto
        .createHash('sha256')
        .update(`${webhookUsername}:${webhookPassword}`)
        .digest('hex');
      
      // Remove any 'SHA256=' prefix if present
      const providedSignature = authHeader.replace(/^SHA256=/, '').toLowerCase();
      const normalizedExpected = expectedSignature.toLowerCase();
      
      const isValidSignature = providedSignature === normalizedExpected;
      
      if (!isValidSignature) {
        console.error('❌ [WEBHOOK] SHA256 signature validation failed:', {
          providedLength: providedSignature.length,
          expectedLength: normalizedExpected.length,
          providedStart: providedSignature.substring(0, 10),
          expectedStart: normalizedExpected.substring(0, 10)
        });
        return false;
      }
      
      console.log('✅ [WEBHOOK] SHA256 signature authentication successful');
      return true;
      
    } catch (error) {
      console.error('❌ [WEBHOOK] SHA256 signature parsing error:', error);
      return false;
    }
  }
};

/**
 * Handle PhonePe payment callback
 */
export const handlePhonePeCallback = async (req: Request, res: Response) => {
  console.log('🎣 [WEBHOOK] ===== PHONEPE WEBHOOK RECEIVED =====');
  console.log('🎣 [WEBHOOK] Timestamp:', new Date().toISOString());
  console.log('🎣 [WEBHOOK] Request Method:', req.method);
  console.log('🎣 [WEBHOOK] Request URL:', req.originalUrl);
  console.log('🎣 [WEBHOOK] Request IP:', req.ip || req.connection.remoteAddress);
  
  // Declare variables in function scope for error handling
  let eventData: any;
  let deduplicationResult: any;
  
  try {
    // ✅ SECURITY FIX: Validate webhook authentication FIRST
    const authHeader = req.headers.authorization;
    const isAuthenticated = validateWebhookAuthentication(authHeader, req.body);
    
    if (!isAuthenticated) {
      console.error('❌ [WEBHOOK] Webhook authentication failed - request rejected');
      return res.status(401).json({ 
        message: 'Unauthorized',
        error: 'Webhook authentication failed'
      });
    }
    
    // Log headers only after authentication (avoid logging sensitive data from invalid requests)
    console.log('📋 [WEBHOOK] Authentication successful, processing webhook...');
    
    console.log('📥 [WEBHOOK] Raw request body:', JSON.stringify(req.body, null, 2));
    
    let decodedResponse;
    
    // Handle new PhonePe webhook format (direct JSON)
    if (req.body.type && req.body.event && req.body.payload) {
      console.log('🆕 [WEBHOOK] New PhonePe webhook format detected');
      console.log('🆕 [WEBHOOK] Event type:', req.body.type);
      console.log('🆕 [WEBHOOK] Event name:', req.body.event);
      
      // Extract data from new format
      const payload = req.body.payload;
      
      // Enhanced state handling for 2025 compliance
      const paymentState = payload.state || 'PENDING';
      let responseCode = 'PENDING';
      
      if (paymentState === 'COMPLETED') {
        responseCode = 'SUCCESS';
      } else if (paymentState === 'FAILED') {
        responseCode = 'FAILED';
      } else if (['PENDING', 'INITIATED', 'PROCESSING'].includes(paymentState)) {
        responseCode = 'PENDING';
      } else {
        responseCode = 'UNKNOWN';
      }
      
      decodedResponse = {
        merchantTransactionId: payload.merchantOrderId,
        transactionId: payload.paymentDetails?.[0]?.transactionId || payload.orderId,
        amount: payload.amount,
        state: paymentState,
        responseCode: responseCode
      };
      
      console.log('✅ [WEBHOOK] Converted new format to internal format:', JSON.stringify(decodedResponse, null, 2));
    }
    // Handle old PhonePe webhook format (base64 encoded)
    else if (req.body.response) {
      console.log('🔓 [WEBHOOK] Old PhonePe webhook format detected, decoding base64...');
      
      const response = req.body.response;
      console.log('🔓 [WEBHOOK] Base64 response length:', response.length);
      console.log('🔓 [WEBHOOK] Base64 response (first 100 chars):', response.substring(0, 100));

      try {
        const decodedString = Buffer.from(response, 'base64').toString();
        console.log('🔓 [WEBHOOK] Decoded string:', decodedString);
        
        decodedResponse = JSON.parse(decodedString);
        console.log('✅ [WEBHOOK] Successfully decoded old format:', JSON.stringify(decodedResponse, null, 2));
      } catch (decodeError) {
        console.error('❌ [WEBHOOK] Failed to decode response:', decodeError);
        console.error('❌ [WEBHOOK] Raw response:', response);
        return res.status(400).json({ message: 'Invalid response format' });
      }
    }
    // Neither format recognized
    else {
      console.error('❌ [WEBHOOK] Unknown webhook format');
      console.error('❌ [WEBHOOK] Request body keys:', Object.keys(req.body));
      console.error('❌ [WEBHOOK] Expected either "response" field (old format) or "type/event/payload" fields (new format)');
      return res.status(400).json({ message: 'Unknown webhook format' });
    }

    const { merchantTransactionId, transactionId, amount, state, responseCode } = decodedResponse;

    console.log('🔍 [WEBHOOK] Extracted webhook data:', {
      merchantTransactionId,
      transactionId,
      amount,
      state,
      responseCode
    });

    if (!merchantTransactionId) {
      console.error('❌ [WEBHOOK] Missing merchant transaction ID in decoded response');
      console.error('❌ [WEBHOOK] Available fields:', Object.keys(decodedResponse));
      return res.status(400).json({ message: 'Missing merchant transaction ID' });
    }

    // 🔒 IDEMPOTENCY CHECK: Prevent duplicate webhook processing
    console.log('🔍 [WEBHOOK] Checking for duplicate webhook events...');
    eventData = {
      merchantTransactionId,
      transactionId,
      state,
      responseCode,
      rawPayload: req.body,
      eventType: 'phonepe_callback' as const,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent']
    };
    
    deduplicationResult = await webhookDeduplicationService.checkDuplication(eventData);
    
    if (!deduplicationResult.shouldProcess) {
      console.log('🔄 [WEBHOOK] Duplicate webhook detected - skipping processing');
      console.log('🔄 [WEBHOOK] Reason:', deduplicationResult.reason);
      
      // Record the duplicate event
      await webhookDeduplicationService.recordEvent(
        eventData,
        deduplicationResult.eventId,
        'skipped'
      );
      
      // Update retry count if it's a retry
      if (deduplicationResult.existingEvent) {
        await webhookDeduplicationService.updateEventRetry(deduplicationResult.eventId);
      }
      
      return res.status(200).json({ 
        message: 'Webhook already processed',
        eventId: deduplicationResult.eventId,
        reason: deduplicationResult.reason
      });
    }
    
    console.log('✅ [WEBHOOK] New webhook event confirmed - proceeding with processing');
    console.log('✅ [WEBHOOK] Event ID:', deduplicationResult.eventId);

    console.log('🔍 [WEBHOOK] Searching for service charge with merchant transaction ID:', merchantTransactionId);
    
    // Find service charge by merchant transaction ID
    let serviceCharge = await ServiceCharge.findOne({ 
      phonePeMerchantTransactionId: merchantTransactionId 
    });

    if (!serviceCharge) {
      console.error('❌ [WEBHOOK] Service charge not found for merchant transaction ID:', merchantTransactionId);
      
      // Let's also try searching by receiptNumber as fallback
      console.log('🔍 [WEBHOOK] Trying fallback search by receiptNumber...');
      serviceCharge = await ServiceCharge.findOne({ 
        receiptNumber: merchantTransactionId 
      });
      
      if (serviceCharge) {
        console.log('✅ [WEBHOOK] Found service charge using receiptNumber fallback:', {
          id: serviceCharge._id,
          receiptNumber: serviceCharge.receiptNumber,
          phonePeMerchantTransactionId: serviceCharge.phonePeMerchantTransactionId
        });
      } else {
        console.error('❌ [WEBHOOK] No service charge found with either phonePeMerchantTransactionId or receiptNumber:', merchantTransactionId);
        return res.status(404).json({ message: 'Service charge not found' });
      }
    }
    
    console.log('✅ [WEBHOOK] Found service charge:', {
      id: serviceCharge._id,
      receiptNumber: serviceCharge.receiptNumber,
      currentPaymentStatus: serviceCharge.paymentStatus,
      currentStatus: serviceCharge.status,
      amount: serviceCharge.amount
    });

    // Update service charge with callback data
    console.log('💾 [WEBHOOK] Updating service charge with callback data...');
    console.log('💾 [WEBHOOK] Setting phonePeTransactionId to:', transactionId);
    
    serviceCharge.phonePeTransactionId = transactionId;
    
    console.log('💾 [WEBHOOK] Analyzing payment state and response code:', { state, responseCode });
    
    // Enhanced state handling for 2025 compliance - handle ALL possible states
    if (state === 'COMPLETED' && responseCode === 'SUCCESS') {
      console.log('✅ [WEBHOOK] Payment successful! Updating status to paid...');
      serviceCharge.paymentStatus = 'paid';
      serviceCharge.status = 'paid';
      serviceCharge.paidAt = new Date();
      
      console.log('✅ [WEBHOOK] Payment successful for service charge:', {
        id: serviceCharge._id,
        receiptNumber: serviceCharge.receiptNumber,
        newStatus: 'paid',
        paidAt: serviceCharge.paidAt
      });
    } else if (state === 'FAILED' && responseCode === 'FAILED') {
      console.log('❌ [WEBHOOK] Payment explicitly failed! Updating status to failed...');
      serviceCharge.paymentStatus = 'failed';
      serviceCharge.status = 'cancelled';
      
      console.log('❌ [WEBHOOK] Payment failed for service charge:', {
        id: serviceCharge._id,
        receiptNumber: serviceCharge.receiptNumber,
        state,
        responseCode,
        newStatus: 'failed'
      });
    } else if (['PENDING', 'INITIATED', 'PROCESSING'].includes(state)) {
      console.log('⏳ [WEBHOOK] Payment is pending/processing! Keeping current status...');
      // Don't update payment status for pending transactions
      // They may complete later via another webhook or sync
      
      console.log('⏳ [WEBHOOK] Payment pending for service charge:', {
        id: serviceCharge._id,
        receiptNumber: serviceCharge.receiptNumber,
        state,
        responseCode,
        currentStatus: serviceCharge.paymentStatus
      });
    } else {
      console.log('⚠️ [WEBHOOK] Unknown payment state! Logging for investigation...');
      serviceCharge.adminNotes = `Webhook received unknown state: ${state}, responseCode: ${responseCode}`;
      
      console.log('⚠️ [WEBHOOK] Unknown state for service charge:', {
        id: serviceCharge._id,
        receiptNumber: serviceCharge.receiptNumber,
        state,
        responseCode,
        currentStatus: serviceCharge.paymentStatus
      });
    }

    console.log('💾 [WEBHOOK] Saving updated service charge to database...');
    await serviceCharge.save();
    console.log('✅ [WEBHOOK] Service charge saved successfully');

          // If payment is successful, handle post-payment processing
      if (serviceCharge.paymentStatus === 'paid') {
        console.log('🎯 [WEBHOOK] Payment successful, starting post-payment processing...');
        
        try {
          const exhibition = await Exhibition.findById(serviceCharge.exhibitionId);
          
          if (exhibition) {
            console.log('📄 [WEBHOOK] Checking receipt generation status...');
            
            // 🔒 ATOMIC OPERATION: Use findOneAndUpdate to prevent race conditions
            // Only ONE webhook will successfully set receiptGenerated = true
            const updatedServiceCharge = await ServiceCharge.findOneAndUpdate(
              { 
                _id: serviceCharge._id,
                receiptGenerated: { $ne: true }  // Only if receipt not already generated
              },
              { 
                $set: { receiptGenerated: true }  // Atomic flag set
              },
              { new: true }
            );
            
            if (updatedServiceCharge) {
              console.log('🏆 [WEBHOOK] This webhook won the race - generating receipt');
              
              try {
                const receiptPath = await serviceChargeReceiptService.generateReceipt({
                  serviceCharge: updatedServiceCharge,
                  exhibition
                });

                // Update service charge with receipt path
                updatedServiceCharge.receiptPath = receiptPath;
                await updatedServiceCharge.save();

                console.log('✅ [WEBHOOK] Receipt generated successfully:', receiptPath);
                
                // Update the serviceCharge object for notification processing
                serviceCharge.receiptPath = receiptPath;
                serviceCharge.receiptGenerated = true;
                
              } catch (receiptError) {
                console.error('❌ [WEBHOOK] Receipt generation failed:', receiptError);
                
                // 🔄 ROLLBACK: Reset the flag so another webhook can try
                await ServiceCharge.findByIdAndUpdate(serviceCharge._id, {
                  $set: { receiptGenerated: false }
                });
                
                console.log('🔄 [WEBHOOK] Receipt flag reset due to generation failure');
              }
            } else {
              console.log('🏃 [WEBHOOK] Another webhook already generating receipt - skipping duplicate generation');
            }

            console.log('📧 [WEBHOOK] Processing notifications...');
            // Send notifications - EMAIL DISABLED for fast payment processing
            try {
              // Only notify admin about new payment (no email)
              await serviceChargeNotificationService.notifyNewServiceCharge(serviceCharge, exhibition);

              // REMOVED: Receipt email to vendor - no email notifications for fast processing
              console.log('✅ [WEBHOOK] Admin notifications sent (email disabled for fast processing)');
            } catch (notificationError) {
              console.error('❌ [WEBHOOK] Notification sending failed:', notificationError);
            }
          } else {
            console.error('❌ [WEBHOOK] Exhibition not found for post-processing:', serviceCharge.exhibitionId);
          }
        } catch (postProcessingError) {
          console.error('❌ [WEBHOOK] Post-payment processing failed:', postProcessingError);
        }
      } else {
        console.log('⚠️ [WEBHOOK] Payment not successful, skipping post-payment processing');
      }

      console.log('🎯 [WEBHOOK] Webhook processing completed successfully');
      
      // 📝 IDEMPOTENCY: Record successful webhook processing
      await webhookDeduplicationService.recordEvent(
        eventData,
        deduplicationResult.eventId,
        'processed',
        serviceCharge._id.toString()
      );
      
      console.log('🎣 [WEBHOOK] ===== WEBHOOK PROCESSING COMPLETE =====');
      
      return res.status(200).json({ 
        message: 'Callback processed successfully',
        serviceChargeId: serviceCharge._id,
        status: serviceCharge.paymentStatus,
        eventId: deduplicationResult.eventId
      });
  } catch (error) {
    console.error('[PhonePe Callback] Error processing callback:', error);
    
    // 📝 IDEMPOTENCY: Record failed webhook processing
    try {
      if (typeof eventData !== 'undefined' && typeof deduplicationResult !== 'undefined') {
        await webhookDeduplicationService.recordEvent(
          eventData,
          deduplicationResult.eventId,
          'failed'
        );
      }
    } catch (recordError) {
      console.error('[PhonePe Callback] Error recording failed webhook:', recordError);
    }
    
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

          // 🔒 ATOMIC OPERATION: Generate receipt if not already generated
          const updatedServiceCharge = await ServiceCharge.findOneAndUpdate(
            { 
              _id: serviceCharge._id,
              receiptGenerated: { $ne: true }  // Only if receipt not already generated
            },
            { 
              $set: { receiptGenerated: true }  // Atomic flag set
            },
            { new: true }
          );
          
          if (updatedServiceCharge) {
            console.log('🏆 [PhonePe Verify] This request won the race - generating receipt');
            
            try {
              const receiptPath = await serviceChargeReceiptService.generateReceipt({
                serviceCharge: updatedServiceCharge,
                exhibition
              });

              updatedServiceCharge.receiptPath = receiptPath;
              await updatedServiceCharge.save();

              console.log('[PhonePe Verify] Receipt generated successfully:', receiptPath);
              
              // Update the serviceCharge object for notification processing
              serviceCharge.receiptPath = receiptPath;
              serviceCharge.receiptGenerated = true;
              
            } catch (receiptError) {
              console.error('[PhonePe Verify] Receipt generation failed:', receiptError);
              
              // 🔄 ROLLBACK: Reset the flag so another request can try
              await ServiceCharge.findByIdAndUpdate(serviceCharge._id, {
                $set: { receiptGenerated: false }
              });
              
              console.log('🔄 [PhonePe Verify] Receipt flag reset due to generation failure');
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
          } else {
            console.log('🏃 [PhonePe Verify] Receipt already generated by another process - skipping');
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

/**
 * Lookup service charge by phone or stall number
 */
export const lookupServiceCharge = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;
    const { phone, stallNumber } = req.body;

    console.log('🔍 [LOOKUP] ===== SERVICE CHARGE LOOKUP =====');
    console.log('🔍 [LOOKUP] Exhibition ID:', exhibitionId);
    console.log('🔍 [LOOKUP] Phone:', phone);
    console.log('🔍 [LOOKUP] Stall Number:', stallNumber);

    // Validate input
    if (!exhibitionId || !mongoose.Types.ObjectId.isValid(exhibitionId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid exhibition ID' 
      });
    }

    if (!phone && !stallNumber) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide either phone number or stall number' 
      });
    }

    // Build search query
    const searchQuery: any = { exhibitionId };
    
    if (phone && stallNumber) {
      // If both are provided, search for either match
      // Escape special regex characters in stall number for safe regex matching
      const escapedStallNumber = stallNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      searchQuery.$or = [
        { vendorPhone: phone },
        { stallNumber: { $regex: escapedStallNumber, $options: 'i' } } // Case-insensitive partial match for stall number
      ];
      console.log('🔍 [LOOKUP] Searching by phone OR stall number (partial match)');
    } else if (phone) {
      searchQuery.vendorPhone = phone;
      console.log('🔍 [LOOKUP] Searching by phone number only');
    } else if (stallNumber) {
      // Escape special regex characters in stall number for safe regex matching
      const escapedStallNumber = stallNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      searchQuery.stallNumber = { $regex: escapedStallNumber, $options: 'i' }; // Case-insensitive partial match for stall number
      console.log('🔍 [LOOKUP] Searching by stall number only (partial match)');
    }

    console.log('🔍 [LOOKUP] Search query:', JSON.stringify(searchQuery, null, 2));

    // Find service charges
    const serviceCharges = await ServiceCharge.find(searchQuery)
      .populate('exhibitionId', 'name venue')
      .sort({ createdAt: -1 })
      .limit(10); // Limit results for safety

    console.log('🔍 [LOOKUP] Found', serviceCharges.length, 'service charges');

    if (serviceCharges.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No service charges found for the provided information'
      });
    }

    // Format results
    const results = serviceCharges.map(charge => ({
      id: charge._id,
      receiptNumber: charge.receiptNumber,
      vendorName: charge.vendorName,
      companyName: charge.companyName,
      exhibitorCompanyName: charge.exhibitorCompanyName,
      stallNumber: charge.stallNumber,
      stallArea: charge.stallArea,
      serviceType: charge.serviceType,
      amount: charge.amount,
      paymentStatus: charge.paymentStatus,
      status: charge.status,
      paidAt: charge.paidAt,
      createdAt: charge.createdAt,
      receiptGenerated: charge.receiptGenerated,
      exhibition: {
        name: (charge.exhibitionId as any).name,
        venue: (charge.exhibitionId as any).venue
      }
    }));

    console.log('✅ [LOOKUP] Returning', results.length, 'formatted results');

    return res.status(200).json({
      success: true,
      data: results,
      message: `Found ${results.length} service charge(s)`
    });

  } catch (error) {
    console.error('❌ [LOOKUP] Error looking up service charge:', error);
    return res.status(500).json({
      success: false,
      message: 'Error looking up service charge',
      error: (error as Error).message
    });
  }
}; 