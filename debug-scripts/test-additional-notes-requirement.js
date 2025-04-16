/**
 * Script to test cases requiring additional notes (PSA, PET scans, etc.)
 */
require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Import the centralized configuration
const config = require('../test-config');

// API URL construction
const API_URL = config.api.baseUrl;

// Generate token for testing
const TEST_TOKEN = jwt.sign(
  { userId: 1, orgId: 1, role: 'physician', email: 'test.physician@example.com' },
  config.api.jwtSecret,
  { expiresIn: '24h' }
);

// Test cases requiring additional notes
const TEST_CASES = [
  {
    name: "Case 1: PET Scan with Minimal Information",
    dictation: `
      Patient with history of lung cancer. Need PET scan.
    `,
    additionalNotes: `
      Patient has stage IIIB non-small cell lung cancer diagnosed 6 months ago. Completed chemoradiation therapy 2 months ago. Recent CT shows equivocal 1.2cm nodule in right lower lobe. Need PET scan to evaluate for recurrence/progression and to guide further treatment planning. Last PET scan was 6 months ago at diagnosis.
    `
  },
  {
    name: "Case 2: MRI Prostate with PSA Information",
    dictation: `
      65-year-old male with elevated PSA. Need MRI prostate.
    `,
    additionalNotes: `
      Patient's PSA has risen from 2.3 to 4.8 over the past year. Digital rectal exam shows no nodules. Family history of prostate cancer in father and brother. No prior prostate biopsies. Need MRI prostate to evaluate for suspicious lesions prior to potential targeted biopsy.
    `
  },
  {
    name: "Case 3: CT Colonography Screening",
    dictation: `
      Need CT colonography for colorectal cancer screening.
    `,
    additionalNotes: `
      Patient is 67-year-old female with history of incomplete colonoscopy due to tortuous colon. Previous attempt at colonoscopy was terminated due to inability to advance beyond the splenic flexure. Patient has average risk for colorectal cancer with no family history. Last screening was attempted 1 year ago. Patient has no symptoms of colorectal cancer.
    `
  },
  {
    name: "Case 4: Breast MRI for Screening",
    dictation: `
      Need breast MRI for screening.
    `,
    additionalNotes: `
      Patient is 42-year-old female with BRCA1 mutation. Mother diagnosed with breast cancer at age 38, sister at age 40. Mammogram and ultrasound 6 months ago were negative. Patient has >20% lifetime risk of breast cancer based on Tyrer-Cuzick model. Annual breast MRI recommended as supplement to mammography.
    `
  }
];

async function testInitialValidation(testCase) {
  try {
    console.log(`\nTesting initial validation for ${testCase.name}...`);
    
    // Prepare the request payload
    const payload = {
      dictationText: testCase.dictation,
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
    const response = await axios.post(`${API_URL}/orders/validate`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    // Check the response
    console.log(`Validation status: ${response.data.validationResult.validationStatus}`);
    console.log(`Feedback length: ${response.data.validationResult.feedback.split(' ').length} words`);
    console.log(`Feedback: ${response.data.validationResult.feedback}`);
    
    // Check if additional notes are required
    const requiresAdditionalNotes = response.data.validationResult.feedback.toLowerCase().includes('additional') || 
                                   response.data.validationResult.feedback.toLowerCase().includes('more information') ||
                                   response.data.validationResult.feedback.toLowerCase().includes('documentation');
    
    console.log(`Requires additional notes: ${requiresAdditionalNotes ? 'Yes' : 'No'}`);
    
    // Log ICD-10 codes
    console.log('ICD-10 Codes:');
    if (response.data.validationResult.suggestedICD10Codes && response.data.validationResult.suggestedICD10Codes.length > 0) {
      response.data.validationResult.suggestedICD10Codes.forEach((code, index) => {
        console.log(`  ${index + 1}. ${code.code} - ${code.description}${code.isPrimary ? ' (PRIMARY)' : ''}`);
      });
    } else {
      console.log('  None provided');
    }
    
    // Log CPT codes
    console.log('CPT Codes:');
    if (response.data.validationResult.suggestedCPTCodes && response.data.validationResult.suggestedCPTCodes.length > 0) {
      response.data.validationResult.suggestedCPTCodes.forEach((code, index) => {
        console.log(`  ${index + 1}. ${code.code} - ${code.description}`);
      });
    } else {
      console.log('  None provided');
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

async function testWithAdditionalNotes(testCase) {
  try {
    console.log(`\nTesting validation with additional notes for ${testCase.name}...`);
    
    // Prepare the request payload
    const payload = {
      dictationText: testCase.dictation + "\n\nAdditional Notes: " + testCase.additionalNotes,
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
    const response = await axios.post(`${API_URL}/orders/validate`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    // Check the response
    console.log(`Validation status with additional notes: ${response.data.validationResult.validationStatus}`);
    console.log(`Feedback length: ${response.data.validationResult.feedback.split(' ').length} words`);
    console.log(`Feedback: ${response.data.validationResult.feedback}`);
    
    // Log ICD-10 codes
    console.log('ICD-10 Codes:');
    if (response.data.validationResult.suggestedICD10Codes && response.data.validationResult.suggestedICD10Codes.length > 0) {
      response.data.validationResult.suggestedICD10Codes.forEach((code, index) => {
        console.log(`  ${index + 1}. ${code.code} - ${code.description}${code.isPrimary ? ' (PRIMARY)' : ''}`);
      });
    } else {
      console.log('  None provided');
    }
    
    // Log CPT codes
    console.log('CPT Codes:');
    if (response.data.validationResult.suggestedCPTCodes && response.data.validationResult.suggestedCPTCodes.length > 0) {
      response.data.validationResult.suggestedCPTCodes.forEach((code, index) => {
        console.log(`  ${index + 1}. ${code.code} - ${code.description}`);
      });
    } else {
      console.log('  None provided');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error during validation with additional notes:');
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
  console.log('Testing cases requiring additional notes...');
  
  // For each test case
  for (const testCase of TEST_CASES) {
    console.log(`\n=== Testing ${testCase.name} ===`);
    
    // Step 1: Initial validation (should require additional notes)
    await testInitialValidation(testCase);
    
    // Step 2: Validation with additional notes
    await testWithAdditionalNotes(testCase);
  }
  
  console.log('\nTests completed.');
}

// Run the tests
runTests().catch(err => {
  console.error('Unhandled error:', err);
});