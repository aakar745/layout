const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Test WhatsApp API Integration with Document Template
 * Testing with new_perfoma template (document header + text body)
 */

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;

// Test data for the document template
const testData = {
  // Document URL for header (PDF file)
  headerDocument: process.env.BACKEND_URL ? 
    `${process.env.BACKEND_URL}/temp/perfoma-invoice.pdf` : 
    "https://tentdecorasia.com/wp-content/uploads/2025/06/invoice.pdf", // Local backend document
  // Alternative document URLs to try if local document doesn't work:
  // headerDocument: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Test PDF
  // headerDocument: "https://sample-videos.com/zip/10/pdf/SamplePDFFile_100kb.pdf", // Sample PDF
  
  // Body parameters ({{1}} to {{6}})
  customerName: "John Doe",
  eventName: "Tech Expo 2024", 
  invoiceNumber: "PI-2024-001",
  supportContact: "+91-9558422743",
  companyName: "Aakar Exhibition Pvt. Ltd.",
  downloadLink: "https://portal.aakarexhibition.com/invoice.pdf"
};

const testPhoneNumber = process.env.TEST_PHONE_NUMBER || "9924874086";

console.log('🧪 WhatsApp API Test with Document Template Started...\n');

// Add function to test document URL accessibility
async function testDocumentURL(documentUrl) {
  try {
    console.log(`🔍 Testing document URL accessibility: ${documentUrl}`);
    const response = await axios.head(documentUrl, { timeout: 5000 });
    console.log(`✅ Document URL accessible - Status: ${response.status}`);
    console.log(`📋 Content-Type: ${response.headers['content-type']}`);
    console.log(`📦 Content-Length: ${response.headers['content-length']}`);
    return true;
  } catch (error) {
    console.log(`❌ Document URL not accessible: ${error.message}`);
    return false;
  }
}

