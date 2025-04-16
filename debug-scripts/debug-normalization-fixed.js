/**
 * Script to debug the normalization process
 */
require('dotenv').config();

// Import the normalization functions directly from the source files
const normalizeResponseFields = require('./src/utils/response/normalizer/normalize-response-fields').normalizeResponseFields;
const normalizeCodeArray = require('./src/utils/response/normalizer/normalize-code-array').normalizeCodeArray;

// Sample responses to test
const sampleResponses = [
  // Response with diagnosisCodes and procedureCodes
  {
    diagnosisCodes: [
      { code: "R10.31", description: "Right lower quadrant pain", isPrimary: true },
      { code: "R10.83", description: "Colic abdominal pain", isPrimary: false },
      { code: "N83.20", description: "Unspecified ovarian cysts", isPrimary: false }
    ],
    procedureCodes: [
      { code: "74177", description: "CT abdomen and pelvis with contrast" }
    ],
    validationStatus: "needs_clarification",
    complianceScore: 72,
    feedback: "Additional clinical information needed to justify CT with contrast. Please provide details on prior imaging, duration of symptoms, and any red flags."
  },
  
  // Response with suggestedICD10Codes and suggestedCPTCodes
  {
    suggestedICD10Codes: [
      { code: "R10.31", description: "Right lower quadrant pain", isPrimary: true },
      { code: "R10.83", description: "Colic abdominal pain", isPrimary: false },
      { code: "N83.20", description: "Unspecified ovarian cysts", isPrimary: false }
    ],
    suggestedCPTCodes: [
      { code: "74177", description: "CT abdomen and pelvis with contrast" }
    ],
    validationStatus: "needs_clarification",
    complianceScore: 72,
    feedback: "Additional clinical information needed to justify CT with contrast. Please provide details on prior imaging, duration of symptoms, and any red flags."
  }
];

// Test the normalization process
function testNormalization() {
  console.log('Testing normalization process...\n');
  
  sampleResponses.forEach((response, index) => {
    console.log(`Sample Response ${index + 1}:`);
    console.log(JSON.stringify(response, null, 2));
    
    try {
      // Normalize field names
      console.log('\nAfter normalizeResponseFields:');
      const normalizedFields = normalizeResponseFields(response);
      console.log(JSON.stringify(normalizedFields, null, 2));
      
      // Check if suggestedICD10Codes exists
      if (!normalizedFields.suggestedICD10Codes) {
        console.log('\nERROR: suggestedICD10Codes is missing after field normalization!');
      }
      
      // Normalize code arrays
      console.log('\nAfter normalizeCodeArray for ICD-10 codes:');
      const normalizedICD10Codes = normalizeCodeArray(normalizedFields.suggestedICD10Codes);
      console.log(JSON.stringify(normalizedICD10Codes, null, 2));
      
      // Check if any code has isPrimary = true
      const primaryCode = normalizedICD10Codes.find(code => code.isPrimary);
      if (!primaryCode) {
        console.log('\nERROR: No primary ICD-10 code found after code array normalization!');
      } else {
        console.log(`\nPrimary code found: ${primaryCode.code} - ${primaryCode.description}`);
      }
      
      console.log('\nAfter normalizeCodeArray for CPT codes:');
      const normalizedCPTCodes = normalizeCodeArray(normalizedFields.suggestedCPTCodes);
      console.log(JSON.stringify(normalizedCPTCodes, null, 2));
    } catch (error) {
      console.error(`Error processing sample ${index + 1}:`, error);
    }
    
    console.log('\n' + '-'.repeat(80) + '\n');
  });
}

// Run the test
testNormalization();