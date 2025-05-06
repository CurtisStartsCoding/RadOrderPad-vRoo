/**
 * Compare Old vs New Validation Approaches
 * 
 * This script compares the old and new validation approaches by:
 * 1. Using the direct API endpoints with a special header to force old validation
 * 2. Using the same dictation text for both approaches
 * 3. Comparing the results side by side
 * 
 * The key is using the X-Use-Legacy-Validation header to force the old validation path
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Create results directory if it doesn't exist
const resultsDir = path.join(__dirname, 'validation-comparison-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Test cases - focusing on cases that should trigger preauthorization codes
const TEST_CASES = [
  {
    name: "Hemochromatosis Case",
    dictation: "48-year-old female with chronic diarrhea for past 4 months, typically 4-5 loose stools daily. Reports upper right quadrant discomfort after meals. Patient has noted darkening of skin on knuckles and neck folds. Recent lab work shows mildly elevated ferritin and transaminases. Family history significant for father with cirrhosis of \"unknown cause.\" Order abdominal ultrasound to evaluate for possible gallbladder disease.",
    expectedCodes: ["E83.110"], // Hemochromatosis
    preauthorizationCritical: true
  },
  {
    name: "Multiple Sclerosis Case",
    dictation: "32-year-old female with recurring episodes of blurred vision, numbness in extremities, and fatigue lasting 2-3 weeks. Recent episode included difficulty with balance. Patient reports family history of autoimmune disorders. Neurological exam shows mild nystagmus and decreased sensation in right leg. Order brain MRI with and without contrast to evaluate for demyelinating disease.",
    expectedCodes: ["G35"], // Multiple sclerosis
    preauthorizationCritical: true
  },
  {
    name: "Simple Gallbladder Case",
    dictation: "45-year-old male with right upper quadrant pain after fatty meals. No fever or jaundice. Order abdominal ultrasound to evaluate for gallstones.",
    expectedCodes: ["K80.20"], // Calculus of gallbladder without cholecystitis
    preauthorizationCritical: false
  }
];

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5001';
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// Generate a JWT token for authentication
function generateToken(user = {
  userId: 1,
  orgId: 1,
  role: 'physician',
  email: 'test.physician@example.com'
}, expiresIn = '24h') {
  const payload = {
    userId: user.userId,
    orgId: user.orgId,
    role: user.role,
    email: user.email
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Validate dictation using the API
 * @param {string} dictation - The dictation text
 * @param {boolean} useLegacy - Whether to use the legacy validation approach
 * @returns {Promise<Object>} - The validation result
 */
