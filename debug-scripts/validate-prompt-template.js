/**
 * Script to validate prompt templates for correct field names
 */
const fs = require('fs');
const path = require('path');

// Configuration
const REQUIRED_FIELD_NAMES = [
  'suggestedICD10Codes',
  'suggestedCPTCodes',
  'validationStatus',
  'complianceScore',
  'feedback'
];

const FORBIDDEN_FIELD_NAMES = [
  'diagnosisCodes',
  'procedureCodes',
  'primaryDiagnosis',
  'codeJustification'
];

/**
 * Validate a prompt template file
 * @param {string} filePath - Path to the prompt template file
 * @returns {Object} - Validation results
 */
function validatePromptTemplate(filePath) {
  console.log(`Validating ${path.basename(filePath)}...`);
  
  try {
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for required field names
    const missingFields = REQUIRED_FIELD_NAMES.filter(field => !content.includes(`"${field}"`));
    
    // Check for forbidden field names
    const forbiddenFields = FORBIDDEN_FIELD_NAMES.filter(field => content.includes(`"${field}"`));
    
    // Determine if the template is valid
    const valid = missingFields.length === 0 && forbiddenFields.length === 0;
    
    // Create the result object
    const result = {
      file: path.basename(filePath),
      valid,
      missingFields,
      forbiddenFields
    };
    
    // Log the results
    if (valid) {
      console.log(`✅ ${path.basename(filePath)} is valid!`);
    } else {
      console.log(`❌ ${path.basename(filePath)} is invalid!`);
      
      if (missingFields.length > 0) {
        console.log(`   Missing required fields: ${missingFields.join(', ')}`);
      }
      
      if (forbiddenFields.length > 0) {
        console.log(`   Contains forbidden fields: ${forbiddenFields.join(', ')}`);
      }
    }
    
    return result;
  } catch (error) {
    console.error(`Error validating ${path.basename(filePath)}:`, error.message);
    return {
      file: path.basename(filePath),
      valid: false,
      error: error.message
    };
  }
}

/**
 * Main function
 */
function main() {
  // Files to validate
  const filesToValidate = [
    path.join(__dirname, '..', 'Docs', 'NEW SUPER DUPER ULTRA GOD PROMPT.txt'),
    // Add other prompt files here if needed
  ];
  
  // Validate each file
  const results = filesToValidate.map(validatePromptTemplate);
  
  // Summary
  const validCount = results.filter(result => result.valid).length;
  const invalidCount = results.length - validCount;
  
  console.log('\nSummary:');
  console.log(`Total templates: ${results.length}`);
  console.log(`Valid templates: ${validCount}`);
  console.log(`Invalid templates: ${invalidCount}`);
  
  // Return non-zero exit code if any templates are invalid
  if (invalidCount > 0) {
    process.exit(1);
  }
}

// Run the main function
main();