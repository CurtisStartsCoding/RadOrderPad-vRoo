/**
 * Test script for RedisSearch functionality
 * 
 * This script tests the RedisSearch functionality for context generation
 * by calling the validation endpoint with a sample dictation.
 * 
 * Usage:
 * ```
 * node tests/test-redis-search.js
 * ```
 */
import axios from 'axios';

// We'll use dynamic imports for CommonJS modules
let redisIndexManager;
let memorydb;

// Sample dictation for testing
const sampleDictation = `
Patient presents with right shoulder pain after a fall. 
The pain is worse with movement and there is limited range of motion.
Patient has a history of osteoarthritis.
Requesting MRI of the right shoulder to rule out rotator cuff tear.
`;

// Test token for authentication
const testToken = process.env.TEST_TOKEN || 'test-token';

// Base URL for API
const baseUrl = process.env.API_URL || 'http://localhost:3000';

/**
 * Main test function
 */
async function runTest() {
  try {
    console.log('Starting RedisSearch test...');
    
    // Dynamically import the CommonJS modules
    const redisIndexManagerModule = await import('../dist/utils/redis/redis-index-manager.js');
    redisIndexManager = redisIndexManagerModule.default;
    
    const memorydbModule = await import('../dist/config/memorydb.js');
    memorydb = memorydbModule.default;
    
    // Step 1: Create the RedisSearch indexes
    console.log('\n--- Step 1: Creating RedisSearch indexes ---');
    await redisIndexManager.createRedisSearchIndexes();
    
    // Step 2: Verify the indexes were created
    console.log('\n--- Step 2: Verifying RedisSearch indexes ---');
    try {
      const cptIndexInfo = await redisIndexManager.getIndexInfo('cpt_index');
      console.log('CPT index info:', JSON.stringify(cptIndexInfo, null, 2));
      
      const icd10IndexInfo = await redisIndexManager.getIndexInfo('icd10_index');
      console.log('ICD-10 index info:', JSON.stringify(icd10IndexInfo, null, 2));
    } catch (error) {
      console.error('Error getting index info:', error);
    }
    
    // Step 3: Call the validation endpoint
    console.log('\n--- Step 3: Calling validation endpoint ---');
    const response = await axios.post(
      `${baseUrl}/api/orders/validate`,
      {
        text: sampleDictation,
        testMode: true
      },
      {
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Step 4: Display the results
    console.log('\n--- Step 4: Validation Results ---');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Step 5: Check if Redis keys exist for the codes returned
    console.log('\n--- Step 5: Checking Redis for returned codes ---');
    const client = memorydb.getRedisClient();
    
    // Check for ICD-10 codes
    if (response.data.suggestedICD10Codes && response.data.suggestedICD10Codes.length > 0) {
      for (const code of response.data.suggestedICD10Codes) {
        const exists = await client.exists(`icd10:${code.code}`);
        console.log(`ICD-10 code ${code.code} exists in Redis: ${exists === 1}`);
      }
    }
    
    // Check for CPT codes
    if (response.data.suggestedCPTCodes && response.data.suggestedCPTCodes.length > 0) {
      for (const code of response.data.suggestedCPTCodes) {
        const exists = await client.exists(`cpt:${code.code}`);
        console.log(`CPT code ${code.code} exists in Redis: ${exists === 1}`);
      }
    }
    
    console.log('\nRedisSearch test completed successfully!');
  } catch (error) {
    console.error('Error in RedisSearch test:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  } finally {
    // Close the Redis connection
    if (memorydb) {
      await memorydb.closeMemoryDbConnection();
    }
  }
}

// Run the test
runTest();