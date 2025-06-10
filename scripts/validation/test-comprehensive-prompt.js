/**
 * Test script to verify the comprehensive prompt is working correctly
 * 
 * This script sends a test order to the validation endpoint and checks
 * the response to ensure it follows the new format requirements.
 */

const axios = require('axios');
require('dotenv').config();

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const API_PATH = process.env.API_PATH || '/api';
const API_URL = `${API_BASE_URL}${API_PATH}`;
const AUTH_TOKEN = process.env.TEST_AUTH_TOKEN; // JWT token for authentication

// Sample dictation text for testing
const SAMPLE_DICTATION = `
Patient is a 45-year-old female with persistent right lower quadrant pain for 3 weeks. 
Pain is sharp, 7/10 intensity, and worse with movement. 
Patient reports nausea but no vomiting. 
No fever. 
Previous ultrasound 2 weeks ago was inconclusive. 
Patient has tried OTC pain medications without relief.
Physical exam shows tenderness to palpation in RLQ with mild guarding.
No rebound tenderness.
Patient has history of ovarian cysts 5 years ago.
Lab results show slightly elevated WBC of 11.2.
Request CT abdomen and pelvis with contrast to evaluate for appendicitis vs. ovarian pathology.
`;

/**
 * Send a validation request to the API
 */
async function testValidation() {
  console.log('Testing validation with comprehensive prompt...');
  console.log('Sample dictation:');
  console.log(SAMPLE_DICTATION);
  console.log('\n');

  try {
    // Prepare the request payload based on the expected format in physician_order_flow.md
    const payload = {
      dictationText: SAMPLE_DICTATION,
      // For the first validation attempt, we don't send an orderId
      // The backend will create a pending order and return the orderId
      patientInfo: {
        id: 1, // This is the patientId
        firstName: 'Jane',
        lastName: 'Doe',
        dateOfBirth: '1980-01-15',
        gender: 'female'
      },
      referringPhysicianId: 1, // Add referring physician ID
      referringOrganizationId: 1 // Add referring organization ID
    };

    // Construct the endpoint URL using the base URL and path
    const validateEndpoint = `${API_URL}/orders/validate`;
    console.log(`Sending request to: ${validateEndpoint}`);
    
    // Make the API request
    const response = await axios.post(validateEndpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });

    // Check the response
    console.log('Validation Response:');
    console.log(JSON.stringify(response.data, null, 2));

    // Verify the response format
    verifyResponse(response.data);

    return response.data;
  } catch (error) {
    console.error('Error during validation test:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

/**
 * Verify the response follows the new format requirements
 */
function verifyResponse(response) {
  console.log('\nVerifying response format...');
  
  // Check for required fields
  const requiredFields = ['success', 'orderId', 'validationResult'];
  for (const field of requiredFields) {
    if (!(field in response)) {
      console.error(`❌ Missing required field: ${field}`);
    } else {
      console.log(`✅ Found required field: ${field}`);
    }
  }

  const validationResult = response.validationResult;
  if (!validationResult) {
    console.error('❌ Missing validationResult object');
    return;
  }

  // Check validation result fields
  const resultFields = [
    'validationStatus', 
    'complianceScore', 
    'feedback', 
    'suggestedICD10Codes', 
    'suggestedCPTCodes'
  ];
  
  for (const field of resultFields) {
    if (!(field in validationResult)) {
      console.error(`❌ Missing validation result field: ${field}`);
    } else {
      console.log(`✅ Found validation result field: ${field}`);
    }
  }

  // Check ICD-10 codes (should have at least 3-4)
  const icd10Codes = validationResult.suggestedICD10Codes || [];
  if (icd10Codes.length < 3) {
    console.error(`❌ Not enough ICD-10 codes: ${icd10Codes.length} (expected at least 3)`);
  } else {
    console.log(`✅ Found ${icd10Codes.length} ICD-10 codes`);
  }

  // Check if there's a primary ICD-10 code
  const primaryCodes = icd10Codes.filter(code => code.isPrimary);
  if (primaryCodes.length !== 1) {
    console.error(`❌ Expected exactly 1 primary ICD-10 code, found ${primaryCodes.length}`);
  } else {
    console.log(`✅ Found primary ICD-10 code: ${primaryCodes[0].code}`);
  }

  // Check CPT codes
  const cptCodes = validationResult.suggestedCPTCodes || [];
  if (cptCodes.length === 0) {
    console.error('❌ No CPT codes found');
  } else {
    console.log(`✅ Found ${cptCodes.length} CPT codes`);
  }

  console.log('\nVerification complete!');
}

// Run the test
testValidation()
  .then(() => {
    console.log('\nTest completed successfully!');
  })
  .catch(error => {
    console.error('\nTest failed:', error.message);
    process.exit(1);
  });