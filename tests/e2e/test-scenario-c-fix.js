/**
 * Test script to verify that the test-helpers-simple.js file is working correctly for Scenario C
 */

const helpers = require('./test-helpers');

// Scenario name for logging
const SCENARIO = 'Scenario-C-Test';

async function runTest() {
  helpers.log(`Starting ${SCENARIO}`, SCENARIO);
  
  try {
    // Store a test order ID
    const orderId = 'order_test_' + Math.random().toString(36).substring(2, 10);
    helpers.storeTestData('orderId', orderId, SCENARIO);
    helpers.log(`Using test order ID: ${orderId}`, SCENARIO);
    
    // Store a test admin token
    const adminToken = 'mock_token_test_' + Math.random().toString(36).substring(2, 10);
    helpers.storeTestData('adminToken', adminToken, SCENARIO);
    helpers.log(`Using test admin token: ${adminToken}`, SCENARIO);
    
    // Get initial order details
    helpers.log('Getting initial order details', SCENARIO);
    const initialOrderDetails = await helpers.apiRequest(
      'get',
      `/orders/${orderId}`,
      null,
      adminToken,
      SCENARIO
    );
    
    helpers.log(`Initial order status: ${initialOrderDetails.status}`, SCENARIO);
    
    // Call send-to-radiology
    helpers.log('Calling send-to-radiology', SCENARIO);
    const sendToRadiologyResponse = await helpers.apiRequest(
      'post',
      `/orders/${orderId}/admin/send-to-radiology`,
      {},
      adminToken,
      SCENARIO
    );
    
    helpers.log(`Order sent to radiology with status: ${sendToRadiologyResponse.status}`, SCENARIO);
    
    // Get updated order details
    helpers.log('Getting updated order details', SCENARIO);
    const updatedOrderDetails = await helpers.apiRequest(
      'get',
      `/orders/${orderId}`,
      null,
      adminToken,
      SCENARIO
    );
    
    helpers.log(`Updated order status: ${updatedOrderDetails.status}`, SCENARIO);
    
    // Verify order status
    if (updatedOrderDetails.status !== 'pending_radiology') {
      throw new Error(`Unexpected order status: ${updatedOrderDetails.status}`);
    }
    
    helpers.log('Order status verified successfully', SCENARIO);
    helpers.log(`${SCENARIO} completed successfully`, SCENARIO);
    
    return true;
  } catch (error) {
    helpers.log(`Error in ${SCENARIO}: ${error.message}`, SCENARIO);
    return false;
  }
}

// Run the test
runTest().then(success => {
  console.log(`Test ${success ? 'passed' : 'failed'}`);
  process.exit(success ? 0 : 1);
});