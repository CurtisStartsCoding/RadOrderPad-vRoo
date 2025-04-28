/**
 * Test script for order validation and update
 * This script combines the validation functionality from the e2e tests
 * with the order update functionality from the Vercel tests
 */

const axios = require('axios');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

// Configuration
const API_URL = 'https://radorderpad-q20dishz7-capecomas-projects.vercel.app';
const JWT_SECRET = process.env.JWT_SECRET || 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';

// Ensure results directory exists
const resultsDir = path.join(__dirname, '../../test-results/vercel-tests');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Test data
const testData = {
  patient: {
    id: 1, // Temporary patient ID (required field)
    firstName: 'Robert',
    lastName: 'Johnson',
    dateOfBirth: '1950-05-15',
    gender: 'male',
    mrn: `MRN12345A-${Date.now()}` // Ensure unique MRN
  },
  dictation: '72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy.',
  signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
};

// Generate token for physician role
function generatePhysicianToken() {
  const payload = {
    userId: 3,
    orgId: 1,
    role: 'physician',
    email: 'test.physician@example.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return jwt.sign(payload, JWT_SECRET);
}

// Create API client with authentication
function createAuthClient(token) {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function recordTestResult(name, passed, error = null, response = null) {
  if (passed) {
    testResults.passed++;
    console.log(`✅ PASSED: ${name}`);
    if (response) {
      console.log(`   Response: ${JSON.stringify(response.data).substring(0, 200)}...`);
    }
  } else {
    testResults.failed++;
    console.log(`❌ FAILED: ${name}`);
    if (error) {
      console.log(`   Error: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
  }
  
  testResults.tests.push({
    name,
    passed,
    error: error ? {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    } : null,
    response: response ? {
      status: response.status,
      data: response.data
    } : null
  });
}

// Test functions
async function testValidateDictation() {
  try {
    console.log(`\n🔍 Testing POST /api/orders/validate...`);
    
    const token = generatePhysicianToken();
    const client = createAuthClient(token);
    
    const data = {
      dictationText: testData.dictation,
      patientInfo: testData.patient
    };
    
    const response = await client.post(`/api/orders/validate`, data);
    recordTestResult(`POST /api/orders/validate`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`POST /api/orders/validate`, false, error);
    return null;
  }
}

async function testUpdateOrder(orderId, validationResult) {
  try {
    console.log(`\n🔍 Testing PUT /api/orders/${orderId}...`);
    
    const token = generatePhysicianToken();
    const client = createAuthClient(token);
    
    // Extract CPT and ICD-10 codes from validation result
    const cptCode = validationResult.suggestedCPTCodes[0].code;
    const icd10Codes = validationResult.suggestedICD10Codes.map(code => code.code);
    
    // Include all required fields with valid values
    const updateData = {
      signature: testData.signature,
      status: 'pending_admin',
      finalValidationStatus: validationResult.validationStatus,
      finalCPTCode: cptCode,
      clinicalIndication: validationResult.feedback,
      finalICD10Codes: icd10Codes
    };
    
    const response = await client.put(`/api/orders/${orderId}`, updateData);
    recordTestResult(`PUT /api/orders/${orderId}`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`PUT /api/orders/${orderId}`, false, error);
    return null;
  }
}

async function testGetOrderById(orderId) {
  try {
    console.log(`\n🔍 Testing GET /api/orders/${orderId}...`);
    
    const token = generatePhysicianToken();
    const client = createAuthClient(token);
    
    const response = await client.get(`/api/orders/${orderId}`);
    recordTestResult(`GET /api/orders/${orderId}`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`GET /api/orders/${orderId}`, false, error);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== TESTING ORDER VALIDATION AND UPDATE ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('=========================================\n');
  
  // Step 1: Validate dictation
  console.log('Step 1: Validating dictation...');
  const validationResponse = await testValidateDictation();
  
  if (validationResponse && validationResponse.success) {
    const orderId = validationResponse.orderId;
    const validationResult = validationResponse.validationResult;
    
    console.log(`Order created with ID: ${orderId}`);
    console.log(`Validation status: ${validationResult.validationStatus}`);
    
    // Extract CPT and ICD-10 codes
    const cptCodes = validationResult.suggestedCPTCodes.map(code => code.code);
    const icd10Codes = validationResult.suggestedICD10Codes.map(code => code.code);
    
    console.log(`CPT codes: ${cptCodes.join(', ')}`);
    console.log(`ICD-10 codes: ${icd10Codes.join(', ')}`);
    
    // Step 2: Update order with validation results
    console.log('\nStep 2: Updating order with validation results...');
    const updateResponse = await testUpdateOrder(orderId, validationResult);
    
    if (updateResponse) {
      // Step 3: Verify order status
      console.log('\nStep 3: Verifying order status...');
      const orderDetails = await testGetOrderById(orderId);
      
      if (orderDetails) {
        console.log(`Order status: ${orderDetails.status}`);
        
        // Check if the order has the expected fields
        if (orderDetails.finalValidationStatus === validationResult.validationStatus) {
          console.log(`✅ Order has correct finalValidationStatus: ${orderDetails.finalValidationStatus}`);
        } else {
          console.log(`❌ Order has incorrect finalValidationStatus: ${orderDetails.finalValidationStatus}`);
        }
        
        if (orderDetails.finalCPTCode === cptCodes[0]) {
          console.log(`✅ Order has correct finalCPTCode: ${orderDetails.finalCPTCode}`);
        } else {
          console.log(`❌ Order has incorrect finalCPTCode: ${orderDetails.finalCPTCode}`);
        }
      }
    }
  }
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log('===================');
  
  // Save results to file
  fs.writeFileSync(path.join(resultsDir, 'validation-and-update-results.json'), JSON.stringify(testResults, null, 2));
  console.log('\nTest results saved to test-results/vercel-tests/validation-and-update-results.json');
}

// Execute tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
});