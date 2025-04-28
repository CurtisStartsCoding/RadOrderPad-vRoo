/**
 * Test script for the new Vercel deployment
 * This script tests the API endpoints against the new deployment
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

// Test health endpoint
async function testHealthEndpoint() {
  try {
    console.log('Testing health endpoint...');
    
    const response = await fetch('https://radorderpad-q20dishz7-capecomas-projects.vercel.app/health');
    const responseText = await response.text();
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response text: ${responseText}`);
    
    return response.ok;
  } catch (error) {
    console.error(`Health endpoint error: ${error.message}`);
    return false;
  }
}

// Get order details
async function getOrderDetails(token, orderId) {
  try {
    console.log(`Getting details for order ${orderId}...`);
    
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    console.log(`Response status: ${response.status}`);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.log('Response is not valid JSON');
      console.log(`Response text: ${responseText}`);
      return { success: false };
    }

    if (!response.ok) {
      console.log(`API Error: ${response.status} - ${JSON.stringify(data)}`);
      return {
        success: false,
        error: data.message || response.statusText
      };
    }

    return {
      success: true,
      order: data.order || data
    };
  } catch (error) {
    console.error(`Error getting order details: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// List orders
async function listOrders(token) {
  try {
    console.log('Listing orders...');
    
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    console.log(`Response status: ${response.status}`);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.log('Response is not valid JSON');
      console.log(`Response text: ${responseText}`);
      return { success: false };
    }

    if (!response.ok) {
      console.log(`API Error: ${response.status} - ${JSON.stringify(data)}`);
      return {
        success: false,
        error: data.message || response.statusText
      };
    }

    return {
      success: true,
      orders: data.orders || data
    };
  } catch (error) {
    console.error(`Error listing orders: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Main function
async function main() {
  try {
    console.log('=== TESTING NEW VERCEL DEPLOYMENT ===');
    console.log(`API URL: ${API_BASE_URL}`);
    console.log('===========================================\n');

    // Step 1: Test health endpoint
    const healthResult = await testHealthEndpoint();
    if (healthResult) {
      console.log('✅ Health endpoint is working\n');
    } else {
      console.log('❌ Health endpoint is not working\n');
    }

    // Step 2: Login as Admin Staff
    const token = await login(ADMIN_STAFF_CREDENTIALS.email, ADMIN_STAFF_CREDENTIALS.password);
    if (token) {
      console.log('✅ Login endpoint is working\n');
    } else {
      console.log('❌ Login endpoint is not working\n');
      console.log('Cannot proceed with further tests without a valid token');
      return;
    }

    // Step 3: Get order details
    const orderDetails = await getOrderDetails(token, ORDER_ID);
    if (orderDetails.success) {
      console.log('✅ Get order details endpoint is working');
      console.log(`Order status: ${orderDetails.order.status}\n`);
    } else {
      console.log('❌ Get order details endpoint is not working\n');
    }

    // Step 4: List orders
    const ordersList = await listOrders(token);
    if (ordersList.success) {
      console.log('✅ List orders endpoint is working');
      console.log(`Number of orders: ${ordersList.orders.length}\n`);
    } else {
      console.log('❌ List orders endpoint is not working\n');
    }

    console.log('\n=== TEST COMPLETE ===');
  } catch (error) {
    console.error(`Test failed: ${error.message}`);
  }
}

// Run the main function
main().catch(console.error);