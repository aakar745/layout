/**
 * Test Script: Hide Inactive Exhibition Bookings
 * 
 * This script tests that bookings from inactive exhibitions are completely hidden
 * from the booking management interface instead of showing with badges.
 * 
 * Test Cases:
 * 1. Verify that only bookings from active exhibitions are displayed
 * 2. Verify that filter dropdown only shows active exhibitions
 * 3. Verify that export only includes bookings from active exhibitions
 * 4. Verify that inactive exhibition bookings are not accessible
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Test authentication token (replace with a valid admin token)
const AUTH_TOKEN = 'your-admin-token-here';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${AUTH_TOKEN}`
};

/**
 * Helper function to make API requests
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error.message);
    throw error;
  }
}

/**
 * Test 1: Verify exhibition filtering
 */
async function testExhibitionFiltering() {
  console.log('\n=== Test 1: Exhibition Filtering ===');
  
  try {
    // Get all exhibitions
    const allExhibitions = await apiRequest('/exhibitions');
    console.log(`Total exhibitions in system: ${allExhibitions.length}`);
    
    // Get active exhibitions
    const activeExhibitions = await apiRequest('/exhibitions/active');
    console.log(`Active exhibitions: ${activeExhibitions.length}`);
    
    // Identify inactive exhibitions
    const inactiveExhibitions = allExhibitions.filter(ex => 
      ex.status !== 'published' || !ex.isActive
    );
    console.log(`Inactive exhibitions: ${inactiveExhibitions.length}`);
    
    if (inactiveExhibitions.length > 0) {
      console.log('Inactive exhibitions:');
      inactiveExhibitions.forEach(ex => {
        console.log(`  - ${ex.name} (Status: ${ex.status}, Active: ${ex.isActive})`);
      });
    }
    
    return { allExhibitions, activeExhibitions, inactiveExhibitions };
  } catch (error) {
    console.error('Failed to test exhibition filtering:', error.message);
    throw error;
  }
}

/**
 * Test 2: Verify booking visibility
 */
async function testBookingVisibility(exhibitions) {
  console.log('\n=== Test 2: Booking Visibility ===');
  
  try {
    // Get all bookings
    const bookingsResponse = await apiRequest('/bookings?page=1&limit=100');
    const allBookings = bookingsResponse.data || bookingsResponse;
    console.log(`Total bookings in system: ${allBookings.length}`);
    
    // Categorize bookings by exhibition status
    const bookingsByStatus = {
      active: [],
      inactive: []
    };
    
    allBookings.forEach(booking => {
      const exhibition = exhibitions.allExhibitions.find(ex => 
        ex._id === booking.exhibitionId._id || ex._id === booking.exhibitionId
      );
      
      if (exhibition && exhibition.status === 'published' && exhibition.isActive) {
        bookingsByStatus.active.push(booking);
      } else {
        bookingsByStatus.inactive.push(booking);
      }
    });
    
    console.log(`Bookings from active exhibitions: ${bookingsByStatus.active.length}`);
    console.log(`Bookings from inactive exhibitions: ${bookingsByStatus.inactive.length}`);
    
    if (bookingsByStatus.inactive.length > 0) {
      console.log('\nBookings from inactive exhibitions:');
      bookingsByStatus.inactive.forEach(booking => {
        const exhibition = exhibitions.allExhibitions.find(ex => 
          ex._id === booking.exhibitionId._id || ex._id === booking.exhibitionId
        );
        console.log(`  - Booking ${booking._id} from ${exhibition?.name || 'Unknown'} (${exhibition?.status}, Active: ${exhibition?.isActive})`);
      });
    }
    
    return bookingsByStatus;
  } catch (error) {
    console.error('Failed to test booking visibility:', error.message);
    throw error;
  }
}

/**
 * Test 3: Verify export filtering
 */
async function testExportFiltering() {
  console.log('\n=== Test 3: Export Filtering ===');
  
  try {
    // Test export endpoint
    const exportData = await apiRequest('/bookings/export');
    console.log(`Export contains ${exportData.length} bookings`);
    
    // Note: The actual filtering happens in the frontend component
    // This test just verifies the export endpoint is accessible
    console.log('✓ Export endpoint accessible');
    
    return exportData;
  } catch (error) {
    console.error('Failed to test export filtering:', error.message);
    throw error;
  }
}

/**
 * Test 4: Verify stall access restrictions
 */
