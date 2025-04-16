/**
 * Script to test the validation endpoint directly
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

// Test case with minimal information
const TEST_CASE = {
  dictation: `
    Patient with history of lung cancer. Need PET scan.
  `
};

async function testValidationEndpoint() {
  try {
    console.log('Testing validation endpoint...');
    
    // Prepare the request payload
    const payload = {
      dictationText: TEST_CASE.dictation,
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
    
    console.log('Request payload:');
    console.log(JSON.stringify(payload, null, 2));
    
    console.log('\nSending request to validation endpoint...');
    
    // Make the API request
    const response = await axios.post(`${API_URL}/orders/validate`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    // Check the response
    console.log('\nResponse received:');
    console.log(`Status: ${response.status}`);
    console.log(`Status Text: ${response.statusText}`);
    
    if (response.data) {
      console.log('\nResponse data:');
      console.log(JSON.stringify(response.data, null, 2));
      
      if (response.data.validationResult) {
        console.log('\nValidation result:');
        console.log(`Validation Status: ${response.data.validationResult.validationStatus}`);
        console.log(`Compliance Score: ${response.data.validationResult.complianceScore}`);
        console.log(`Feedback: ${response.data.validationResult.feedback}`);
        
        if (response.data.validationResult.suggestedICD10Codes) {
          console.log('\nSuggested ICD-10 Codes:');
          response.data.validationResult.suggestedICD10Codes.forEach((code, index) => {
            console.log(`${index + 1}. ${code.code} - ${code.description}${code.isPrimary ? ' (PRIMARY)' : ''}`);
          });
        }
        
        if (response.data.validationResult.suggestedCPTCodes) {
          console.log('\nSuggested CPT Codes:');
          response.data.validationResult.suggestedCPTCodes.forEach((code, index) => {
            console.log(`${index + 1}. ${code.code} - ${code.description}`);
          });
        }
      }
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
    
    // Print more detailed error information
    console.error('\nDetailed error information:');
    if (error.config) {
      console.error('Request URL:', error.config.url);
      console.error('Request Method:', error.config.method);
      console.error('Request Headers:', error.config.headers);
      if (error.config.data) {
        console.error('Request Data:', error.config.data);
      }
    }
    
    if (error.response && error.response.headers) {
      console.error('Response Headers:', error.response.headers);
    }
    
    return null;
  }
}

// Run the test
testValidationEndpoint().then(result => {
  if (result) {
    console.log('\nValidation endpoint test completed successfully.');
  } else {
    console.error('\nValidation endpoint test failed.');
  }
});