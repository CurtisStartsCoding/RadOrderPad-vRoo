// Script to test the new Vercel deployment login endpoint
const fetch = require('node-fetch');

// New Vercel deployment URL
const VERCEL_URL = 'https://radorderpad-8zi108wpf-capecomas-projects.vercel.app';

// Test credentials
const testCredentials = {
  email: 'test.admin@example.com',
  password: 'password123'
};

async function testLogin() {
  console.log('Testing login endpoint on new Vercel deployment...');
  console.log(`URL: ${VERCEL_URL}/api/auth/login`);
  console.log(`Credentials: ${testCredentials.email} / ${testCredentials.password.replace(/./g, '*')}`);
  
  try {
    const response = await fetch(`${VERCEL_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testCredentials)
    });
    
    const status = response.status;
    console.log(`Response status: ${status}`);
    
    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.log('Could not parse response as JSON');
      const text = await response.text();
      console.log('Response text:', text.substring(0, 500) + (text.length > 500 ? '...' : ''));
      return;
    }
    
    if (status === 200) {
      console.log('✅ Login successful!');
      console.log('Response data:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Login failed');
      console.log('Error response:');
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

// Test health endpoint first
async function testHealth() {
  console.log('Testing health endpoint on new Vercel deployment...');
  console.log(`URL: ${VERCEL_URL}/health`);
  
  try {
    const response = await fetch(`${VERCEL_URL}/health`);
    const status = response.status;
    console.log(`Response status: ${status}`);
    
    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.log('Could not parse response as JSON');
      const text = await response.text();
      console.log('Response text:', text.substring(0, 500) + (text.length > 500 ? '...' : ''));
      return;
    }
    
    if (status === 200) {
      console.log('✅ Health check successful!');
      console.log('Response data:');
      console.log(JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log('❌ Health check failed');
      console.log('Error response:');
      console.log(JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('=== New Vercel Deployment Test ===');
  
  // Test health endpoint first
  const healthOk = await testHealth();
  
  if (healthOk) {
    console.log('\n=== Testing Login Endpoint ===');
    await testLogin();
  } else {
    console.log('\n❌ Health check failed, skipping login test');
    console.log('Make sure your Vercel deployment is running and accessible');
  }
  
  console.log('\n=== Test Complete ===');
}

runTests();