/**
 * Test script for the admin orders queue endpoint
 * This script tests the functionality to list orders awaiting admin finalization
 */

const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: './.env.test' });

// API base URL
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Read admin token from file
const getToken = () => {
  try {
    // Get the project root directory
    const projectRoot = process.env.PROJECT_ROOT || process.cwd();
    const tokenPath = `${projectRoot}/tokens/admin_staff-token.txt`;
    
    // Try to read the admin_staff token
    console.log(`Reading token from: ${tokenPath}`);
    return fs.readFileSync(tokenPath, 'utf8').trim();
  } catch (error) {
    console.error('Error reading admin token:', error.message);
    process.exit(1);
  }
};

/**
 * Test the basic queue retrieval
 */
async function testBasicQueueRetrieval(token) {
  console.log('\nTest 1: Basic queue retrieval');
  
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/orders/queue`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Response Status:', response.status);
    console.log('Response Data (first 2 orders):', JSON.stringify(response.data.orders.slice(0, 2), null, 2));
    console.log('Pagination:', JSON.stringify(response.data.pagination, null, 2));
    
    if (response.status === 200 && response.data.orders && response.data.pagination) {
      console.log('✅ Test passed: Queue retrieved successfully');
    } else {
      console.log('❌ Test failed: Unexpected response');
    }
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
  }
}

/**
 * Test pagination
 */
async function testPagination(token) {
  console.log('\nTest 2: With pagination (page 1, limit 5)');
  
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/orders/queue?page=1&limit=5`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Response Status:', response.status);
    console.log('Number of orders returned:', response.data.orders.length);
    console.log('Pagination:', JSON.stringify(response.data.pagination, null, 2));
    
    if (response.status === 200 && response.data.orders.length <= 5 && response.data.pagination.limit === 5) {
      console.log('✅ Test passed: Pagination working correctly');
    } else {
      console.log('❌ Test failed: Pagination not working as expected');
    }
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
  }
}

/**
 * Test sorting
 */
async function testSorting(token) {
  console.log('\nTest 3: With sorting (by patient_name, ascending)');
  
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/orders/queue?sortBy=patient_name&sortOrder=asc`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Response Status:', response.status);
    
    // Check if we have at least 2 orders to verify sorting
    if (response.data.orders.length >= 2) {
      console.log('First two patient names:');
      console.log('1.', response.data.orders[0].patient_name);
      console.log('2.', response.data.orders[1].patient_name);
    } else {
      console.log('Not enough orders to verify sorting');
    }
    
    if (response.status === 200) {
      console.log('✅ Test passed: Sorting request processed successfully');
    } else {
      console.log('❌ Test failed: Unexpected response');
    }
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
  }
}

/**
 * Test filtering
 */
async function testFiltering(token) {
  console.log('\nTest 4: With filtering (by patient name)');
  
  // Use a common name that might exist in the database
  const searchName = 'Smith';
  
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/orders/queue?patientName=${searchName}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Response Status:', response.status);
    console.log('Number of orders returned:', response.data.orders.length);
    
    if (response.status === 200) {
      console.log('✅ Test passed: Filtering request processed successfully');
      if (response.data.orders.length > 0) {
        console.log('Found orders matching the filter');
      } else {
        console.log('No orders match the filter criteria');
      }
    } else {
      console.log('❌ Test failed: Unexpected response');
    }
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('===== Testing Admin Orders Queue Endpoint =====');
  console.log(`API URL: ${API_URL}`);
  
  try {
    // Get admin_staff token
    const token = getToken();
    if (!token) {
      console.error('No token available. Please check the token file path.');
      process.exit(1);
    }
    
    // Decode the JWT token to get basic user info
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      try {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log('\nToken information:');
        console.log('User ID:', payload.userId);
        console.log('Organization ID:', payload.orgId);
        console.log('Role:', payload.role);
        console.log('Token expires:', new Date(payload.exp * 1000).toLocaleString());
      } catch (e) {
        console.log('Could not decode token:', e.message);
      }
    }
    
    // Run the tests
    await testBasicQueueRetrieval(token);
    await testPagination(token);
    await testSorting(token);
    await testFiltering(token);
    
    console.log('\n===== All Tests Completed =====');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

// Run the tests
runTests();