async function validateDictation(dictation, useLegacy = false) {
  try {
    // Generate JWT token for authentication
    const token = generateToken();
    console.log(`Generated JWT token: ${token.substring(0, 20)}...`);
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Test-Mode': 'true'
    };
    
    // Add the legacy validation header if needed
    if (useLegacy) {
      headers['X-Use-Legacy-Validation'] = 'true';
    }
    
    const response = await axios.post(`${API_BASE_URL}/orders/validate`, {
      dictationText: dictation,
      patientInfo: {
        id: 1,
        firstName: "Test",
        lastName: "Patient",
        dateOfBirth: "1980-01-01",
        gender: "M",
        mrn: "TEST12345"
      }
    }, { headers });
    
    return response.data;
  } catch (error) {
    console.error(`Error validating dictation: ${error.message}`);
    if (error.response) {
      console.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

/**
 * Check if the response contains specific codes
 * @param {Object} validationResult - The validation result
 * @param {string[]} expectedCodes - The expected codes
 * @param {boolean} isLegacy - Whether this is a legacy validation result
 * @returns {Object} - The check result
 */
function checkForExpectedCodes(validationResult, expectedCodes, isLegacy = false) {
  try {
    // Extract codes based on whether it's legacy or new format
    let codesArray = [];
    
    if (isLegacy) {
      // Legacy format
      codesArray = validationResult.icd10Codes || [];
    } else {
      // New format
      codesArray = validationResult.suggestedICD10Codes || [];
    }
    
    if (!codesArray || !Array.isArray(codesArray)) {
      return {
        found: false,
        foundCodes: [],
        message: 'No diagnosis codes found in response'
      };
    }
    
    const foundCodes = [];
    
    for (const expectedCode of expectedCodes) {
      const matchingCode = codesArray.find(code => {
        // Handle different formats
        if (typeof code === 'string') {
          return code === expectedCode || code.startsWith(expectedCode.split('.')[0]);
        } else if (code.code) {
          return code.code === expectedCode || code.code.startsWith(expectedCode.split('.')[0]);
        }
        return false;
      });
      
      if (matchingCode) {
        foundCodes.push(matchingCode);
      }
    }
    
    return {
      found: foundCodes.length > 0,
      foundCodes,
      message: foundCodes.length > 0 ? 
        `Found ${foundCodes.length}/${expectedCodes.length} expected codes` : 
        'No expected codes found'
    };
  } catch (error) {
    console.error('Error checking for expected codes:', error.message);
    return {
      found: false,
      foundCodes: [],
      message: `Error: ${error.message}`
    };
  }
}

/**
 * Test a single case with both old and new validation
 * @param {Object} testCase - The test case
 * @returns {Promise<Object>} - The test results
 */
async function testCase(testCase) {
  console.log(`\n=== Testing Case: ${testCase.name} ===`);
  console.log(`Dictation: "${testCase.dictation.substring(0, 100)}..."`);
  console.log(`Expected Codes: ${testCase.expectedCodes.join(', ')}`);
  console.log(`Preauthorization Critical: ${testCase.preauthorizationCritical ? 'YES' : 'No'}`);
  
  const results = {
    testCase: testCase.name,
    dictation: testCase.dictation,
    expectedCodes: testCase.expectedCodes,
    preauthorizationCritical: testCase.preauthorizationCritical,
    oldValidation: null,
    newValidation: null
  };
  
  try {
    // Test with old validation approach
    console.log('\n--- Testing with OLD validation approach ---');
    const oldValidationResult = await validateDictation(testCase.dictation, true);
    
    // Save raw response to file
    const oldValidationPath = path.join(resultsDir, `${testCase.name.replace(/\s+/g, '_')}_old_validation.json`);
    fs.writeFileSync(oldValidationPath, JSON.stringify(oldValidationResult, null, 2));
    
    // Check for expected codes
    const oldCodeCheck = checkForExpectedCodes(oldValidationResult, testCase.expectedCodes, true);
    console.log(`OLD validation: ${oldCodeCheck.message}`);
    
    results.oldValidation = {
      result: oldValidationResult,
      codeCheck: oldCodeCheck
    };
    
    // Test with new validation approach
    console.log('\n--- Testing with NEW validation approach ---');
    const newValidationResult = await validateDictation(testCase.dictation, false);
    
    // Save raw response to file
    const newValidationPath = path.join(resultsDir, `${testCase.name.replace(/\s+/g, '_')}_new_validation.json`);
    fs.writeFileSync(newValidationPath, JSON.stringify(newValidationResult, null, 2));
    
    // Check for expected codes
    const newCodeCheck = checkForExpectedCodes(newValidationResult, testCase.expectedCodes, false);
    console.log(`NEW validation: ${newCodeCheck.message}`);
    
    results.newValidation = {
      result: newValidationResult,
      codeCheck: newCodeCheck
    };
    
    // Save results to file
    const resultsPath = path.join(resultsDir, `${testCase.name.replace(/\s+/g, '_')}_comparison.json`);
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(`Results saved to ${resultsPath}`);
    
    return results;
  } catch (error) {
    console.error(`Error testing case ${testCase.name}:`, error.message);
    results.error = error.message;
    
    // Save error results to file
    const resultsPath = path.join(resultsDir, `${testCase.name.replace(/\s+/g, '_')}_error.json`);
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    
    return results;
  }
}

/**
 * Run all tests and generate summary
 */
async function runTests() {
  console.log('Starting validation approach comparison tests...');
  
  const allResults = [];
  
  for (const testCaseItem of TEST_CASES) {
    const results = await testCase(testCaseItem);
    allResults.push(results);
  }
  
  // Generate summary
  const summary = {
    totalCases: TEST_CASES.length,
    preauthorizationCriticalCases: TEST_CASES.filter(tc => tc.preauthorizationCritical).length,
    oldValidation: {
      totalDetections: 0,
      preauthorizationCriticalDetections: 0
    },
    newValidation: {
      totalDetections: 0,
      preauthorizationCriticalDetections: 0
    }
  };
  
  // Calculate detection rates
  for (const result of allResults) {
    // Old validation
    if (result.oldValidation && result.oldValidation.codeCheck && result.oldValidation.codeCheck.found) {
      summary.oldValidation.totalDetections++;
      if (result.preauthorizationCritical) {
        summary.oldValidation.preauthorizationCriticalDetections++;
      }
    }
    
    // New validation
    if (result.newValidation && result.newValidation.codeCheck && result.newValidation.codeCheck.found) {
      summary.newValidation.totalDetections++;
      if (result.preauthorizationCritical) {
        summary.newValidation.preauthorizationCriticalDetections++;
      }
    }
  }
  
  // Calculate percentages
  summary.oldValidation.totalDetectionRate = 
    (summary.oldValidation.totalDetections / TEST_CASES.length) * 100;
  
  summary.oldValidation.preauthorizationCriticalDetectionRate = 
    (summary.oldValidation.preauthorizationCriticalDetections / 
     TEST_CASES.filter(tc => tc.preauthorizationCritical).length) * 100;
  
  summary.newValidation.totalDetectionRate = 
    (summary.newValidation.totalDetections / TEST_CASES.length) * 100;
  
  summary.newValidation.preauthorizationCriticalDetectionRate = 
    (summary.newValidation.preauthorizationCriticalDetections / 
     TEST_CASES.filter(tc => tc.preauthorizationCritical).length) * 100;
  
  // Save summary to file
  const summaryPath = path.join(resultsDir, 'validation_comparison_summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`Summary saved to ${summaryPath}`);
  
  // Print summary
  console.log('\n=== Validation Approach Comparison Summary ===');
  console.log(`Total Cases: ${summary.totalCases}`);
  console.log(`Preauthorization Critical Cases: ${summary.preauthorizationCriticalCases}`);
  
  console.log(`\nOLD validation:`);
  console.log(`  Total Detection Rate: ${summary.oldValidation.totalDetectionRate.toFixed(2)}%`);
  console.log(`  Preauthorization Critical Detection Rate: ${summary.oldValidation.preauthorizationCriticalDetectionRate.toFixed(2)}%`);
  
  console.log(`\nNEW validation:`);
  console.log(`  Total Detection Rate: ${summary.newValidation.totalDetectionRate.toFixed(2)}%`);
  console.log(`  Preauthorization Critical Detection Rate: ${summary.newValidation.preauthorizationCriticalDetectionRate.toFixed(2)}%`);
  
  return summary;
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error.message);
});