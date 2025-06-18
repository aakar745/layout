const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test clear logs functionality
async function testClearLogs() {
  try {
    console.log('Testing Clear Logs Functionality...\n');

    // Test 1: Get current activity count
    console.log('1. Getting current activity count...');
    const activitiesResponse = await axios.get(`${API_BASE}/activities`, {
      headers: {
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE' // Replace with actual admin token
      }
    });
    console.log(`   Current total activities: ${activitiesResponse.data.pagination.total}\n`);

    // Test 2: Try to clear logs without confirmation text (should fail)
    console.log('2. Testing clear logs without proper confirmation (should fail)...');
    try {
      await axios.delete(`${API_BASE}/activities/clear`, {
        data: { confirmText: 'wrong text' },
        headers: {
          'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE'
        }
      });
      console.log('   ERROR: This should have failed!');
    } catch (error) {
      console.log(`   ✓ Correctly failed: ${error.response?.data?.message}\n`);
    }

    // Test 3: Try to clear logs with correct confirmation text
    console.log('3. Testing clear logs with correct confirmation...');
    console.log('   WARNING: This will actually clear all logs!');
    console.log('   Uncomment the code below to test (be careful!)');
    
    /*
    const clearResponse = await axios.delete(`${API_BASE}/activities/clear`, {
      data: { confirmText: 'CLEAR ALL LOGS' },
      headers: {
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE'
      }
    });
    console.log(`   ✓ Logs cleared: ${clearResponse.data.message}`);
    console.log(`   ✓ Deleted count: ${clearResponse.data.deletedCount}`);
    */

    // Test 4: Test with date filter (safer option)
    console.log('4. Testing clear logs with date filter (safer)...');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    console.log('   This would clear logs older than 30 days');
    console.log('   Uncomment the code below to test:');
    
    /*
    const clearOldResponse = await axios.delete(`${API_BASE}/activities/clear`, {
      data: { 
        confirmText: 'CLEAR ALL LOGS',
        beforeDate: thirtyDaysAgo.toISOString()
      },
      headers: {
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE'
      }
    });
    console.log(`   ✓ Old logs cleared: ${clearOldResponse.data.message}`);
    */

    console.log('\nAll tests completed!');

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

// Instructions
console.log('Clear Logs Test Script');
console.log('=====================');
console.log('1. Make sure the backend server is running on port 5000');
console.log('2. Replace YOUR_ADMIN_TOKEN_HERE with a valid admin token');
console.log('3. Be VERY careful with the actual clear operations!');
console.log('4. Run: node test-clear-logs.js');
console.log('');

// Uncomment the line below to run the test
// testClearLogs(); 