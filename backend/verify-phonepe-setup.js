/**
 * PhonePe Setup Verification Script
 * 
 * This script helps verify and troubleshoot PhonePe configuration
 */

require('dotenv').config();

const verifyPhonePeSetup = () => {
  console.log('🔍 PhonePe Setup Verification');
  console.log('='.repeat(50));

  const clientId = process.env.PHONEPE_CLIENT_ID;
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
  const clientVersion = process.env.PHONEPE_CLIENT_VERSION || '1';
  const env = process.env.PHONEPE_ENV || 'SANDBOX';

  console.log('\n📋 Current Configuration:');
  console.log(`PHONEPE_CLIENT_ID: ${clientId || '❌ NOT SET'}`);
  console.log(`PHONEPE_CLIENT_SECRET: ${clientSecret ? '✅ SET' : '❌ NOT SET'}`);
  console.log(`PHONEPE_CLIENT_VERSION: ${clientVersion}`);
  console.log(`PHONEPE_ENV: ${env}`);

  // Check for common issues
  const issues = [];
  const suggestions = [];

  if (!clientId) {
    issues.push('❌ Client ID is not set');
    suggestions.push('Add PHONEPE_CLIENT_ID to your .env file');
  } else if (clientId.includes(' ') || clientId.startsWith(' ') || clientId.endsWith(' ')) {
    issues.push('❌ Client ID contains spaces');
    suggestions.push('Remove any spaces from PHONEPE_CLIENT_ID');
  }

  if (!clientSecret) {
    issues.push('❌ Client Secret is not set');
    suggestions.push('Add PHONEPE_CLIENT_SECRET to your .env file');
  } else if (clientSecret.includes(' ') || clientSecret.startsWith(' ') || clientSecret.endsWith(' ')) {
    issues.push('❌ Client Secret contains spaces');
    suggestions.push('Remove any spaces from PHONEPE_CLIENT_SECRET');
  }

  if (env !== 'SANDBOX' && env !== 'PRODUCTION') {
    issues.push('❌ Invalid environment');
    suggestions.push('Set PHONEPE_ENV to either SANDBOX or PRODUCTION');
  }

  console.log('\n🔍 Issues Found:');
  if (issues.length === 0) {
    console.log('✅ No configuration issues detected');
  } else {
    issues.forEach(issue => console.log(`   ${issue}`));
  }

  console.log('\n💡 Suggestions:');
  if (suggestions.length === 0 && clientId !== 'phonepe_test_development_mode') {
    console.log('✅ Configuration looks good!');
    console.log('\n📞 Next Steps with PhonePe:');
    console.log('   1. Verify your merchant account is APPROVED for API access');
    console.log('   2. Confirm your client ID is ACTIVATED for SANDBOX environment');
    console.log('   3. Check if you need to whitelist any domains/IPs');
    console.log('   4. Ask PhonePe support about any additional activation steps');
    console.log('\n🧪 Test Your Setup:');
    console.log('   Run: node test-phonepe-order.js');
  } else if (clientId === 'phonepe_test_development_mode') {
    console.log('🧪 Currently in DEVELOPMENT MODE');
    console.log('   - This will simulate payments (no real API calls)');
    console.log('   - Perfect for testing while waiting for PhonePe activation');
    console.log('   - Switch to real credentials once PhonePe confirms activation');
  } else {
    suggestions.forEach(suggestion => console.log(`   ${suggestion}`));
  }

  console.log('\n📚 Useful Information:');
  console.log('   - PhonePe Sandbox URL: https://api-preprod.phonepe.com/apis/pg-sandbox');
  console.log('   - PhonePe Production URL: https://api.phonepe.com/apis/hermes');
  console.log('   - Business Dashboard: https://www.phonepe.com/business-solutions/');
  console.log('   - Developer Docs: https://developer.phonepe.com/');

  console.log('\n🔧 Development Mode Instructions:');
  console.log('   If your credentials are not working yet, use development mode:');
  console.log('   1. Set PHONEPE_CLIENT_ID=phonepe_test_development_mode');
  console.log('   2. Set PHONEPE_CLIENT_SECRET=test_secret');
  console.log('   3. Restart your server and test');

  console.log('\n✨ Verification Complete!');
};

verifyPhonePeSetup(); 