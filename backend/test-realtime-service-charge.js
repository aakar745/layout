const crypto = require('crypto');
const axios = require('axios');
const mongoose = require('mongoose');

// Test configuration
const WEBHOOK_URL = 'http://localhost:5000/api/public/service-charge/phonepe-callback';
const TEST_USERNAME = 'aakarbooking_webhook';
const TEST_PASSWORD = 'AAKAr7896';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/exhibition_management';

console.log('🚀 [REAL-TIME TEST] ===== Service Charge Real-time Notification Test =====');

/**
 * Generate SHA256 signature for webhook authentication
 */
function generateSignature(username, password) {
  return crypto
    .createHash('sha256')
    .update(`${username}:${password}`)
    .digest('hex');
}

/**
 * Setup test data - create a service charge and exhibition
 */
async function setupTestData() {
  console.log('🔌 [SETUP] Connecting to MongoDB...');
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ [SETUP] Connected to MongoDB');
    
    // Get models
    const ServiceChargeSchema = new mongoose.Schema({}, { strict: false });
    const ServiceCharge = mongoose.model('ServiceCharge', ServiceChargeSchema, 'servicecharges');
    
    const ExhibitionSchema = new mongoose.Schema({}, { strict: false });
    const Exhibition = mongoose.model('Exhibition', ExhibitionSchema, 'exhibitions');
    
    const UserSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.model('User', UserSchema, 'users');
    
    // Get first admin user for exhibition owner
    const adminUser = await User.findOne({ role: { $in: ['admin', 'super_admin'] } });
    if (!adminUser) {
      throw new Error('No admin user found for test');
    }
    
    // Create test exhibition
    const testExhibition = new Exhibition({
      name: 'Real-time Test Exhibition',
      venue: 'Test Venue',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      description: 'Test exhibition for real-time notifications',
      createdBy: adminUser._id,
      isActive: true,
      status: 'published'
    });
    
    await testExhibition.save();
    console.log('✅ [SETUP] Test exhibition created:', testExhibition._id);
    
    // Create test service charge record
    const testMerchantTransactionId = `REALTIME_TEST_${Date.now()}`;
    
    const testServiceCharge = new ServiceCharge({
      exhibitionId: testExhibition._id,
      vendorName: 'Real-time Test Vendor',
      vendorPhone: '9876543210',
      companyName: 'Test Company Ltd',
      stallNumber: 'RT-1',
      serviceType: 'Electricity',
      amount: 1000,
      paymentGateway: 'phonepe',
      phonePeMerchantTransactionId: testMerchantTransactionId,
      phonePeTransactionId: 'TXN_REALTIME_' + Date.now(),
      paymentStatus: 'pending',
      status: 'submitted',
      receiptNumber: 'RT_' + Date.now(),
      receiptGenerated: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await testServiceCharge.save();
    
    console.log('✅ [SETUP] Test service charge created:', {
      id: testServiceCharge._id,
      merchantTransactionId: testMerchantTransactionId,
      receiptNumber: testServiceCharge.receiptNumber,
      exhibitionId: testExhibition._id,
      exhibitionOwner: adminUser._id
    });
    
    return {
      serviceCharge: testServiceCharge,
      exhibition: testExhibition,
      adminUser: adminUser,
      merchantTransactionId: testMerchantTransactionId
    };
    
  } catch (error) {
    console.error('❌ [SETUP] Error setting up test data:', error);
    throw error;
  }
}

/**
 * Send payment webhook to trigger real-time notifications
 */
async function sendPaymentWebhook(merchantTransactionId) {
  console.log('\n🎣 [WEBHOOK TEST] Sending payment webhook...');
  
  try {
    const signature = generateSignature(TEST_USERNAME, TEST_PASSWORD);
    
    const webhookPayload = {
      type: 'checkout.order.completed',
      event: 'order.completed',
      payload: {
        merchantOrderId: merchantTransactionId,
        paymentDetails: [{
          transactionId: 'TXN_REALTIME_' + Date.now(),
          amount: 100000, // ₹1000.00 in paisa
          paymentMethod: 'UPI',
          status: 'SUCCESS'
        }],
        amount: 100000,
        state: 'COMPLETED',
        timestamp: Math.floor(Date.now() / 1000)
      }
    };
    
    console.log('📤 [WEBHOOK TEST] Sending webhook payload:', JSON.stringify(webhookPayload, null, 2));
    
    const response = await axios.post(WEBHOOK_URL, webhookPayload, {
      headers: {
        'Authorization': signature,
        'Content-Type': 'application/json',
        'User-Agent': 'PhonePe-Webhook-Test/1.0'
      },
      timeout: 15000
    });
    
    console.log('✅ [WEBHOOK TEST] Webhook response status:', response.status);
    console.log('✅ [WEBHOOK TEST] Webhook response data:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200 && response.data.message) {
      console.log('🎉 [WEBHOOK TEST] Webhook processed successfully!');
      console.log('🚀 [WEBHOOK TEST] Real-time notifications should now be triggered!');
      return true;
    } else {
      console.log('❌ [WEBHOOK TEST] Unexpected webhook response');
      return false;
    }
    
  } catch (error) {
    console.error('❌ [WEBHOOK TEST] Webhook test failed:', error.message);
    
    if (error.response) {
      console.error('❌ [WEBHOOK TEST] Error Response Status:', error.response.status);
      console.error('❌ [WEBHOOK TEST] Error Response Data:', error.response.data);
    }
    
    return false;
  }
}

/**
 * Verify database updates after webhook
 */
async function verifyDatabaseUpdates(serviceChargeId) {
  console.log('\n🔍 [VERIFY] Checking database updates...');
  
  try {
    const ServiceChargeSchema = new mongoose.Schema({}, { strict: false });
    const ServiceCharge = mongoose.model('ServiceCharge', ServiceChargeSchema, 'servicecharges');
    
    // Wait a moment for processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const updatedServiceCharge = await ServiceCharge.findById(serviceChargeId);
    
    if (!updatedServiceCharge) {
      console.log('❌ [VERIFY] Service charge not found in database');
      return false;
    }
    
    console.log('✅ [VERIFY] Updated service charge:', {
      id: updatedServiceCharge._id,
      paymentStatus: updatedServiceCharge.paymentStatus,
      status: updatedServiceCharge.status,
      paidAt: updatedServiceCharge.paidAt,
      receiptGenerated: updatedServiceCharge.receiptGenerated
    });
    
    if (updatedServiceCharge.paymentStatus === 'paid') {
      console.log('🎉 [VERIFY] Payment status correctly updated to "paid"!');
      console.log('🚀 [VERIFY] Real-time notifications should have been sent!');
      return true;
    } else {
      console.log('❌ [VERIFY] Payment status not updated. Current status:', updatedServiceCharge.paymentStatus);
      return false;
    }
    
  } catch (error) {
    console.error('❌ [VERIFY] Error verifying database updates:', error);
    return false;
  }
}

/**
 * Cleanup test data
 */
async function cleanupTestData(testData) {
  console.log('\n🧹 [CLEANUP] Cleaning up test data...');
  
  try {
    const ServiceChargeSchema = new mongoose.Schema({}, { strict: false });
    const ServiceCharge = mongoose.model('ServiceCharge', ServiceChargeSchema, 'servicecharges');
    
    const ExhibitionSchema = new mongoose.Schema({}, { strict: false });
    const Exhibition = mongoose.model('Exhibition', ExhibitionSchema, 'exhibitions');
    
    if (testData.serviceCharge) {
      await ServiceCharge.findByIdAndDelete(testData.serviceCharge._id);
      console.log('✅ [CLEANUP] Test service charge deleted');
    }
    
    if (testData.exhibition) {
      await Exhibition.findByIdAndDelete(testData.exhibition._id);
      console.log('✅ [CLEANUP] Test exhibition deleted');
    }
    
    await mongoose.disconnect();
    console.log('✅ [CLEANUP] Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ [CLEANUP] Error during cleanup:', error);
  }
}

/**
 * Run complete real-time notification test
 */
async function runRealTimeTest() {
  let testData = null;
  
  try {
    console.log('🚀 [TEST SUITE] Starting real-time service charge notification test...\n');
    
    // Setup test data
    testData = await setupTestData();
    
    console.log('\n📋 [TEST SUITE] Test Setup Complete!');
    console.log('📋 [TEST SUITE] Now testing real-time notifications...');
    console.log('📋 [TEST SUITE] Open your browser to http://localhost:3000/service-charges');
    console.log('📋 [TEST SUITE] You should see the table update automatically when payment is received!');
    
    // Wait a moment for user to open browser
    console.log('\n⏳ [TEST SUITE] Waiting 10 seconds for you to open the browser...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Send payment webhook
    const webhookResult = await sendPaymentWebhook(testData.merchantTransactionId);
    
    if (webhookResult) {
      // Verify database updates
      const verifyResult = await verifyDatabaseUpdates(testData.serviceCharge._id);
      
      console.log('\n' + '='.repeat(80));
      console.log('🎯 [FINAL REPORT] Real-time Service Charge Notification Test Results');
      console.log('='.repeat(80));
      
      if (verifyResult) {
        console.log('🎉 [SUCCESS] All tests passed!');
        console.log('✅ [SUCCESS] Webhook processed successfully');
        console.log('✅ [SUCCESS] Database updated correctly');
        console.log('✅ [SUCCESS] Real-time notifications should have been sent!');
        console.log('');
        console.log('👀 [SUCCESS] Check your browser - you should have seen:');
        console.log('   1. Table row updated with payment status = "paid"');
        console.log('   2. Success message notification appeared');
        console.log('   3. Stats refreshed with new totals');
        console.log('   4. In-app notification bell updated');
      } else {
        console.log('❌ [FAILURE] Some tests failed');
        console.log('⚠️ [FAILURE] Check the logs above for details');
      }
      
      console.log('='.repeat(80));
    }
    
  } catch (error) {
    console.error('💥 [TEST SUITE] Fatal error during testing:', error);
  } finally {
    // Always cleanup
    if (testData) {
      await cleanupTestData(testData);
    }
  }
}

// Run the test
runRealTimeTest().catch(error => {
  console.error('💥 [TEST SUITE] Fatal error:', error);
  process.exit(1);
});
