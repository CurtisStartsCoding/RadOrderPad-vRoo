/**
 * Test script to verify OpenAI GPT fallback functionality
 * 
 * This script forces failures with both Claude 3.7 and Grok to test the fallback to OpenAI GPT
 */

// Import required modules
const { ValidationService } = require('./dist/services/validation.service');
const llmClient = require('./dist/utils/llm');
const config = require('./dist/config/config').default;

// Store the original API keys
const originalAnthropicKey = config.llm.anthropicApiKey;
const originalGrokKey = config.llm.grokApiKey;

// Disable Claude and Grok by setting their API keys to null
console.log('Temporarily disabling Claude and Grok API keys to force fallback to GPT...');
config.llm.anthropicApiKey = null;
config.llm.grokApiKey = null;

// Test dictation text
const testDictation = `
Patient presents with lower back pain radiating down the left leg for 3 weeks. 
Pain is worse with sitting and bending. No improvement with NSAIDs. 
No history of trauma. Physical exam shows positive straight leg raise test on the left. 
Requesting MRI lumbar spine to evaluate for disc herniation.
`;

// Run the test
async function runTest() {
  console.log('Starting OpenAI GPT fallback test...');
  console.log('Test dictation:', testDictation.substring(0, 100) + '...');
  
  try {
    // Call the validation service with test mode enabled
    const result = await ValidationService.runValidation(testDictation, {}, true);
    
    // Log the result
    console.log('\n=== Validation Result ===');
    console.log(`Validation Status: ${result.validationStatus}`);
    console.log(`Compliance Score: ${result.complianceScore}`);
    console.log(`Feedback: ${result.feedback ? result.feedback.substring(0, 100) + '...' : 'N/A'}`);
    console.log(`Suggested ICD-10 Codes: ${JSON.stringify(result.suggestedICD10Codes || [])}`);
    console.log(`Suggested CPT Codes: ${JSON.stringify(result.suggestedCPTCodes || [])}`);
    
    console.log('\nOpenAI GPT fallback test completed successfully!');
  } catch (error) {
    console.error('Error in OpenAI GPT fallback test:', error);
  } finally {
    // Restore the original API keys
    console.log('Restoring original API keys...');
    config.llm.anthropicApiKey = originalAnthropicKey;
    config.llm.grokApiKey = originalGrokKey;
  }
}

// Run the test
runTest().catch(error => {
  console.error('Unhandled error in test:', error);
  process.exit(1);
});