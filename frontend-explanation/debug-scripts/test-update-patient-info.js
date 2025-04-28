const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'https://radorderpad-8zi108wpf-capecomas-projects.vercel.app/api';
const ORDER_ID = 607; // Use order #607 which has the more specific error

// Admin staff credentials
const ADMIN_STAFF_CREDENTIALS = {
  email: 'test.admin_staff@example.com',
  password: 'password123'
};

// Login function
async function login(email, password) {
  try {
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
    return data.token;
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    throw error;
  }
}

// Get order details
async function getOrderDetails(token, orderId) {
  try {
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

// Test updating patient information with different parameter combinations
async function testUpdatePatientInfo() {
  try {
    console.log('=== PRECISION TESTING: UPDATE PATIENT INFO ===');
    console.log(`API URL: ${API_BASE_URL}`);
    console.log(`Order ID: ${ORDER_ID}`);
    console.log('===========================================\n');

    // Step 1: Login as Admin Staff
    console.log('Step 1: Logging in as Admin Staff...');
    const token = await login(ADMIN_STAFF_CREDENTIALS.email, ADMIN_STAFF_CREDENTIALS.password);
    console.log('✅ Admin Staff login successful!\n');

    // Step 2: Get order details
    console.log('Step 2: Getting order details...');
    const orderDetails = await getOrderDetails(token, ORDER_ID);
    if (orderDetails.success) {
      console.log('✅ Order details retrieved successfully');
      console.log(`Order Status: ${orderDetails.order.status}`);
      console.log(`Patient Info:`, orderDetails.order.patient || 'Not available');
      console.log('\n');
    } else {
      console.log(`❌ Failed to get order details: ${orderDetails.error}`);
      return;
    }

    // Step 3: Test update-patient-info with different parameter combinations
    console.log('Step 3: Testing update-patient-info with different parameter combinations...');

    // Test 1: Standard patient info format
    console.log('\nTest 1: Standard patient info format');
    await testUpdatePatientInfoWithParams(token, {
      address_line1: '123 Main Street',
      city: 'Springfield',
      state: 'IL',
      zip_code: '62704',
      phone_number: '(555) 123-4567',
      email: 'robert.johnson@example.com'
    });

    // Test 2: Camel case format
    console.log('\nTest 2: Camel case format');
    await testUpdatePatientInfoWithParams(token, {
      addressLine1: '123 Main Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      phoneNumber: '(555) 123-4567',
      email: 'robert.johnson@example.com'
    });

    // Test 3: Nested format
    console.log('\nTest 3: Nested format');
    await testUpdatePatientInfoWithParams(token, {
      patient: {
        address_line1: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62704',
        phone_number: '(555) 123-4567',
        email: 'robert.johnson@example.com'
      }
    });

    // Test 4: With patient_id
    console.log('\nTest 4: With patient_id');
    await testUpdatePatientInfoWithParams(token, {
      patient_id: orderDetails.order.patient?.id || 1,
      address_line1: '123 Main Street',
      city: 'Springfield',
      state: 'IL',
      zip_code: '62704',
      phone_number: '(555) 123-4567',
      email: 'robert.johnson@example.com'
    });

    // Test 5: With minimal required fields
    console.log('\nTest 5: With minimal required fields');
    await testUpdatePatientInfoWithParams(token, {
      city: 'Springfield',
      state: 'IL',
      zip_code: '62704'
    });

    console.log('\n=== PRECISION TESTING COMPLETE ===');
  } catch (error) {
    console.error(`Test failed: ${error.message}`);
  }
}

// Helper function to test update-patient-info with specific parameters
async function testUpdatePatientInfoWithParams(token, params) {
  try {
    console.log(`Testing with params:`, params);
    
    const response = await fetch(`${API_BASE_URL}/admin/orders/${ORDER_ID}/patient-info`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
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

    if (response.ok) {
      console.log('✅ Success!');
    } else {
      console.log(`❌ Failed: ${data.message || response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

// Run the test
testUpdatePatientInfo();