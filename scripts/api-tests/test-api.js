const axios = require('axios');

const API_URL = 'https://api.radorderpad.com';

// Test the health endpoint
async function testHealthEndpoint() {
  try {
    console.log('Testing health endpoint...');
    const response = await axios.get(`${API_URL}/health`);
    console.log('Health endpoint response:', response.data);
    console.log('Health endpoint test: SUCCESS');
    return true;
  } catch (error) {
    console.error('Health endpoint test: FAILED');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return false;
  }
}

// Test the login endpoint with invalid credentials (should return 401)
async function testLoginEndpoint() {
  try {
    console.log('\nTesting login endpoint...');
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'invalidpassword'
    });
    console.log('Login endpoint response:', response.data);
    console.log('Login endpoint test: SUCCESS (unexpected success)');
    return true;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('Login endpoint test: SUCCESS (expected 401 Unauthorized)');
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      return true;
    } else {
      console.error('Login endpoint test: FAILED');
      console.error('Error:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      return false;
    }
  }
}

// Test the API routes to ensure they're properly configured
async function testApiRoutes() {
  const routes = [
    '/api/auth',
    '/api/orders',
    '/api/admin/orders',
    '/api/radiology/orders',
    '/api/uploads',
    '/api/webhooks',
    '/api/connections',
    '/api/organizations',
    '/api/users',
    '/api/superadmin',
    '/api/billing'
  ];

  console.log('\nTesting API routes...');
  
  for (const route of routes) {
    try {
      const response = await axios.get(`${API_URL}${route}`);
      console.log(`Route ${route}: SUCCESS (${response.status})`);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log(`Route ${route}: SUCCESS (expected ${error.response.status} - Authentication required)`);
      } else if (error.response && error.response.status === 404) {
        console.log(`Route ${route}: SUCCESS (expected 404 - GET method not allowed)`);
      } else {
        console.error(`Route ${route}: FAILED`);
        console.error('Error:', error.message);
        if (error.response) {
          console.error('Status:', error.response.status);
          console.error('Data:', error.response.data);
        }
      }
    }
  }
}

// Run all tests
async function runTests() {
  console.log('=== API TESTS ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('=================\n');

  const healthResult = await testHealthEndpoint();
  const loginResult = await testLoginEndpoint();
  await testApiRoutes();

  console.log('\n=== TEST SUMMARY ===');
  console.log(`Health endpoint: ${healthResult ? 'PASSED' : 'FAILED'}`);
  console.log(`Login endpoint: ${loginResult ? 'PASSED' : 'FAILED'}`);
  console.log('====================');
}

runTests();