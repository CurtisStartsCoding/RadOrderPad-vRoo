/**
 * Script to debug token generation and authentication
 */
require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Import the centralized configuration
const config = require('./test-config');

// API URL construction
const API_URL = config.api.baseUrl;

// Generate token for physician role
const PHYSICIAN_TOKEN = jwt.sign(
  { userId: 1, orgId: 1, role: 'physician', email: 'test.physician@example.com' },
  config.api.jwtSecret,
  { expiresIn: '24h' }
);

console.log('Generated physician token:');
console.log(PHYSICIAN_TOKEN);
console.log('\nToken payload:');
console.log(jwt.decode(PHYSICIAN_TOKEN));

// Sample dictation text for testing
const SAMPLE_DICTATION = `
Patient with headache for 3 days. Request MRI brain.
`;

async function debugAuth() {
  try {
    // First, try a simple API call to check authentication
    console.log('\nTesting authentication with a simple API call...');
    const authTestResponse = await axios.get(`${API_URL}/health`, {
      headers: {
        'Authorization': `Bearer ${PHYSICIAN_TOKEN}`
      }
    });
    
    console.log('Authentication test response:');
    console.log(authTestResponse.data);
    
    // Now try the validation request with timing
    console.log('\nSending validation request with timing...');
    const startTime = Date.now();
    
    // Prepare the request payload
    const payload = {
      dictationText: SAMPLE_DICTATION,
      patientInfo: {
        id: 1,
        firstName: 'Test',
        lastName: 'Patient',
        dateOfBirth: '1980-01-01',
        gender: 'female'
      },
      referringPhysicianId: 1,
      referringOrganizationId: 1
    };
    
    // Make the API request
    const response = await axios.post(`${API_URL}/orders/validate`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PHYSICIAN_TOKEN}`
      }
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`Validation request completed in ${duration}ms`);
    
    // Log the response status and headers
    console.log('\nResponse status:', response.status);
    console.log('Response headers:', response.headers);
    
    // Log a summary of the response
    console.log('\nValidation response summary:');
    console.log(`- Success: ${response.data.success}`);
    console.log(`- Order ID: ${response.data.orderId}`);
    console.log(`- Validation Status: ${response.data.validationResult?.validationStatus}`);
    console.log(`- Compliance Score: ${response.data.validationResult?.complianceScore}`);
    console.log(`- ICD-10 Codes: ${response.data.validationResult?.suggestedICD10Codes?.length || 0}`);
    console.log(`- CPT Codes: ${response.data.validationResult?.suggestedCPTCodes?.length || 0}`);
    
    // Check for error messages
    if (response.data.validationResult?.internalReasoning?.includes('Error')) {
      console.log('\nError detected in internal reasoning:');
      console.log(response.data.validationResult.internalReasoning);
    }
    
  } catch (error) {
    console.error('Error during debug:');
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

// Run the debug function
debugAuth();