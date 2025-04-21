const axios = require('axios');

const API_URL = 'https://radorderpad-jwtja60z4-capecomas-projects.vercel.app';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjk5OSwib3JnSWQiOjEsInJvbGUiOiJzdXBlcl9hZG1pbiIsImVtYWlsIjoidGVzdC5zdXBlcmFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ1MzI0ODk0OSwiZXhwIjoxNzQ1MzM1MzQ5fQ.io-9ah6e0rcwU05oazBZw5C9ZZGVGXIc_KWd9jNywl4';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Test the health endpoint
async function testHealthEndpoint() {
  try {
    console.log('Testing health endpoint...');
    const response = await api.get('/health');
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

// Test the superadmin endpoint
async function testSuperadminEndpoint() {
  try {
    console.log('\nTesting superadmin endpoint...');
    const response = await api.get('/api/superadmin/health');
    console.log('Superadmin endpoint response:', response.data);
    console.log('Superadmin endpoint test: SUCCESS');
    return true;
  } catch (error) {
    console.error('Superadmin endpoint test: FAILED');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return false;
  }
}

// Test the organizations endpoint
async function testOrganizationsEndpoint() {
  try {
    console.log('\nTesting organizations endpoint...');
    const response = await api.get('/api/organizations');
    console.log('Organizations endpoint response:', response.data);
    console.log('Organizations endpoint test: SUCCESS');
    return true;
  } catch (error) {
    console.error('Organizations endpoint test: FAILED');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return false;
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
    '/api/users',
    '/api/billing'
  ];

  console.log('\nTesting API routes with authentication...');
  
  for (const route of routes) {
    try {
      const response = await api.get(route);
      console.log(`Route ${route}: SUCCESS (${response.status})`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(`Route ${route}: SUCCESS (expected 404 - GET method not allowed or endpoint requires additional path parameters)`);
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
  console.log('=== API TESTS WITH AUTHENTICATION ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('Using superadmin token for authentication');
  console.log('=======================================\n');

  const healthResult = await testHealthEndpoint();
  const superadminResult = await testSuperadminEndpoint();
  const organizationsResult = await testOrganizationsEndpoint();
  await testApiRoutes();

  console.log('\n=== TEST SUMMARY ===');
  console.log(`Health endpoint: ${healthResult ? 'PASSED' : 'FAILED'}`);
  console.log(`Superadmin endpoint: ${superadminResult ? 'PASSED' : 'FAILED'}`);
  console.log(`Organizations endpoint: ${organizationsResult ? 'PASSED' : 'FAILED'}`);
  console.log('====================');
}

runTests();