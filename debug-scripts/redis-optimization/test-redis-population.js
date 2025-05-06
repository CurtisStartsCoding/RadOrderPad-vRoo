/**
 * Test Redis Population on Server Startup
 * 
 * This script tests the automatic Redis population functionality that runs on server startup.
 * It clears Redis, then calls the populateRedisFromPostgres function directly to simulate
 * what happens during server startup.
 */

// Import required modules
const { getRedisClient } = require('../../dist/config/redis');
const { populateRedisFromPostgres } = require('../../dist/utils/cache');
const enhancedLogger = require('../../dist/utils/enhanced-logger').default;

// Configure logger to show debug messages
enhancedLogger.level = 'debug';

/**
 * Main test function
 */
async function testRedisPopulation() {
  try {
    console.log('=== Testing Redis Population on Server Startup ===\n');
    
    // Get Redis client
    const redisClient = getRedisClient();
    console.log('Connected to Redis');
    
    // Clear Redis keys related to medical codes
    console.log('\nClearing existing Redis keys...');
    const cptKeys = await redisClient.keys('cpt:code:*');
    const icd10Keys = await redisClient.keys('icd10:code:*');
    const mappingKeys = await redisClient.keys('mapping:icd10-to-cpt:*');
    
    console.log(`Found ${cptKeys.length} CPT keys`);
    console.log(`Found ${icd10Keys.length} ICD-10 keys`);
    console.log(`Found ${mappingKeys.length} mapping keys`);
    
    if (cptKeys.length > 0 || icd10Keys.length > 0 || mappingKeys.length > 0) {
      console.log('Deleting keys...');
      
      if (cptKeys.length > 0) {
        await redisClient.del(...cptKeys);
      }
      
      if (icd10Keys.length > 0) {
        await redisClient.del(...icd10Keys);
      }
      
      if (mappingKeys.length > 0) {
        await redisClient.del(...mappingKeys);
      }
      
      console.log('Keys deleted');
    } else {
      console.log('No keys to delete');
    }
    
    // Verify Redis is empty
    const keysAfterDelete = await redisClient.keys('*:code:*');
    console.log(`Keys after delete: ${keysAfterDelete.length}`);
    
    // Call the populate function
    console.log('\nCalling populateRedisFromPostgres()...');
    console.time('Population time');
    await populateRedisFromPostgres();
    console.timeEnd('Population time');
    
    // Check if Redis was populated
    const cptKeysAfter = await redisClient.keys('cpt:code:*');
    const icd10KeysAfter = await redisClient.keys('icd10:code:*');
    const mappingKeysAfter = await redisClient.keys('mapping:icd10-to-cpt:*');
    
    console.log('\nAfter population:');
    console.log(`CPT keys: ${cptKeysAfter.length}`);
    console.log(`ICD-10 keys: ${icd10KeysAfter.length}`);
    console.log(`Mapping keys: ${mappingKeysAfter.length}`);
    
    // Test retrieving a specific key
    if (cptKeysAfter.length > 0) {
      const sampleKey = cptKeysAfter[0];
      console.log(`\nSample key: ${sampleKey}`);
      const data = await redisClient.hgetall(sampleKey);
      console.log('Sample data:', data);
    }
    
    // Call the populate function again to test the "already populated" check
    console.log('\nCalling populateRedisFromPostgres() again to test "already populated" check...');
    console.time('Second population time');
    await populateRedisFromPostgres();
    console.timeEnd('Second population time');
    
    console.log('\nTest completed successfully!');
    
    // Close Redis connection
    await redisClient.quit();
    
  } catch (error) {
    console.error('Error during test:', error);
    process.exit(1);
  }
}

// Run the test
testRedisPopulation();