const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env.test') });

// Set API URL
const API_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://api.radorderpad.com';

console.log(`Using API URL: ${API_URL}`);

// Get tokens
let adminReferringToken, adminRadiologyToken, physicianToken;

try {
  adminReferringToken = fs.readFileSync(path.join(__dirname, '..', 'tokens', 'admin_referring-token.txt'), 'utf8').trim();
  adminRadiologyToken = fs.readFileSync(path.join(__dirname, '..', 'tokens', 'admin_radiology-token.txt'), 'utf8').trim();
  physicianToken = fs.readFileSync(path.join(__dirname, '..', 'tokens', 'physician-token.txt'), 'utf8').trim();
} catch (error) {
  console.error('Error reading token files:', error.message);
  process.exit(1);
}

// Helper function to handle errors
const handleError = (error) => {
  if (error.response) {
    return {
      error: true,
      status: error.response.status,
      data: error.response.data
    };
  } else {
    return {
      error: true,
      message: error.message
    };
  }
};

// Run all billing tests
async function runTests() {
  console.log('\n===== Testing Billing & Credit Endpoints =====\n');
  
  // Test 1: Get billing overview (referring admin)
  console.log('Test 1: Get billing overview - admin_referring (GET /api/billing)');
  try {
    const response = await axios.get(`${API_URL}/api/billing`, {
      headers: { 'Authorization': `Bearer ${adminReferringToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 2: Get billing overview (radiology admin)
  console.log('\n\nTest 2: Get billing overview - admin_radiology');
  try {
    const response = await axios.get(`${API_URL}/api/billing`, {
      headers: { 'Authorization': `Bearer ${adminRadiologyToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 3: Get credit balance (referring admin)
  console.log('\n\nTest 3: Get credit balance - admin_referring (GET /api/billing/credit-balance)');
  try {
    const response = await axios.get(`${API_URL}/api/billing/credit-balance`, {
      headers: { 'Authorization': `Bearer ${adminReferringToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 4: Get credit balance (radiology admin)
  console.log('\n\nTest 4: Get credit balance - admin_radiology');
  try {
    const response = await axios.get(`${API_URL}/api/billing/credit-balance`, {
      headers: { 'Authorization': `Bearer ${adminRadiologyToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 5: Get credit usage history
  console.log('\n\nTest 5: Get credit usage history (GET /api/billing/credit-usage)');
  try {
    const response = await axios.get(`${API_URL}/api/billing/credit-usage?limit=5`, {
      headers: { 'Authorization': `Bearer ${adminReferringToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 6: Get credit usage with filters
  console.log('\n\nTest 6: Get credit usage filtered by action type');
  try {
    const response = await axios.get(`${API_URL}/api/billing/credit-usage?actionType=order_submitted&limit=3`, {
      headers: { 'Authorization': `Bearer ${adminReferringToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 7: Create checkout session (referring admin only)
  console.log('\n\nTest 7: Create checkout session (POST /api/billing/create-checkout-session)');
  try {
    const response = await axios.post(
      `${API_URL}/api/billing/create-checkout-session`,
      {
        priceId: 'price_test_100_credits' // This will likely fail without valid price ID
      },
      {
        headers: { 
          'Authorization': `Bearer ${adminReferringToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Expected error (invalid price ID):', handleError(error));
  }
  
  // Test 8: Non-admin access (should fail)
  console.log('\n\nTest 8: Non-admin access to billing (should fail)');
  try {
    const response = await axios.get(`${API_URL}/api/billing`, {
      headers: { 'Authorization': `Bearer ${physicianToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Expected error:', handleError(error));
  }
  
  // Test 9: Create subscription (referring admin only)
  console.log('\n\nTest 9: Create subscription (POST /api/billing/create-subscription)');
  try {
    const response = await axios.post(
      `${API_URL}/api/billing/create-subscription`,
      {
        priceId: 'price_monthly_tier1' // This will likely fail without valid price ID
      },
      {
        headers: { 
          'Authorization': `Bearer ${adminReferringToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Expected error (invalid price ID or no Stripe customer):', handleError(error));
  }
  
  // Test 10: Radiology admin trying to create checkout (should fail)
  console.log('\n\nTest 10: Radiology admin trying to create checkout (should fail)');
  try {
    const response = await axios.post(
      `${API_URL}/api/billing/create-checkout-session`,
      {},
      {
        headers: { 
          'Authorization': `Bearer ${adminRadiologyToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Expected error:', handleError(error));
  }
  
  console.log('\n\nTests completed');
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});