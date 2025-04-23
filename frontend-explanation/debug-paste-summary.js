/**
 * Script to debug the paste-summary endpoint database schema issue
 * 
 * This script:
 * 1. Authenticates as admin_staff
 * 2. Makes a request to the paste-summary endpoint with detailed logging
 * 3. Analyzes the error response to help debug the database schema issue
 */

const axios = require('axios');

// --- Configuration ---
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Order ID that works with other admin endpoints but fails with paste-summary
const ORDER_ID = 600;

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

// Function to test paste-summary endpoint with detailed logging
async function testPasteSummary(orderId, token) {
  try {
    console.log(`\n🔍 Testing paste-summary endpoint with order ID ${orderId}...`);
    
    // Request payload
    const payload = {
      pastedText: "EMR Summary: Patient John Doe, DOB 1980-01-01. Insurance: BCBS Policy: 123"
    };
    
    console.log('Request Payload:', JSON.stringify(payload, null, 2));
    
    // Make the request with detailed logging
    console.log(`Making POST request to ${API_URL}/api/admin/orders/${orderId}/paste-summary`);
    
    const response = await axios.post(
      `${API_URL}/api/admin/orders/${orderId}/paste-summary`,
      payload,
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
      
      // Analyze the error message for database schema issues
      if (error.response.data && error.response.data.message) {
        const errorMessage = error.response.data.message;
        
        if (errorMessage.includes('column') && errorMessage.includes('does not exist')) {
          console.log('\n🔍 DATABASE SCHEMA ISSUE DETECTED:');
          console.log('The error indicates a missing column in the database schema.');
          console.log('Column mentioned in error:', errorMessage.match(/column "([^"]+)"/)?.[1] || 'Unknown');
          console.log('\nPossible causes:');
          console.log('1. Missing migration: A database migration to add this column was not run in production');
          console.log('2. Code-schema mismatch: The code is trying to use a column that is not in the schema design');
          console.log('\nRecommended actions:');
          console.log('1. Check the database schema in production');
          console.log('2. Review migration files for this column');
          console.log('3. Check the service function that processes EMR summary data');
        }
      }
    } else if (error.request) {
      console.log('Error: No response received', error.message);
    } else {
      console.log('Error:', error.message);
    }
    
    return null;
  }
}

// Main function
async function debugPasteSummary() {
  console.log('=== DEBUGGING PASTE-SUMMARY ENDPOINT ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('======================================\n');
  
  // Get token
  const token = await getToken();
  if (!token) {
    console.log('\n❌ Cannot proceed without authentication token. Exiting.');
    return;
  }
  
  // Test paste-summary endpoint
  await testPasteSummary(ORDER_ID, token);
  
  console.log('\n=== DEBUGGING COMPLETE ===');
  console.log('Next steps:');
  console.log('1. Check the patient_insurance table schema in production');
  console.log('2. Look for the authorization_number column');
  console.log('3. Review the updateInsuranceFromEmr service function');
}

// Run the script
debugPasteSummary().catch(error => {
  console.error('\n--- UNEXPECTED SCRIPT ERROR ---');
  console.error(error);
});