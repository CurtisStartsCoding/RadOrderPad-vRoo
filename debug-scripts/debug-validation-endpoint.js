/**
 * Script to debug the validation endpoint
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
console.log('\nAPI URL:', API_URL);

// Sample dictation text for testing
const SAMPLE_DICTATION = `
Patient with headache for 3 days. Request MRI brain.
`;

async function debugValidation() {
  try {
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
    
    console.log('Request payload:', JSON.stringify(payload, null, 2));
    console.log('Sending request to:', `${API_URL}/orders/validate`);
    
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
    
    // Log the full response
    console.log('\nFull validation response:');
    console.log(JSON.stringify(response.data, null, 2));
    
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
      console.error('Request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

// Run the debug function
debugValidation();