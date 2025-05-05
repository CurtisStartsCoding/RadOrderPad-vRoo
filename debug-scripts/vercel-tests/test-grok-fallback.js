/**
 * Test script to verify Grok fallback functionality
 * 
 * This script forces a failure with Claude 3.7 to test the fallback to Grok
 */

// Import required modules
const config = require('../../dist/config/config').default;
const ValidationService = require('../../dist/services/validation').default;
const logger = require('../../dist/utils/logger').default;

// Disable Claude by setting its API key to null
console.log('Disabling Claude API key to force fallback to Grok...');
config.llm.anthropicApiKey = null;

// Test dictation text
const testDictation = `
45-year-old male with persistent lower back pain radiating down the left leg for 3 weeks.
Pain is worse with sitting and bending. No improvement with NSAIDs.
No history of trauma. Physical exam shows positive straight leg raise test on the left.
Requesting MRI lumbar spine to evaluate for disc herniation.
`;

async function runTest() {
  console.log('Starting Grok fallback test...');
  console.log('Test dictation:', testDictation.substring(0, 100) + '...');
  
  try {
    // Call the validation service
    const result = await ValidationService.runValidation(testDictation);
    
    // Log the result
    console.log('\n=== Validation Result ===');
    console.log(`Provider: ${result.provider || 'Not reported'}`);
    console.log(`Validation Status: ${result.validationStatus}`);
    console.log(`Compliance Score: ${result.complianceScore}`);
    console.log(`Feedback: ${result.feedback ? result.feedback.substring(0, 100) + '...' : 'N/A'}`);
    console.log(`Suggested ICD-10 Codes: ${JSON.stringify(result.suggestedICD10Codes || [])}`);
    console.log(`Suggested CPT Codes: ${JSON.stringify(result.suggestedCPTCodes || [])}`);
    
    console.log('\nGrok fallback test completed successfully!');
  } catch (error) {
    console.error('Error in Grok fallback test:', error);
  }
}

// Run the test
runTest().catch(error => {
  console.error('Unhandled error in test:', error);
  process.exit(1);
});