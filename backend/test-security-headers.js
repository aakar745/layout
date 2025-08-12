const axios = require('axios');

// Test configuration
const TEST_URL = process.env.TEST_URL || 'http://localhost:5000';
const PRODUCTION_URL = 'https://aakarbooking.com';

console.log('🔒 [SECURITY HEADERS TEST] ===== Security Headers Verification =====');

/**
 * Test security headers for a given URL
 */
async function testSecurityHeaders(url, description) {
  console.log(`\n🔍 [SECURITY TEST] Testing: ${description}`);
  console.log(`📍 [SECURITY TEST] URL: ${url}`);
  console.log('─'.repeat(70));
  
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      validateStatus: () => true // Accept any status code
    });
    
    console.log(`✅ [SECURITY TEST] Response Status: ${response.status}`);
    
    // Required security headers to check
    const requiredHeaders = {
      'strict-transport-security': {
        name: 'Strict-Transport-Security (HSTS)',
        description: 'Forces HTTPS connections',
        required: url.startsWith('https')
      },
      'content-security-policy': {
        name: 'Content-Security-Policy (CSP)',
        description: 'Prevents XSS and injection attacks',
        required: true
      },
      'x-frame-options': {
        name: 'X-Frame-Options',
        description: 'Prevents clickjacking attacks',
        required: true
      },
      'x-content-type-options': {
        name: 'X-Content-Type-Options',
        description: 'Prevents MIME type sniffing',
        required: true
      },
      'referrer-policy': {
        name: 'Referrer-Policy',
        description: 'Controls referrer information',
        required: true
      },
      'permissions-policy': {
        name: 'Permissions-Policy',
        description: 'Controls browser features',
        required: true
      }
    };
    
    // Additional recommended headers
    const recommendedHeaders = {
      'x-xss-protection': {
        name: 'X-XSS-Protection',
        description: 'Legacy XSS protection'
      },
      'x-dns-prefetch-control': {
        name: 'X-DNS-Prefetch-Control',
        description: 'Controls DNS prefetching'
      },
      'cross-origin-embedder-policy': {
        name: 'Cross-Origin-Embedder-Policy',
        description: 'Controls cross-origin embedding'
      },
      'cross-origin-opener-policy': {
        name: 'Cross-Origin-Opener-Policy',
        description: 'Isolates browsing context'
      }
    };
    
    let passedRequired = 0;
    let totalRequired = 0;
    let passedRecommended = 0;
    let totalRecommended = Object.keys(recommendedHeaders).length;
    
    console.log('\n📋 [REQUIRED HEADERS] Security Headers Status:');
    console.log('═'.repeat(70));
    
    // Check required headers
    for (const [headerKey, headerInfo] of Object.entries(requiredHeaders)) {
      if (headerInfo.required) {
        totalRequired++;
        const headerValue = response.headers[headerKey];
        
        if (headerValue) {
          console.log(`✅ ${headerInfo.name}: PRESENT`);
          console.log(`   📝 Value: ${headerValue}`);
          console.log(`   💡 Purpose: ${headerInfo.description}`);
          passedRequired++;
        } else {
          console.log(`❌ ${headerInfo.name}: MISSING`);
          console.log(`   💡 Purpose: ${headerInfo.description}`);
        }
        console.log('');
      }
    }
    
    console.log('\n📋 [RECOMMENDED HEADERS] Additional Security Headers:');
    console.log('═'.repeat(70));
    
    // Check recommended headers
    for (const [headerKey, headerInfo] of Object.entries(recommendedHeaders)) {
      const headerValue = response.headers[headerKey];
      
      if (headerValue) {
        console.log(`✅ ${headerInfo.name}: PRESENT`);
        console.log(`   📝 Value: ${headerValue}`);
        console.log(`   💡 Purpose: ${headerInfo.description}`);
        passedRecommended++;
      } else {
        console.log(`⚠️ ${headerInfo.name}: MISSING (Optional)`);
        console.log(`   💡 Purpose: ${headerInfo.description}`);
      }
      console.log('');
    }
    
    // Security score calculation
    const requiredScore = totalRequired > 0 ? Math.round((passedRequired / totalRequired) * 100) : 100;
    const recommendedScore = totalRecommended > 0 ? Math.round((passedRecommended / totalRecommended) * 100) : 100;
    const overallScore = Math.round((requiredScore * 0.8) + (recommendedScore * 0.2));
    
    console.log('📊 [SECURITY SCORE] Security Headers Report:');
    console.log('═'.repeat(70));
    console.log(`🎯 Required Headers: ${passedRequired}/${totalRequired} (${requiredScore}%)`);
    console.log(`🎯 Recommended Headers: ${passedRecommended}/${totalRecommended} (${recommendedScore}%)`);
    console.log(`🏆 Overall Security Score: ${overallScore}%`);
    
    if (overallScore >= 90) {
      console.log('🎉 EXCELLENT: Your security headers are well configured!');
    } else if (overallScore >= 70) {
      console.log('✅ GOOD: Your security is decent, but could be improved.');
    } else if (overallScore >= 50) {
      console.log('⚠️ FAIR: Your security needs improvement.');
    } else {
      console.log('❌ POOR: Your security headers need immediate attention!');
    }
    
    return {
      url,
      status: response.status,
      requiredScore,
      recommendedScore,
      overallScore,
      passedRequired,
      totalRequired,
      passedRecommended,
      totalRecommended
    };
    
  } catch (error) {
    console.error(`❌ [SECURITY TEST] Error testing ${url}:`, error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 [SECURITY TEST] Server appears to be offline. Please start the server first.');
    } else if (error.code === 'ENOTFOUND') {
      console.error('💡 [SECURITY TEST] Domain not found. Please check the URL.');
    }
    
    return {
      url,
      error: error.message,
      status: 'ERROR'
    };
  }
}

