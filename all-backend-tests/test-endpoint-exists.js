const axios = require('axios');

const API_BASE_URL = 'https://api.radorderpad.com/api';
const ADMIN_REFERRING_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksIm9yZ0lkIjoxLCJyb2xlIjoiYWRtaW5fcmVmZXJyaW5nIiwiZW1haWwiOiJ0ZXN0LmFkbWluX3JlZmVycmluZ0BleGFtcGxlLmNvbSIsImlhdCI6MTc0OTgyMDI2MSwiZXhwIjoxNzQ5OTA2NjYxfQ.ovCinzc0tyP04_-jQs7zh4jt68F-pD_sCWUrsyffQEg';

async function testEndpoints() {
  console.log('Testing if endpoints exist...\n');
  
  // Test statistics endpoint (we know this works)
  console.log('1. Testing statistics endpoint:');
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/statistics/orders`, {
      headers: { 'Authorization': `Bearer ${ADMIN_REFERRING_TOKEN}` }
    });
    console.log('✅ Statistics endpoint works');
  } catch (error) {
    console.error('❌ Statistics endpoint error:', error.response?.status, error.response?.data);
  }

  // Test export endpoint with OPTIONS request
  console.log('\n2. Testing export endpoint with OPTIONS:');
  try {
    const response = await axios.options(`${API_BASE_URL}/admin/orders/export`, {
      headers: { 'Authorization': `Bearer ${ADMIN_REFERRING_TOKEN}` }
    });
    console.log('✅ Export endpoint exists, allowed methods:', response.headers['access-control-allow-methods'] || 'No CORS headers');
  } catch (error) {
    console.error('❌ OPTIONS error:', error.response?.status);
  }

  // Test export endpoint with GET (should fail with 404 or 405)
  console.log('\n3. Testing export endpoint with GET:');
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/orders/export`, {
      headers: { 'Authorization': `Bearer ${ADMIN_REFERRING_TOKEN}` }
    });
    console.log('Response:', response.status);
  } catch (error) {
    console.error('GET error:', error.response?.status, error.response?.statusText);
    if (error.response?.status === 404) {
      console.log('❌ Endpoint not found');
    } else if (error.response?.status === 405) {
      console.log('✅ Endpoint exists but method not allowed (expected)');
    }
  }

  // Check if it's at a different path
  console.log('\n4. Testing alternate path /api/admin/export:');
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/export`, 
      { limit: 1 },
      { headers: { 'Authorization': `Bearer ${ADMIN_REFERRING_TOKEN}`, 'Content-Type': 'application/json' } }
    );
    console.log('Found at alternate path!');
  } catch (error) {
    console.error('Alternate path error:', error.response?.status);
  }
}

testEndpoints();