async function testWhatsAppDocumentAPI() {
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

    // Test document URL accessibility first
    console.log('📄 Testing Header Document URL...');
    const documentAccessible = await testDocumentURL(testData.headerDocument);
    if (!documentAccessible) {
      console.log('⚠️  Document URL not accessible - trying alternative...');
      testData.headerDocument = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"; // Fallback to test PDF
      await testDocumentURL(testData.headerDocument);
    }
    console.log('');

    // Debug: Show all test data values
    console.log('🔍 Debug - Test Data Values:');
    console.log('headerDocument:', testData.headerDocument);
    console.log('customerName:', testData.customerName);
    console.log('eventName:', testData.eventName);
    console.log('invoiceNumber:', testData.invoiceNumber);
    console.log('supportContact:', testData.supportContact);
    console.log('companyName:', testData.companyName);
    console.log('downloadLink:', testData.downloadLink);
    console.log('');

    // Prepare payload for document template
    const templatePayload = {
      message: "Perfoma Invoice document message",
      brodcast_service: "whatsapp_credits",
      broadcast_name: `test_document_${Date.now()}`,
      template_id: "new_perfoma", // Document template name
      schedule_date: new Date().toISOString().split('T')[0],
      schedule_time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      contacts: testPhoneNumber,
      // Header document parameter
      uploaded_image1: testData.headerDocument,                  // Document URL (uses same parameter as images)
      // Body text parameters (API maps attribute2 to {{1}}, attribute3 to {{2}}, etc.)
      attribute2: testData.customerName || "John Doe",           // {{1}} - Customer name
      attribute3: testData.eventName || "Tech Expo",             // {{2}} - Event name
      attribute4: testData.invoiceNumber || "PI-2024-001",       // {{3}} - Invoice number
      attribute5: testData.supportContact || "+91-9558422743",   // {{4}} - Support contact
      attribute6: testData.companyName || "Aakar Exhibition",    // {{5}} - Company name
      attribute7: testData.downloadLink || "https://portal.aakarexhibition.com/invoice.pdf"  // {{6}} - Download link
    };

    console.log('📤 Sending document template...');
    console.log('🔄 Template: new_perfoma');
    console.log('📄 Header Document:', templatePayload.uploaded_image1);
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

    // Send template message with header document
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

    // Check for specific document-related errors in response
    if (response.data) {
      if (response.data.error && (response.data.error.includes('document') || response.data.error.includes('pdf'))) {
        console.log('📄 ⚠️  Document-related error detected in response!');
      }
      if (response.data.message && response.data.message.includes('media')) {
        console.log('📄 ⚠️  Media-related message in response!');
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
          
          // Check for document-related issues in status
          if (statusResponse.data && statusResponse.data.status) {
            const status = JSON.stringify(statusResponse.data.status).toLowerCase();
            if (status.includes('document') || status.includes('pdf') || status.includes('attachment')) {
              console.log('📄 ⚠️  Possible document/PDF issue detected in status!');
            }
          }
        } catch (statusError) {
          console.log('\n⚠️  Status check failed:', statusError.message);
        }
      }, 5000);
    }

    console.log('\n🎉 Test completed successfully!');
    console.log('Check your WhatsApp for the Perfoma Invoice message with document attachment.');
    console.log('\n📱 Expected message structure:');
    console.log('📄 Header: PDF Document attachment');
    console.log(`📝 Body: Dear ${testData.customerName}`);
    console.log(`       Thank you for confirming your participation in ${testData.eventName}`);
    console.log(`       Invoice Number: ${testData.invoiceNumber}`);
    console.log(`       Support Contact Number: ${testData.supportContact}`);
    console.log(`       Your Company Name: ${testData.companyName}`);
    console.log(`       Download PI: ${testData.downloadLink}`);
    console.log('       Attached herewith is your PI, expecting your payment in two working days.');
    console.log('       (Attach PI of the client)');
    console.log('📋 Footer: Aakar Exhibition Pvt. Ltd.');
    console.log('\n🔧 Troubleshooting Notes:');
    console.log('- If no document: Check if template actually supports document headers');
    console.log('- If document fails: Try different PDF URLs or check file accessibility');
    console.log('- Document must be publicly accessible via HTTPS');
    console.log('- Supported formats: .pdf, .jpg, .png, .mp3, .mp4');
    console.log('- PDF size should be reasonable (under 5MB recommended)');

  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
      
      // Check for document-related errors
      const responseStr = JSON.stringify(error.response.data).toLowerCase();
      if (responseStr.includes('document') || responseStr.includes('pdf') || responseStr.includes('upload')) {
        console.log('\n📄 ⚠️  This appears to be a document/PDF related error!');
        console.log('Possible solutions:');
        console.log('1. Use a different PDF URL');
        console.log('2. Upload PDF to provider servers first');
        console.log('3. Check if PDF URL is publicly accessible');
        console.log('4. Verify PDF format and size are supported');
        console.log('5. Ensure PDF is not password protected');
      }
    }
  }
}

// Test different scenarios with document template
async function runDocumentTests() {
  console.log('🧪 Starting WhatsApp API tests with document template (PDF header + text body)...\n');
  
  await testWhatsAppDocumentAPI();
  
  console.log('\n📋 Test Summary:');
  console.log('1. ✅ Environment variables check');
  console.log('2. ✅ API connection test');
  console.log('3. ✅ Document template message test');
  console.log('4. ✅ Status reporting test');
  console.log('\n🎯 Template Details:');
  console.log('- Template Name: new_perfoma');
  console.log('- Header: Document component (PDF)');
  console.log('- Body: 6 parameters (customer, event, invoice, support, company, download)');
  console.log('- Footer: Static text "Aakar Exhibition Pvt. Ltd."');
  console.log('- Purpose: Send Perfoma Invoice documents');
  console.log('\n📱 Next Steps:');
  console.log('- Check your WhatsApp for the Perfoma Invoice message');
  console.log('- Verify both PDF document and text message are received');
  console.log('- Test with your actual PDF files once working');
  console.log('- If failed, check the error messages above');
}

// Run the test
runDocumentTests(); 