/**
 * Run comprehensive security header tests
 */
async function runSecurityTests() {
  console.log('🚀 [SECURITY SUITE] Starting comprehensive security header tests...\n');
  
  const tests = [];
  
  // Test local development server
  if (TEST_URL.includes('localhost')) {
    console.log('🔧 [SECURITY SUITE] Testing local development server...');
    const localResult = await testSecurityHeaders(TEST_URL, 'Local Development Server');
    tests.push(localResult);
  }
  
  // Test production server
  console.log('🌐 [SECURITY SUITE] Testing production server...');
  const prodResult = await testSecurityHeaders(PRODUCTION_URL, 'Production Server');
  tests.push(prodResult);
  
  // Final summary
  console.log('\n' + '='.repeat(80));
  console.log('🎯 [FINAL REPORT] Security Headers Test Summary');
  console.log('='.repeat(80));
  
  tests.forEach((result, index) => {
    if (result.error) {
      console.log(`${index + 1}. ${result.url}: ERROR - ${result.error}`);
    } else {
      console.log(`${index + 1}. ${result.url}: ${result.overallScore}% (${result.status})`);
      console.log(`   Required: ${result.passedRequired}/${result.totalRequired} | Recommended: ${result.passedRecommended}/${result.totalRecommended}`);
    }
  });
  
  const successfulTests = tests.filter(t => !t.error);
  const avgScore = successfulTests.length > 0 
    ? Math.round(successfulTests.reduce((sum, t) => sum + t.overallScore, 0) / successfulTests.length)
    : 0;
  
  console.log('\n🏆 [FINAL REPORT] Average Security Score:', avgScore + '%');
  
  if (avgScore >= 90) {
    console.log('🎉 [FINAL REPORT] Excellent security posture! 🎊');
  } else if (avgScore >= 70) {
    console.log('✅ [FINAL REPORT] Good security, minor improvements possible.');
  } else {
    console.log('⚠️ [FINAL REPORT] Security improvements needed.');
  }
  
  console.log('='.repeat(80));
  console.log('💡 [FINAL REPORT] To improve security:');
  console.log('   1. Deploy the updated server.ts with security headers');
  console.log('   2. Ensure HTTPS is properly configured');
  console.log('   3. Test again after deployment');
  console.log('   4. Consider using securityheaders.com for external validation');
  console.log('='.repeat(80));
}

// Run tests
runSecurityTests().catch(error => {
  console.error('💥 [SECURITY SUITE] Fatal error during testing:', error);
  process.exit(1);
});
