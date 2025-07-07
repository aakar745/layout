const fs = require('fs');
const path = require('path');

/**
 * Quick PhonePe Development Mode Setup
 * Run this to temporarily switch to development mode for testing
 */

console.log('🔧 Setting up PhonePe Development Mode...');

const envPath = path.join(__dirname, '.env');
const envContent = `
# PhonePe Development Configuration (Temporary)
PHONEPE_CLIENT_ID=phonepe_test_development_mode
PHONEPE_CLIENT_SECRET=test_secret
PHONEPE_CLIENT_VERSION=1
PHONEPE_ENV=SANDBOX
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Add your other environment variables here...
`;

try {
  // Check if .env exists
  if (fs.existsSync(envPath)) {
    // Backup existing .env
    const backupPath = path.join(__dirname, '.env.backup');
    fs.copyFileSync(envPath, backupPath);
    console.log('✅ Backed up existing .env to .env.backup');
  }

  // Write development configuration
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated .env with development configuration');
  console.log('');
  console.log('📋 Development Mode Setup Complete!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Restart your backend server: npm run dev');
  console.log('2. Test service charge payment (it will be simulated)');
  console.log('3. When ready for production, restore your production keys');
  console.log('');
  console.log('⚠️  Note: This is for testing only - no real payments will be processed');

} catch (error) {
  console.error('❌ Error setting up development mode:', error.message);
} 