/**
 * Test script to force fallback to Grok
 * 
 * This script temporarily disables the Anthropic API key to force a fallback to Grok
 */

// Import required modules
const { ValidationService } = require('./dist/services/validation.service');
const llmClient = require('./dist/utils/llm');
const config = require('./dist/config/config').default;

// Test dictation text
const testDictation = `
Patient presents with lower back pain radiating down the left leg for 3 weeks. 
Pain is worse with sitting and bending. No improvement with NSAIDs. 
No history of trauma. Physical exam shows positive straight leg raise test on the left. 
Requesting MRI lumbar spine to evaluate for disc herniation.
`;

// Run the test
async function runTest() {
  console.log('Starting forced Grok fallback test...');
  console.log('Test dictation:', testDictation.substring(0, 100) + '...');
  
  // Store the original API keys and model
  const originalAnthropicKey = config.llm.anthropicApiKey;
  const originalGrokModel = config.llm.grokModelName;
  
  try {
    // Temporarily disable the Anthropic API key to force fallback to Grok
    console.log('Temporarily disabling Anthropic API key to force fallback to Grok...');
    config.llm.anthropicApiKey = null;
    
    // Make sure we're using a valid Grok model
    console.log(`Original Grok model: ${originalGrokModel}`);
    console.log('Setting Grok model to grok-3-latest for testing...');
    config.llm.grokModelName = 'grok-3-latest';
    
    // Call the validation service with test mode enabled
    const result = await ValidationService.runValidation(testDictation, {}, true);
    
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
    // Restore the original API keys and model
    console.log('Restoring original API keys and model...');
    config.llm.anthropicApiKey = originalAnthropicKey;
    config.llm.grokModelName = originalGrokModel;
  }
}

// Run the test
runTest().catch(error => {
  console.error('Unhandled error in test:', error);
  process.exit(1);
});