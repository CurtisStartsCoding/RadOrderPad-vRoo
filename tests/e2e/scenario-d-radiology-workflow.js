/**
 * Scenario D: Radiology View/Update
 * 
 * This test scenario covers:
 * 1. Using an orderId from Scenario C (status 'pending_radiology')
 * 2. Register Radiology Organization and Admin (if not already done)
 * 3. Login as Radiology Scheduler
 * 4. Call /radiology/orders (queue)
 * 5. Call /radiology/orders/{orderId} (details)
 * 6. Call /radiology/orders/{orderId}/update-status (set to 'scheduled')
 * 7. Verify response data and final order status
 */

const helpers = require('./test-helpers');
const fs = require('fs');
const path = require('path');

// Scenario name for logging
const SCENARIO = 'Scenario-D';

// Test data
const testData = {
  radiology: {
    orgName: 'Test Radiology Center D',
    orgType: 'radiology',
    admin: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'admin-rad-d@example.com',
      password: 'Password123!'
    },
    scheduler: {
      firstName: 'David',
      lastName: 'Miller',
      email: 'scheduler-d@example.com',
      password: 'Password123!',
      role: 'scheduler'
    }
  },
  schedulingNotes: 'Patient scheduled for 05/15/2025 at 10:30 AM. Please arrive 15 minutes early.',
  scheduledDate: '2025-05-15T10:30:00.000Z'
};

