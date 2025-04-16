/**
 * Script to test the specialty-specific word count feature
 */
require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Import the centralized configuration
const config = require('../test-config');

// API URL construction
const API_URL = config.api.baseUrl;

// Generate tokens with specialties but using user ID 1 (which exists in the database)
// This way we avoid "User not found" errors while still testing the specialty feature
const FAMILY_MEDICINE_TOKEN = jwt.sign(
  { userId: 1, orgId: 1, role: 'physician', email: 'test.physician@example.com', specialty: 'Family Medicine' },
  config.api.jwtSecret,
  { expiresIn: '24h' }
);

const DERMATOLOGY_TOKEN = jwt.sign(
  { userId: 1, orgId: 1, role: 'physician', email: 'test.physician@example.com', specialty: 'Dermatology' },
  config.api.jwtSecret,
  { expiresIn: '24h' }
);

const GENERAL_RADIOLOGY_TOKEN = jwt.sign(
  { userId: 1, orgId: 1, role: 'physician', email: 'test.physician@example.com', specialty: 'General Radiology' },
  config.api.jwtSecret,
  { expiresIn: '24h' }
);

const NO_SPECIALTY_TOKEN = jwt.sign(
  { userId: 1, orgId: 1, role: 'physician', email: 'test.physician@example.com' },
  config.api.jwtSecret,
  { expiresIn: '24h' }
);

// Sample dictation text for testing
const SAMPLE_DICTATION = `
Patient with headache for 3 days. Request MRI brain.
`;

async function testValidation(token, specialty) {
  try {
    console.log(`\nTesting validation with ${specialty || 'no specialty'}...`);
    
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
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Check the response
    console.log(`Validation status: ${response.data.validationResult.validationStatus}`);
    console.log(`Feedback length: ${response.data.validationResult.feedback.split(' ').length} words`);
    console.log(`Feedback: ${response.data.validationResult.feedback}`);
    
    // Check if there's any logging about the word count in the internal reasoning
    if (response.data.validationResult.internalReasoning) {
      const wordCountMatch = response.data.validationResult.internalReasoning.match(/word (count|limit).*?(\d+)/i);
      if (wordCountMatch) {
        console.log(`Word count mentioned in internal reasoning: ${wordCountMatch[0]}`);
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
  }
}

async function runTests() {
  console.log('Testing specialty-specific word count feature...');
  
  // Test with Family Medicine specialty (29 words)
  await testValidation(FAMILY_MEDICINE_TOKEN, 'Family Medicine');
  
  // Test with Dermatology specialty (30 words)
  await testValidation(DERMATOLOGY_TOKEN, 'Dermatology');
  
  // Test with General Radiology specialty (30 words)
  await testValidation(GENERAL_RADIOLOGY_TOKEN, 'General Radiology');
  
  // Test with no specialty (should default to General Radiology - 30 words)
  await testValidation(NO_SPECIALTY_TOKEN, null);
  
  console.log('\nTests completed.');
}

// Run the tests
runTests().catch(err => {
  console.error('Unhandled error:', err);
});