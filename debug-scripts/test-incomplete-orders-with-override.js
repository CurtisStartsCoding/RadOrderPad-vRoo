/**
 * Script to test incomplete orders with override workflow
 */
require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Import the centralized configuration
const config = require('../test-config');

// API URL construction
const API_URL = config.api.baseUrl;

// Generate token for testing
const TEST_TOKEN = jwt.sign(
  { userId: 1, orgId: 1, role: 'physician', email: 'test.physician@example.com' },
  config.api.jwtSecret,
  { expiresIn: '24h' }
);

// Incomplete test cases
const TEST_CASES = [
  {
    name: "Case 1: Vague Headache with Minimal Information",
    dictation: `
      I have a patient with headache. Would like to get an MRI of the brain.
    `
  },
  {
    name: "Case 2: Abdominal Pain with Limited Clinical Information",
    dictation: `
      Patient has abdominal pain. Need CT abdomen with contrast.
    `
  },
  {
    name: "Case 3: Joint Pain with No Clinical Context",
    dictation: `
      Right knee pain. Requesting MRI.
    `
  },
  {
    name: "Case 4: Chest Symptoms with Minimal Details",
    dictation: `
      Patient has shortness of breath. Need chest CT.
    `
  }
];

// Override justifications
const OVERRIDE_JUSTIFICATIONS = [
  "Patient has concerning symptoms that warrant immediate imaging despite limited clinical information.",
  "Patient's history suggests potential serious pathology that requires urgent evaluation.",
  "Clinical examination findings are concerning and imaging is needed for proper diagnosis.",
  "Patient's condition has worsened and imaging is necessary for treatment planning."
];

async function testInitialValidation(testCase) {
  try {
    console.log(`\nTesting initial validation for ${testCase.name}...`);
    
    // Prepare the request payload
    const payload = {
      dictationText: testCase.dictation,
      patientInfo: {
        id: 1,
        firstName: 'Test',
        lastName: 'Patient',
        dateOfBirth: '1980-01-01',
        gender: 'male'
      },
      referringPhysicianId: 1,
      referringOrganizationId: 1
    };
    
    // Make the API request
    const response = await axios.post(`${API_URL}/orders/validate`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    // Check the response
    console.log(`Validation status: ${response.data.validationResult.validationStatus}`);
    console.log(`Feedback length: ${response.data.validationResult.feedback.split(' ').length} words`);
    console.log(`Feedback: ${response.data.validationResult.feedback}`);
    
    // Log ICD-10 codes
    console.log('ICD-10 Codes:');
    if (response.data.validationResult.suggestedICD10Codes && response.data.validationResult.suggestedICD10Codes.length > 0) {
      response.data.validationResult.suggestedICD10Codes.forEach((code, index) => {
        console.log(`  ${index + 1}. ${code.code} - ${code.description}${code.isPrimary ? ' (PRIMARY)' : ''}`);
      });
    } else {
      console.log('  None provided');
    }
    
    // Log CPT codes
    console.log('CPT Codes:');
    if (response.data.validationResult.suggestedCPTCodes && response.data.validationResult.suggestedCPTCodes.length > 0) {
      response.data.validationResult.suggestedCPTCodes.forEach((code, index) => {
        console.log(`  ${index + 1}. ${code.code} - ${code.description}`);
      });
    } else {
      console.log('  None provided');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error during validation:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error message:', error.message);
    }
  }
}

async function testOverrideValidation(testCase, justification, index) {
  try {
    console.log(`\nTesting override validation for ${testCase.name}...`);
    
    // Prepare the request payload
    const payload = {
      dictationText: testCase.dictation,
      patientInfo: {
        id: 1,
        firstName: 'Test',
        lastName: 'Patient',
        dateOfBirth: '1980-01-01',
        gender: 'male'
      },
      referringPhysicianId: 1,
      referringOrganizationId: 1,
      overrideJustification: justification,
      isOverride: true
    };
    
    // Make the API request
    const response = await axios.post(`${API_URL}/orders/validate`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    // Check the response
    console.log(`Override validation status: ${response.data.validationResult.validationStatus}`);
    console.log(`Override feedback length: ${response.data.validationResult.feedback.split(' ').length} words`);
    console.log(`Override feedback: ${response.data.validationResult.feedback}`);
    
    // Log ICD-10 codes
    console.log('Override ICD-10 Codes:');
    if (response.data.validationResult.suggestedICD10Codes && response.data.validationResult.suggestedICD10Codes.length > 0) {
      response.data.validationResult.suggestedICD10Codes.forEach((code, index) => {
        console.log(`  ${index + 1}. ${code.code} - ${code.description}${code.isPrimary ? ' (PRIMARY)' : ''}`);
      });
    } else {
      console.log('  None provided');
    }
    
    // Log CPT codes
    console.log('Override CPT Codes:');
    if (response.data.validationResult.suggestedCPTCodes && response.data.validationResult.suggestedCPTCodes.length > 0) {
      response.data.validationResult.suggestedCPTCodes.forEach((code, index) => {
        console.log(`  ${index + 1}. ${code.code} - ${code.description}`);
      });
    } else {
      console.log('  None provided');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error during override validation:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error message:', error.message);
    }
  }
}

async function runTests() {
  console.log('Testing incomplete orders with override workflow...');
  
  // For each test case
  for (let i = 0; i < TEST_CASES.length; i++) {
    const testCase = TEST_CASES[i];
    const justification = OVERRIDE_JUSTIFICATIONS[i];
    
    console.log(`\n=== Testing ${testCase.name} ===`);
    
    // Step 1: Initial validation (should fail or need clarification)
    await testInitialValidation(testCase);
    
    // Step 2: Override validation
    await testOverrideValidation(testCase, justification, i);
  }
  
  console.log('\nTests completed.');
}

// Run the tests
runTests().catch(err => {
  console.error('Unhandled error:', err);
});