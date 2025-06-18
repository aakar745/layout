/**
 * Test script to verify Exhibition Status Filtering
 * 
 * This script tests that stalls from exhibitions with the following statuses
 * are NOT available for booking:
 * - Draft exhibitions
 * - Completed exhibitions  
 * - Inactive exhibitions (isActive: false)
 * 
 * Only Published + Active exhibitions should allow stall booking.
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data - you'll need to replace these with actual IDs from your database
const TEST_DATA = {
  // Replace these with actual exhibition IDs from your database
  publishedActiveExhibition: '67890abcdef123456789012', // Published + Active
  draftExhibition: '67890abcdef123456789013',           // Draft
  completedExhibition: '67890abcdef123456789014',       // Completed
  inactiveExhibition: '67890abcdef123456789015',        // Published but Inactive
  
  // Admin user credentials for testing
  adminCredentials: {
    email: 'admin@example.com',
    password: 'admin123'
  }
};

let authToken = '';

async function loginAsAdmin() {
  console.log('🔐 Logging in as admin...');
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, TEST_DATA.adminCredentials);
    authToken = response.data.token;
    console.log('✅ Admin login successful');
    return true;
  } catch (error) {
    console.error('❌ Admin login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testStallFetching(exhibitionId, exhibitionType, shouldSucceed = true) {
  console.log(`\\n📋 Testing stall fetching for ${exhibitionType} exhibition...`);
  
  try {
    const response = await axios.get(
      `${BASE_URL}/exhibitions/${exhibitionId}/stalls`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    if (shouldSucceed) {
      console.log(`✅ ${exhibitionType}: Stalls fetched successfully (${response.data.stalls?.length || 0} stalls)`);
      return true;
    } else {
      console.log(`❌ ${exhibitionType}: Should have failed but succeeded`);
      return false;
    }
  } catch (error) {
    if (!shouldSucceed) {
      console.log(`✅ ${exhibitionType}: Correctly blocked stall access (${error.response?.status}: ${error.response?.data?.message})`);
      return true;
    } else {
      console.log(`❌ ${exhibitionType}: Should have succeeded but failed (${error.response?.status}: ${error.response?.data?.message})`);
      return false;
    }
  }
}

async function testBookingCreation(exhibitionId, exhibitionType, shouldSucceed = true) {
  console.log(`\\n🎫 Testing booking creation for ${exhibitionType} exhibition...`);
  
  // Sample booking data
  const bookingData = {
    exhibitionId: exhibitionId,
    stallIds: ['67890abcdef123456789020'], // Replace with actual stall ID
    exhibitorId: '67890abcdef123456789021', // Replace with actual exhibitor ID
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    customerPhone: '1234567890',
    companyName: 'Test Company'
  };
  
  try {
    const response = await axios.post(
      `${BASE_URL}/bookings`,
      bookingData,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    if (shouldSucceed) {
      console.log(`✅ ${exhibitionType}: Booking created successfully (ID: ${response.data._id})`);
      return true;
    } else {
      console.log(`❌ ${exhibitionType}: Should have failed but succeeded`);
      return false;
    }
  } catch (error) {
    if (!shouldSucceed) {
      console.log(`✅ ${exhibitionType}: Correctly blocked booking creation (${error.response?.status}: ${error.response?.data?.message})`);
      return true;
    } else {
      console.log(`❌ ${exhibitionType}: Should have succeeded but failed (${error.response?.status}: ${error.response?.data?.message})`);
      return false;
    }
  }
}

async function testPublicAccess(exhibitionId, exhibitionType, shouldSucceed = true) {
  console.log(`\\n🌐 Testing public access for ${exhibitionType} exhibition...`);
  
  try {
    const response = await axios.get(`${BASE_URL}/public/exhibitions/${exhibitionId}`);
    
    if (shouldSucceed) {
      console.log(`✅ ${exhibitionType}: Public access allowed`);
      return true;
    } else {
      console.log(`❌ ${exhibitionType}: Should have failed but succeeded`);
      return false;
    }
  } catch (error) {
    if (!shouldSucceed) {
      console.log(`✅ ${exhibitionType}: Correctly blocked public access (${error.response?.status}: ${error.response?.data?.message})`);
      return true;
    } else {
      console.log(`❌ ${exhibitionType}: Should have succeeded but failed (${error.response?.status}: ${error.response?.data?.message})`);
      return false;
    }
  }
}

async function runAllTests() {
  console.log('🧪 Starting Exhibition Status Filtering Tests\\n');
  console.log('=' .repeat(60));
  
  // Login first
  if (!(await loginAsAdmin())) {
    console.log('❌ Cannot proceed without admin authentication');
    return;
  }
  
  let passedTests = 0;
  let totalTests = 0;
  
  // Test 1: Published + Active exhibition (should work)
  console.log('\\n📋 TESTING PUBLISHED + ACTIVE EXHIBITION');
  console.log('-'.repeat(40));
  totalTests += 3;
  if (await testStallFetching(TEST_DATA.publishedActiveExhibition, 'Published+Active', true)) passedTests++;
  if (await testBookingCreation(TEST_DATA.publishedActiveExhibition, 'Published+Active', true)) passedTests++;
  if (await testPublicAccess(TEST_DATA.publishedActiveExhibition, 'Published+Active', true)) passedTests++;
  
  // Test 2: Draft exhibition (should fail)
  console.log('\\n📋 TESTING DRAFT EXHIBITION');
  console.log('-'.repeat(40));
  totalTests += 3;
  if (await testStallFetching(TEST_DATA.draftExhibition, 'Draft', false)) passedTests++;
  if (await testBookingCreation(TEST_DATA.draftExhibition, 'Draft', false)) passedTests++;
  if (await testPublicAccess(TEST_DATA.draftExhibition, 'Draft', false)) passedTests++;
  
  // Test 3: Completed exhibition (should fail)
  console.log('\\n📋 TESTING COMPLETED EXHIBITION');
  console.log('-'.repeat(40));
  totalTests += 3;
  if (await testStallFetching(TEST_DATA.completedExhibition, 'Completed', false)) passedTests++;
  if (await testBookingCreation(TEST_DATA.completedExhibition, 'Completed', false)) passedTests++;
  if (await testPublicAccess(TEST_DATA.completedExhibition, 'Completed', false)) passedTests++;
  
  // Test 4: Inactive exhibition (should fail)
  console.log('\\n📋 TESTING INACTIVE EXHIBITION');
  console.log('-'.repeat(40));
  totalTests += 3;
  if (await testStallFetching(TEST_DATA.inactiveExhibition, 'Inactive', false)) passedTests++;
  if (await testBookingCreation(TEST_DATA.inactiveExhibition, 'Inactive', false)) passedTests++;
  if (await testPublicAccess(TEST_DATA.inactiveExhibition, 'Inactive', false)) passedTests++;
  
  // Results
  console.log('\\n' + '='.repeat(60));
  console.log('🎯 TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log('\\n🎉 ALL TESTS PASSED! Exhibition status filtering is working correctly.');
  } else {
    console.log('\\n⚠️  Some tests failed. Please review the implementation.');
  }
  
  console.log('\\n📝 WHAT WAS TESTED:');
  console.log('- ✅ Published + Active exhibitions allow stall booking');
  console.log('- ❌ Draft exhibitions block stall booking');
  console.log('- ❌ Completed exhibitions block stall booking');
  console.log('- ❌ Inactive exhibitions block stall booking');
  console.log('- ❌ Non-active exhibitions are hidden from public view');
}

// Instructions
console.log('📋 EXHIBITION STATUS FILTERING TEST');
console.log('=' .repeat(60));
console.log('📝 SETUP INSTRUCTIONS:');
console.log('1. Update TEST_DATA object with actual exhibition IDs from your database');
console.log('2. Ensure you have exhibitions with different statuses:');
console.log('   - Published + Active (isActive: true, status: "published")');
console.log('   - Draft (status: "draft")');
console.log('   - Completed (status: "completed")');
console.log('   - Inactive (isActive: false, status: "published")');
console.log('3. Update admin credentials');
console.log('4. Make sure your server is running on localhost:5000');
console.log('\\n⚠️  IMPORTANT: This script will attempt to create test bookings!');
console.log('   Make sure you have test data and are not running on production.\\n');

// Uncomment the line below to run the tests
// runAllTests().catch(console.error);

console.log('💡 To run the tests, uncomment the last line in this script.'); 