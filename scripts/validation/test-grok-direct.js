/**
 * Direct test script for Grok API
 * 
 * This script directly calls the Grok API to verify it works correctly
 */

// Import required modules
const { ValidationService } = require('./dist/services/validation.service');
const llmClient = require('./dist/utils/llm');

// Test dictation text
const testDictation = `
Patient presents with lower back pain radiating down the left leg for 3 weeks. 
Pain is worse with sitting and bending. No improvement with NSAIDs. 
No history of trauma. Physical exam shows positive straight leg raise test on the left. 
Requesting MRI lumbar spine to evaluate for disc herniation.
`;

// Run the test
async function runTest() {
  console.log('Starting direct Grok API test...');
  console.log('Test dictation:', testDictation.substring(0, 100) + '...');
  
  try {
    // Generate a prompt similar to what the validation service would use
    const prompt = `
You are a medical validation assistant. Your task is to evaluate the appropriateness of a requested imaging study based on the clinical indications provided.

DICTATION TEXT:
${testDictation}

INSTRUCTIONS:
1. Analyze the dictation text and determine if the requested imaging study is appropriate based on clinical guidelines.
2. Consider the patient's symptoms, history, and any relevant medical context.
3. Provide a compliance score from 1-9 (1 = completely inappropriate, 9 = completely appropriate).
4. Suggest relevant ICD-10 diagnosis codes and CPT procedure codes.
5. Limit your feedback to 200 words.

RESPONSE FORMAT:
Provide your response in JSON format with the following fields:
- validationStatus: "appropriate", "inappropriate", or "needs_clarification"
- complianceScore: numeric score from 1-9
- feedback: educational note for the physician
- suggestedICD10Codes: array of objects with code and description
- suggestedCPTCodes: array of objects with code and description
- internalReasoning: explanation of your reasoning process

Respond ONLY with the JSON object, no additional text.
`;
    
    // Call Grok directly
    console.log('Calling Grok API directly...');
    const result = await llmClient.callLLMWithFallback(prompt);
    
    // Log the result
    console.log('\n=== Grok API Result ===');
    console.log(`Provider: ${result.provider}`);
    console.log(`Model: ${result.model}`);
    console.log(`Content: ${result.content.substring(0, 200)}...`);
    console.log(`Tokens: ${result.totalTokens}`);
    console.log(`Latency: ${result.latencyMs}ms`);
    
    console.log('\nGrok API test completed successfully!');
  } catch (error) {
    console.error('Error in Grok API test:', error);
  }
}

// Run the test
runTest().catch(error => {
  console.error('Unhandled error in test:', error);
  process.exit(1);
});