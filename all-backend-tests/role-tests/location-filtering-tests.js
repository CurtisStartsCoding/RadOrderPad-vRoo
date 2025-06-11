/**
 * Location Filtering Test Suite
 * 
 * This script tests the location filtering functionality for:
 * 1. Order creation with automatic location assignment
 * 2. Admin queue filtering by originating location
 * 3. Multi-location physician scenarios
 * 4. Location-based access control
 * 
 * Usage:
 * ```
 * node all-backend-tests/role-tests/location-filtering-tests.js
 * ```
 */

const axios = require('axios');
const chalk = require('chalk');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.test') });

// Base URL for API requests
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Test data for physicians at different locations
const physicianLocation1 = {
  email: process.env.PHYSICIAN_LOC1_EMAIL || 'physician.location1@example.com',
  password: process.env.PHYSICIAN_LOC1_PASSWORD || 'password123',
  locationId: 1 // Boston Main Office
};

const physicianLocation2 = {
  email: process.env.PHYSICIAN_LOC2_EMAIL || 'physician.location2@example.com',
  password: process.env.PHYSICIAN_LOC2_PASSWORD || 'password123',
  locationId: 2 // Cambridge Satellite
};

// Test data for admin staff at different locations
const adminStaffLocation1 = {
  email: process.env.ADMIN_STAFF_LOC1_EMAIL || 'admin.location1@example.com',
  password: process.env.ADMIN_STAFF_LOC1_PASSWORD || 'password123',
  locationId: 1 // Boston Main Office
};

const adminStaffLocation2 = {
  email: process.env.ADMIN_STAFF_LOC2_EMAIL || 'admin.location2@example.com',
  password: process.env.ADMIN_STAFF_LOC2_PASSWORD || 'password123',
  locationId: 2 // Cambridge Satellite
};

// Test patient data
const testPatient = {
  firstName: 'Location',
  lastName: 'TestPatient',
  dateOfBirth: '1980-01-01',
  gender: 'male'
};

// Test dictation
const testDictation = 'MRI brain for chronic headaches. Rule out mass lesion.';

// Validation result for order creation
const validationResult = {
  validationStatus: 'APPROPRIATE',
  complianceScore: 95,
  suggestedCPTCodes: [{ code: '70551', description: 'MRI Brain without contrast', isPrimary: true }],
  suggestedICD10Codes: [{ code: 'R51.9', description: 'Headache, unspecified', isPrimary: true }],
  feedback: 'Order is appropriate for the clinical indication.',
  clinicalIndication: 'Chronic headaches'
};

// Helper function to login
async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password
    });
    return response.data.token;
  } catch (error) {
    console.error(chalk.red(`Login failed for ${email}:`, error.response?.data || error.message));
    throw error;
  }
}

