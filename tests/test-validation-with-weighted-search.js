/**
 * Test Validation with Weighted Search
 * 
 * This script tests the validation engine with the weighted search implementation.
 * It runs a validation on a sample text and logs the results.
 */

import { ValidationService } from '../dist/services/validation/index.js';
import logger from '../dist/utils/logger.js';

// Sample text to validate
const sampleText = `
Patient presents with shoulder pain that has been ongoing for 3 weeks. 
The pain is worse with overhead activities and at night. 
Patient reports a history of rotator cuff tear in the past.
Requesting MRI of the shoulder to evaluate for possible rotator cuff tear.
`;

// Enable debug logging to see the search results
process.env.LOG_LEVEL = 'debug';

async function testValidationWithWeightedSearch() {
  console.log('Testing validation with weighted search...');
  console.log('Sample text:', sampleText);
  
  try {
    // Run validation on the sample text
    console.log('\nRunning validation...');
    const result = await ValidationService.runValidation(sampleText, {}, true);
    
    // Log the result
    console.log('\nValidation result:');
    console.log(JSON.stringify(result, null, 2));
    
    // Check the validation status
    if (result.validationStatus) {
      if (result.validationStatus === 'appropriate') {
        console.log('\nValidation SUCCESSFUL!');
        console.log('Validation Status: APPROPRIATE');
      } else if (result.validationStatus === 'needs_clarification') {
        console.log('\nValidation NEEDS CLARIFICATION!');
        console.log('Validation Status: NEEDS CLARIFICATION');
      } else if (result.validationStatus === 'inappropriate') {
        console.log('\nValidation FAILED - INAPPROPRIATE!');
        console.log('Validation Status: INAPPROPRIATE');
      } else {
        console.log('\nValidation completed with unknown status!');
        console.log('Validation Status:', result.validationStatus);
      }
      
      console.log('Compliance Score:', result.complianceScore);
      console.log('Suggested ICD-10 Codes:', result.suggestedICD10Codes.map(code => `${code.code}: ${code.description}`).join(', '));
      console.log('Suggested CPT Codes:', result.suggestedCPTCodes.map(code => `${code.code}: ${code.description}`).join(', '));
      console.log('Feedback:', result.feedback);
    } else {
      console.log('\nValidation processing error!');
      console.log('Error:', result.error);
    }
    
    console.log('\nTest completed.');
  } catch (error) {
    console.error('Error testing validation with weighted search:', error);
  }
}

// Run the test
testValidationWithWeightedSearch().catch(console.error);