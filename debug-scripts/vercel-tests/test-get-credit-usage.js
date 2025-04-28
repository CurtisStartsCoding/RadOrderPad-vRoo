const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Set API URL
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
console.log(`Using API URL: ${API_URL}`);

// Main test function
async function runTests() {
  console.log('Testing GET /api/billing/credit-usage Endpoint');

  // Get admin_referring token
  let adminReferringToken;
  try {
    adminReferringToken = fs.readFileSync(path.join(__dirname, '..', '..', 'tokens', 'admin_referring-token.txt'), 'utf8').trim();
  } catch (error) {
    console.error('Error reading admin_referring token file:', error.message);
    process.exit(1);
  }

  // Get physician token
  let physicianToken;
  try {
    physicianToken = fs.readFileSync(path.join(__dirname, '..', '..', 'tokens', 'physician-token.txt'), 'utf8').trim();
  } catch (error) {
    console.error('Error reading physician token file:', error.message);
    process.exit(1);
  }

  // Test 1: Get credit usage history with admin_referring token
  console.log('\nTest 1: Get credit usage history with admin_referring token');
  console.log('Expected: 200 OK with credit usage logs and pagination');
  try {
    const response = await axios.get(`${API_URL}/api/billing/credit-usage`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminReferringToken}`
      }
    });
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
    if (error.response && error.response.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
  }

  // Test 2: Get credit usage history with pagination (limit=1)
  console.log('\nTest 2: Get credit usage history with pagination (limit=1)');
  console.log('Expected: 200 OK with only 1 log entry');
  try {
    const response = await axios.get(`${API_URL}/api/billing/credit-usage?limit=1`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminReferringToken}`
      }
    });
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
    if (error.response && error.response.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
  }

  // Test 3: Get credit usage history with filtering (actionType=order_submitted)
  console.log('\nTest 3: Get credit usage history with filtering (actionType=order_submitted)');
  console.log('Expected: 200 OK with filtered logs');
  try {
    const response = await axios.get(`${API_URL}/api/billing/credit-usage?actionType=order_submitted`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminReferringToken}`
      }
    });
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
    if (error.response && error.response.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
  }

  // Test 4: Get credit usage history with sorting (sortBy=created_at&sortOrder=asc)
  console.log('\nTest 4: Get credit usage history with sorting (sortBy=created_at&sortOrder=asc)');
  console.log('Expected: 200 OK with sorted logs');
  try {
    const response = await axios.get(`${API_URL}/api/billing/credit-usage?sortBy=created_at&sortOrder=asc`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminReferringToken}`
      }
    });
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
    if (error.response && error.response.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
  }

  // Test 5: Get credit usage history with physician token
  console.log('\nTest 5: Get credit usage history with physician token');
  console.log('Expected: 403 Forbidden (role restriction)');
  try {
    const response = await axios.get(`${API_URL}/api/billing/credit-usage`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${physicianToken}`
      }
    });
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
    if (error.response && error.response.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
  }

  // Test 6: Get credit usage history without token
  console.log('\nTest 6: Get credit usage history without token');
  console.log('Expected: 401 Unauthorized');
  try {
    const response = await axios.get(`${API_URL}/api/billing/credit-usage`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
    if (error.response && error.response.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
  }

  console.log('\nTests completed');
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});