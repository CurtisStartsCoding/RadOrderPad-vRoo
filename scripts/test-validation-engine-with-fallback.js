/**
 * Test script for validation engine with PostgreSQL fallback
 * 
 * This script tests the full validation flow:
 * 1. Closes Redis connection to force PostgreSQL fallback
 * 2. Makes API calls to validate dictation text
 * 3. Verifies that the validation results are correct
 */

const axios = require('axios');
const { closeRedisConnection } = require('../dist/config/redis');

// API URL and JWT token
const API_URL = 'http://localhost:3000';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NTE4NTk5NCwiZXhwIjoxNzQ1MjcyMzk0fQ.CPle3x1WWqYMklkIsh79J4ZKdW4l05Jv1XW_nQHh_WI';

// Test cases
const testCases = [
  {
    name: 'Shoulder pain with MRI',
    dictation: `
      Patient presents with right shoulder pain after a fall. 
      The pain is worse with movement and there is limited range of motion.
      Patient has a history of osteoarthritis.
      Requesting MRI of the right shoulder to rule out rotator cuff tear.
    `,
    expectedKeywords: ['shoulder', 'pain', 'MRI', 'rotator cuff', 'tear', 'osteoarthritis']
  },
  {
    name: 'Headache with CT scan',
    dictation: `
      Patient presents with severe headache for 3 days.
      The pain is worse with light and sound.
      No history of migraines.
      Requesting CT scan of the head to rule out intracranial hemorrhage.
    `,
    expectedKeywords: ['headache', 'CT', 'head', 'intracranial', 'hemorrhage']
  },
  {
    name: 'Abdominal pain with ultrasound',
    dictation: `
      Patient presents with right upper quadrant abdominal pain for 2 days.
      The pain is worse after eating fatty foods.
      No fever or vomiting.
      Requesting ultrasound of the abdomen to evaluate for gallstones.
    `,
    expectedKeywords: ['abdominal', 'pain', 'ultrasound', 'gallstones']
  }
];

/**
 * Run a validation test
 */
async function runValidationTest(testCase) {
  console.log(`\n=== Testing: ${testCase.name} ===`);
  console.log(`Dictation: ${testCase.dictation.substring(0, 100)}...`);
  
  try {
    // Make API call to validate the dictation
    const response = await axios.post(`${API_URL}/api/orders/validate`, {
      dictationText: testCase.dictation,
      patientInfo: {
        id: 12345,
        firstName: "Test",
        lastName: "Patient",
        dateOfBirth: "1980-01-01",
        gender: "male"
      },
      testMode: true,
      skipDatabaseOperations: true
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    });
    
    // Extract the validation result
    const result = response.data.validationResult;
    
    // Check if result exists and has the expected properties
    if (result) {
      console.log(`Validation Status: ${result.validationStatus || 'N/A'}`);
      console.log(`Compliance Score: ${result.complianceScore || 'N/A'}`);
      console.log(`Feedback: ${result.feedback ? result.feedback.substring(0, 100) + '...' : 'N/A'}`);
      
      // Display suggested codes
      if (result.suggestedICD10Codes && result.suggestedICD10Codes.length > 0) {
        console.log('Suggested ICD-10 Codes:');
        result.suggestedICD10Codes.forEach(code => {
          console.log(`- ${code.code}: ${code.description}`);
        });
      } else {
        console.log('No suggested ICD-10 codes');
      }
      
      if (result.suggestedCPTCodes && result.suggestedCPTCodes.length > 0) {
        console.log('Suggested CPT Codes:');
        result.suggestedCPTCodes.forEach(code => {
          console.log(`- ${code.code}: ${code.description}`);
        });
      } else {
        console.log('No suggested CPT codes');
      }
      
      // Check if the result contains any of the expected keywords
      const keywordsFound = testCase.expectedKeywords.filter(keyword => {
        // Check in ICD-10 codes
        const inIcd10 = result.suggestedICD10Codes?.some(code => 
          code.description.toLowerCase().includes(keyword.toLowerCase())
        ) || false;
        
        // Check in CPT codes
        const inCpt = result.suggestedCPTCodes?.some(code => 
          code.description.toLowerCase().includes(keyword.toLowerCase())
        ) || false;
        
        // Check in feedback
        const inFeedback = result.feedback?.toLowerCase().includes(keyword.toLowerCase()) || false;
        
        return inIcd10 || inCpt || inFeedback;
      });
      
      const keywordsFoundPercentage = Math.round((keywordsFound.length / testCase.expectedKeywords.length) * 100);
      console.log(`Keywords found: ${keywordsFound.length}/${testCase.expectedKeywords.length} (${keywordsFoundPercentage}%)`);
      console.log(`Found keywords: ${keywordsFound.join(', ')}`);
      console.log(`Missing keywords: ${testCase.expectedKeywords.filter(k => !keywordsFound.includes(k)).join(', ')}`);
      
      const passed = keywordsFoundPercentage >= 50; // At least 50% of keywords should be found
      console.log(`Test result: ${passed ? 'PASS ✓' : 'FAIL ✗'}`);
      
      return {
        name: testCase.name,
        passed,
        keywordsFoundPercentage,
        result
      };
    } else {
      console.log('Invalid or incomplete result received from API');
      console.log('Raw response:', JSON.stringify(response.data));
      
      return {
        name: testCase.name,
        passed: false,
        error: 'Invalid or incomplete validation result'
      };
    }
  } catch (error) {
    console.error(`Error testing ${testCase.name}:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    return {
      name: testCase.name,
      passed: false,
      error: error.message
    };
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  try {
    console.log('Starting validation engine tests with PostgreSQL fallback...');
    
    // Close Redis connection to force PostgreSQL fallback
    console.log('Closing Redis connection to force PostgreSQL fallback...');
    await closeRedisConnection();
    console.log('Redis connection closed');
    
    // Run all test cases
    const results = [];
    for (const testCase of testCases) {
      const result = await runValidationTest(testCase);
      results.push(result);
    }
    
    // Print summary
    console.log('\n=== Test Summary ===');
    const passedTests = results.filter(r => r.passed).length;
    console.log(`Passed: ${passedTests}/${results.length} (${Math.round(passedTests / results.length * 100)}%)`);
    
    for (const result of results) {
      console.log(`- ${result.name}: ${result.passed ? 'PASS ✓' : 'FAIL ✗'}`);
    }
    
    // Overall result
    const overallSuccess = passedTests === results.length;
    console.log(`\nOverall result: ${overallSuccess ? 'SUCCESS ✓' : 'FAILURE ✗'}`);
    
    return overallSuccess;
  } catch (error) {
    console.error('Error running tests:', error);
    return false;
  }
}

// Run the tests
runAllTests().then(success => {
  console.log(`\nTests ${success ? 'completed successfully' : 'failed'}`);
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});