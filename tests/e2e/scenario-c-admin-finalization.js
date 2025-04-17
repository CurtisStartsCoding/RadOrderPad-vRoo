/**
 * Scenario C: Admin Finalization
 * 
 * This test scenario covers:
 * 1. Using an orderId from Scenario A (status 'pending_admin')
 * 2. Login as Admin Staff
 * 3. Call /paste-summary
 * 4. Call /send-to-radiology
 * 5. Verify Order Status ('pending_radiology'), credit_usage_logs, order_history, patient_clinical_records
 */

const helpers = require('./test-helpers');
const fs = require('fs');
const path = require('path');

// Scenario name for logging
const SCENARIO = 'Scenario-C';

// Test data
const testData = {
  summaryText: `PATIENT: Johnson, Robert
MRN: MRN12345A
DOB: 05/15/1950
REFERRING PHYSICIAN: Smith, Jane
CLINICAL INDICATION: Lower back pain radiating to left leg, history of degenerative disc disease
EXAM REQUESTED: MRI Lumbar Spine without contrast
INSURANCE: Medicare
POLICY #: 123456789A
GROUP #: MCARE2023`,
  
  supplementalText: `Patient reports pain level of 7/10, worse with movement. 
Previous conservative treatment with NSAIDs and physical therapy for 2 weeks with minimal improvement.
No bowel or bladder symptoms.
No recent trauma.`
};

// Main test function
async function runTest() {
  helpers.log(`Starting ${SCENARIO}`, SCENARIO);
  
  try {
    // Get data from Scenario A
    let scenarioAData;
    try {
      scenarioAData = JSON.parse(fs.readFileSync(
        path.join(helpers.config.resultsDir, 'scenario-a.json'),
        'utf8'
      ));
    } catch (error) {
      // If we can't find the file, create mock data
      helpers.log('Could not find Scenario A data, using mock data', SCENARIO);
      scenarioAData = {
        orderId: 'order_database_mock',
        referring: {
          admin: {
            email: 'admin-ref-a@example.com',
            password: 'Password123!'
          }
        }
      };
    }
    
    if (!scenarioAData || !scenarioAData.orderId) {
      throw new Error('Could not find orderId from Scenario A. Please run Scenario A first.');
    }
    
    const orderId = scenarioAData.orderId;
    helpers.storeTestData('orderId', orderId, SCENARIO);
    helpers.log(`Using order ID from Scenario A: ${orderId}`, SCENARIO);
    
    // Step 1: Login as Admin
    helpers.log('Step 1: Login as Admin', SCENARIO);
    const adminToken = await helpers.login(
      scenarioAData.referring?.admin?.email || 'admin-ref-a@example.com',
      scenarioAData.referring?.admin?.password || 'Password123!'
    );
    helpers.storeTestData('adminToken', adminToken, SCENARIO);
    
    // Step 2: Get order details to verify initial state
    helpers.log('Step 2: Verify Initial Order State', SCENARIO);
    const initialOrderDetails = await helpers.apiRequest(
      'get',
      `/orders/${orderId}`,
      null,
      adminToken
    );
    
    // Verify order is in pending_admin status
    if (initialOrderDetails.status !== 'pending_admin') {
      throw new Error(`Order is not in pending_admin status. Current status: ${initialOrderDetails.status}`);
    }
    
    helpers.log('Initial order state verified: pending_admin', SCENARIO);
    
    // Step 3: Call /paste-summary
    helpers.log('Step 3: Paste Summary', SCENARIO);
    const pasteSummaryResponse = await helpers.apiRequest(
      'post',
      `/orders/${orderId}/admin/paste-summary`,
      {
        summaryText: testData.summaryText
      },
      adminToken
    );
    
    // Verify paste-summary was successful
    if (!pasteSummaryResponse.success) {
      throw new Error('Paste summary failed');
    }
    
    helpers.log('Summary pasted successfully', SCENARIO);
    
    // Step 4: Call /paste-supplemental
    helpers.log('Step 4: Paste Supplemental Information', SCENARIO);
    const pasteSupplementalResponse = await helpers.apiRequest(
      'post',
      `/orders/${orderId}/admin/paste-supplemental`,
      {
        supplementalText: testData.supplementalText
      },
      adminToken
    );
    
    // Verify paste-supplemental was successful
    if (!pasteSupplementalResponse.success) {
      throw new Error('Paste supplemental failed');
    }
    
    helpers.log('Supplemental information pasted successfully', SCENARIO);
    
    // Step 5: Call /send-to-radiology
    helpers.log('Step 5: Send to Radiology', SCENARIO);
    const sendToRadiologyResponse = await helpers.apiRequest(
      'post',
      `/orders/${orderId}/admin/send-to-radiology`,
      {},
      adminToken
    );
    
    // Verify send-to-radiology was successful
    if (!sendToRadiologyResponse.success) {
      throw new Error('Send to radiology failed');
    }
    
    const finalStatus = sendToRadiologyResponse.status || 'pending_radiology';
    helpers.storeTestData('finalStatus', finalStatus, SCENARIO);
    helpers.log(`Order sent to radiology with status: ${finalStatus}`, SCENARIO);
    
    // Verify status is now pending_radiology
    if (finalStatus !== 'pending_radiology') {
      throw new Error(`Unexpected status after send to radiology: ${finalStatus}`);
    }
    
    // Step 6: Verify Order Status, credit_usage_logs, order_history, patient_clinical_records
    helpers.log('Step 6: Verify Final Order State', SCENARIO);
    
    // Get updated order details
    const finalOrderDetails = await helpers.apiRequest(
      'get',
      `/orders/${orderId}`,
      null,
      adminToken
    );
    
    // Verify order status
    if (finalOrderDetails.status !== 'pending_radiology') {
      throw new Error(`Unexpected order status: ${finalOrderDetails.status}`);
    }
    
    // Verify order history includes admin actions
    if (!finalOrderDetails.history || 
        !finalOrderDetails.history.some(h => h.action === 'paste_summary') ||
        !finalOrderDetails.history.some(h => h.action === 'paste_supplemental') ||
        !finalOrderDetails.history.some(h => h.action === 'send_to_radiology')) {
      throw new Error('Order history is missing admin actions');
    }
    
    // Verify clinical records were created
    if (!finalOrderDetails.clinicalRecords || finalOrderDetails.clinicalRecords.length < 2) {
      throw new Error('Clinical records are missing or incomplete');
    }
    
    // Verify credit usage
    // In a real implementation, we would query the credit_usage_logs table
    // For this test, we'll assume it's part of the order details
    if (!finalOrderDetails.creditUsage || finalOrderDetails.creditUsage.length < 1) {
      throw new Error('Credit usage logs are missing');
    }
    
    helpers.log('Order verification completed successfully', SCENARIO);
    helpers.log(`${SCENARIO} completed successfully`, SCENARIO);
    
    return true;
  } catch (error) {
    helpers.log(`Error in ${SCENARIO}: ${error.message}`, SCENARIO);
    return false;
  }
}

// Export the runTest function
module.exports = { runTest };

// If this script is run directly (not required), run the test
if (require.main === module) {
  runTest().then(success => {
    process.exit(success ? 0 : 1);
  });
}