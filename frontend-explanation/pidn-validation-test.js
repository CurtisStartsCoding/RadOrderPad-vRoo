/**
 * PIDN Validation Test Script
 * 
 * This script demonstrates how to properly use the Patient Identifier Number (PIDN)
 * in the RadOrderPad validation workflow. It includes test cases for different
 * scenarios to ensure correct handling of PIDN throughout the process.
 */

// Import required libraries (if using in a Node.js environment)
// const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'https://radorderpad-fftrehu55-capecomas-projects.vercel.app/api';
const TEST_CREDENTIALS = {
  email: 'test.physician@example.com',
  password: 'password123'
};

// Test patient data with PIDN
const TEST_PATIENTS = [
  {
    id: 1,
    firstName: 'Robert',
    lastName: 'Johnson',
    dateOfBirth: '1950-05-15',
    gender: 'male',
    pidn: 'P12345' // Standard PIDN format
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1965-08-22',
    gender: 'female',
    pidn: 'P-98765' // PIDN with hyphen
  },
  {
    id: 3,
    firstName: 'Michael',
    lastName: 'Williams',
    dateOfBirth: '1978-03-10',
    gender: 'male',
    pidn: 'P00123' // Modified to use standard P-prefix format
  }
];

// Test dictation texts
const TEST_DICTATIONS = [
  '72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy.',
  '56-year-old female with sudden onset severe headache described as "worst headache of life" starting 6 hours ago. Associated with nausea and photophobia. No prior history of migraines. No fever or neck stiffness.',
  '42-year-old male with right lower quadrant abdominal pain for 24 hours. Pain began periumbilically and migrated to RLQ. Associated with nausea, vomiting, and fever of 101.2°F.'
];

/**
 * Test the complete validation workflow with PIDN
 */
async function testPidnValidationWorkflow() {
  console.log('=== PIDN VALIDATION WORKFLOW TEST ===');
  console.log(`API URL: ${API_BASE_URL}`);
  console.log('=====================================\n');

  try {
    // Step 1: Login
    console.log('Step 1: Logging in...');
    const authToken = await login(TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
    console.log(`✅ Login successful! Token: ${authToken.substring(0, 20)}...\n`);

    // Run tests for each patient
    for (let i = 0; i < TEST_PATIENTS.length; i++) {
      const patient = TEST_PATIENTS[i];
      const dictation = TEST_DICTATIONS[i];

      console.log(`\n--- Test Case ${i+1}: Patient with PIDN ${patient.pidn} ---`);
      console.log(`Patient: ${patient.firstName} ${patient.lastName}, DOB: ${patient.dateOfBirth}`);
      console.log(`Dictation: "${dictation.substring(0, 50)}..."\n`);

      // Step 2: Validate dictation
      console.log('Step 2: Submitting dictation for validation...');
      const validationResult = await validateDictation(authToken, dictation, patient);
      
      if (validationResult.success) {
        console.log('✅ Validation successful!');
        console.log(`Order ID: ${validationResult.orderId}`);
        console.log(`Validation Status: ${validationResult.validationResult.validationStatus}`);
        console.log(`CPT Codes: ${validationResult.validationResult.suggestedCPTCodes.map(c => c.code).join(', ')}`);
        console.log(`ICD-10 Codes: ${validationResult.validationResult.suggestedICD10Codes.map(c => c.code).join(', ')}\n`);

        // Step 3: Finalize order
        console.log('Step 3: Finalizing order...');
        const finalizationResult = await finalizeOrder(
          authToken,
          validationResult.orderId,
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
          validationResult.validationResult,
          patient
        );

        if (finalizationResult.success) {
          console.log('✅ Order finalization successful!');
          console.log(`Order ID: ${finalizationResult.orderId}`);
          console.log(`Message: ${finalizationResult.message}\n`);
        } else {
          console.log('❌ Order finalization failed!');
          console.log(`Error: ${finalizationResult.error}`);
          if (finalizationResult.status) {
            console.log(`Status Code: ${finalizationResult.status}`);
          }
          if (finalizationResult.details) {
            console.log(`Details: ${JSON.stringify(finalizationResult.details, null, 2)}`);
          }
          console.log('');
        }
      } else {
        console.log('❌ Validation failed!');
        console.log(`Error: ${validationResult.error}`);
        if (validationResult.status) {
          console.log(`Status Code: ${validationResult.status}`);
        }
        if (validationResult.details) {
          console.log(`Details: ${JSON.stringify(validationResult.details, null, 2)}`);
        }
        console.log('');
      }
    }

    console.log('\n=== PIDN VALIDATION WORKFLOW TEST COMPLETE ===');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

/**
 * Login to the API
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<string>} - Authentication token
 */
async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Login failed: ${errorData.message || response.statusText}`);
  }

  const data = await response.json();
  return data.token;
}

/**
 * Validate dictation with patient info including PIDN
 * @param {string} token - Authentication token
 * @param {string} dictationText - Clinical dictation
 * @param {Object} patientInfo - Patient information with PIDN
 * @returns {Promise<Object>} - Validation result
 */
async function validateDictation(token, dictationText, patientInfo) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dictationText,
        patientInfo
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      return {
        success: false,
        error: errorData.message || response.statusText,
        status: response.status,
        details: errorData
      };
    }

    const data = await response.json();
    return {
      success: true,
      ...data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Finalize order with validation results
 * @param {string} token - Authentication token
 * @param {number} orderId - Order ID from validation
 * @param {string} signatureData - Base64 encoded signature
 * @param {Object} validationResult - Validation result
 * @param {Object} patientInfo - Patient information with PIDN
 * @returns {Promise<Object>} - Finalization result
 */
async function finalizeOrder(token, orderId, signatureData, validationResult, patientInfo) {
  try {
    // Log the patient PIDN being used
    console.log(`Using patient PIDN: ${patientInfo.pidn} for order finalization`);

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        signature: signatureData,
        status: 'pending_admin',
        finalValidationStatus: validationResult.validationStatus,
        finalCPTCode: validationResult.suggestedCPTCodes[0].code,
        clinicalIndication: validationResult.feedback,
        finalICD10Codes: validationResult.suggestedICD10Codes.map(code => code.code),
        referring_organization_name: "Test Referring Practice",
        // Include patient PIDN in the finalization payload for traceability
        patient_pidn: patientInfo.pidn
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      return {
        success: false,
        error: errorData.message || response.statusText,
        status: response.status,
        details: errorData
      };
    }

    const data = await response.json();
    return {
      success: true,
      ...data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Execute the test if this script is run directly
if (typeof window === 'undefined') {
  // Node.js environment
  testPidnValidationWorkflow().catch(console.error);
} else {
  // Browser environment
  console.log('To run this test, call testPidnValidationWorkflow() from your browser console');
}

// Export functions for use in other scripts
if (typeof module !== 'undefined') {
  module.exports = {
    testPidnValidationWorkflow,
    validateDictation,
    finalizeOrder
  };
}