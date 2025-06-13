const axios = require('axios');

const API_BASE_URL = 'https://api.radorderpad.com/api';
const ADMIN_REFERRING_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksIm9yZ0lkIjoxLCJyb2xlIjoiYWRtaW5fcmVmZXJyaW5nIiwiZW1haWwiOiJ0ZXN0LmFkbWluX3JlZmVycmluZ0BleGFtcGxlLmNvbSIsImlhdCI6MTc0OTgyMDI2MSwiZXhwIjoxNzQ5OTA2NjYxfQ.ovCinzc0tyP04_-jQs7zh4jt68F-pD_sCWUrsyffQEg';

async function testExport() {
  console.log('Testing export with minimal parameters...\n');
  
  try {
    // Test with just limit
    console.log('1. Testing with limit=5 only:');
    const response1 = await axios.post(`${API_BASE_URL}/admin/orders/export`, 
      { limit: 5 },
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_REFERRING_TOKEN}`,
          'Content-Type': 'application/json'
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );
    console.log('✅ Success! Got response:');
    console.log('Response type:', response1.headers['content-type']);
    console.log('Response data (first 200 chars):', response1.data.substring(0, 200));
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }

  // Test with empty body
  console.log('\n2. Testing with empty body:');
  try {
    const response2 = await axios.post(`${API_BASE_URL}/admin/orders/export`, 
      {},
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_REFERRING_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Success! Got response');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testExport();