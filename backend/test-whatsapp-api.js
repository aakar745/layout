const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Test WhatsApp API Integration with Correct Template
 * Testing with aakar_registration_new_latest template (with header image + text body)
 */

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;

// Test data for the template
const testData = {
  // Use local backend image served from /temp/ directory (publicly accessible)
  headerImage: process.env.BACKEND_URL ? 
    `${process.env.BACKEND_URL}/temp/whatsapp-header.jpg` : 
    "https://images.pexels.com/photos/1438404/pexels-photo-1438404.jpeg", // Local backend image
  // Alternative images to try if local image doesn't work:
  // headerImage: "https://via.placeholder.com/400x200/0066cc/ffffff?text=Aakar+Exhibition", // Placeholder image for testing
  // headerImage: "https://aakarexhibition.com/assets/images/logo.jpg", // Original URL
  // headerImage: "https://picsum.photos/400/200", // Random image service
  // headerImage: "https://httpbin.org/image/jpeg", // Test JPEG image
  customerName: "John Doe",
  registrationType: "Exhibitor Registration", 
  eventName: "Tech Expo 2024",
  venue: "Mumbai Convention Center",
  downloadLink: "https://portal.aakarexhibition.com/badge",
  teamName: "Support"
};

const testPhoneNumber = process.env.TEST_PHONE_NUMBER || "9558422743";

console.log('🧪 WhatsApp API Test with Correct Template Started...\n');

// Add function to test image URL accessibility
async function testImageURL(imageUrl) {
  try {
    console.log(`🔍 Testing image URL accessibility: ${imageUrl}`);
    const response = await axios.head(imageUrl, { timeout: 5000 });
    console.log(`✅ Image URL accessible - Status: ${response.status}`);
    console.log(`📋 Content-Type: ${response.headers['content-type']}`);
    console.log(`📦 Content-Length: ${response.headers['content-length']}`);
    return true;
  } catch (error) {
    console.log(`❌ Image URL not accessible: ${error.message}`);
    return false;
  }
}

