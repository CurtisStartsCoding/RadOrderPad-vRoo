/**
 * Test script to verify that the test-helpers-simple.js file is working correctly for Scenario A
 */

const helpers = require('./test-helpers');

// Scenario name for logging
const SCENARIO = 'Scenario-A-Test';

async function runTest() {
  helpers.log(`Starting ${SCENARIO}`, SCENARIO);
  
  try {
    // Step 1: Register Referring Organization and Admin
    helpers.log('Step 1: Register Referring Organization and Admin', SCENARIO);
    const referringRegisterResponse = await helpers.registerOrganization(
      'Test Referring Practice A',
      'referring',
      'John',
      'Smith',
      'admin-ref-a@example.com',
      'Password123!'
    );
    
    // Store referring organization and admin data
    const referringOrgId = helpers.storeTestData('referringOrgId', referringRegisterResponse.organization.id, SCENARIO);
    const referringAdminId = helpers.storeTestData('referringAdminId', referringRegisterResponse.user.id, SCENARIO);
    helpers.log(`Referring organization created with ID: ${referringOrgId}`, SCENARIO);
    helpers.log(`Referring admin created with ID: ${referringAdminId}`, SCENARIO);
    
    // Step 2: Login as Admin
    helpers.log('Step 2: Login as Admin', SCENARIO);
    const adminToken = await helpers.login(
      'admin-ref-a@example.com',
      'Password123!'
    );
    helpers.storeTestData('adminToken', adminToken, SCENARIO);
    
    // Step 3: Register Physician
    helpers.log('Step 3: Register Physician', SCENARIO);
    const physician = await helpers.createUser(
      'Jane',
      'Smith',
      'physician-a@example.com',
      'Password123!',
      'physician',
      '1234567890',
      adminToken,
      SCENARIO
    );
    
    helpers.log(`Physician created with ID: ${physician.id}`, SCENARIO);
    
    // Step 4: Login as Physician
    helpers.log('Step 4: Login as Physician', SCENARIO);
    const physicianToken = await helpers.login(
      'physician-a@example.com',
      'Password123!'
    );
    helpers.storeTestData('physicianToken', physicianToken, SCENARIO);
    
    // Step 5: Validate Dictation
    helpers.log('Step 5: Validate Dictation', SCENARIO);
    const dictation = '72-year-old male with persistent lower back pain radiating to left leg for 3 months. History of degenerative disc disease. Physical exam shows positive straight leg raise test on left. Conservative treatment with NSAIDs and physical therapy for 6 weeks with minimal improvement.';
    
    const patientInfo = {
      firstName: 'Robert',
      lastName: 'Johnson',
      dateOfBirth: '1950-05-15',
      gender: 'male',
      mrn: 'MRN12345A',
      insurance: 'Medicare',
      policyNumber: '123456789A'
    };
    
    const validationResponse = await helpers.validateDictation(
      dictation,
      patientInfo,
      physicianToken,
      SCENARIO
    );
    
    const orderId = helpers.storeTestData('orderId', validationResponse.orderId, SCENARIO);
    helpers.log(`Order created with ID: ${orderId}`, SCENARIO);
    helpers.log(`Validation status: ${validationResponse.validationStatus}`, SCENARIO);
    helpers.log(`CPT code: ${validationResponse.cptCode}`, SCENARIO);
    helpers.log(`ICD-10 codes: ${validationResponse.icd10Codes.join(', ')}`, SCENARIO);
    
    // Step 6: Finalize and Sign Order
    helpers.log('Step 6: Finalize and Sign Order', SCENARIO);
    const signature = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    
    const finalizeResponse = await helpers.finalizeOrder(
      orderId,
      signature,
      physicianToken,
      SCENARIO
    );
    
    helpers.log(`Order finalized with status: ${finalizeResponse.status}`, SCENARIO);
    
    // Step 7: Verify Order Status and History
    helpers.log('Step 7: Verify Order Status and History', SCENARIO);
    const orderDetails = await helpers.apiRequest(
      'get',
      `/orders/${orderId}`,
      null,
      physicianToken,
      SCENARIO
    );
    
    helpers.log(`Order status: ${orderDetails.status}`, SCENARIO);
    
    // Verify order status
    if (orderDetails.status !== 'pending_admin') {
      throw new Error(`Unexpected order status: ${orderDetails.status}`);
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