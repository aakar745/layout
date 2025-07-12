/**
 * Test script to verify that concurrent service charge submissions don't cause race conditions
 * This simulates 100 concurrent users submitting service charge forms
 */

const mongoose = require('mongoose');
const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000';
const CONCURRENT_USERS = 100;
const EXHIBITION_ID = 'your-exhibition-id-here'; // Replace with actual exhibition ID

// Mock data for testing
const generateMockServiceCharge = (index) => ({
  exhibitionId: EXHIBITION_ID,
  vendorName: `Vendor ${index}`,
  vendorPhone: `98765${String(index).padStart(5, '0')}`,
  companyName: `Company ${index}`,
  exhibitorCompanyName: `Exhibitor ${index}`,
  stallNumber: `A${index}`,
  stallArea: 50 + (index % 100),
  serviceType: 'Positioning',
  amount: 1000 + (index * 10),
  uploadedImage: null
});

// Test function to submit service charge
async function submitServiceCharge(index) {
  const startTime = Date.now();
  
  try {
    console.log(`[${index}] Starting service charge submission...`);
    
    const mockData = generateMockServiceCharge(index);
    
    const response = await axios.post(`${BASE_URL}/api/public/service-charge/create`, mockData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (response.data.success) {
      console.log(`[${index}] ✅ SUCCESS - Receipt: ${response.data.data.receiptNumber} (${duration}ms)`);
      return {
        success: true,
        index,
        receiptNumber: response.data.data.receiptNumber,
        duration,
        orderId: response.data.data.orderId
      };
    } else {
      console.log(`[${index}] ❌ FAILED - ${response.data.message}`);
      return {
        success: false,
        index,
        error: response.data.message,
        duration
      };
    }
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`[${index}] ❌ ERROR - ${error.response?.data?.message || error.message} (${duration}ms)`);
    return {
      success: false,
      index,
      error: error.response?.data?.message || error.message,
      duration
    };
  }
}

// Main test function
async function runConcurrentTest() {
  console.log('🚀 Starting concurrent payment test...');
  console.log(`📊 Simulating ${CONCURRENT_USERS} concurrent users`);
  console.log(`🎯 Target URL: ${BASE_URL}`);
  console.log('─'.repeat(80));
  
  const startTime = Date.now();
  
  // Create array of promises for concurrent execution
  const promises = [];
  for (let i = 1; i <= CONCURRENT_USERS; i++) {
    promises.push(submitServiceCharge(i));
  }
  
  // Wait for all requests to complete
  console.log('⏳ Waiting for all requests to complete...');
  const results = await Promise.all(promises);
  
  const endTime = Date.now();
  const totalDuration = endTime - startTime;
  
  // Analyze results
  console.log('\n' + '='.repeat(80));
  console.log('📈 TEST RESULTS ANALYSIS');
  console.log('='.repeat(80));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful submissions: ${successful.length}/${CONCURRENT_USERS}`);
  console.log(`❌ Failed submissions: ${failed.length}/${CONCURRENT_USERS}`);
  console.log(`⏱️  Total test duration: ${totalDuration}ms`);
  console.log(`📊 Average response time: ${Math.round(results.reduce((sum, r) => sum + r.duration, 0) / results.length)}ms`);
  
  // Check for duplicate receipt numbers (this is the key test)
  const receiptNumbers = successful.map(r => r.receiptNumber);
  const uniqueReceipts = [...new Set(receiptNumbers)];
  
  console.log('\n🔍 RACE CONDITION TEST:');
  console.log(`📋 Total receipt numbers generated: ${receiptNumbers.length}`);
  console.log(`🔢 Unique receipt numbers: ${uniqueReceipts.length}`);
  
  if (receiptNumbers.length === uniqueReceipts.length) {
    console.log('✅ RACE CONDITION TEST PASSED - No duplicate receipt numbers!');
  } else {
    console.log('❌ RACE CONDITION TEST FAILED - Duplicate receipt numbers detected!');
    
    // Find duplicates
    const duplicates = receiptNumbers.filter((receipt, index) => 
      receiptNumbers.indexOf(receipt) !== index
    );
    console.log('🚨 Duplicate receipt numbers:', [...new Set(duplicates)]);
  }
  
  // Show failed requests details
  if (failed.length > 0) {
    console.log('\n❌ FAILED REQUESTS:');
    failed.forEach(failure => {
      console.log(`[${failure.index}] ${failure.error}`);
    });
  }
  
  // Show successful receipt numbers (first 10 and last 10)
  if (successful.length > 0) {
    console.log('\n📋 SAMPLE RECEIPT NUMBERS:');
    const sampleReceipts = successful.slice(0, 10).map(r => r.receiptNumber);
    console.log('First 10:', sampleReceipts.join(', '));
    
    if (successful.length > 10) {
      const lastReceipts = successful.slice(-10).map(r => r.receiptNumber);
      console.log('Last 10:', lastReceipts.join(', '));
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('🎯 Test completed!');
  console.log('='.repeat(80));
}

// Check counter status before and after test
async function checkCounterStatus() {
  try {
    const response = await axios.get(`${BASE_URL}/api/service-charges/counter-status`, {
      headers: {
        'Authorization': 'Bearer your-admin-token-here' // Replace with actual token
      }
    });
    
    if (response.data.success) {
      console.log('📊 Counter Status:', response.data.data);
    }
  } catch (error) {
    console.log('⚠️  Could not fetch counter status:', error.message);
  }
}

// Run the test
async function main() {
  console.log('🔧 Checking counter status before test...');
  await checkCounterStatus();
  
  console.log('\n🧪 Running concurrent payment test...');
  await runConcurrentTest();
  
  console.log('\n🔧 Checking counter status after test...');
  await checkCounterStatus();
  
  console.log('\n✨ All tests completed!');
}

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted by user');
  process.exit(0);
});

// Start the test
main().catch(error => {
  console.error('🚨 Test failed:', error);
  process.exit(1);
}); 