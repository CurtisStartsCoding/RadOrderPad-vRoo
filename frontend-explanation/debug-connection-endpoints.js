/**
 * Script to debug the connection management endpoints
 * 
 * This script:
 * 1. Authenticates as admin_radiology
 * 2. Tests the GET /api/connections/requests endpoint with detailed logging
 * 3. Analyzes the error response to help debug the implementation issues
 */

const axios = require('axios');

// --- Configuration ---
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Test user credentials
const TEST_USER = {
  role: 'admin_radiology',
  email: 'test.admin_radiology@example.com',
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

// Function to test GET /api/connections/requests with detailed logging
async function testConnectionRequests(token) {
  try {
    console.log(`\n🔍 Testing GET /api/connections/requests endpoint...`);
    
    // Make the request with detailed logging
    console.log(`Making GET request to ${API_URL}/api/connections/requests`);
    
    const response = await axios.get(
      `${API_URL}/api/connections/requests`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    console.log(`✅ Request successful`);
    console.log('Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log(`❌ Request failed`);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
      
      // Analyze the error message for common issues
      if (error.response.status === 500) {
        console.log('\n🔍 INTERNAL SERVER ERROR DETECTED:');
        console.log('The error indicates an issue with the server-side implementation.');
        
        if (error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          
          if (errorMessage.includes('column') && errorMessage.includes('does not exist')) {
            console.log('\nPossible database schema issue:');
            console.log('Column mentioned in error:', errorMessage.match(/column "([^"]+)"/)?.[1] || 'Unknown');
          } else if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
            console.log('\nPossible missing table:');
            console.log('Table mentioned in error:', errorMessage.match(/relation "([^"]+)"/)?.[1] || 'Unknown');
          } else if (errorMessage.includes('undefined') || errorMessage.includes('null')) {
            console.log('\nPossible null/undefined value:');
            console.log('Error message:', errorMessage);
          }
        }
        
        console.log('\nRecommended actions:');
        console.log('1. Check Vercel logs for detailed stack traces');
        console.log('2. Debug the listIncomingRequests service function');
        console.log('3. Check database queries and joins');
        console.log('4. Verify data formats and types');
      }
    } else if (error.request) {
      console.log('Error: No response received', error.message);
    } else {
      console.log('Error:', error.message);
    }
    
    return null;
  }
}

// Function to test connection approve endpoint with a range of IDs
async function testConnectionApprove(token, startId, endId) {
  console.log(`\n🔍 Testing POST /api/connections/{relationshipId}/approve with IDs ${startId}-${endId}...`);
  
  const results = [];
  
  for (let id = startId; id <= endId; id++) {
    try {
      console.log(`\nTrying relationship ID: ${id}`);
      console.log(`Making POST request to ${API_URL}/api/connections/${id}/approve`);
      
      const response = await axios.post(
        `${API_URL}/api/connections/${id}/approve`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log(`✅ Request successful for ID ${id}`);
      console.log('Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
      
      results.push({
        id,
        success: true,
        status: response.status,
        data: response.data
      });
    } catch (error) {
      console.log(`❌ Request failed for ID ${id}`);
      
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
        
        results.push({
          id,
          success: false,
          status: error.response.status,
          error: error.response.data
        });
      } else {
        console.log('Error:', error.message);
        
        results.push({
          id,
          success: false,
          error: error.message
        });
      }
    }
  }
  
  return results;
}

// Main function
async function debugConnectionEndpoints() {
  console.log('=== DEBUGGING CONNECTION ENDPOINTS ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('=====================================\n');
  
  // Get token
  const token = await getToken();
  if (!token) {
    console.log('\n❌ Cannot proceed without authentication token. Exiting.');
    return;
  }
  
  // Test GET /api/connections/requests endpoint
  console.log('\n=== TESTING GET /api/connections/requests ===');
  await testConnectionRequests(token);
  
  // Test POST /api/connections/{relationshipId}/approve with a range of IDs
  console.log('\n=== TESTING POST /api/connections/{relationshipId}/approve ===');
  const approveResults = await testConnectionApprove(token, 1, 5);
  
  // Print summary of approve results
  console.log('\n=== APPROVE ENDPOINT RESULTS ===');
  console.log(`Total IDs tested: ${approveResults.length}`);
  console.log(`Successful requests: ${approveResults.filter(r => r.success).length}`);
  
  if (approveResults.filter(r => r.success).length > 0) {
    console.log('\nSuccessful relationship IDs:');
    approveResults.filter(r => r.success).forEach(r => {
      console.log(`- ID ${r.id}: Status ${r.status}`);
    });
  }
  
  console.log('\n=== DEBUGGING COMPLETE ===');
  console.log('Next steps:');
  console.log('1. Check Vercel logs for detailed stack traces');
  console.log('2. Debug the connection management service functions');
  console.log('3. Verify database schema and queries');
}

// Run the script
debugConnectionEndpoints().catch(error => {
  console.error('\n--- UNEXPECTED SCRIPT ERROR ---');
  console.error(error);
});