/**
 * Script to debug the admin order queue endpoint
 * 
 * This script:
 * 1. Authenticates as admin_staff
 * 2. Tests the GET /api/admin/orders/queue endpoint with detailed logging
 * 3. Analyzes the error response to help debug the implementation issues
 */

const axios = require('axios');

// --- Configuration ---
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

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

// Function to test GET /api/admin/orders/queue with detailed logging
async function testAdminOrderQueue(token) {
  try {
    console.log(`\n🔍 Testing GET /api/admin/orders/queue endpoint...`);
    
    // Make the request with detailed logging
    console.log(`Making GET request to ${API_URL}/api/admin/orders/queue`);
    
    const response = await axios.get(
      `${API_URL}/api/admin/orders/queue`,
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
        console.log('2. Check if the controller/service function for listing admin orders exists');
        console.log('3. Debug the database query and logic');
        console.log('4. Check for missing joins or invalid filters');
      }
    } else if (error.request) {
      console.log('Error: No response received', error.message);
    } else {
      console.log('Error:', error.message);
    }
    
    return null;
  }
}

// Function to test GET /api/admin/orders with detailed logging
async function testAdminOrders(token) {
  try {
    console.log(`\n🔍 Testing GET /api/admin/orders endpoint (for comparison)...`);
    
    // Make the request with detailed logging
    console.log(`Making GET request to ${API_URL}/api/admin/orders`);
    
    const response = await axios.get(
      `${API_URL}/api/admin/orders`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    console.log(`✅ Request successful`);
    console.log('Status:', response.status);
    console.log('Response Data (first 2 orders):', JSON.stringify(response.data.orders?.slice(0, 2), null, 2));
    console.log(`Total orders returned: ${response.data.orders?.length || 0}`);
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

// Main function
async function debugAdminQueue() {
  console.log('=== DEBUGGING ADMIN ORDER QUEUE ENDPOINT ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('=========================================\n');
  
  // Get token
  const token = await getToken();
  if (!token) {
    console.log('\n❌ Cannot proceed without authentication token. Exiting.');
    return;
  }
  
  // Test GET /api/admin/orders/queue endpoint
  console.log('\n=== TESTING GET /api/admin/orders/queue ===');
  await testAdminOrderQueue(token);
  
  // Test GET /api/admin/orders endpoint for comparison
  console.log('\n=== TESTING GET /api/admin/orders (for comparison) ===');
  const ordersData = await testAdminOrders(token);
  
  // Analyze the results
  console.log('\n=== ANALYSIS ===');
  if (ordersData && ordersData.orders && ordersData.orders.length > 0) {
    console.log('The regular admin orders endpoint works, but the queue endpoint fails.');
    console.log('This suggests that the queue endpoint might be missing or has implementation issues.');
    
    console.log('\nPossible issues:');
    console.log('1. The route for /api/admin/orders/queue might not be defined');
    console.log('2. The controller function for the queue endpoint might be missing');
    console.log('3. The queue endpoint might have a different database query that is failing');
    
    console.log('\nSuggested implementation:');
    console.log('1. Check if the route is defined in the routes file');
    console.log('2. Check if the controller function exists');
    console.log('3. Implement the queue endpoint based on the regular orders endpoint');
  } else {
    console.log('Both endpoints are failing. This suggests a broader issue with admin order endpoints.');
  }
  
  console.log('\n=== DEBUGGING COMPLETE ===');
  console.log('Next steps:');
  console.log('1. Check Vercel logs for detailed stack traces');
  console.log('2. Check if the queue endpoint route and controller exist');
  console.log('3. Implement or fix the queue endpoint based on the findings');
}

// Run the script
debugAdminQueue().catch(error => {
  console.error('\n--- UNEXPECTED SCRIPT ERROR ---');
  console.error(error);
});