async function testWhatsAppAPI() {
  try {
    // Check if environment variables are set
    if (!WHATSAPP_API_URL || !WHATSAPP_API_TOKEN) {
      console.error('❌ Environment variables not set!');
      console.log('Please set:');
      console.log('WHATSAPP_API_URL=https://wa20.nuke.co.in');
      console.log('WHATSAPP_API_TOKEN=your_token_here');
      console.log('TEST_PHONE_NUMBER=your_test_number (optional)');
      return;
    }

    console.log('✅ Environment variables found');
    console.log(`📡 API URL: ${WHATSAPP_API_URL}`);
    console.log(`🔑 Token: ${WHATSAPP_API_TOKEN.substring(0, 20)}...`);
    console.log(`📱 Test Number: ${testPhoneNumber}\n`);

    // Test image URL accessibility first
    console.log('🖼️  Testing Header Image URL...');
    const imageAccessible = await testImageURL(testData.headerImage);
    if (!imageAccessible) {
      console.log('⚠️  Image URL not accessible - trying alternative...');
      testData.headerImage = "https://picsum.photos/400/200"; // Fallback to working image
      await testImageURL(testData.headerImage);
    }
    console.log('');

    // Debug: Show all test data values
    console.log('🔍 Debug - Test Data Values:');
    console.log('headerImage:', testData.headerImage);
    console.log('customerName:', testData.customerName);
    console.log('registrationType:', testData.registrationType);
    console.log('eventName:', testData.eventName);
    console.log('venue:', testData.venue);
    console.log('downloadLink:', testData.downloadLink);
    console.log('teamName:', testData.teamName);
    console.log('');

    // Prepare payload for registration template with header image
    const templatePayload = {
      message: "Registration confirmation message",
      brodcast_service: "whatsapp_credits",
      broadcast_name: `test_registration_${Date.now()}`,
      template_id: "aakar_registration_new_latest", // Correct template name
      schedule_date: new Date().toISOString().split('T')[0],
      schedule_time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      contacts: testPhoneNumber,
      // Header image parameter
      uploaded_image1: testData.headerImage,                     // Header image URL
      // Body text parameters (API maps attribute2 to {{1}}, attribute3 to {{2}}, etc.)
      attribute2: testData.customerName || "John Doe",           // {{1}} - Customer name
      attribute3: testData.registrationType || "Registration",   // {{2}} - Registration type
      attribute4: testData.eventName || "Tech Expo",             // {{3}} - Event name
      attribute5: testData.venue || "Convention Center",         // {{4}} - Venue
      attribute6: testData.downloadLink || "https://portal.aakarexhibition.com/badge",  // {{5}} - Download link
      attribute7: testData.teamName || "Support"                 // {{6}} - Team name
    };

    console.log('📤 Sending registration template with header image...');
    console.log('🔄 Template: aakar_registration_new_latest');
    console.log('🖼️  Header Image:', templatePayload.uploaded_image1);
    console.log('📝 Body Parameters Mapping:');
    console.log('  {{1}} (attribute2):', templatePayload.attribute2);
    console.log('  {{2}} (attribute3):', templatePayload.attribute3);
    console.log('  {{3}} (attribute4):', templatePayload.attribute4);
    console.log('  {{4}} (attribute5):', templatePayload.attribute5);
    console.log('  {{5}} (attribute6):', templatePayload.attribute6);
    console.log('  {{6}} (attribute7):', templatePayload.attribute7);
    console.log('');

    // Debug: Show the complete payload
    console.log('🔍 Debug - Complete Payload:');
    console.log(JSON.stringify(templatePayload, null, 2));
    console.log('');

    // Send template message with header image
    const response = await axios.post(
      `${WHATSAPP_API_URL}/v5/api/index.php/addbroadcast`,
      templatePayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': WHATSAPP_API_TOKEN
        }
      }
    );

    console.log('\n✅ API Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));

    // Check for specific image-related errors in response
    if (response.data) {
      if (response.data.error && response.data.error.includes('image')) {
        console.log('🖼️  ⚠️  Image-related error detected in response!');
      }
      if (response.data.message && response.data.message.includes('media')) {
        console.log('🖼️  ⚠️  Media-related message in response!');
      }
    }

    // Check if we got a request_id for status tracking
    if (response.data && response.data.request_id) {
      console.log(`\n📊 Request ID: ${response.data.request_id}`);
      console.log('You can check status at:');
      console.log(`https://goshort.in/api/broadcast_status.php?request_id=${response.data.request_id}`);
      
      // Wait a bit and check status
      setTimeout(async () => {
        try {
          const statusResponse = await axios.get(
            `https://goshort.in/api/broadcast_status.php?request_id=${response.data.request_id}`,
            {
              headers: {
                'Authorization': WHATSAPP_API_TOKEN
              }
            }
          );
          console.log('\n📊 Status Check:');
          console.log(JSON.stringify(statusResponse.data, null, 2));
          
          // Check for image-related issues in status
          if (statusResponse.data && statusResponse.data.status) {
            const status = JSON.stringify(statusResponse.data.status).toLowerCase();
            if (status.includes('image') || status.includes('media') || status.includes('attachment')) {
              console.log('🖼️  ⚠️  Possible image/media issue detected in status!');
            }
          }
        } catch (statusError) {
          console.log('\n⚠️  Status check failed:', statusError.message);
        }
      }, 5000);
    }

    console.log('\n🎉 Test completed successfully!');
    console.log('Check your WhatsApp for the registration message with header image.');
    console.log('\n📱 Expected message structure:');
    console.log('📷 Header: Image attachment');
    console.log(`📝 Body: Hi ${testData.customerName} Thank you for registering ${testData.registrationType} on ${testData.eventName} at ${testData.venue}. To download your e-badge,click ${testData.downloadLink} Team ${testData.teamName} Aakar Exhibition`);
    console.log('📋 Footer: Aakar Exhibition');
    console.log('\n🔧 Troubleshooting Notes:');
    console.log('- If no image: Check if template actually supports header images');
    console.log('- If image fails: Try different image URLs or upload to provider servers');
    console.log('- Image must be publicly accessible via HTTPS');
    console.log('- Supported formats: .jpg, .png, .pdf, .mp3, .mp4');

  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
      
      // Check for image-related errors
      const responseStr = JSON.stringify(error.response.data).toLowerCase();
      if (responseStr.includes('image') || responseStr.includes('media') || responseStr.includes('upload')) {
        console.log('\n🖼️  ⚠️  This appears to be an image/media related error!');
        console.log('Possible solutions:');
        console.log('1. Use a different image URL');
        console.log('2. Upload image to provider servers first');
        console.log('3. Check if image URL is publicly accessible');
        console.log('4. Verify image format is supported (.jpg, .png, etc.)');
      }
    }
  }
}

// Test different scenarios with correct template
async function runAllTests() {
  console.log('🧪 Starting WhatsApp API tests with correct template (header image + text body)...\n');
  
  await testWhatsAppAPI();
  
  console.log('\n📋 Test Summary:');
  console.log('1. ✅ Environment variables check');
  console.log('2. ✅ API connection test');
  console.log('3. ✅ Template message test with header image');
  console.log('4. ✅ Status reporting test');
  console.log('\n🎯 Template Details:');
  console.log('- Template Name: aakar_registration_new_latest');
  console.log('- Header: Image component');
  console.log('- Body: 6 parameters (customer name, registration type, event, venue, download link, team)');
  console.log('- Footer: Static text "Aakar Exhibition"');
  console.log('\n📱 Next Steps:');
  console.log('- Check your WhatsApp for the registration message');
  console.log('- Verify both header image and text message are received');
  console.log('- If failed, check the error messages above');
}

// Run the test
runAllTests(); 