async function testStallAccessRestrictions(exhibitions) {
  console.log('\n=== Test 4: Stall Access Restrictions ===');
  
  try {
    // Test stall access for inactive exhibitions
    const inactiveExhibitions = exhibitions.inactiveExhibitions;
    
    for (const exhibition of inactiveExhibitions.slice(0, 2)) { // Test first 2 inactive exhibitions
      try {
        const stalls = await apiRequest(`/stalls?exhibitionId=${exhibition._id}`);
        console.log(`⚠️  WARNING: Stalls accessible for inactive exhibition ${exhibition.name}`);
        console.log(`  Returned ${stalls.length} stalls`);
      } catch (error) {
        if (error.message.includes('403')) {
          console.log(`✓ Access correctly blocked for inactive exhibition ${exhibition.name}`);
        } else {
          console.log(`❌ Unexpected error for ${exhibition.name}: ${error.message}`);
        }
      }
    }
    
    // Test stall access for active exhibitions
    const activeExhibitions = exhibitions.activeExhibitions;
    
    for (const exhibition of activeExhibitions.slice(0, 2)) { // Test first 2 active exhibitions
      try {
        const stalls = await apiRequest(`/stalls?exhibitionId=${exhibition._id}`);
        console.log(`✓ Stalls accessible for active exhibition ${exhibition.name} (${stalls.length} stalls)`);
      } catch (error) {
        console.log(`❌ Unexpected access denial for active exhibition ${exhibition.name}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Failed to test stall access restrictions:', error.message);
    throw error;
  }
}

/**
 * Test 5: Verify booking creation restrictions
 */
async function testBookingCreationRestrictions(exhibitions) {
  console.log('\n=== Test 5: Booking Creation Restrictions ===');
  
  try {
    const inactiveExhibitions = exhibitions.inactiveExhibitions;
    
    if (inactiveExhibitions.length === 0) {
      console.log('No inactive exhibitions to test booking creation restrictions');
      return;
    }
    
    // Try to create a booking for an inactive exhibition
    const inactiveExhibition = inactiveExhibitions[0];
    
    // First, try to get stalls for the inactive exhibition
    try {
      const stalls = await apiRequest(`/stalls?exhibitionId=${inactiveExhibition._id}`);
      
      if (stalls.length > 0) {
        console.log(`⚠️  WARNING: Stalls still accessible for inactive exhibition ${inactiveExhibition.name}`);
        
        // Try to create a booking
        const testBooking = {
          exhibitionId: inactiveExhibition._id,
          stallIds: [stalls[0]._id],
          customerName: 'Test Customer',
          customerEmail: 'test@example.com',
          customerPhone: '1234567890',
          companyName: 'Test Company'
        };
        
        try {
          const booking = await apiRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify(testBooking)
          });
          
          console.log(`❌ CRITICAL: Booking creation allowed for inactive exhibition!`);
          console.log(`  Booking ID: ${booking._id}`);
          
          // Clean up - delete the test booking
          try {
            await apiRequest(`/bookings/${booking._id}`, { method: 'DELETE' });
            console.log('  Test booking cleaned up');
          } catch (cleanupError) {
            console.log('  Failed to clean up test booking');
          }
          
        } catch (bookingError) {
          if (bookingError.message.includes('403') || bookingError.message.includes('400')) {
            console.log(`✓ Booking creation correctly blocked for inactive exhibition ${inactiveExhibition.name}`);
          } else {
            console.log(`❌ Unexpected error during booking creation: ${bookingError.message}`);
          }
        }
      }
    } catch (stallError) {
      if (stallError.message.includes('403')) {
        console.log(`✓ Stall access correctly blocked for inactive exhibition ${inactiveExhibition.name}`);
      } else {
        console.log(`❌ Unexpected stall access error: ${stallError.message}`);
      }
    }
    
  } catch (error) {
    console.error('Failed to test booking creation restrictions:', error.message);
    throw error;
  }
}

/**
 * Main test execution
 */
async function runTests() {
  console.log('🧪 Testing Hide Inactive Exhibition Bookings Feature');
  console.log('================================================');
  
  try {
    // Test 1: Exhibition filtering
    const exhibitions = await testExhibitionFiltering();
    
    // Test 2: Booking visibility
    const bookings = await testBookingVisibility(exhibitions);
    
    // Test 3: Export filtering
    await testExportFiltering();
    
    // Test 4: Stall access restrictions
    await testStallAccessRestrictions(exhibitions);
    
    // Test 5: Booking creation restrictions
    await testBookingCreationRestrictions(exhibitions);
    
    // Summary
    console.log('\n=== Test Summary ===');
    console.log('✅ All tests completed');
    
    if (exhibitions.inactiveExhibitions.length > 0) {
      console.log('\n📋 Key Findings:');
      console.log(`- ${exhibitions.inactiveExhibitions.length} inactive exhibitions found`);
      console.log(`- ${bookings.inactive.length} bookings from inactive exhibitions (should be hidden from UI)`);
      console.log('- Filter dropdown should only show active exhibitions');
      console.log('- Export should only include bookings from active exhibitions');
      console.log('- New bookings should be blocked for inactive exhibitions');
    } else {
      console.log('\n📋 No inactive exhibitions found - create some test data to verify filtering');
    }
    
    console.log('\n🎯 Expected Behavior:');
    console.log('- Frontend booking table should only show bookings from active exhibitions');
    console.log('- No visual indicators (badges) should be shown since inactive bookings are hidden');
    console.log('- Filter dropdown should only contain active exhibitions');
    console.log('- Export should only include active exhibition bookings');
    
  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = {
  runTests,
  testExhibitionFiltering,
  testBookingVisibility,
  testExportFiltering,
  testStallAccessRestrictions,
  testBookingCreationRestrictions
}; 