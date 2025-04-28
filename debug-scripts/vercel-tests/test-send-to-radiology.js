/**
 * Test script for the send-to-radiology endpoint
 * This script tests the send-to-radiology-fixed endpoint against the new deployment
 */

const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.production' });

// Configuration
const API_BASE_URL = 'https://radorderpad-q20dishz7-capecomas-projects.vercel.app/api';
const ORDER_ID = 607; // Use order #607 for testing

// Admin staff credentials
const ADMIN_STAFF_CREDENTIALS = {
  email: 'test.admin_staff@example.com',
  password: 'password123'
};

// Login function
async function login(email, password) {
  try {
    console.log(`Logging in as ${email}...`);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const responseText = await response.text();
    console.log(`Response status: ${response.status}`);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.log('Response is not valid JSON');
      return null;
    }

    if (!response.ok) {
      console.log(`Login failed: ${data.message || response.statusText}`);
      return null;
    }

    console.log('Login successful!');
    return data.token;
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    return null;
  }
}

// Send to radiology using the fixed implementation
async function sendToRadiologyFixed(token, orderId) {
  try {
    console.log(`Sending order ${orderId} to radiology using fixed implementation...`);
    
    // Use the fixed endpoint
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/send-to-radiology-fixed`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    const responseText = await response.text();
    console.log(`Response status: ${response.status}`);
    console.log(`Response text: ${responseText}`);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.log('Response is not valid JSON');
      data = { message: responseText };
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.message || response.statusText,
        status: response.status
      };
    }

    return {
      success: true,
      ...data
    };
  } catch (error) {
    console.error(`Error sending to radiology: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Main function
async function main() {
  try {
    console.log('=== TESTING SEND-TO-RADIOLOGY-FIXED ENDPOINT ===');
    console.log(`API URL: ${API_BASE_URL}`);
    console.log(`Order ID: ${ORDER_ID}`);
    console.log('===========================================\n');

    // Step 1: Login as Admin Staff
    const token = await login(ADMIN_STAFF_CREDENTIALS.email, ADMIN_STAFF_CREDENTIALS.password);
    if (!token) {
      console.log('❌ Login failed, cannot proceed with test');
      return;
    }

    // Step 2: Send to radiology using fixed implementation
    const sendToRadiologyResult = await sendToRadiologyFixed(token, ORDER_ID);
    if (sendToRadiologyResult.success) {
      console.log('✅ Send to radiology endpoint is working\n');
    } else {
      console.log(`❌ Send to radiology endpoint is not working: ${sendToRadiologyResult.error}\n`);
    }

    console.log('\n=== TEST COMPLETE ===');
  } catch (error) {
    console.error(`Test failed: ${error.message}`);
  }
}

// Run the main function
main().catch(console.error);