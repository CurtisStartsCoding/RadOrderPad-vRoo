/**
 * Test script to try different Grok model names
 * 
 * This script will try different model names for Grok to see which one works
 */

// Import required modules
const llmClient = require('./dist/utils/llm');
const config = require('./dist/config/config').default;

// Test prompt
const prompt = `
Hello! Please respond with a simple "Hello from Grok!" message.
`;

// Model names to try
const modelNames = [
  // Models from the first image
  'grok-3-beta',    // Current setting in .env
  'grok-3',         // Alias shown in the image
  'grok-3-latest',  // Alias shown in the image
  
  // Models from the second image
  'grok-3-fast-beta',     // New model with higher cost
  'grok-3-mini-fast-beta', // Smaller model with lower cost
  'grok-2-1212',          // Legacy model
  'grok-beta',            // Legacy model
  
  // Other models to try
  'grok-2',         // Another version that worked in previous test
  'grok-1'          // Default in config.ts (didn't work in previous test)
];

// Run the test for a specific model
async function testModel(modelName) {
  console.log(`\n=== Testing Grok model: ${modelName} ===`);
  
  // Store the original values
  const originalGrokModelName = config.llm.grokModelName;
  const originalAnthropicApiKey = config.llm.anthropicApiKey;
  
  try {
    // Set the model name for this test
    config.llm.grokModelName = modelName;
    
    // Disable Claude to force fallback to Grok
    config.llm.anthropicApiKey = null;
    
    // Call the LLM with fallback (should go to Grok)
    console.log('Calling LLM with fallback (Claude disabled, should use Grok)...');
    const startTime = Date.now();
    
    // We need to access the internal function
    const result = await require('./dist/utils/llm-client').callLLMWithFallback(prompt);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ SUCCESS with model ${modelName}`);
    console.log(`Response: ${result.content.substring(0, 100)}...`);
    console.log(`Tokens: ${result.totalTokens}, Latency: ${result.latencyMs}ms`);
    
    return { success: true, model: modelName, error: null };
  } catch (error) {
    console.log(`❌ FAILED with model ${modelName}`);
    console.log(`Error: ${error.message}`);
    
    return { success: false, model: modelName, error: error.message };
  } finally {
    // Restore the original values
    config.llm.grokModelName = originalGrokModelName;
    config.llm.anthropicApiKey = originalAnthropicApiKey;
  }
}

// Run tests for all models
async function runTests() {
  console.log('Starting Grok model tests...');
  
  const results = [];
  
  for (const modelName of modelNames) {
    const result = await testModel(modelName);
    results.push(result);
  }
  
  // Print summary
  console.log('\n=== Test Results Summary ===');
  const successfulModels = results.filter(r => r.success);
  
  if (successfulModels.length > 0) {
    console.log(`✅ Successful models: ${successfulModels.map(r => r.model).join(', ')}`);
  } else {
    console.log('❌ No models were successful');
  }
  
  const failedModels = results.filter(r => !r.success);
  if (failedModels.length > 0) {
    console.log(`❌ Failed models: ${failedModels.map(r => r.model).join(', ')}`);
    
    // Group by error message
    const errorGroups = {};
    for (const result of failedModels) {
      const errorMsg = result.error;
      if (!errorGroups[errorMsg]) {
        errorGroups[errorMsg] = [];
      }
      errorGroups[errorMsg].push(result.model);
    }
    
    console.log('\nError patterns:');
    for (const [error, models] of Object.entries(errorGroups)) {
      console.log(`- Error: ${error}`);
      console.log(`  Models: ${models.join(', ')}`);
    }
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error in tests:', error);
  process.exit(1);
});