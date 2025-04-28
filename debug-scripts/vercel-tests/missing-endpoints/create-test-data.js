/**
 * Script to create and find test data for API endpoint testing
 * 
 * This script helps:
 * 1. Find orders in pending_admin status
 * 2. Find relationships in pending and active status
 * 3. Create test data if needed
 */

const axios = require('axios');

// --- Configuration ---
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Test user credentials (from test-login-all-roles.js)
const TEST_USERS = [
  {
    role: 'admin_staff',
    email: 'test.admin_staff@example.com',
    password: 'password123'
  },
  {
    role: 'physician',
    email: 'test.physician@example.com',
    password: 'password123'
  },
  {
    role: 'admin_referring',
    email: 'test.admin_referring@example.com',
    password: 'password123'
  },
  {
    role: 'super_admin',
    email: 'test.superadmin@example.com',
    password: 'password123'
  },
  {
    role: 'admin_radiology',
    email: 'test.admin_radiology@example.com',
    password: 'password123'
  },
  {
    role: 'scheduler',
    email: 'test.scheduler@example.com',
    password: 'password123'
  },
  {
    role: 'radiologist',
    email: 'test.radiologist@example.com',
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

// Function to find orders in pending_admin status
async function findPendingAdminOrders() {
  console.log('\n--- Finding Orders in pending_admin Status ---');
  
  // Try to get orders as admin_staff
  const ordersResponse = await makeRequest('get', '/api/admin/orders', 'admin_staff');
  
  if (ordersResponse && Array.isArray(ordersResponse.orders)) {
    const pendingAdminOrders = ordersResponse.orders.filter(order => order.status === 'pending_admin');
    
    if (pendingAdminOrders.length > 0) {
      console.log(`\n✅ Found ${pendingAdminOrders.length} orders in pending_admin status:`);
      pendingAdminOrders.forEach(order => {
        console.log(`- Order ID: ${order.id}, Created: ${order.created_at}`);
      });
      return pendingAdminOrders;
    } else {
      console.log('\n❌ No orders found in pending_admin status');
    }
  }
  
  return [];
}

// Function to find relationships in pending status
async function findPendingRelationships() {
  console.log('\n--- Finding Relationships in pending Status ---');
  
  // Try to get relationships as admin_radiology
  const relationshipsResponse = await makeRequest('get', '/api/connections', 'admin_radiology');
  
  if (relationshipsResponse && Array.isArray(relationshipsResponse.relationships)) {
    const pendingRelationships = relationshipsResponse.relationships.filter(rel => rel.status === 'pending');
    
    if (pendingRelationships.length > 0) {
      console.log(`\n✅ Found ${pendingRelationships.length} relationships in pending status:`);
      pendingRelationships.forEach(rel => {
        console.log(`- Relationship ID: ${rel.id}, Created: ${rel.created_at}`);
      });
      return pendingRelationships;
    } else {
      console.log('\n❌ No relationships found in pending status');
    }
  }
  
  return [];
}

// Function to find relationships in active status
async function findActiveRelationships() {
  console.log('\n--- Finding Relationships in active Status ---');
  
  // Try to get relationships as admin_radiology
  const relationshipsResponse = await makeRequest('get', '/api/connections', 'admin_radiology');
  
  if (relationshipsResponse && Array.isArray(relationshipsResponse.relationships)) {
    const activeRelationships = relationshipsResponse.relationships.filter(rel => rel.status === 'active');
    
    if (activeRelationships.length > 0) {
      console.log(`\n✅ Found ${activeRelationships.length} relationships in active status:`);
      activeRelationships.forEach(rel => {
        console.log(`- Relationship ID: ${rel.id}, Created: ${rel.created_at}`);
      });
      return activeRelationships;
    } else {
      console.log('\n❌ No relationships found in active status');
    }
  }
  
  return [];
}

// Main function to find all test data
async function findTestData() {
  console.log('=== FINDING TEST DATA FOR API ENDPOINT TESTING ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('=================================================\n');
  
  // Authenticate with all roles
  console.log('\n--- Authenticating with all roles ---');
  for (const user of TEST_USERS) {
    await getToken(user.role);
  }
  
  // Find orders in pending_admin status
  const pendingAdminOrders = await findPendingAdminOrders();
  
  // Find relationships in pending status
  const pendingRelationships = await findPendingRelationships();
  
  // Find relationships in active status
  const activeRelationships = await findActiveRelationships();
  
  // Print summary
  console.log('\n=== TEST DATA SUMMARY ===');
  console.log(`Pending Admin Orders: ${pendingAdminOrders.length}`);
  console.log(`Pending Relationships: ${pendingRelationships.length}`);
  console.log(`Active Relationships: ${activeRelationships.length}`);
  
  // Provide test script values
  console.log('\n=== SUGGESTED TEST SCRIPT VALUES ===');
  
  if (pendingAdminOrders.length > 0) {
    console.log(`VALID_ORDER_ID_PENDING_ADMIN = ${pendingAdminOrders[0].id};`);
  } else {
    console.log('No pending_admin orders found. Need to create one.');
  }
  
  if (pendingRelationships.length > 0) {
    console.log(`VALID_RELATIONSHIP_ID_PENDING = ${pendingRelationships[0].id};`);
  } else {
    console.log('No pending relationships found. Need to create one.');
  }
  
  if (activeRelationships.length > 0) {
    console.log(`VALID_RELATIONSHIP_ID_ACTIVE = ${activeRelationships[0].id};`);
  } else {
    console.log('No active relationships found. Need to create one.');
  }
}

// Run the script
findTestData().catch(error => {
  console.error('\n--- UNEXPECTED SCRIPT ERROR ---');
  console.error(error);
});