/**
 * Test for Radiology Request Information Endpoint
 * 
 * This test verifies the functionality of the POST /api/radiology/orders/{orderId}/request-info endpoint
 * which allows radiology staff to request additional information for an order from the referring organization.
 */

const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const TOKENS_DIR = path.join(__dirname, '..', 'tokens');
const ADMIN_RADIOLOGY_TOKEN_PATH = path.join(TOKENS_DIR, 'admin_radiology-token.txt');
const SCHEDULER_TOKEN_PATH = path.join(TOKENS_DIR, 'scheduler-token.txt');

// Test data
const TEST_ORDER_ID = process.env.TEST_ORDER_ID || 1; // Replace with a valid order ID for testing
const TEST_DATA = {
  requestedInfoType: 'labs',
  requestedInfoDetails: 'Please provide recent CBC and metabolic panel results for this patient.'
};

// Helper function to get token
function getToken(tokenPath) {
  try {
    return fs.readFileSync(tokenPath, 'utf8').trim();
  } catch (error) {
    console.error(`Error reading token from ${tokenPath}:`, error.message);
    return null;
  }
}

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {}
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('API Request Error:', error.response?.data || error.message);
    throw error;
  }
}

// Main test function
async function runTest() {
  console.log('Starting Radiology Request Information Test');

  try {
    // Get tokens
    const adminRadiologyToken = getToken(ADMIN_RADIOLOGY_TOKEN_PATH);
    const schedulerToken = getToken(SCHEDULER_TOKEN_PATH);

    if (!adminRadiologyToken && !schedulerToken) {
      throw new Error('No valid tokens found. Please generate tokens first.');
    }

    const token = adminRadiologyToken || schedulerToken;
    console.log('Using token for role:', adminRadiologyToken ? 'admin_radiology' : 'scheduler');

    // Test 1: Request additional information
    console.log('\nTest 1: Request additional information');
    const requestInfoResponse = await apiRequest(
      'post',
      `/radiology/orders/${TEST_ORDER_ID}/request-info`,
      TEST_DATA,
      token
    );

    console.log('Request Information Response:', JSON.stringify(requestInfoResponse, null, 2));

    // Verify response structure
    if (!requestInfoResponse.success) {
      throw new Error('Request information failed');
    }

    if (!requestInfoResponse.requestId) {
      throw new Error('Response missing requestId');
    }

    console.log('Request information test passed');

    // Test 2: Invalid request (missing required fields)
    console.log('\nTest 2: Invalid request (missing required fields)');
    try {
      await apiRequest(
        'post',
        `/radiology/orders/${TEST_ORDER_ID}/request-info`,
        { requestedInfoType: 'labs' }, // Missing requestedInfoDetails
        token
      );
      throw new Error('Request should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw error;
      }
      console.log('Invalid request test passed (received 400 as expected)');
    }

    // Test 3: Non-existent order
    console.log('\nTest 3: Non-existent order');
    try {
      await apiRequest(
        'post',
        '/radiology/orders/999999/request-info', // Using a non-existent order ID
        TEST_DATA,
        token
      );
      throw new Error('Request should have failed but succeeded');
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error;
      }
      console.log('Non-existent order test passed (received 404 as expected)');
    }

    console.log('\nAll tests completed successfully');
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
runTest();