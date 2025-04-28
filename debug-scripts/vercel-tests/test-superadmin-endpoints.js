/**
 * Comprehensive API test script for testing all endpoints with super_admin role
 * This script tests all API endpoints with the super_admin role to ensure they're accessible
 */

const axios = require('axios');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Configuration
const API_URL = 'https://radorderpad-q20dishz7-capecomas-projects.vercel.app';
const JWT_SECRET = process.env.JWT_SECRET || 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';

// Generate a super_admin token
function generateSuperAdminToken() {
  const payload = {
    userId: 999,
    orgId: 1,
    role: 'super_admin',
    email: 'test.superadmin@example.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return jwt.sign(payload, JWT_SECRET);
}

// Create API client with authentication
function createAuthClient(token) {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function recordTestResult(name, passed, error = null, response = null) {
  if (passed) {
    testResults.passed++;
    console.log(`✅ PASSED: ${name}`);
    if (response) {
      console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
    }
  } else {
    testResults.failed++;
    console.log(`❌ FAILED: ${name}`);
    if (error) {
      console.log(`   Error: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
  }
  
  testResults.tests.push({
    name,
    passed,
    error: error ? {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    } : null,
    response: response ? {
      status: response.status,
      data: response.data
    } : null
  });
}

// Test functions
async function testHealthEndpoint(client) {
  try {
    console.log('\n🔍 Testing health endpoint...');
    const response = await client.get(`/health`);
    recordTestResult('Health Endpoint', true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult('Health Endpoint', false, error);
    return null;
  }
}

// Auth endpoints
async function testAuthEndpoints(client) {
  console.log('\n🔍 Testing auth endpoints...');
  
  // Test login endpoint (POST)
  try {
    const loginResponse = await client.post(`/api/auth/login`, {
      email: 'test.admin@example.com',
      password: 'password123'
    });
    recordTestResult('POST /api/auth/login', true, null, loginResponse);
  } catch (error) {
    recordTestResult('POST /api/auth/login', false, error);
  }
}

// Orders endpoints
async function testOrdersEndpoints(client) {
  console.log('\n🔍 Testing orders endpoints...');
  
  // Test get all orders (GET)
  try {
    const ordersResponse = await client.get(`/api/orders`);
    recordTestResult('GET /api/orders', true, null, ordersResponse);
  } catch (error) {
    recordTestResult('GET /api/orders', false, error);
  }
  
  // Test get order by ID (GET)
  try {
    const orderResponse = await client.get(`/api/orders/607`);
    recordTestResult('GET /api/orders/607', true, null, orderResponse);
  } catch (error) {
    recordTestResult('GET /api/orders/607', false, error);
  }
}

// Admin orders endpoints
async function testAdminOrdersEndpoints(client) {
  console.log('\n🔍 Testing admin orders endpoints...');
  
  // Test get all admin orders (GET)
  try {
    const adminOrdersResponse = await client.get(`/api/admin/orders`);
    recordTestResult('GET /api/admin/orders', true, null, adminOrdersResponse);
  } catch (error) {
    recordTestResult('GET /api/admin/orders', false, error);
  }
  
  // Test send to radiology (POST)
  try {
    // Create a new order that's in pending_admin status
    const newOrderResponse = await client.post(`/api/orders`, {
      patient_name: 'Test Patient',
      patient_dob: '1980-01-01',
      dictation: 'Test dictation for API testing',
      modality: 'MRI',
      body_part: 'BRAIN'
    });
    
    let orderId = 607; // Default to 607 if we can't create a new order
    
    if (newOrderResponse && newOrderResponse.data && newOrderResponse.data.order && newOrderResponse.data.order.id) {
      orderId = newOrderResponse.data.order.id;
      console.log(`   Created new order with ID: ${orderId}`);
    }
    
    const sendToRadiologyResponse = await client.post(`/api/admin/orders/${orderId}/send-to-radiology-fixed`, {});
    recordTestResult(`POST /api/admin/orders/${orderId}/send-to-radiology-fixed`, true, null, sendToRadiologyResponse);
  } catch (error) {
    recordTestResult('POST /api/admin/orders/[id]/send-to-radiology-fixed', false, error);
  }
}

// Radiology orders endpoints
async function testRadiologyOrdersEndpoints(client) {
  console.log('\n🔍 Testing radiology orders endpoints...');
  
  // Test get all radiology orders (GET)
  try {
    const radiologyOrdersResponse = await client.get(`/api/radiology/orders`);
    recordTestResult('GET /api/radiology/orders', true, null, radiologyOrdersResponse);
  } catch (error) {
    recordTestResult('GET /api/radiology/orders', false, error);
  }
}

// Uploads endpoints
async function testUploadsEndpoints(client) {
  console.log('\n🔍 Testing uploads endpoints...');
  
  // Test get upload URL (POST)
  try {
    const uploadUrlResponse = await client.post(`/api/uploads/url`, {
      fileName: 'test.pdf',
      contentType: 'application/pdf'
    });
    recordTestResult('POST /api/uploads/url', true, null, uploadUrlResponse);
  } catch (error) {
    recordTestResult('POST /api/uploads/url', false, error);
  }
}

// Webhooks endpoints
async function testWebhooksEndpoints(client) {
  console.log('\n🔍 Testing webhooks endpoints...');
  
  // Test Stripe webhook (POST)
  try {
    const stripeWebhookResponse = await client.post(`/api/webhooks/stripe`, {
      type: 'test_webhook',
      data: {
        object: {
          id: 'test_id'
        }
      }
    });
    recordTestResult('POST /api/webhooks/stripe', true, null, stripeWebhookResponse);
  } catch (error) {
    recordTestResult('POST /api/webhooks/stripe', false, error);
  }
}

// Connections endpoints
async function testConnectionsEndpoints(client) {
  console.log('\n🔍 Testing connections endpoints...');
  
  // Test get all connections (GET)
  try {
    const connectionsResponse = await client.get(`/api/connections`);
    recordTestResult('GET /api/connections', true, null, connectionsResponse);
  } catch (error) {
    recordTestResult('GET /api/connections', false, error);
  }
}

// Organizations endpoints
async function testOrganizationsEndpoints(client) {
  console.log('\n🔍 Testing organizations endpoints...');
  
  // Test get all organizations (GET)
  try {
    const organizationsResponse = await client.get(`/api/organizations`);
    recordTestResult('GET /api/organizations', true, null, organizationsResponse);
  } catch (error) {
    recordTestResult('GET /api/organizations', false, error);
  }
}

// Users endpoints
async function testUsersEndpoints(client) {
  console.log('\n🔍 Testing users endpoints...');
  
  // Test get all users (GET)
  try {
    const usersResponse = await client.get(`/api/users`);
    recordTestResult('GET /api/users', true, null, usersResponse);
  } catch (error) {
    recordTestResult('GET /api/users', false, error);
  }
}

// Superadmin endpoints
async function testSuperadminEndpoints(client) {
  console.log('\n🔍 Testing superadmin endpoints...');
  
  // Test get all organizations (GET)
  try {
    const superadminOrgsResponse = await client.get(`/api/superadmin/organizations`);
    recordTestResult('GET /api/superadmin/organizations', true, null, superadminOrgsResponse);
  } catch (error) {
    recordTestResult('GET /api/superadmin/organizations', false, error);
  }
  
  // Test get all users (GET)
  try {
    const superadminUsersResponse = await client.get(`/api/superadmin/users`);
    recordTestResult('GET /api/superadmin/users', true, null, superadminUsersResponse);
  } catch (error) {
    recordTestResult('GET /api/superadmin/users', false, error);
  }
}

// Billing endpoints
async function testBillingEndpoints(client) {
  console.log('\n🔍 Testing billing endpoints...');
  
  // Test get billing info (GET)
  try {
    const billingResponse = await client.get(`/api/billing`);
    recordTestResult('GET /api/billing', true, null, billingResponse);
  } catch (error) {
    recordTestResult('GET /api/billing', false, error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== COMPREHENSIVE API TESTING WITH SUPER_ADMIN ROLE ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('====================================================\n');
  
  // Generate super_admin token
  const token = generateSuperAdminToken();
  const client = createAuthClient(token);
  
  // Test all endpoints
  await testHealthEndpoint(client);
  await testAuthEndpoints(client);
  await testOrdersEndpoints(client);
  await testAdminOrdersEndpoints(client);
  await testRadiologyOrdersEndpoints(client);
  await testUploadsEndpoints(client);
  await testWebhooksEndpoints(client);
  await testConnectionsEndpoints(client);
  await testOrganizationsEndpoints(client);
  await testUsersEndpoints(client);
  await testSuperadminEndpoints(client);
  await testBillingEndpoints(client);
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log('===================');
  
  // Save results to file
  fs.writeFileSync('superadmin-test-results.json', JSON.stringify(testResults, null, 2));
  console.log('\nTest results saved to superadmin-test-results.json');
}

// Execute tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
});