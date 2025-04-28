/**
 * Script to test admin order endpoints directly with a range of order IDs
 * 
 * This script:
 * 1. Authenticates as admin_staff
 * 2. Tests admin order endpoints with a range of order IDs
 * 3. Reports which order IDs work with which endpoints
 */

const axios = require('axios');

// --- Configuration ---
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Range of order IDs to try
const ORDER_IDS_TO_TRY = Array.from({ length: 20 }, (_, i) => 600 + i); // Try order IDs 600-619

// Test user credentials (from test-login-all-roles.js)
const TEST_USERS = [
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
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.log(`❌ Request failed`);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
      return {
        success: false,
        status: error.response.status,
        error: error.response.data
      };
    } else if (error.request) {
      console.log('Error: No response received', error.message);
      return {
        success: false,
        error: 'No response received'
      };
    } else {
      console.log('Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Function to test paste-summary endpoint
async function testPasteSummary(orderId) {
  console.log(`\n--- Testing paste-summary with Order ID: ${orderId} ---`);
  
  return await makeRequest('post', `/api/admin/orders/${orderId}/paste-summary`, 'admin_staff', {
    pastedText: "EMR Summary: Patient John Doe, DOB 1980-01-01. Insurance: BCBS Policy: 123"
  });
}

// Function to test paste-supplemental endpoint
async function testPasteSupplemental(orderId) {
  console.log(`\n--- Testing paste-supplemental with Order ID: ${orderId} ---`);
  
  return await makeRequest('post', `/api/admin/orders/${orderId}/paste-supplemental`, 'admin_staff', {
    pastedText: "Supplemental Info: Prior imaging report attached."
  });
}

// Function to test patient-info endpoint
async function testPatientInfo(orderId) {
  console.log(`\n--- Testing patient-info with Order ID: ${orderId} ---`);
  
  return await makeRequest('put', `/api/admin/orders/${orderId}/patient-info`, 'admin_staff', {
    city: 'Updated City',
    phoneNumber: '555-555-1212'
  });
}

// Function to test insurance-info endpoint
async function testInsuranceInfo(orderId) {
  console.log(`\n--- Testing insurance-info with Order ID: ${orderId} ---`);
  
  return await makeRequest('put', `/api/admin/orders/${orderId}/insurance-info`, 'admin_staff', {
    insurerName: 'Updated Insurer',
    policyNumber: 'UPDATEDPOL123'
  });
}

// Main function to test admin order endpoints with a range of order IDs
async function testAdminEndpoints() {
  console.log('=== TESTING ADMIN ORDER ENDPOINTS ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('===================================\n');
  
  // Authenticate
  await getToken('admin_staff');
  
  // Results storage
  const results = {
    pasteSummary: [],
    pasteSupplemental: [],
    patientInfo: [],
    insuranceInfo: []
  };
  
  // Test paste-summary endpoint with all order IDs
  console.log('\n=== Testing paste-summary endpoint ===');
  for (const orderId of ORDER_IDS_TO_TRY) {
    const result = await testPasteSummary(orderId);
    results.pasteSummary.push({
      orderId,
      success: result.success,
      status: result.status,
      message: result.error?.message || 'Success'
    });
  }
  
  // Test paste-supplemental endpoint with all order IDs
  console.log('\n=== Testing paste-supplemental endpoint ===');
  for (const orderId of ORDER_IDS_TO_TRY) {
    const result = await testPasteSupplemental(orderId);
    results.pasteSupplemental.push({
      orderId,
      success: result.success,
      status: result.status,
      message: result.error?.message || 'Success'
    });
  }
  
  // Test patient-info endpoint with all order IDs
  console.log('\n=== Testing patient-info endpoint ===');
  for (const orderId of ORDER_IDS_TO_TRY) {
    const result = await testPatientInfo(orderId);
    results.patientInfo.push({
      orderId,
      success: result.success,
      status: result.status,
      message: result.error?.message || 'Success'
    });
  }
  
  // Test insurance-info endpoint with all order IDs
  console.log('\n=== Testing insurance-info endpoint ===');
  for (const orderId of ORDER_IDS_TO_TRY) {
    const result = await testInsuranceInfo(orderId);
    results.insuranceInfo.push({
      orderId,
      success: result.success,
      status: result.status,
      message: result.error?.message || 'Success'
    });
  }
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  
  // Find successful order IDs for each endpoint
  const successfulOrderIds = {
    pasteSummary: results.pasteSummary.filter(r => r.success).map(r => r.orderId),
    pasteSupplemental: results.pasteSupplemental.filter(r => r.success).map(r => r.orderId),
    patientInfo: results.patientInfo.filter(r => r.success).map(r => r.orderId),
    insuranceInfo: results.insuranceInfo.filter(r => r.success).map(r => r.orderId)
  };
  
  console.log('\nSuccessful Order IDs:');
  console.log(`paste-summary: ${successfulOrderIds.pasteSummary.join(', ') || 'None'}`);
  console.log(`paste-supplemental: ${successfulOrderIds.pasteSupplemental.join(', ') || 'None'}`);
  console.log(`patient-info: ${successfulOrderIds.patientInfo.join(', ') || 'None'}`);
  console.log(`insurance-info: ${successfulOrderIds.insuranceInfo.join(', ') || 'None'}`);
  
  // Find order IDs that work with all endpoints
  const workingWithAllEndpoints = ORDER_IDS_TO_TRY.filter(orderId => 
    successfulOrderIds.pasteSummary.includes(orderId) &&
    successfulOrderIds.pasteSupplemental.includes(orderId) &&
    successfulOrderIds.patientInfo.includes(orderId) &&
    successfulOrderIds.insuranceInfo.includes(orderId)
  );
  
  console.log(`\nOrder IDs that work with all endpoints: ${workingWithAllEndpoints.join(', ') || 'None'}`);
  
  // Provide test script values
  if (workingWithAllEndpoints.length > 0) {
    console.log('\n=== SUGGESTED TEST SCRIPT VALUES ===');
    console.log(`VALID_ORDER_ID_PENDING_ADMIN = ${workingWithAllEndpoints[0]};`);
  } else {
    console.log('\n❌ No order IDs found that work with all endpoints.');
  }
  
  console.log('\n=== SCRIPT COMPLETE ===');
}

// Run the script
testAdminEndpoints().catch(error => {
  console.error('\n--- UNEXPECTED SCRIPT ERROR ---');
  console.error(error);
});