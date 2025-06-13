const axios = require('axios');

const API_BASE_URL = 'https://api.radorderpad.com/api';
const ADMIN_REFERRING_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksIm9yZ0lkIjoxLCJyb2xlIjoiYWRtaW5fcmVmZXJyaW5nIiwiZW1haWwiOiJ0ZXN0LmFkbWluX3JlZmVycmluZ0BleGFtcGxlLmNvbSIsImlhdCI6MTc0OTgyMDI2MSwiZXhwIjoxNzQ5OTA2NjYxfQ.ovCinzc0tyP04_-jQs7zh4jt68F-pD_sCWUrsyffQEg';

async function testExport() {
  console.log('Testing export endpoint at new path...\n');
  
  try {
    console.log('1. Testing POST /api/admin/export/orders with limit=1:');
    const response = await axios.post(
      `${API_BASE_URL}/admin/export/orders`, 
      { limit: 1 },
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_REFERRING_TOKEN}`,
          'Content-Type': 'application/json'
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        validateStatus: () => true // Don't throw on any status
      }
    );
    
    console.log('Status:', response.status);
    console.log('Headers Content-Type:', response.headers['content-type']);
    
    if (response.status === 200) {
      console.log('✅ Success!');
      console.log('Data type:', typeof response.data);
      console.log('First 300 chars:', response.data.substring(0, 300));
    } else {
      console.log('❌ Failed with status:', response.status);
      console.log('Response:', response.data);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    if (error.code) console.error('Error code:', error.code);
  }
}

testExport();