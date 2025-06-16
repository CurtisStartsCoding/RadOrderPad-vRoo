/**
 * Script to diagnose frontend permissions issues with the organization locations endpoint
 * This simulates what the frontend might be doing and provides detailed debugging info
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'https://api.radorderpad.com';

// Test with existing users
const TEST_USER = {
  email: 'test.admin_referring@example.com',
  password: 'password123'
};

// Detailed debugging for axios
axios.interceptors.request.use(request => {
  console.log('\n📤 REQUEST:');
  console.log(`   ${request.method.toUpperCase()} ${request.url}`);
  console.log('   Headers:', JSON.stringify(request.headers, null, 2));
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('\n📥 RESPONSE:');
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log('   Data:', JSON.stringify(response.data, null, 2).substring(0, 500) + '...');
    return response;
  },
  error => {
    console.log('\n❌ ERROR RESPONSE:');
    if (error.response) {
      console.log(`   Status: ${error.response.status} ${error.response.statusText}`);
      console.log('   Data:', JSON.stringify(error.response.data, null, 2));
      console.log('   Headers:', JSON.stringify(error.response.headers, null, 2));
    } else {
      console.log('   Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Login function
async function login() {
  console.log('🔐 Logging in...');
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    const token = response.data.token;
    console.log('✅ Login successful');
    console.log(`   User ID: ${response.data.user?.id}`);
    console.log(`   Org ID: ${response.data.user?.organization_id}`);
    console.log(`   Role: ${response.data.user?.role}`);
    
    return {
      token,
      user: response.data.user
    };
  } catch (error) {
    console.error('❌ Login failed');
    throw error;
  }
}

// Test own organization locations
async function testOwnLocations(token) {
  console.log('\n\n=== TEST 1: Own Organization Locations ===');
  console.log('Endpoint: GET /api/organizations/mine/locations');
  
  try {
    const response = await axios.get(`${API_URL}/api/organizations/mine/locations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`✅ Success! Found ${response.data.locations?.length || 0} locations`);
    return true;
  } catch (error) {
    console.log('❌ Failed to get own locations');
    return false;
  }
}

// Get connections
async function getConnections(token) {
  console.log('\n\n=== TEST 2: Get Connections ===');
  console.log('Endpoint: GET /api/connections');
  
  try {
    const response = await axios.get(`${API_URL}/api/connections`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const connections = response.data.connections || [];
    console.log(`✅ Found ${connections.length} connections`);
    
    connections.forEach(conn => {
      console.log(`\n📊 Connection:`);
      console.log(`   Partner: ${conn.partnerOrgName} (ID: ${conn.partnerOrgId})`);
      console.log(`   Status: ${conn.status}`);
      console.log(`   Type: ${conn.isInitiator ? 'Outgoing' : 'Incoming'}`);
    });
    
    return connections;
  } catch (error) {
    console.log('❌ Failed to get connections');
    return [];
  }
}

// Test connected organization locations
async function testConnectedOrgLocations(token, orgId, orgName) {
  console.log(`\n\n=== TEST 3: Connected Organization Locations ===`);
  console.log(`Organization: ${orgName} (ID: ${orgId})`);
  console.log(`Endpoint: GET /api/organizations/${orgId}/locations`);
  
  try {
    const response = await axios.get(`${API_URL}/api/organizations/${orgId}/locations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const locations = response.data.data || response.data.locations || [];
    console.log(`✅ Success! Found ${locations.length} locations`);
    
    locations.forEach(loc => {
      console.log(`   📍 ${loc.name} - ${loc.city}, ${loc.state}`);
    });
    
    return true;
  } catch (error) {
    console.log('❌ Failed to get connected org locations');
    return false;
  }
}

// Test with different authorization header formats
async function testAuthHeaderFormats(token, orgId) {
  console.log(`\n\n=== TEST 4: Authorization Header Formats ===`);
  console.log('Testing different header formats that frontend might use...');
  
  const formats = [
    { name: 'Bearer with space', header: `Bearer ${token}` },
    { name: 'Bearer lowercase', header: `bearer ${token}` },
    { name: 'Token only', header: token },
    { name: 'JWT prefix', header: `JWT ${token}` }
  ];
  
  for (const format of formats) {
    console.log(`\n🔧 Testing: ${format.name}`);
    try {
      const response = await axios.get(`${API_URL}/api/organizations/${orgId}/locations`, {
        headers: {
          'Authorization': format.header
        },
        validateStatus: () => true // Don't throw on any status
      });
      
      if (response.status === 200) {
        console.log(`   ✅ Works with format: ${format.name}`);
      } else {
        console.log(`   ❌ Failed with status ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Network error`);
    }
  }
}

// Frontend simulation
async function simulateFrontendFlow() {
  console.log('\n\n=== SIMULATING FRONTEND WORKFLOW ===');
  console.log('This simulates what the frontend might be doing...');
  
  // Step 1: User selects a radiology organization from a dropdown
  console.log('\n1️⃣ User selects radiology organization from dropdown');
  console.log('   (Frontend would get this from /api/connections)');
  
  // Step 2: Frontend needs to load locations for that org
  console.log('\n2️⃣ Frontend calls GET /api/organizations/:orgId/locations');
  console.log('   Expected: List of locations');
  console.log('   Common issues:');
  console.log('   - Using wrong endpoint (/api/organizations/mine/locations/:orgId)');
  console.log('   - Missing or malformed Authorization header');
  console.log('   - Using organization name instead of ID');
  console.log('   - Caching old authentication token');
}

// Main diagnostic function
async function runDiagnostics() {
  console.log('=== LOCATION PERMISSIONS DIAGNOSTIC TOOL ===');
  console.log(`API URL: ${API_URL}`);
  console.log('==========================================\n');

  try {
    // Login
    const { token, user } = await login();
    
    // Test own locations
    await testOwnLocations(token);
    
    // Get connections
    const connections = await getConnections(token);
    
    // Test connected org locations
    if (connections.length > 0) {
      const activeConnection = connections.find(c => c.status === 'active');
      if (activeConnection) {
        await testConnectedOrgLocations(
          token, 
          activeConnection.partnerOrgId,
          activeConnection.partnerOrgName
        );
        
        // Test auth header formats
        await testAuthHeaderFormats(token, activeConnection.partnerOrgId);
      } else {
        console.log('\n⚠️  No active connections found!');
        console.log('This might be why the frontend is getting 403 errors.');
      }
    }
    
    // Simulate frontend flow
    await simulateFrontendFlow();
    
    // Summary and recommendations
    console.log('\n\n=== DIAGNOSTIC SUMMARY ===');
    console.log('\n🔍 Common Frontend Issues to Check:');
    console.log('1. Authorization header format - should be: "Bearer <token>"');
    console.log('2. Using numeric organization ID, not name or string');
    console.log('3. Connection must be active, not pending');
    console.log('4. User must have admin role (admin_referring or admin_radiology)');
    console.log('5. Token might be expired - try refreshing login');
    
    console.log('\n📝 Frontend Code to Check:');
    console.log('1. How is the organization ID being passed?');
    console.log('   - Should be: /api/organizations/123/locations');
    console.log('   - Not: /api/organizations/"123"/locations');
    console.log('2. How is the Authorization header set?');
    console.log('   - axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;');
    console.log('3. Is the connection status being checked?');
    console.log('   - Only show orgs where connection.status === "active"');
    
  } catch (error) {
    console.error('\n❌ Diagnostic failed:', error.message);
  }
}

// Run diagnostics
runDiagnostics();