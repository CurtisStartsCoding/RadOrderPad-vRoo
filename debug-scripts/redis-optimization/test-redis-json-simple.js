/**
 * Simple Test Script for Redis JSON Search Implementation
 * 
 * This script tests the Redis JSON storage and retrieval
 */

// Adjust the path based on the project structure
const { getRedisClient } = require('../../src/config/redis.js');

/**
 * Test Redis JSON storage
 */
async function testRedisJSONStorage() {
  console.log('Testing Redis JSON storage');
  
  try {
    const client = getRedisClient();
    
    // Get a sample CPT code
    const cptKey = 'cpt:code:73221';
    const cptData = await client.call('JSON.GET', cptKey);
    
    if (cptData) {
      console.log(`Found CPT code ${cptKey} stored as JSON:`);
      console.log(JSON.parse(cptData));
    } else {
      console.warn(`CPT code ${cptKey} not found or not stored as JSON`);
    }
    
    // Get a sample ICD-10 code
    const icd10Key = 'icd10:code:M54.5';
    const icd10Data = await client.call('JSON.GET', icd10Key);
    
    if (icd10Data) {
      console.log(`Found ICD-10 code ${icd10Key} stored as JSON:`);
      console.log(JSON.parse(icd10Data));
    } else {
      console.warn(`ICD-10 code ${icd10Key} not found or not stored as JSON`);
    }
    
    // Get a sample mapping (should still be a hash)
    const mappingKey = 'mapping:icd10-to-cpt:M54.5';
    const mappingData = await client.hgetall(mappingKey);
    
    if (mappingData && Object.keys(mappingData).length > 0) {
      console.log(`Found mapping ${mappingKey} stored as Hash:`);
      console.log(mappingData);
    } else {
      console.warn(`Mapping ${mappingKey} not found or empty`);
    }
  } catch (error) {
    console.error('Error testing Redis JSON storage:', error);
  }
}

/**
 * Main function to run all tests
 */
async function runTests() {
  console.log('Starting Redis JSON Storage tests');
  
  // Test Redis JSON storage
  await testRedisJSONStorage();
  
  console.log('All tests completed');
  process.exit(0);
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});