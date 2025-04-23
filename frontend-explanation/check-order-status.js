/**
 * Script to check the status of specific order IDs
 * 
 * This script:
 * 1. Authenticates as admin_staff
 * 2. Checks the status of specific order IDs that worked with admin endpoints
 * 3. Reports the status and other details of each order
 */

const axios = require('axios');

// --- Configuration ---
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Order IDs that worked with admin endpoints
const ORDER_IDS_TO_CHECK = [600, 601, 603, 604, 609, 612];

// Test user credentials
const TEST_USER = {
  role: 'admin_staff',
  email: 'test.admin_staff@example.com',
  password: 'password123'
};

// Function to login and get a token
async function getToken() {
  try {
    console.log(`\n🔍 Logging in as ${TEST_USER.role} (${TEST_USER.email})...`);
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.token) {
      console.log(`✅ Login successful for ${TEST_USER.role}`);
      return response.data.token;
    } else {
      console.log(`❌ Login failed for ${TEST_USER.role}: No token in response`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Login failed for ${TEST_USER.role}`);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
    return null;
  }
}

// Function to check order status
async function checkOrderStatus(orderId, token) {
  try {
    console.log(`\n🔍 Checking status of order ${orderId}...`);
    const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    console.log(`✅ Order ${orderId} found`);
    console.log('Status:', response.status);
    
    // Extract key information
    const order = response.data.order;
    const orderDetails = {
      id: order.id,
      status: order.status,
      patientId: order.patient_id,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    };
    
    console.log('Order Details:', JSON.stringify(orderDetails, null, 2));
    return orderDetails;
  } catch (error) {
    console.log(`❌ Failed to get order ${orderId}`);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
    return null;
  }
}

// Main function
async function checkOrders() {
  console.log('=== CHECKING ORDER STATUS ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('===========================\n');
  
  // Get token
  const token = await getToken();
  if (!token) {
    console.log('\n❌ Cannot proceed without authentication token. Exiting.');
    return;
  }
  
  // Check each order
  const orderDetails = [];
  for (const orderId of ORDER_IDS_TO_CHECK) {
    const details = await checkOrderStatus(orderId, token);
    if (details) {
      orderDetails.push(details);
    }
  }
  
  // Print summary
  console.log('\n=== ORDER STATUS SUMMARY ===');
  console.log(`Total orders checked: ${ORDER_IDS_TO_CHECK.length}`);
  console.log(`Orders found: ${orderDetails.length}`);
  
  // Group by status
  const statusGroups = {};
  for (const order of orderDetails) {
    if (!statusGroups[order.status]) {
      statusGroups[order.status] = [];
    }
    statusGroups[order.status].push(order.id);
  }
  
  console.log('\nOrders by status:');
  for (const [status, ids] of Object.entries(statusGroups)) {
    console.log(`- ${status}: ${ids.join(', ')}`);
  }
  
  console.log('\n=== SCRIPT COMPLETE ===');
}

// Run the script
checkOrders().catch(error => {
  console.error('\n--- UNEXPECTED SCRIPT ERROR ---');
  console.error(error);
});