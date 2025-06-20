const axios = require('axios');
require('dotenv').config();

const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;

async function checkMessageStatus(requestId) {
  try {
    console.log(`🔍 Checking status for Request ID: ${requestId}...\n`);
    
    const response = await axios.get(
      `https://goshort.in/api/broadcast_status.php?request_id=${requestId}`,
      {
        headers: {
          'Authorization': WHATSAPP_API_TOKEN
        }
      }
    );
    
    console.log('✅ Status Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.length > 0) {
      const status = response.data[0].status;
      console.log(`\n📊 Message Status: ${status}`);
      
      // Explain common status codes
      const statusExplanations = {
        'PP1': 'Pending Processing - Stage 1',
        '59b': 'Message queued for delivery',
        'delivered': 'Successfully delivered',
        'read': 'Message read by recipient',
        'failed': 'Delivery failed',
        'sent': 'Message sent successfully'
      };
      
      if (statusExplanations[status]) {
        console.log(`📝 Meaning: ${statusExplanations[status]}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking status:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Check the latest successful request with header_media_set
const requestIds = ['41551460']; // Real PDF + JSON + header_media_set

async function checkAllStatuses() {
  for (const id of requestIds) {
    await checkMessageStatus(id);
    console.log('\n' + '='.repeat(50) + '\n');
  }
}

checkAllStatuses(); 