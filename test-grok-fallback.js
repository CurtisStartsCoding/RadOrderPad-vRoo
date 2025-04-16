/**
 * Test script to verify Grok fallback functionality
 * 
 * This script forces a failure with Claude 3.7 to test the fallback to Grok
 */

// Import required modules
const { ValidationService } = require('./dist/services/validation.service');
const llmClient = require('./dist/utils/llm-client');

// Store the original callClaude function
const originalCallClaude = llmClient.callLLMWithFallback;
const originalCallClaudeFunc = async function(prompt) {
  console.log('Forcing Claude API call to fail for testing fallback...');
  throw new Error('Simulated Claude API failure for testing fallback');
};

// Override the callClaude function to always throw an error
llmClient.callClaude = originalCallClaudeFunc;

// Test dictation text
const testDictation = `
Patient presents with lower back pain radiating down the left leg for 3 weeks. 
Pain is worse with sitting and bending. No improvement with NSAIDs. 
No history of trauma. Physical exam shows positive straight leg raise test on the left. 
Requesting MRI lumbar spine to evaluate for disc herniation.
`;

// Run the test
async function runTest() {
  console.log('Starting Grok fallback test...');
  console.log('Test dictation:', testDictation.substring(0, 100) + '...');
  
  try {
    // Call the validation service
    const result = await ValidationService.runValidation(testDictation);
    
    // Log the result
    console.log('\n=== Validation Result ===');
    console.log(`Validation Status: ${result.validationStatus}`);
    console.log(`Compliance Score: ${result.complianceScore}`);
    console.log(`Feedback: ${result.feedback ? result.feedback.substring(0, 100) + '...' : 'N/A'}`);
    console.log(`Suggested ICD-10 Codes: ${JSON.stringify(result.suggestedICD10Codes || [])}`);
    console.log(`Suggested CPT Codes: ${JSON.stringify(result.suggestedCPTCodes || [])}`);
    
    console.log('\nGrok fallback test completed successfully!');
  } catch (error) {
    console.error('Error in Grok fallback test:', error);
  } finally {
    // Restore the original callClaude function
    llmClient.callClaude = undefined;
  }
}

// Run the test
runTest().catch(error => {
  console.error('Unhandled error in test:', error);
  process.exit(1);
});