/**
 * Test PhonePe Payment Flow
 * 
 * This script tests the complete PhonePe payment flow including:
 * 1. Order creation
 * 2. Payment verification 
 * 3. Status checking
 * 4. URL parameter handling
 */

const BASE_URL = 'http://localhost:5000';

// Test data - Update this exhibition ID with a real one from your database
const testData = {
  exhibitionId: '677d52a33a99aba2cbf4b3f9', // Replace with actual exhibition ID
  vendorName: 'Test Vendor PhonePe',
  companyName: 'Test Company Ltd',
  vendorPhone: '9876543210',
  vendorEmail: 'test.vendor@example.com',
  stallNumber: 'A-101',
  vendorAddress: '123 Test Street, Test City',
  serviceType: 'cleaning',
  amount: 500
};

async function testCreateOrder() {
  console.log('\n=== Testing PhonePe Order Creation ===');
  
  try {
    const response = await fetch(`${BASE_URL}/api/public/service-charge/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const data = await response.json();
    
    console.log('Create Order Response Status:', response.status);
    console.log('Create Order Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.data) {
      return {
        serviceChargeId: data.data.serviceChargeId,
        orderId: data.data.orderId,
        receiptNumber: data.data.receiptNumber,
        redirectUrl: data.data.redirectUrl
      };
    } else {
      throw new Error('Order creation failed: ' + data.message);
    }
  } catch (error) {
    console.error('Error creating order:', error.message);
    return null;
  }
}

async function testGetServiceChargeStatus(serviceChargeId) {
  console.log('\n=== Testing Service Charge Status ===');
  console.log('Service Charge ID:', serviceChargeId);
  
  try {
    const response = await fetch(`${BASE_URL}/api/public/service-charge/status/${serviceChargeId}`);
    const data = await response.json();
    
    console.log('Status Response Status:', response.status);
    console.log('Status Response:', JSON.stringify(data, null, 2));
    
    return data.data;
  } catch (error) {
    console.error('Error getting status:', error.message);
    return null;
  }
}

async function testPhonePeVerification(merchantTransactionId) {
  console.log('\n=== Testing PhonePe Payment Verification ===');
  console.log('Merchant Transaction ID:', merchantTransactionId);
  
  try {
    const response = await fetch(`${BASE_URL}/api/public/service-charge/verify-phonepe-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        merchantTransactionId: merchantTransactionId
      })
    });

    const data = await response.json();
    
    console.log('Verification Response Status:', response.status);
    console.log('Verification Response:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    return null;
  }
}

async function testPhonePeStatusAPI(merchantTransactionId) {
  console.log('\n=== Testing Direct PhonePe Status API ===');
  console.log('Merchant Transaction ID:', merchantTransactionId);
  
  try {
    const response = await fetch(`${BASE_URL}/api/phonepe/status/${merchantTransactionId}`);
    const data = await response.json();
    
    console.log('PhonePe Status API Response Status:', response.status);
    console.log('PhonePe Status API Response:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error checking PhonePe status:', error.message);
    return null;
  }
}

function generateTestPaymentResultUrl(serviceChargeId, merchantTransactionId) {
  // Simulate PhonePe redirect URL with various parameters
  const baseUrl = `http://localhost:3000/service-charge/payment-result`;
  const params = new URLSearchParams({
    serviceChargeId: serviceChargeId,
    gateway: 'phonepe',
    transactionId: merchantTransactionId, // This is what PhonePe sends
    code: 'PAYMENT_SUCCESS', // Simulated success code
    merchantId: 'TEST_MERCHANT',
    amount: '500',
    providerReferenceId: 'PP' + Date.now()
  });
  
  return `${baseUrl}?${params.toString()}`;
}

async function testCompleteFlow() {
  console.log('🚀 Starting PhonePe Payment Flow Test');
  console.log('='.repeat(50));
  
  // Step 1: Create order
  const orderData = await testCreateOrder();
  if (!orderData) {
    console.log('❌ Order creation failed - stopping test');
    return;
  }
  
  console.log('\n✅ Order created successfully');
  console.log('Service Charge ID:', orderData.serviceChargeId);
  console.log('Order ID (Merchant Transaction ID):', orderData.orderId);
  console.log('Receipt Number:', orderData.receiptNumber);
  console.log('PhonePe Redirect URL:', orderData.redirectUrl);
  
  // Step 2: Check initial status
  await testGetServiceChargeStatus(orderData.serviceChargeId);
  
  // Step 3: Test PhonePe status API
  await testPhonePeStatusAPI(orderData.orderId);
  
  // Step 4: Test payment verification with merchant transaction ID
  console.log('\n=== Testing Verification with Merchant Transaction ID ===');
  await testPhonePeVerification(orderData.orderId);
  
  // Step 5: Test verification with receipt number (fallback)
  console.log('\n=== Testing Verification with Receipt Number (Fallback) ===');
  await testPhonePeVerification(orderData.receiptNumber);
  
  // Step 6: Generate test payment result URL
  const testUrl = generateTestPaymentResultUrl(orderData.serviceChargeId, orderData.orderId);
  console.log('\n=== Test Payment Result URL ===');
  console.log('URL:', testUrl);
  console.log('This URL simulates what PhonePe would redirect to after payment');
  
  // Step 7: Parse URL parameters to show what frontend would extract
  const urlObj = new URL(testUrl);
  console.log('\n=== URL Parameters (What Frontend Extracts) ===');
  console.log('serviceChargeId:', urlObj.searchParams.get('serviceChargeId'));
  console.log('gateway:', urlObj.searchParams.get('gateway'));
  console.log('transactionId (from PhonePe):', urlObj.searchParams.get('transactionId'));
  console.log('code (from PhonePe):', urlObj.searchParams.get('code'));
  console.log('providerReferenceId:', urlObj.searchParams.get('providerReferenceId'));
  
  console.log('\n=== Test Summary ===');
  console.log('✅ Order Creation: Tested');
  console.log('✅ Status Checking: Tested');
  console.log('✅ PhonePe API Integration: Tested');
  console.log('✅ Payment Verification: Tested');
  console.log('✅ Fallback Logic: Tested');
  console.log('✅ URL Parameter Handling: Demonstrated');
  
  console.log('\n📝 Next Steps:');
  console.log('1. Copy the test payment result URL above');
  console.log('2. Open it in your browser to test the frontend flow');
  console.log('3. Check browser console for detailed logs');
  console.log('4. Verify that the payment verification works end-to-end');
}

async function testSingleVerification() {
  console.log('\n=== Testing Single Payment Verification ===');
  
  // You can manually set a merchant transaction ID here for testing
  const merchantTransactionId = process.argv[2];
  
  if (!merchantTransactionId) {
    console.log('Usage: node test-phonepe-payment-flow.js <merchantTransactionId>');
    console.log('Or run without arguments to test complete flow');
    return;
  }
  
  console.log('Testing verification for:', merchantTransactionId);
  await testPhonePeVerification(merchantTransactionId);
}

// Run tests
if (process.argv.length > 2) {
  testSingleVerification();
} else {
  testCompleteFlow();
} 