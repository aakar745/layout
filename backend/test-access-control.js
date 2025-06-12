const API_BASE = 'http://localhost:5000/api';

// Test credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

const VIEWER_CREDENTIALS = {
  username: 'modi', // Replace with your viewer username
  password: 'modi123' // Replace with your viewer password
};

async function makeRequest(endpoint, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'GET',
    headers
  });
  
  return {
    status: response.status,
    data: await response.json()
  };
}

async function login(credentials) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  
  const data = await response.json();
  return data.token;
}

async function testAccess() {
  try {
    console.log('🧪 Testing Exhibition Access Control...\n');
    
    // Test 1: Admin access
    console.log('1️⃣  Testing Admin Access:');
    const adminToken = await login(ADMIN_CREDENTIALS);
    console.log('   ✅ Admin logged in successfully');
    
    const adminExhibitions = await makeRequest('/exhibitions', adminToken);
    console.log(`   📊 Admin sees ${adminExhibitions.data.length} exhibitions`);
    
    const adminAssignmentExhibitions = await makeRequest('/exhibitions/all-for-assignment', adminToken);
    console.log(`   🔧 Admin assignment endpoint: ${adminAssignmentExhibitions.data.length} exhibitions\n`);
    
    // Test 2: Viewer access
    console.log('2️⃣  Testing Viewer Access:');
    const viewerToken = await login(VIEWER_CREDENTIALS);
    console.log('   ✅ Viewer logged in successfully');
    
    const viewerExhibitions = await makeRequest('/exhibitions', viewerToken);
    console.log(`   📊 Viewer sees ${viewerExhibitions.data.length} exhibitions`);
    
    const viewerAssignmentAttempt = await makeRequest('/exhibitions/all-for-assignment', viewerToken);
    console.log(`   🚫 Viewer assignment endpoint: status ${viewerAssignmentAttempt.status} (should be 403)\n`);
    
    // Test 3: Show exhibition details
    if (viewerExhibitions.data.length > 0) {
      console.log('3️⃣  Exhibition Details:');
      viewerExhibitions.data.forEach((exhibition, index) => {
        console.log(`   ${index + 1}. "${exhibition.name}" (${exhibition.venue})`);
      });
    }
    
    console.log('\n✅ Access control test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAccess(); 