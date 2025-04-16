/**
 * Enhanced script to test cases requiring additional notes (PSA, PET scans, etc.)
 * This version provides more detailed output about the order flow
 */
require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

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

// Database connection for fetching the active prompt
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = process.env.DB_NAME || 'radorder_main';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres123';

// Create a connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

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
  },
  {
    name: "Case 5: Inappropriate CT Head for Headache",
    dictation: `
      Patient with headache for 2 days. Need CT head.
    `,
    additionalNotes: `
      Patient has had tension-type headaches for years. Current headache is similar to previous episodes. No neurological symptoms, no fever, no trauma. Pain responds to OTC analgesics. No red flags.
    `
  }
];

// Function to print a section header
function printSectionHeader(title) {
  console.log('\n' + '='.repeat(80));
  console.log(title);
  console.log('='.repeat(80));
}

// Function to print a subsection header
function printSubsectionHeader(title) {
  console.log('\n' + '-'.repeat(60));
  console.log(title);
  console.log('-'.repeat(60));
}

// Function to print formatted dictation
function printDictation(dictation, label = 'DICTATION') {
  console.log(`\n${label}:`);
  console.log(dictation.trim());
}

// Function to print validation status
function printValidationStatus(status, score) {
  console.log('\nVALIDATION STATUS:', status);
  console.log('COMPLIANCE SCORE:', score);
}

// Function to print feedback
function printFeedback(feedback) {
  console.log('\nFEEDBACK:');
  console.log(feedback);
  console.log(`(${feedback.split(' ').length} words)`);
}

// Function to print codes
function printCodes(icd10Codes, cptCodes) {
  console.log('\nICD-10 CODES:');
  if (icd10Codes && icd10Codes.length > 0) {
    icd10Codes.forEach((code, index) => {
      const codeText = `  ${index + 1}. ${code.code} - ${code.description}`;
      if (code.isPrimary) {
        console.log(codeText + ' (PRIMARY)');
      } else {
        console.log(codeText);
      }
    });
  } else {
    console.log('  None provided');
  }
  
  console.log('\nCPT CODES:');
  if (cptCodes && cptCodes.length > 0) {
    cptCodes.forEach((code, index) => {
      console.log(`  ${index + 1}. ${code.code} - ${code.description}`);
    });
  } else {
    console.log('  None provided');
  }
}

// Function to print internal reasoning
function printInternalReasoning(reasoning) {
  if (reasoning) {
    console.log('\nINTERNAL REASONING:');
    console.log(reasoning);
  }
}

// Function to fetch and display the active prompt template
async function fetchAndDisplayActivePrompt() {
  let client;
  
  try {
    client = await pool.connect();
    
    // Query the active prompt template
    const result = await client.query(`
      SELECT id, name, type, version, content_template, word_limit, active
      FROM prompt_templates
      WHERE active = TRUE;
    `);
    
    if (result.rows.length === 0) {
      console.log('No active prompt template found!');
      return null;
    }
    
    const activeTemplate = result.rows[0];
    
    printSectionHeader('ACTIVE PROMPT TEMPLATE');
    console.log(`ID: ${activeTemplate.id}`);
    console.log(`Name: ${activeTemplate.name}`);
    console.log(`Type: ${activeTemplate.type}`);
    console.log(`Version: ${activeTemplate.version}`);
    console.log(`Word Limit: ${activeTemplate.word_limit || 'Not set'}`);
    console.log(`Active: ${activeTemplate.active}`);
    
    printSectionHeader('PROMPT CONTENT');
    console.log(activeTemplate.content_template);
    
    return activeTemplate;
  } catch (error) {
    console.error('Error fetching active prompt template:', error.message);
    return null;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function testInitialValidation(testCase) {
  try {
    printSubsectionHeader(`INITIAL VALIDATION - ${testCase.name}`);
    
    // Print original dictation
    printDictation(testCase.dictation, 'ORIGINAL DICTATION');
    
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
    
    console.log('\nSending validation request...');
    
    // Make the API request
    const response = await axios.post(`${API_URL}/orders/validate`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    const result = response.data.validationResult;
    
    // Print validation status and score
    printValidationStatus(result.validationStatus, result.complianceScore);
    
    // Print feedback
    printFeedback(result.feedback);
    
    // Check if additional notes are required
    const requiresAdditionalNotes = result.feedback.toLowerCase().includes('additional') || 
                                   result.feedback.toLowerCase().includes('more information') ||
                                   result.feedback.toLowerCase().includes('documentation');
    
    console.log('\nREQUIRES ADDITIONAL NOTES:', requiresAdditionalNotes ? 'Yes' : 'No');
    
    // Print codes
    printCodes(result.suggestedICD10Codes, result.suggestedCPTCodes);
    
    // Print internal reasoning
    printInternalReasoning(result.internalReasoning);
    
    return response.data;
  } catch (error) {
    console.error('\nError during validation:');
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
    printSubsectionHeader(`VALIDATION WITH ADDITIONAL NOTES - ${testCase.name}`);
    
    // Create the updated dictation with additional notes
    const updatedDictation = testCase.dictation + "\n\nAdditional Notes: " + testCase.additionalNotes;
    
    // Print updated dictation
    printDictation(updatedDictation, 'UPDATED DICTATION WITH ADDITIONAL NOTES');
    
    // Prepare the request payload
    const payload = {
      dictationText: updatedDictation,
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
    
    console.log('\nSending validation request with additional notes...');
    
    // Make the API request
    const response = await axios.post(`${API_URL}/orders/validate`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    const result = response.data.validationResult;
    
    // Print validation status and score
    printValidationStatus(result.validationStatus, result.complianceScore);
    
    // Print feedback
    printFeedback(result.feedback);
    
    // Print codes
    printCodes(result.suggestedICD10Codes, result.suggestedCPTCodes);
    
    // Print internal reasoning
    printInternalReasoning(result.internalReasoning);
    
    return response.data;
  } catch (error) {
    console.error('\nError during validation with additional notes:');
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
  // First, fetch and display the active prompt template
  await fetchAndDisplayActivePrompt();
  
  printSectionHeader('TESTING CASES REQUIRING ADDITIONAL NOTES');
  console.log('This test demonstrates the validation flow with and without additional notes');
  console.log('Each case will be tested twice:');
  console.log('1. With minimal information (should require additional notes)');
  console.log('2. With additional clinical details (should improve validation status)');
  
  // For each test case
  for (const testCase of TEST_CASES) {
    printSectionHeader(`TEST CASE: ${testCase.name}`);
    
    // Step 1: Initial validation (should require additional notes)
    await testInitialValidation(testCase);
    
    // Step 2: Validation with additional notes
    await testWithAdditionalNotes(testCase);
  }
  
  printSectionHeader('TESTS COMPLETED');
  
  // Close the database pool
  await pool.end();
}

// Run the tests
runTests().catch(err => {
  console.error('Unhandled error:', err);
  // Make sure to close the pool on error
  pool.end();
});