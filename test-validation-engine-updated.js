const fetch = require('node-fetch');
const config = require('./test-config');
const fs = require('fs');
const API_URL = config.api.baseUrl;

// Read the token from the file
const JWT_TOKEN = fs.readFileSync('./test-token.txt', 'utf8').trim();

// Test cases
const testCases = [
  {
    name: 'Lower back pain with radiculopathy',
    dictation: 'Patient presents with lower back pain radiating down the left leg for 3 weeks. Pain is worse with sitting and bending. No improvement with NSAIDs. No history of trauma. Physical exam shows positive straight leg raise test on the left. Requesting MRI lumbar spine to evaluate for disc herniation.',
    expectedStatus: 'appropriate'
  },
  {
    name: 'Headache with concerning features',
    dictation: 'Patient with sudden onset severe headache described as "worst headache of life". Associated with nausea and photophobia. No fever. No history of migraines. Requesting CT head without contrast to rule out subarachnoid hemorrhage.',
    expectedStatus: 'appropriate'
  },
  {
    name: 'Routine screening mammogram',
    dictation: 'Patient is due for annual screening mammogram. No breast symptoms. No family history of breast cancer. Last mammogram was 12 months ago and was normal.',
    expectedStatus: 'appropriate'
  }
];

// Function to run a validation test
async function runValidationTest(testCase) {
  console.log(`\n=== Testing: ${testCase.name} ===`);
  console.log(`Dictation: ${testCase.dictation.substring(0, 100)}...`);
  
  try {
    const response = await fetch(`${API_URL}/orders/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWT_TOKEN}`
      },
      body: JSON.stringify({
        dictationText: testCase.dictation,
        patientInfo: {
          id: 1, // This is the required patient ID
          firstName: "Test",
          lastName: "Patient",
          dateOfBirth: "1980-01-01",
          gender: "M",
          mrn: "TEST12345"
        },
        skipDatabaseOperations: true // Add this flag to skip database operations
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const apiResponse = await response.json();
    
    // Extract the validation result from the API response
    const result = apiResponse.validationResult;
    
    // Check if result exists and has the expected properties
    if (result && result.validationStatus) {
      console.log(`Validation Status: ${result.validationStatus}`);
      console.log(`Compliance Score: ${result.complianceScore}`);
      console.log(`Feedback: ${result.feedback ? result.feedback.substring(0, 100) + '...' : 'N/A'}`);
      console.log(`Suggested ICD-10 Codes: ${JSON.stringify(result.suggestedICD10Codes || [])}`);
      console.log(`Suggested CPT Codes: ${JSON.stringify(result.suggestedCPTCodes || [])}`);
      
      // Check if the result matches the expected status (if provided)
      let statusMatch = false;
      if (testCase.expectedStatus && result.validationStatus) {
        statusMatch = result.validationStatus.toLowerCase() === testCase.expectedStatus.toLowerCase();
        console.log(`Status Match: ${statusMatch ? 'PASS ✓' : 'FAIL ✗'}`);
      } else {
        console.log('Status Match: SKIP (expected status not provided or actual status missing)');
      }
      
      return {
        name: testCase.name,
        passed: statusMatch,
        result
      };
    } else {
      console.log('Invalid or incomplete result received from API');
      console.log('Raw response:', JSON.stringify(apiResponse));
      
      return {
        name: testCase.name,
        passed: false,
        error: 'Invalid or incomplete validation result'
      };
    }
    
  } catch (error) {
    console.error(`Error testing ${testCase.name}:`, error);
    return {
      name: testCase.name,
      passed: false,
      error: error.message
    };
  }
}

// Run all tests
async function runAllTests() {
  console.log('Starting validation engine tests...');
  
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
}

// Run the tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});