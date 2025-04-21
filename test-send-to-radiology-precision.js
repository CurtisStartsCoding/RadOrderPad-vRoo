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

// Send to radiology with different parameter combinations
async function testSendToRadiology() {
  try {
    console.log('=== PRECISION TESTING: SEND TO RADIOLOGY ===');
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

    // Step 3: Try to update patient information
    console.log('Step 3: Updating patient information...');
    const patientUpdateResult = await updatePatientInfo(token, ORDER_ID, {
      address_line1: '123 Main Street',
      city: 'Springfield',
      state: 'IL',
      zip_code: '62704',
      phone_number: '(555) 123-4567',
      email: 'robert.johnson@example.com'
    });

    if (patientUpdateResult.success) {
      console.log('✅ Patient information updated successfully\n');
    } else {
      console.log(`❌ Failed to update patient information: ${patientUpdateResult.error}`);
      console.log('Continuing with tests anyway...\n');
    }

    // Step 4: Test send-to-radiology with different parameter combinations
    console.log('Step 4: Testing send-to-radiology with different parameter combinations...');

    // Test 1: Empty body
    console.log('\nTest 1: Empty body');
    await testSendToRadiologyWithParams(token, {});

    // Test 2: With radiologyOrgId
    console.log('\nTest 2: With radiologyOrgId');
    await testSendToRadiologyWithParams(token, {
      radiologyOrgId: 1
    });

    // Test 3: With patientInfo
    console.log('\nTest 3: With patientInfo');
    await testSendToRadiologyWithParams(token, {
      patientInfo: {
        address: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62704',
        phoneNumber: '(555) 123-4567',
        email: 'robert.johnson@example.com'
      }
    });

    // Test 4: With both radiologyOrgId and patientInfo
    console.log('\nTest 4: With both radiologyOrgId and patientInfo');
    await testSendToRadiologyWithParams(token, {
      radiologyOrgId: 1,
      patientInfo: {
        address: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62704',
        phoneNumber: '(555) 123-4567',
        email: 'robert.johnson@example.com'
      }
    });

    // Test 5: With flat patient info parameters
    console.log('\nTest 5: With flat patient info parameters');
    await testSendToRadiologyWithParams(token, {
      address: '123 Main Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      phoneNumber: '(555) 123-4567',
      email: 'robert.johnson@example.com'
    });

    // Test 6: With organization_id parameter
    console.log('\nTest 6: With organization_id parameter');
    await testSendToRadiologyWithParams(token, {
      organization_id: 1
    });

    // Test 7: With radiology_organization_id parameter
    console.log('\nTest 7: With radiology_organization_id parameter');
    await testSendToRadiologyWithParams(token, {
      radiology_organization_id: 1
    });

    console.log('\n=== PRECISION TESTING COMPLETE ===');
  } catch (error) {
    console.error(`Test failed: ${error.message}`);
  }
}

// Helper function to test send-to-radiology with specific parameters
async function testSendToRadiologyWithParams(token, params) {
  try {
    console.log(`Testing with params:`, params);
    
    const response = await fetch(`${API_BASE_URL}/admin/orders/${ORDER_ID}/send-to-radiology`, {
      method: 'POST',
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
testSendToRadiology();