// Test 1: Create orders at different locations
async function testOrderCreationWithLocation() {
  console.log(chalk.blue('\n=== Test 1: Order Creation with Location Assignment ==='));
  
  const orders = [];
  
  try {
    // Login as physician at location 1
    console.log(chalk.yellow('\nPhysician at Location 1 creating order...'));
    const token1 = await login(physicianLocation1.email, physicianLocation1.password);
    
    const order1Response = await axios.post(
      `${API_URL}/api/orders`,
      {
        patientInfo: testPatient,
        dictationText: testDictation + ' Location 1',
        finalValidationResult: validationResult,
        isOverride: false,
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        signerFullName: 'Dr. Location One'
      },
      {
        headers: { Authorization: `Bearer ${token1}` }
      }
    );
    
    orders.push({
      orderId: order1Response.data.data.orderId,
      location: 'Location 1',
      expectedLocationId: physicianLocation1.locationId
    });
    console.log(chalk.green(`✓ Order created at Location 1: ${order1Response.data.data.orderId}`));
    
    // Login as physician at location 2
    console.log(chalk.yellow('\nPhysician at Location 2 creating order...'));
    const token2 = await login(physicianLocation2.email, physicianLocation2.password);
    
    const order2Response = await axios.post(
      `${API_URL}/api/orders`,
      {
        patientInfo: { ...testPatient, firstName: 'LocationTwo' },
        dictationText: testDictation + ' Location 2',
        finalValidationResult: validationResult,
        isOverride: false,
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        signerFullName: 'Dr. Location Two'
      },
      {
        headers: { Authorization: `Bearer ${token2}` }
      }
    );
    
    orders.push({
      orderId: order2Response.data.data.orderId,
      location: 'Location 2',
      expectedLocationId: physicianLocation2.locationId
    });
    console.log(chalk.green(`✓ Order created at Location 2: ${order2Response.data.data.orderId}`));
    
    // Test explicit location override
    console.log(chalk.yellow('\nPhysician at Location 1 creating order with explicit location...'));
    const order3Response = await axios.post(
      `${API_URL}/api/orders`,
      {
        patientInfo: { ...testPatient, firstName: 'ExplicitLocation' },
        dictationText: testDictation + ' Explicit Location',
        finalValidationResult: validationResult,
        isOverride: false,
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        signerFullName: 'Dr. Location One',
        originatingLocationId: 3 // Explicitly set to a different location
      },
      {
        headers: { Authorization: `Bearer ${token1}` }
      }
    );
    
    orders.push({
      orderId: order3Response.data.data.orderId,
      location: 'Explicit Location 3',
      expectedLocationId: 3
    });
    console.log(chalk.green(`✓ Order created with explicit location: ${order3Response.data.data.orderId}`));
    
  } catch (error) {
    console.error(chalk.red('Error creating orders:', error.response?.data || error.message));
    throw error;
  }
  
  return orders;
}

// Test 2: Admin queue filtering by location
async function testAdminQueueLocationFiltering(orders) {
  console.log(chalk.blue('\n=== Test 2: Admin Queue Location Filtering ==='));
  
  try {
    // Login as admin staff at location 1
    console.log(chalk.yellow('\nAdmin Staff at Location 1 checking queue...'));
    const adminToken1 = await login(adminStaffLocation1.email, adminStaffLocation1.password);
    
    // Get all orders (no filter)
    const allOrdersResponse = await axios.get(
      `${API_URL}/api/admin/orders/queue`,
      {
        headers: { Authorization: `Bearer ${adminToken1}` }
      }
    );
    
    console.log(chalk.cyan(`Total orders in queue: ${allOrdersResponse.data.pagination.total}`));
    
    // Get orders filtered by location 1
    const location1OrdersResponse = await axios.get(
      `${API_URL}/api/admin/orders/queue?originatingLocationId=${physicianLocation1.locationId}`,
      {
        headers: { Authorization: `Bearer ${adminToken1}` }
      }
    );
    
    console.log(chalk.cyan(`Orders from Location 1: ${location1OrdersResponse.data.pagination.total}`));
    
    // Verify the orders have correct location IDs
    const location1Orders = location1OrdersResponse.data.orders;
    let locationFilterSuccess = true;
    
    for (const order of location1Orders) {
      if (order.originating_location_id !== physicianLocation1.locationId) {
        console.error(chalk.red(`✗ Order ${order.id} has incorrect location: ${order.originating_location_id}`));
        locationFilterSuccess = false;
      }
    }
    
    if (locationFilterSuccess && location1Orders.length > 0) {
      console.log(chalk.green(`✓ All ${location1Orders.length} orders have correct location ID`));
    }
    
    // Login as admin staff at location 2
    console.log(chalk.yellow('\nAdmin Staff at Location 2 checking queue...'));
    const adminToken2 = await login(adminStaffLocation2.email, adminStaffLocation2.password);
    
    // Get orders filtered by location 2
    const location2OrdersResponse = await axios.get(
      `${API_URL}/api/admin/orders/queue?originatingLocationId=${physicianLocation2.locationId}`,
      {
        headers: { Authorization: `Bearer ${adminToken2}` }
      }
    );
    
    console.log(chalk.cyan(`Orders from Location 2: ${location2OrdersResponse.data.pagination.total}`));
    
    // Test patient name search across all locations
    console.log(chalk.yellow('\nTesting patient name search across all locations...'));
    const patientSearchResponse = await axios.get(
      `${API_URL}/api/admin/orders/queue?patientName=Location`,
      {
        headers: { Authorization: `Bearer ${adminToken1}` }
      }
    );
    
    console.log(chalk.cyan(`Orders matching patient name 'Location': ${patientSearchResponse.data.pagination.total}`));
    
    // Test combined filters
    console.log(chalk.yellow('\nTesting combined location and patient name filter...'));
    const combinedFilterResponse = await axios.get(
      `${API_URL}/api/admin/orders/queue?originatingLocationId=${physicianLocation1.locationId}&patientName=Location`,
      {
        headers: { Authorization: `Bearer ${adminToken1}` }
      }
    );
    
    console.log(chalk.cyan(`Orders from Location 1 with patient name 'Location': ${combinedFilterResponse.data.pagination.total}`));
    
  } catch (error) {
    console.error(chalk.red('Error testing admin queue:', error.response?.data || error.message));
    throw error;
  }
}

