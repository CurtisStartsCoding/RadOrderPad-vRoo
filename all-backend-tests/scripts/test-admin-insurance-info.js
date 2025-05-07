/**
 * Test script for the admin insurance-info endpoint
 * This script tests the functionality to update insurance information for an order
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
 * Test the insurance-info endpoint with a valid order
 */
async function testUpdateInsuranceInfo(token, orderId) {
  console.log(`Testing PUT /api/admin/orders/${orderId}/insurance-info with valid data...`);
  
  try {
    // Try with camelCase field names instead of snake_case
    const response = await axios.put(
      `${API_URL}/api/admin/orders/${orderId}/insurance-info`,
      {
        insurerName: "Blue Cross Blue Shield", // Try camelCase
        policyNumber: "XYZ123456789", // Try camelCase
        groupNumber: "BCBS-GROUP-12345",
        policyHolderName: "John Smith",
        policyHolderRelationship: "self"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Test passed: Insurance information updated successfully');
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
 * Test the insurance-info endpoint with an invalid order ID
 */
async function testInvalidOrderId(token) {
  console.log('\nTesting with invalid order ID...');
  
  try {
    const response = await axios.put(
      `${API_URL}/api/admin/orders/999999/insurance-info`,
      {
        insurerName: "Blue Cross Blue Shield", // Try camelCase
        policyNumber: "XYZ123456789" // Try camelCase
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    console.log('❌ Test failed: Expected an error for invalid order ID');
  } catch (error) {
    console.log('Response Status:', error.response?.status);
    console.log('Response Data:', JSON.stringify(error.response?.data, null, 2));
    
    if (error.response?.status === 404) {
      console.log('✅ Test passed: Received expected error for invalid order ID');
    } else {
      console.log('❌ Test failed: Unexpected error');
    }
  }
}

/**
 * Test the insurance-info endpoint with missing required fields
 */
async function testMissingRequiredFields(token, orderId) {
  console.log('\nTesting with missing required fields (no policy_number)...');
  
  try {
    const response = await axios.put(
      `${API_URL}/api/admin/orders/${orderId}/insurance-info`,
      {
        // Empty request body to test missing required fields
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    console.log('❌ Test failed: Expected an error for missing required fields');
  } catch (error) {
    console.log('Response Status:', error.response?.status);
    console.log('Response Data:', JSON.stringify(error.response?.data, null, 2));
    
    if (error.response?.status === 400 || error.response?.status === 500) {
      console.log('✅ Test passed: Received expected error for missing required fields');
    } else {
      console.log('❌ Test failed: Unexpected error');
    }
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('===== Testing Admin Insurance Info Endpoint =====');
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
    
    // Use one of the known working order IDs from the test results
    // Based on ADMIN_ENDPOINTS_TEST_RESULTS.md, these IDs work: 600, 601, 603, 604, 609, 612
    const orderId = process.env.TEST_ORDER_ID || 603;
    
    console.log(`\nUsing order ID: ${orderId}`);
    console.log('Note: If the first test fails, try one of these order IDs: 600, 601, 603, 604, 609, 612');
    
    // Run the tests
    await testUpdateInsuranceInfo(token, orderId);
    await testInvalidOrderId(token);
    await testMissingRequiredFields(token, orderId);
    
    console.log('\n===== All Tests Completed =====');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

// Run the tests
runTests();