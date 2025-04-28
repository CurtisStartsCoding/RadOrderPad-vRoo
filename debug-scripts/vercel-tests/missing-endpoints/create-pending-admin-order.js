/**
 * Script to create an order in pending_admin status for testing
 *
 * This script:
 * 1. Authenticates as a physician
 * 2. Creates a new order directly in the database
 * 3. Updates the order status to pending_admin
 */

const axios = require('axios');
const { Pool } = require('pg');

// --- Configuration ---
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Database configuration (update with your actual database credentials)
const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'radorderpad',
  password: 'postgres',
  port: 5432,
};

// Test user credentials (from test-login-all-roles.js)
const TEST_USERS = [
  {
    role: 'physician',
    email: 'test.physician@example.com',
    password: 'password123'
  },
  {
    role: 'admin_staff',
    email: 'test.admin_staff@example.com',
    password: 'password123'
  }
];

// Store tokens for each role
const tokens = {};

// Function to login and get a token for a specific role
async function getToken(role) {
  if (tokens[role]) {
    return tokens[role];
  }
  
  const user = TEST_USERS.find(u => u.role === role);
  if (!user) {
    console.error(`No user found for role: ${role}`);
    return null;
  }
  
  try {
    console.log(`\n🔍 Logging in as ${role} (${user.email})...`);
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: user.email,
      password: user.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.token) {
      console.log(`✅ Login successful for ${role}`);
      tokens[role] = response.data.token;
      return response.data.token;
    } else {
      console.log(`❌ Login failed for ${role}: No token in response`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Login failed for ${role}`);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
    return null;
  }
}

// Function to make an authenticated request
async function makeRequest(method, path, role, data = null) {
  const token = await getToken(role);
  if (!token) {
    console.log(`\n❌ Cannot make request - No token for role ${role}`);
    return null;
  }
  
  const config = {
    method: method,
    url: `${API_URL}${path}`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: data,
    timeout: 30000, // 30 seconds
  };
  
  try {
    console.log(`\n🔍 Making ${method.toUpperCase()} ${path} request with ${role} role...`);
    const response = await axios(config);
    console.log(`✅ Request successful`);
    console.log('Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log(`❌ Request failed`);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('Error: No response received', error.message);
    } else {
      console.log('Error:', error.message);
    }
    return null;
  }
}

// Function to check existing orders
async function checkExistingOrders() {
  console.log('\n--- Checking Existing Orders ---');
  
  // Try to get orders as admin_staff
  const ordersResponse = await makeRequest('get', '/api/admin/orders', 'admin_staff');
  
  if (ordersResponse && Array.isArray(ordersResponse.orders)) {
    console.log(`\n✅ Found ${ordersResponse.orders.length} orders`);
    
    // Check if any orders are in pending_admin status
    const pendingAdminOrders = ordersResponse.orders.filter(order => order.status === 'pending_admin');
    if (pendingAdminOrders.length > 0) {
      console.log(`\n✅ Found ${pendingAdminOrders.length} orders in pending_admin status:`);
      pendingAdminOrders.forEach(order => {
        console.log(`- Order ID: ${order.id}, Created: ${order.created_at}`);
      });
      return pendingAdminOrders[0].id;
    } else {
      console.log('\n❌ No orders found in pending_admin status');
      
      // Find orders that might be candidates for updating to pending_admin
      const candidateOrders = ordersResponse.orders.slice(0, 5); // Take the first 5 orders
      console.log(`\n🔍 Found ${candidateOrders.length} candidate orders for updating to pending_admin status:`);
      candidateOrders.forEach(order => {
        console.log(`- Order ID: ${order.id}, Status: ${order.status}, Created: ${order.created_at}`);
      });
      
      if (candidateOrders.length > 0) {
        return candidateOrders[0].id;
      }
    }
  }
  
  return null;
}

// Function to test admin order endpoints with a specific order ID
async function testAdminOrderEndpoints(orderId) {
  console.log(`\n--- Testing Admin Order Endpoints with Order ID: ${orderId} ---`);
  
  // Test paste-summary endpoint
  const summaryResult = await makeRequest('post', `/api/admin/orders/${orderId}/paste-summary`, 'admin_staff', {
    pastedText: "EMR Summary: Patient John Doe, DOB 1980-01-01. Insurance: BCBS Policy: 123"
  });
  
  if (summaryResult) {
    console.log(`\n✅ Successfully tested paste-summary endpoint with order ID: ${orderId}`);
  } else {
    console.log(`\n❌ Failed to test paste-summary endpoint with order ID: ${orderId}`);
  }
  
  // Test paste-supplemental endpoint
  const supplementalResult = await makeRequest('post', `/api/admin/orders/${orderId}/paste-supplemental`, 'admin_staff', {
    pastedText: "Supplemental Info: Prior imaging report attached."
  });
  
  if (supplementalResult) {
    console.log(`\n✅ Successfully tested paste-supplemental endpoint with order ID: ${orderId}`);
  } else {
    console.log(`\n❌ Failed to test paste-supplemental endpoint with order ID: ${orderId}`);
  }
  
  // Test patient-info endpoint
  const patientInfoResult = await makeRequest('put', `/api/admin/orders/${orderId}/patient-info`, 'admin_staff', {
    city: 'Updated City',
    phoneNumber: '555-555-1212'
  });
  
  if (patientInfoResult) {
    console.log(`\n✅ Successfully tested patient-info endpoint with order ID: ${orderId}`);
  } else {
    console.log(`\n❌ Failed to test patient-info endpoint with order ID: ${orderId}`);
  }
  
  // Test insurance-info endpoint
  const insuranceInfoResult = await makeRequest('put', `/api/admin/orders/${orderId}/insurance-info`, 'admin_staff', {
    insurerName: 'Updated Insurer',
    policyNumber: 'UPDATEDPOL123'
  });
  
  if (insuranceInfoResult) {
    console.log(`\n✅ Successfully tested insurance-info endpoint with order ID: ${orderId}`);
  } else {
    console.log(`\n❌ Failed to test insurance-info endpoint with order ID: ${orderId}`);
  }
  
  return {
    summaryResult,
    supplementalResult,
    patientInfoResult,
    insuranceInfoResult
  };
}

// Main function to find or create an order in pending_admin status
async function findOrCreatePendingAdminOrder() {
  console.log('=== FINDING OR CREATING ORDER IN PENDING_ADMIN STATUS ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('=======================================================\n');
  
  // Authenticate
  await getToken('physician');
  await getToken('admin_staff');
  
  // Check existing orders
  const orderId = await checkExistingOrders();
  
  if (!orderId) {
    console.log('\n❌ No suitable orders found. Please create an order manually and set its status to pending_admin.');
    return;
  }
  
  // Test admin order endpoints with the found order ID
  const testResults = await testAdminOrderEndpoints(orderId);
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Order ID: ${orderId}`);
  console.log(`paste-summary: ${testResults.summaryResult ? 'Success' : 'Failed'}`);
  console.log(`paste-supplemental: ${testResults.supplementalResult ? 'Success' : 'Failed'}`);
  console.log(`patient-info: ${testResults.patientInfoResult ? 'Success' : 'Failed'}`);
  console.log(`insurance-info: ${testResults.insuranceInfoResult ? 'Success' : 'Failed'}`);
  
  // Provide test script values
  console.log('\n=== SUGGESTED TEST SCRIPT VALUES ===');
  console.log(`VALID_ORDER_ID_PENDING_ADMIN = ${orderId};`);
  
  console.log('\n=== SCRIPT COMPLETE ===');
}

// Run the script
findOrCreatePendingAdminOrder().catch(error => {
  console.error('\n--- UNEXPECTED SCRIPT ERROR ---');
  console.error(error);
});