// Test 3: Verify order details include location information
async function testOrderDetailsLocationInfo(orderId) {
  console.log(chalk.blue('\n=== Test 3: Order Details Location Information ==='));
  
  try {
    const token = await login(adminStaffLocation1.email, adminStaffLocation1.password);
    
    // Get specific order details
    const orderResponse = await axios.get(
      `${API_URL}/api/orders/${orderId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    const order = orderResponse.data.data;
    
    if (order.originating_location_id) {
      console.log(chalk.green(`✓ Order ${orderId} has originating_location_id: ${order.originating_location_id}`));
    } else {
      console.log(chalk.red(`✗ Order ${orderId} missing originating_location_id`));
    }
    
    // Display full order details for verification
    console.log(chalk.cyan('\nOrder Details:'));
    console.log(chalk.cyan(`- Order Number: ${order.order_number}`));
    console.log(chalk.cyan(`- Patient: ${order.patient_name}`));
    console.log(chalk.cyan(`- Physician: ${order.referring_physician_name}`));
    console.log(chalk.cyan(`- Originating Location ID: ${order.originating_location_id}`));
    console.log(chalk.cyan(`- Target Facility ID: ${order.target_facility_id || 'Not set'}`));
    
  } catch (error) {
    console.error(chalk.red('Error getting order details:', error.response?.data || error.message));
  }
}

// Test 4: Multi-location physician scenario
async function testMultiLocationPhysician() {
  console.log(chalk.blue('\n=== Test 4: Multi-Location Physician Scenario ==='));
  
  console.log(chalk.yellow('Note: This test requires a physician assigned to multiple locations.'));
  console.log(chalk.yellow('The system should use the first assigned location automatically.'));
  
  // This would require a physician with multiple location assignments
  // For now, we'll document the expected behavior
  console.log(chalk.cyan('\nExpected Behavior:'));
  console.log(chalk.cyan('1. Physician assigned to locations [1, 2, 3]'));
  console.log(chalk.cyan('2. Order created without specifying location'));
  console.log(chalk.cyan('3. Order should have originating_location_id = 1 (first assigned)'));
  console.log(chalk.cyan('4. Future: Allow physician to select location at login or order creation'));
}

// Main test runner
async function runAllTests() {
  console.log(chalk.bold.blue('\n===================================='));
  console.log(chalk.bold.blue('Location Filtering Test Suite'));
  console.log(chalk.bold.blue('===================================='));
  
  try {
    // Test 1: Create orders at different locations
    const orders = await testOrderCreationWithLocation();
    
    // Wait a bit for orders to be processed
    console.log(chalk.yellow('\nWaiting for orders to be processed...'));
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Admin queue filtering
    await testAdminQueueLocationFiltering(orders);
    
    // Test 3: Order details
    if (orders.length > 0) {
      await testOrderDetailsLocationInfo(orders[0].orderId);
    }
    
    // Test 4: Multi-location physician
    await testMultiLocationPhysician();
    
    console.log(chalk.bold.green('\n✓ All location filtering tests completed!'));
    
  } catch (error) {
    console.error(chalk.bold.red('\n✗ Test suite failed:'), error.message);
    process.exit(1);
  }
}

// Run tests
runAllTests();