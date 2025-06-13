#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.radorderpad.com/api';

// Test tokens
const ADMIN_REFERRING_TOKEN = process.env.ADMIN_REFERRING_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksIm9yZ0lkIjoxLCJyb2xlIjoiYWRtaW5fcmVmZXJyaW5nIiwiZW1haWwiOiJ0ZXN0LmFkbWluX3JlZmVycmluZ0BleGFtcGxlLmNvbSIsImlhdCI6MTc0OTgyMDEwOSwiZXhwIjoxNzQ5OTA2NTA5fQ.ttmx0GVhiqlrTBXrrsjDhs50SX6WEyRmn0ODriwLflQ';
const ADMIN_RADIOLOGY_TOKEN = process.env.ADMIN_RADIOLOGY_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsIm9yZ0lkIjoyLCJyb2xlIjoiYWRtaW5fcmFkaW9sb2d5IiwiZW1haWwiOiJ0ZXN0LmFkbWluX3JhZGlvbG9neUBleGFtcGxlLmNvbSIsImlhdCI6MTc0OTgyMDExMCwiZXhwIjoxNzQ5OTA2NTEwfQ.cH8hd3e9vGDeysgMT4orS9f1aZO8yUs2RAHjeDvJZLM';

async function testOrderStatistics() {
  console.log('\n=== Testing Order Statistics Endpoints ===\n');

  // Test 1: Get statistics as admin_referring
  console.log('1. Testing GET /api/admin/statistics/orders (admin_referring)');
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/statistics/orders`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_REFERRING_TOKEN}`
      }
    });
    console.log('✅ Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }

  // Test 2: Get statistics as admin_radiology
  console.log('\n2. Testing GET /api/admin/statistics/orders (admin_radiology)');
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/statistics/orders`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_RADIOLOGY_TOKEN}`
      }
    });
    console.log('✅ Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }

  // Test 3: Export orders as admin_referring
  console.log('\n3. Testing POST /api/admin/export/orders (admin_referring)');
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/export/orders`, 
      {
        status: 'all',
        limit: 10
      },
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_REFERRING_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Success: Received CSV data');
    console.log('First 500 characters:', response.data.substring(0, 500));
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }

  // Test 4: Export with date filter
  console.log('\n4. Testing POST /api/admin/export/orders with date filter');
  try {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 30); // Last 30 days
    
    const response = await axios.post(`${API_BASE_URL}/admin/export/orders`, 
      {
        dateFrom: dateFrom.toISOString().split('T')[0],
        dateTo: new Date().toISOString().split('T')[0],
        limit: 100
      },
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_RADIOLOGY_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Success: Received CSV data for date range');
    console.log('First 500 characters:', response.data.substring(0, 500));
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }

  // Test 5: Test unauthorized access
  console.log('\n5. Testing unauthorized access');
  try {
    await axios.get(`${API_BASE_URL}/admin/statistics/orders`, {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    console.log('❌ Should have failed with unauthorized');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Correctly rejected unauthorized request');
    } else {
      console.error('❌ Unexpected error:', error.response?.data || error.message);
    }
  }
}

// Run tests
testOrderStatistics().then(() => {
  console.log('\n=== Tests completed ===\n');
}).catch(error => {
  console.error('Test suite error:', error);
  process.exit(1);
});