// Main test function
async function runTest() {
  helpers.log(`Starting ${SCENARIO}`, SCENARIO);
  
  try {
    // Get data from Scenario C
    const scenarioCData = JSON.parse(fs.readFileSync(
      path.join(helpers.config.resultsDir, 'scenario-c.json'),
      'utf8'
    ));
    
    if (!scenarioCData || !scenarioCData.orderId) {
      throw new Error('Could not find orderId from Scenario C. Please run Scenario C first.');
    }
    
    const orderId = scenarioCData.orderId;
    helpers.storeTestData('orderId', orderId, SCENARIO);
    helpers.log(`Using order ID from Scenario C: ${orderId}`, SCENARIO);
    
    // Step 1: Register Radiology Organization and Admin
    helpers.log('Step 1: Register Radiology Organization and Admin', SCENARIO);
    const registerResponse = await helpers.registerOrganization(
      testData.radiology.orgName,
      testData.radiology.orgType,
      testData.radiology.admin.firstName,
      testData.radiology.admin.lastName,
      testData.radiology.admin.email,
      testData.radiology.admin.password
    );
    
    // Store organization and admin data
    const orgId = helpers.storeTestData('orgId', registerResponse.organization.id, SCENARIO);
    const adminId = helpers.storeTestData('adminId', registerResponse.user.id, SCENARIO);
    helpers.log(`Radiology organization created with ID: ${orgId}`, SCENARIO);
    helpers.log(`Radiology admin created with ID: ${adminId}`, SCENARIO);
    
    // Login as admin
    const adminToken = await helpers.login(
      testData.radiology.admin.email,
      testData.radiology.admin.password
    );
    helpers.storeTestData('adminToken', adminToken, SCENARIO);
    
    // Step 2: Create Radiology Scheduler
    helpers.log('Step 2: Create Radiology Scheduler', SCENARIO);
    const schedulerResponse = await helpers.createUser(
      testData.radiology.scheduler.firstName,
      testData.radiology.scheduler.lastName,
      testData.radiology.scheduler.email,
      testData.radiology.scheduler.password,
      testData.radiology.scheduler.role,
      null, // No NPI needed for scheduler
      adminToken
    );
    
    // Store scheduler data
    const schedulerId = helpers.storeTestData('schedulerId', schedulerResponse.id, SCENARIO);
    helpers.log(`Radiology scheduler created with ID: ${schedulerId}`, SCENARIO);
    
    // Step 3: Create Connection Between Referring and Radiology
    helpers.log('Step 3: Create Connection Between Organizations', SCENARIO);
    
    // Get referring org ID from Scenario A
    const scenarioAData = JSON.parse(fs.readFileSync(
      path.join(helpers.config.resultsDir, 'scenario-a.json'),
      'utf8'
    ));
    
    if (!scenarioAData || !scenarioAData.orgId) {
      throw new Error('Could not find referring orgId from Scenario A.');
    }
    
    const referringOrgId = scenarioAData.orgId;
    
    // Request connection from radiology to referring
    const connectionRequest = await helpers.apiRequest(
      'post',
      '/connections',
      {
        targetOrganizationId: referringOrgId,
        notes: 'Connection for testing'
      },
      adminToken
    );
    
    const connectionId = helpers.storeTestData('connectionId', connectionRequest.id, SCENARIO);
    helpers.log(`Connection request created with ID: ${connectionId}`, SCENARIO);
    
    // Login as referring admin to approve connection
    const referringAdminToken = await helpers.login(
      scenarioAData.referring.admin.email,
      scenarioAData.referring.admin.password
    );
    
    // Approve connection
    const approveResponse = await helpers.apiRequest(
      'post',
      `/connections/${connectionId}/approve`,
      {},
      referringAdminToken
    );
    
    if (!approveResponse.success) {
      throw new Error('Connection approval failed');
    }
    
    helpers.log('Connection approved successfully', SCENARIO);
    
    // Step 4: Login as Radiology Scheduler
    helpers.log('Step 4: Login as Radiology Scheduler', SCENARIO);
    const schedulerToken = await helpers.login(
      testData.radiology.scheduler.email,
      testData.radiology.scheduler.password
    );
    helpers.storeTestData('schedulerToken', schedulerToken, SCENARIO);
    
    // Step 5: Call /radiology/orders (queue)
    helpers.log('Step 5: Get Radiology Orders Queue', SCENARIO);
    const ordersQueueResponse = await helpers.apiRequest(
      'get',
      '/radiology/orders?status=pending_radiology',
      null,
      schedulerToken
    );
    
    // Verify the order is in the queue
    const orderInQueue = ordersQueueResponse.orders.some(o => o.id === orderId);
    if (!orderInQueue) {
      throw new Error(`Order ${orderId} not found in radiology queue`);
    }
    
    helpers.log('Order found in radiology queue', SCENARIO);
    
    // Step 6: Call /radiology/orders/{orderId} (details)
    helpers.log('Step 6: Get Order Details', SCENARIO);
    const orderDetailsResponse = await helpers.apiRequest(
      'get',
      `/radiology/orders/${orderId}`,
      null,
      schedulerToken
    );
    
    // Verify order details
    if (orderDetailsResponse.id !== orderId) {
      throw new Error('Order details ID mismatch');
    }
    
    if (orderDetailsResponse.status !== 'pending_radiology') {
      throw new Error(`Unexpected order status: ${orderDetailsResponse.status}`);
    }
    
    helpers.log('Order details retrieved successfully', SCENARIO);
    
    // Step 7: Call /radiology/orders/{orderId}/update-status (set to 'scheduled')
    helpers.log('Step 7: Update Order Status to Scheduled', SCENARIO);
    const updateStatusResponse = await helpers.apiRequest(
      'post',
      `/radiology/orders/${orderId}/update-status`,
      {
        status: 'scheduled',
        notes: testData.schedulingNotes,
        scheduledDate: testData.scheduledDate
      },
      schedulerToken
    );
    
    // Verify status update
    if (!updateStatusResponse.success) {
      throw new Error('Status update failed');
    }
    
    const finalStatus = updateStatusResponse.status;
    helpers.storeTestData('finalStatus', finalStatus, SCENARIO);
    helpers.log(`Order status updated to: ${finalStatus}`, SCENARIO);
    
    // Verify status is now scheduled
    if (finalStatus !== 'scheduled') {
      throw new Error(`Unexpected status after update: ${finalStatus}`);
    }
    
    // Step 8: Verify Final Order State
    helpers.log('Step 8: Verify Final Order State', SCENARIO);
    
    // Get updated order details
    const finalOrderDetails = await helpers.apiRequest(
      'get',
      `/radiology/orders/${orderId}`,
      null,
      schedulerToken
    );
    
    // Verify order status
    if (finalOrderDetails.status !== 'scheduled') {
      throw new Error(`Unexpected order status: ${finalOrderDetails.status}`);
    }
    
    // Verify scheduling notes
    if (finalOrderDetails.schedulingNotes !== testData.schedulingNotes) {
      throw new Error('Scheduling notes do not match');
    }
    
    // Verify scheduled date
    if (new Date(finalOrderDetails.scheduledDate).toISOString() !== testData.scheduledDate) {
      throw new Error('Scheduled date does not match');
    }
    
    // Verify order history includes status update
    if (!finalOrderDetails.history || 
        !finalOrderDetails.history.some(h => h.action === 'status_update' && h.newStatus === 'scheduled')) {
      throw new Error('Order history is missing status update action');
    }
    
    helpers.log('Order verification completed successfully', SCENARIO);
    helpers.log(`${SCENARIO} completed successfully`, SCENARIO);
    
  } catch (error) {
    helpers.log(`Error in ${SCENARIO}: ${error.message}`, SCENARIO);
    throw error;
  }
}

// Run the test
runTest().catch(error => {
  helpers.log(`Test failed: ${error.message}`, SCENARIO);
  process.exit(1);
});