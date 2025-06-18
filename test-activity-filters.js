const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test activity filtering
async function testActivityFilters() {
  try {
    console.log('Testing Activity Filters...\n');

    // Test 1: Get all activities
    console.log('1. Testing: Get all activities');
    const allActivities = await axios.get(`${API_BASE}/activities`, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
      }
    });
    console.log(`   Total activities: ${allActivities.data.pagination.total}`);
    console.log(`   Activities returned: ${allActivities.data.activities.length}\n`);

    // Test 2: Filter by action
    console.log('2. Testing: Filter by action (user_login)');
    const loginActivities = await axios.get(`${API_BASE}/activities?action=user_login`, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
      }
    });
    console.log(`   Login activities: ${loginActivities.data.pagination.total}\n`);

    // Test 3: Filter by resource
    console.log('3. Testing: Filter by resource (user)');
    const userActivities = await axios.get(`${API_BASE}/activities?resource=user`, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
      }
    });
    console.log(`   User activities: ${userActivities.data.pagination.total}\n`);

    // Test 4: Filter by success status
    console.log('4. Testing: Filter by success status (true)');
    const successActivities = await axios.get(`${API_BASE}/activities?success=true`, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
      }
    });
    console.log(`   Successful activities: ${successActivities.data.pagination.total}\n`);

    // Test 5: Search by text
    console.log('5. Testing: Search by text (login)');
    const searchActivities = await axios.get(`${API_BASE}/activities?search=login`, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
      }
    });
    console.log(`   Search results: ${searchActivities.data.pagination.total}\n`);

    // Test 6: Get available filters
    console.log('6. Testing: Get available filters');
    const filters = await axios.get(`${API_BASE}/activities/filters`, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
      }
    });
    console.log(`   Available actions: ${filters.data.actions.length}`);
    console.log(`   Available resources: ${filters.data.resources.length}`);
    console.log(`   Actions: ${filters.data.actions.join(', ')}`);
    console.log(`   Resources: ${filters.data.resources.join(', ')}\n`);

    console.log('All tests completed successfully!');

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

// Instructions
console.log('Activity Filter Test Script');
console.log('==========================');
console.log('1. Make sure the backend server is running on port 5000');
console.log('2. Replace YOUR_TOKEN_HERE with a valid admin token');
console.log('3. Run: node test-activity-filters.js');
console.log('');

// Uncomment the line below to run the test
// testActivityFilters(); 