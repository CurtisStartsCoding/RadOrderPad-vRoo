/**
 * Test script for the fixed send-to-radiology implementation
 * This script tests the fixed implementation that uses both PHI and Main database connections
 */

const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'https://radorderpad-8zi108wpf-capecomas-projects.vercel.app/api';
console.log(`Using API URL: ${API_BASE_URL}`);
const ORDER_ID = process.env.ORDER_ID || 607; // Use order #607 which previously had the database connection error
console.log(`Using Order ID: ${ORDER_ID}`);

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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Login failed: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('Login successful!');
    return data.token;
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    throw error;
  }
}

// Update patient information
async function updatePatientInfo(token, orderId, patientInfo) {
  try {
    console.log(`Updating patient info for order ${orderId}:`, patientInfo);
    
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/patient-info`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientInfo)
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
    console.error(`Error updating patient info: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Send to radiology using the fixed implementation
async function sendToRadiologyFixed(token, orderId) {
  try {
    console.log(`Sending order ${orderId} to radiology using fixed implementation...`);
    
    // Use a special endpoint for the fixed implementation
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

    if (!response.ok) {
      const errorData = await response.json();
      console.log(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      return {
        success: false,
        error: errorData.message || response.statusText
      };
    }

    const data = await response.json();
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

// Main function
async function main() {
  try {
    console.log('=== TESTING FIXED SEND-TO-RADIOLOGY IMPLEMENTATION ===');
    console.log(`API URL: ${API_BASE_URL}`);
    console.log(`Order ID: ${ORDER_ID}`);
    console.log('===========================================\n');

    // Step 1: Login as Admin Staff
    const token = await login(ADMIN_STAFF_CREDENTIALS.email, ADMIN_STAFF_CREDENTIALS.password);

    // Step 2: Get order details before update
    const orderDetailsBefore = await getOrderDetails(token, ORDER_ID);
    if (orderDetailsBefore.success) {
      console.log('Order details before update:');
      console.log(`Status: ${orderDetailsBefore.order.status}`);
      console.log('\n');
    } else {
      console.log(`Failed to get order details: ${orderDetailsBefore.error}`);
      return;
    }

    // Step 3: Update patient information
    const patientUpdateResult = await updatePatientInfo(token, ORDER_ID, {
      address_line1: '123 Main Street',
      city: 'Springfield',
      state: 'IL',
      zip_code: '62704',
      phone_number: '(555) 123-4567',
      email: 'robert.johnson@example.com'
    });

    if (patientUpdateResult.success) {
      console.log('Patient information updated successfully\n');
    } else {
      console.log(`Failed to update patient information: ${patientUpdateResult.error}`);
      console.log('Continuing with test anyway...\n');
    }

    // Step 4: Send to radiology using fixed implementation
    const sendToRadiologyResult = await sendToRadiologyFixed(token, ORDER_ID);
    if (sendToRadiologyResult.success) {
      console.log('Order sent to radiology successfully\n');
    } else {
      console.log(`Failed to send order to radiology: ${sendToRadiologyResult.error}`);
      return;
    }

    // Step 5: Get order details after update
    const orderDetailsAfter = await getOrderDetails(token, ORDER_ID);
    if (orderDetailsAfter.success) {
      console.log('Order details after update:');
      console.log(`Status: ${orderDetailsAfter.order.status}`);
      console.log('\n');
      
      // Verify status changed to pending_radiology
      if (orderDetailsAfter.order.status === 'pending_radiology') {
        console.log('✅ SUCCESS: Order status changed to pending_radiology');
      } else {
        console.log(`❌ FAILURE: Order status is ${orderDetailsAfter.order.status}, expected pending_radiology`);
      }
    } else {
      console.log(`Failed to get updated order details: ${orderDetailsAfter.error}`);
    }

    console.log('\n=== TEST COMPLETE ===');
  } catch (error) {
    console.error(`Test failed: ${error.message}`);
  }
}

// Run the main function
main().catch(console.error);