const axios = require('axios');
require('dotenv').config();

const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;
const username = "aakar";

async function checkTemplates() {
  try {
    console.log('🔍 Checking available templates...\n');
    
    const response = await axios.get(
      `https://goshort.in/api/templates.php?username=${username}`,
      {
        headers: {
          'Authorization': WHATSAPP_API_TOKEN
        }
      }
    );
    
    console.log('✅ Templates Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error checking templates:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

checkTemplates(); 