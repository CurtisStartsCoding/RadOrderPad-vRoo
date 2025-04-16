/**
 * Script to test validation with test medical data
 */
require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const config = require('../test-config');

// API URL construction
const API_URL = config.api.baseUrl;

// Generate token for testing
const TEST_TOKEN = jwt.sign(
  { userId: 1, orgId: 1, role: 'physician', email: 'test.physician@example.com' },
  config.api.jwtSecret,
  { expiresIn: '24h' }
);

// Test dictations that should match our test data
const TEST_DICTATIONS = [
  {
    name: "Low Back Pain",
    text: "45-year-old male with low back pain for 2 weeks. Pain radiates to left leg. No trauma. Need lumbar spine x-ray."
  },
  {
    name: "Right Lower Quadrant Pain",
    text: "22-year-old female with right lower quadrant pain, fever, and nausea for 12 hours. Suspect appendicitis. Need CT abdomen with contrast."
  },
  {
    name: "Headache",
    text: "35-year-old female with chronic headaches for 3 months, not responding to medication. Need MRI brain without contrast."
  }
];

// Function to validate a dictation
async function validateDictation(dictation) {
  try {
    console.log(`\nValidating dictation: "${dictation.text}"`);
    
    // Prepare the request payload
    const payload = {
      dictationText: dictation.text,
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
    console.log(`Sending request to ${API_URL}/orders/validate`);
    const response = await axios.post(`${API_URL}/orders/validate`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    // Extract the validation result
    const validationResult = response.data.validationResult;
    
    // Display the validation result
    console.log(`\nVALIDATION RESULT FOR: ${dictation.name}`);
    console.log(`Status: ${validationResult.validationStatus}`);
    console.log(`Compliance Score: ${validationResult.complianceScore}`);
    console.log(`Feedback: ${validationResult.feedback}`);
    
    // Display ICD-10 codes
    console.log('\nICD-10 Codes:');
    if (validationResult.suggestedICD10Codes && validationResult.suggestedICD10Codes.length > 0) {
      validationResult.suggestedICD10Codes.forEach((code, index) => {
        console.log(`  ${index + 1}. ${code.code} - ${code.description}${code.isPrimary ? ' (PRIMARY)' : ''}`);
      });
    } else {
      console.log('  None provided');
    }
    
    // Display CPT codes
    console.log('\nCPT Codes:');
    if (validationResult.suggestedCPTCodes && validationResult.suggestedCPTCodes.length > 0) {
      validationResult.suggestedCPTCodes.forEach((code, index) => {
        console.log(`  ${index + 1}. ${code.code} - ${code.description}`);
      });
    } else {
      console.log('  None provided');
    }
    
    // Check if our test data was found
    let foundTestData = false;
    
    // Check ICD-10 codes
    if (validationResult.suggestedICD10Codes) {
      if (dictation.name === "Low Back Pain" && 
          validationResult.suggestedICD10Codes.some(code => code.code === 'M54.5')) {
        foundTestData = true;
      } else if (dictation.name === "Right Lower Quadrant Pain" && 
                validationResult.suggestedICD10Codes.some(code => code.code === 'R10.31')) {
        foundTestData = true;
      } else if (dictation.name === "Headache" && 
                validationResult.suggestedICD10Codes.some(code => code.code === 'R51')) {
        foundTestData = true;
      }
    }
    
    // Check CPT codes
    if (validationResult.suggestedCPTCodes) {
      if (dictation.name === "Low Back Pain" && 
          validationResult.suggestedCPTCodes.some(code => code.code === '72110')) {
        foundTestData = true;
      } else if (dictation.name === "Right Lower Quadrant Pain" && 
                validationResult.suggestedCPTCodes.some(code => code.code === '74177')) {
        foundTestData = true;
      } else if (dictation.name === "Headache" && 
                validationResult.suggestedCPTCodes.some(code => code.code === '70551')) {
        foundTestData = true;
      }
    }
    
    console.log(`\nTEST DATA FOUND: ${foundTestData ? 'YES' : 'NO'}`);
    
    return {
      dictation: dictation.name,
      foundTestData,
      validationResult
    };
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
    
    return {
      dictation: dictation.name,
      foundTestData: false,
      error: error.message
    };
  }
}

// Main function to run the tests
async function runTests() {
  console.log('TESTING VALIDATION WITH TEST MEDICAL DATA');
  console.log('========================================');
  
  const results = [];
  
  // Run each test dictation
  for (const dictation of TEST_DICTATIONS) {
    try {
      const result = await validateDictation(dictation);
      results.push(result);
    } catch (error) {
      console.error(`Error in test for ${dictation.name}:`, error.message);
    }
  }
  
  // Print summary
  console.log('\nTEST RESULTS SUMMARY');
  console.log('===================');
  
  let foundCount = 0;
  
  for (const result of results) {
    console.log(`${result.dictation}: ${result.foundTestData ? 'FOUND' : 'NOT FOUND'}`);
    if (result.foundTestData) {
      foundCount++;
    }
  }
  
  console.log(`\nTotal tests: ${results.length}`);
  console.log(`Tests that found test data: ${foundCount}`);
  console.log(`Success rate: ${(foundCount / results.length * 100).toFixed(2)}%`);
  
  if (foundCount > 0) {
    console.log('\nCONCLUSION: The system is successfully querying the database for medical codes.');
  } else {
    console.log('\nCONCLUSION: The system is NOT querying the database for medical codes, or the queries are not working correctly.');
  }
}

// Run the tests
runTests().catch(err => {
  console.error('Unhandled error:', err);
});