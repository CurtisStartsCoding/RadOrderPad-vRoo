/**
 * Basic Redis Connection and Search Test
 * 
 * This script tests the basic Redis Cloud connection and search functionality
 * without relying on the validation endpoint.
 * 
 * Usage:
 * ```
 * node tests/test-redis-basic.cjs
 * ```
 */
const redis = require('../dist/config/redis');
const redisIndexManager = require('../dist/utils/redis/redis-index-manager');

// Set a timeout for the entire test
const TEST_TIMEOUT = 30000; // 30 seconds
let timeoutId;

/**
 * Main test function
 */
async function runTest() {
  try {
    console.log('Starting Basic Redis Test...');
    
    // Step 1: Test Redis connection
    console.log('\n--- Step 1: Testing Redis connection ---');
    const connectionResult = await redis.testRedisConnection();
    console.log(`Redis connection test result: ${connectionResult ? 'SUCCESS' : 'FAILED'}`);
    
    if (!connectionResult) {
      throw new Error('Redis connection failed. Please check your Redis Cloud configuration and IP allowlisting.');
    }
    
    // Step 2: Create the RedisSearch indexes
    console.log('\n--- Step 2: Creating RedisSearch indexes ---');
    await redisIndexManager.createRedisSearchIndexes();
    
    // Step 3: Verify the indexes were created
    console.log('\n--- Step 3: Verifying RedisSearch indexes ---');
    try {
      const cptIndexInfo = await redisIndexManager.getIndexInfo('cpt_index');
      console.log('CPT index info:', JSON.stringify(cptIndexInfo, null, 2));
      
      const icd10IndexInfo = await redisIndexManager.getIndexInfo('icd10_index');
      console.log('ICD-10 index info:', JSON.stringify(icd10IndexInfo, null, 2));
    } catch (error) {
      console.error('Error getting index info:', error);
    }
    
    // Step 4: Test basic Redis operations
    console.log('\n--- Step 4: Testing basic Redis operations ---');
    const client = redis.getRedisClient();
    
    // Set a test key
    const testKey = 'test:redis:connection:' + Date.now();
    const testValue = { test: true, timestamp: Date.now() };
    
    // Use JSON.SET to store the data as JSON
    await client.call('JSON.SET', testKey, '.', JSON.stringify(testValue));
    console.log(`Set test key: ${testKey}`);
    
    // Get the test key
    const result = await client.call('JSON.GET', testKey);
    console.log(`Retrieved test key: ${result}`);
    
    // Delete the test key
    await client.del(testKey);
    console.log(`Deleted test key: ${testKey}`);
    
    console.log('\nBasic Redis test completed successfully!');
  } catch (error) {
    console.error('Error in Basic Redis test:', error);
  } finally {
    // Clear the timeout
    clearTimeout(timeoutId);
    
    // Close the Redis connection
    if (redis) {
      await redis.closeRedisConnection();
    }
  }
}

// Set a timeout for the entire test
timeoutId = setTimeout(() => {
  console.error(`\nTest timed out after ${TEST_TIMEOUT / 1000} seconds`);
  console.error('This might indicate a connection issue or a hanging operation.');
  console.error('Please check your Redis Cloud configuration and IP allowlisting.');
  
  // Force exit the process
  process.exit(1);
}, TEST_TIMEOUT);

// Run the test
runTest();