/**
 * Test Development Mode
 * 
 * This script tests if development mode works correctly
 */

require('dotenv').config();

const testDevelopmentMode = () => {
  console.log('🧪 Testing Development Mode Configuration');
  console.log('='.repeat(50));

  const frontendUrl = process.env.FRONTEND_URL;
  const backendUrl = process.env.BACKEND_URL;
  const clientId = process.env.PHONEPE_CLIENT_ID;

  console.log('\n📋 Environment Check:');
  console.log(`FRONTEND_URL: ${frontendUrl || '❌ NOT SET'}`);
  console.log(`BACKEND_URL: ${backendUrl || '❌ NOT SET'}`);
  console.log(`PHONEPE_CLIENT_ID: ${clientId || '❌ NOT SET'}`);

  const isDevelopmentMode = clientId === 'phonepe_test_development_mode';

  console.log(`\n🔧 Mode: ${isDevelopmentMode ? '🧪 Development' : '🚀 Production'}`);

  if (isDevelopmentMode) {
    console.log('\n✅ Development Mode Active');
    console.log('   - Payments will be simulated');
    console.log('   - No real API calls to PhonePe');
    console.log('   - Perfect for testing payment flow');
    
    if (frontendUrl && backendUrl) {
      console.log('\n🔗 Test URLs:');
      console.log(`   Redirect URL: ${frontendUrl}/service-charge/payment-success`);
      console.log(`   Callback URL: ${backendUrl}/api/public/service-charge/phonepe-callback`);
      console.log('\n🎉 Ready for testing!');
    } else {
      console.log('\n❌ Missing URL configuration');
      console.log('   Add to .env:');
      console.log('   FRONTEND_URL=http://localhost:5173');
      console.log('   BACKEND_URL=http://localhost:5000');
    }
  } else {
    console.log('\n⚠️  Production Mode Active');
    console.log('   - Will make real API calls to PhonePe');
    console.log('   - Your merchant key needs to be activated first');
    console.log('\n💡 Recommendation: Switch to development mode for testing');
    console.log('   Set PHONEPE_CLIENT_ID=phonepe_test_development_mode');
  }

  console.log('\n📝 Complete .env Configuration for Development Mode:');
  console.log('   PHONEPE_CLIENT_ID=phonepe_test_development_mode');
  console.log('   PHONEPE_CLIENT_SECRET=test_secret');
  console.log('   PHONEPE_CLIENT_VERSION=1');
  console.log('   PHONEPE_ENV=SANDBOX');
  console.log('   FRONTEND_URL=http://localhost:5173');
  console.log('   BACKEND_URL=http://localhost:5000');

  console.log('\n🔄 After updating .env:');
  console.log('   1. Restart your backend server: npm run dev');
  console.log('   2. Test service charge payment flow');
  console.log('   3. Payment will be simulated successfully');

  console.log('\n✨ Test Complete!');
};

testDevelopmentMode(); 