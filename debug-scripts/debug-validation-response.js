/**
 * Script to debug the validation response
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

// Sample dictation text for testing
const SAMPLE_DICTATION = `
Patient with headache for 3 days. Request MRI brain.
`;

async function debugValidation() {
  try {
    console.log('Sending validation request with sample dictation:');
    console.log(SAMPLE_DICTATION);
    
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
    
    // Log the full response
    console.log('\nFull validation response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Check if there's a primary ICD-10 code
    const suggestedICD10Codes = response.data.validationResult?.suggestedICD10Codes || [];
    console.log('\nICD-10 Codes:');
    suggestedICD10Codes.forEach((code, index) => {
      console.log(`Code ${index + 1}: ${code.code} - ${code.description}, isPrimary: ${code.isPrimary}`);
    });
    
    const primaryCode = suggestedICD10Codes.find(code => code.isPrimary);
    if (primaryCode) {
      console.log(`\nPrimary ICD-10 code found: ${primaryCode.code} - ${primaryCode.description}`);
    } else {
      console.log('\nNo primary ICD-10 code found in the validation result');
    }
    
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

// Run the debug function
debugValidation();