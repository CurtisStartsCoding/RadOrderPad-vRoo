/**
 * Test script for Redis-based rate limiting
 * 
 * This script tests the rate limiting middleware by making multiple
 * rapid requests to a rate-limited endpoint and observing the responses.
 */

const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000';
const API_ENDPOINT = '/api/orders/validate';
const NUM_REQUESTS = 70; // Number of requests to send
const DELAY_MS = 50; // Delay between requests in milliseconds

// Sample payload for validation
const samplePayload = {
  patientInfo: {
    age: 45,
    gender: 'female'
  },
  clinicalInfo: 'Patient with persistent headache for 3 weeks, no visual changes.',
  orderType: 'MRI'
};

// Authentication token (replace with actual token)
let authToken = '';

/**
 * Authenticate and get a token
 */
async function authenticate() {
  try {
    // Replace with your actual authentication endpoint and credentials
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: process.env.TEST_USER_EMAIL || 'test@example.com',
      password: process.env.TEST_USER_PASSWORD || 'password123'
    });
    
    authToken = response.data.token;
    console.log('Authentication successful');
  } catch (error) {
    console.error('Authentication failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

/**
 * Make a single request to the rate-limited endpoint
 */
async function makeRequest(index) {
  try {
    const response = await axios.post(`${API_URL}${API_ENDPOINT}`, samplePayload, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Request ${index + 1}: Success (${response.status})`);
    return { success: true, status: response.status };
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(`Request ${index + 1}: Failed (${error.response.status}) - ${JSON.stringify(error.response.data)}`);
      return { 
        success: false, 
        status: error.response.status,
        retryAfter: error.response.headers['retry-after'],
        data: error.response.data
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`Request ${index + 1}: Error - ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

/**
 * Run the rate limit test
 */
async function runTest() {
  console.log('=== Rate Limit Test ===');
  console.log(`API URL: ${API_URL}`);
  console.log(`Endpoint: ${API_ENDPOINT}`);
  console.log(`Number of requests: ${NUM_REQUESTS}`);
  console.log(`Delay between requests: ${DELAY_MS}ms`);
  console.log('========================\n');
  
  // Authenticate first
  await authenticate();
  
  const results = {
    success: 0,
    rateLimit: 0,
    otherErrors: 0
  };
  
  // Make multiple requests in sequence
  for (let i = 0; i < NUM_REQUESTS; i++) {
    const result = await makeRequest(i);
    
    if (result.success) {
      results.success++;
    } else if (result.status === 429) {
      results.rateLimit++;
      
      // Log rate limit details
      console.log(`  Rate limit details: Retry after ${result.retryAfter || 'unknown'} seconds`);
      if (result.data && result.data.retryAfter) {
        console.log(`  Server suggests waiting ${result.data.retryAfter} seconds`);
      }
    } else {
      results.otherErrors++;
    }
    
    // Add delay between requests
    if (i < NUM_REQUESTS - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }
  
  // Print summary
  console.log('\n=== Test Results ===');
  console.log(`Successful requests: ${results.success}`);
  console.log(`Rate limited (429): ${results.rateLimit}`);
  console.log(`Other errors: ${results.otherErrors}`);
  console.log('====================');
  
  // Determine test outcome
  if (results.rateLimit > 0) {
    console.log('\n✅ TEST PASSED: Rate limiting is working as expected');
  } else {
    console.log('\n❌ TEST FAILED: No rate limiting observed');
  }
}

// Run the test
runTest().catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
});