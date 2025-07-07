/**
 * PhonePe API Test Script
 * 
 * This script tests the PhonePe payment gateway configuration
 * and helps verify that the credentials are properly set up.
 */

require('dotenv').config();

const testPhonePeConfiguration = () => {
  console.log('🔐 PhonePe API Configuration Test Started...\n');

  // Check environment variables
  const clientId = process.env.PHONEPE_CLIENT_ID;
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
  const clientVersion = process.env.PHONEPE_CLIENT_VERSION || '1';
  const env = process.env.PHONEPE_ENV || 'SANDBOX';

  console.log('📋 Environment Variables Check:');
  console.log(`PHONEPE_CLIENT_ID: ${clientId ? (clientId === 'phonepe_test_development_mode' ? '✅ Development Mode' : `✅ Set (${clientId.substring(0, 10)}...)`) : '❌ Not Set'}`);
  console.log(`PHONEPE_CLIENT_SECRET: ${clientSecret ? '✅ Set' : '❌ Not Set'}`);
  console.log(`PHONEPE_CLIENT_VERSION: ${clientVersion}`);
  console.log(`PHONEPE_ENV: ${env}`);

  // Determine if in development mode
  const isDevelopmentMode = clientId === 'phonepe_test_development_mode' || 
                           !clientId || 
                           !clientSecret ||
                           clientId === '' ||
                           clientSecret === '';

  console.log(`\n🔧 Configuration Status: ${isDevelopmentMode ? '🧪 Development Mode' : '🚀 Production Mode'}`);

  if (isDevelopmentMode) {
    console.log('\n✅ Running in Development Mode');
    console.log('   - Payments will be simulated');
    console.log('   - No actual API calls will be made');
    console.log('   - This is safe for testing');
  } else {
    console.log('\n⚠️  Running in Production Mode');
    console.log('   - Real API calls will be made to PhonePe');
    console.log('   - Ensure your credentials are valid');
    console.log('   - Test with small amounts first');
  }

  // Recommendations
  console.log('\n📝 Recommendations:');
  
  if (isDevelopmentMode) {
    console.log('   For Development:');
    console.log('   - Set PHONEPE_CLIENT_ID=phonepe_test_development_mode');
    console.log('   - Set PHONEPE_CLIENT_SECRET=test_secret');
    console.log('   - Set PHONEPE_ENV=SANDBOX');
  } else {
    if (!clientId || !clientSecret) {
      console.log('   ❌ Missing Configuration:');
      if (!clientId) console.log('     - Set PHONEPE_CLIENT_ID with your actual PhonePe client ID');
      if (!clientSecret) console.log('     - Set PHONEPE_CLIENT_SECRET with your actual PhonePe client secret');
    } else {
      console.log('   ✅ Configuration appears complete');
      console.log('   - Verify credentials in PhonePe Business Dashboard');
      console.log('   - Ensure webhook URLs are configured');
      console.log('   - Test with actual payment flows');
    }
  }

  console.log('\n🔗 Useful Links:');
  console.log('   - PhonePe Business Dashboard: https://www.phonepe.com/business-solutions/');
  console.log('   - PhonePe Integration Docs: https://developer.phonepe.com/');
  console.log('   - Support: Contact PhonePe Integration Team');

  console.log('\n🧪 To test the actual API integration:');
  console.log('   1. Start your backend server: npm run dev');
  console.log('   2. Create a service charge order via API');
  console.log('   3. Check the logs for detailed error messages');

  console.log('\n✨ PhonePe Configuration Test Completed!\n');
};

// Run the test
testPhonePeConfiguration(); 