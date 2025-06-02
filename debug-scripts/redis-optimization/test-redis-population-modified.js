/**
 * Test Redis Population on Server Startup - Modified for both old and new key patterns
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

// Set timeout for the entire script (10 minutes)
const SCRIPT_TIMEOUT = 10 * 60 * 1000;
const scriptTimeout = setTimeout(() => {
  console.error('Script execution timed out after 10 minutes');
  process.exit(1);
}, SCRIPT_TIMEOUT);

/**
 * Main test function
 */
async function testRedisPopulation() {
  let redisClient = null;
  
  try {
    console.log('=== Testing Redis Population on Server Startup (Modified) ===\n');
    console.log(`[${new Date().toISOString()}] Starting Redis connection test`);
    
    // Get Redis configuration from environment
    const redisHost = process.env.REDIS_CLOUD_HOST || 'localhost';
    const redisPort = process.env.REDIS_CLOUD_PORT || '6379';
    console.log(`Redis Host: ${redisHost}`);
    console.log(`Redis Port: ${redisPort}`);
    
    console.log(`[${new Date().toISOString()}] Attempting to connect to Redis...`);
    
    // Get Redis client
    redisClient = getRedisClient();
    console.log(`[${new Date().toISOString()}] Redis client created, testing connection...`);
    
    // Test connection with ping
    const pingResult = await Promise.race([
      redisClient.ping(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Redis ping timed out after 5 seconds')), 5000)
      )
    ]);
    
    console.log(`[${new Date().toISOString()}] Redis ping result: ${pingResult}`);
    console.log('Connected to Redis successfully');
    
    // Clear Redis keys related to medical codes (both old and new patterns)
    console.log('\nClearing existing Redis keys...');
    
    // Old patterns
    const oldCptKeys = await redisClient.keys('cpt:code:*');
    const oldIcd10Keys = await redisClient.keys('icd10:code:*');
    const oldMappingKeys = await redisClient.keys('mapping:icd10-to-cpt:*');
    
    // New patterns
    const newCptKeys = await redisClient.keys('cpt:*');
    const newIcd10Keys = await redisClient.keys('icd10:*');
    const newMappingKeys = await redisClient.keys('mapping:*');
    const markdownKeys = await redisClient.keys('markdown:*');
    
    // Filter out old keys from new keys to avoid duplicates
    const filteredCptKeys = newCptKeys.filter(key => !oldCptKeys.includes(key));
    const filteredIcd10Keys = newIcd10Keys.filter(key => !oldIcd10Keys.includes(key));
    const filteredMappingKeys = newMappingKeys.filter(key => !oldMappingKeys.includes(key));
    
    console.log(`Found ${oldCptKeys.length} old CPT keys`);
    console.log(`Found ${oldIcd10Keys.length} old ICD-10 keys`);
    console.log(`Found ${oldMappingKeys.length} old mapping keys`);
    console.log(`Found ${filteredCptKeys.length} new CPT keys`);
    console.log(`Found ${filteredIcd10Keys.length} new ICD-10 keys`);
    console.log(`Found ${filteredMappingKeys.length} new mapping keys`);
    console.log(`Found ${markdownKeys.length} markdown keys`);
    
    // Delete keys in batches to avoid command line length limits
    const deleteKeysBatch = async (keys, name) => {
      if (keys.length === 0) {
        console.log(`No ${name} keys to delete`);
        return;
      }
      
      console.log(`Deleting ${keys.length} ${name} keys...`);
      
      // Delete in batches of 1000
      for (let i = 0; i < keys.length; i += 1000) {
        const batch = keys.slice(i, i + 1000);
        await redisClient.del(...batch);
        console.log(`  Deleted batch ${Math.floor(i / 1000) + 1}/${Math.ceil(keys.length / 1000)}`);
      }
    };
    
    // Delete all key types
    await deleteKeysBatch(oldCptKeys, 'old CPT');
    await deleteKeysBatch(oldIcd10Keys, 'old ICD-10');
    await deleteKeysBatch(oldMappingKeys, 'old mapping');
    await deleteKeysBatch(filteredCptKeys, 'new CPT');
    await deleteKeysBatch(filteredIcd10Keys, 'new ICD-10');
    await deleteKeysBatch(filteredMappingKeys, 'new mapping');
    await deleteKeysBatch(markdownKeys, 'markdown');
    
    // Verify Redis is empty
    const keysAfterDelete = await redisClient.keys('cpt:*');
    keysAfterDelete.push(...await redisClient.keys('icd10:*'));
    keysAfterDelete.push(...await redisClient.keys('mapping:*'));
    keysAfterDelete.push(...await redisClient.keys('markdown:*'));
    
    console.log(`\nRemaining keys after deletion: ${keysAfterDelete.length}`);
    
    // Call the populate function
    console.log('\nCalling populateRedisFromPostgres()...');
    console.time('Population time');
    console.log(`[${new Date().toISOString()}] Starting Redis population...`);
    await Promise.race([
      populateRedisFromPostgres(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Redis population timed out after 5 minutes')), 5 * 60 * 1000)
      )
    ]);
    console.timeEnd('Population time');
    console.log(`[${new Date().toISOString()}] Redis population completed`);
    
    // Check if Redis was populated
    const cptKeysAfter = await redisClient.keys('cpt:*');
    const icd10KeysAfter = await redisClient.keys('icd10:*');
    const mappingKeysAfter = await redisClient.keys('mapping:*');
    const markdownKeysAfter = await redisClient.keys('markdown:*');
    
    console.log('\nAfter population:');
    console.log(`CPT keys: ${cptKeysAfter.length}`);
    console.log(`ICD-10 keys: ${icd10KeysAfter.length}`);
    console.log(`Mapping keys: ${mappingKeysAfter.length}`);
    console.log(`Markdown keys: ${markdownKeysAfter.length}`);
    
    // Test retrieving a specific key
    if (cptKeysAfter.length > 0) {
      const sampleKey = cptKeysAfter[0];
      console.log(`\nSample key: ${sampleKey}`);
      
      // Try both JSON.GET and hgetall to see which one works
      try {
        const jsonData = await redisClient.call('JSON.GET', sampleKey);
        console.log('Sample data (JSON):', JSON.parse(jsonData));
      } catch (jsonError) {
        console.log('Error getting JSON data:', jsonError.message);
        
        try {
          const hashData = await redisClient.hgetall(sampleKey);
          console.log('Sample data (Hash):', hashData);
        } catch (hashError) {
          console.log('Error getting hash data:', hashError.message);
        }
      }
    }
    
    // Call the populate function again to test the "already populated" check
    console.log('\nCalling populateRedisFromPostgres() again to test "already populated" check...');
    console.time('Second population time');
    await populateRedisFromPostgres();
    console.timeEnd('Second population time');
    
    console.log('\nTest completed successfully!');
    
    // Close Redis connection
    console.log(`[${new Date().toISOString()}] Closing Redis connection...`);
    if (redisClient) {
      await redisClient.quit();
      console.log(`[${new Date().toISOString()}] Redis connection closed`);
    }
    
    // Clear the script timeout
    clearTimeout(scriptTimeout);
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error during test:`, error);
    
    // Try to close Redis connection if it exists
    if (redisClient) {
      try {
        await redisClient.quit();
        console.log(`[${new Date().toISOString()}] Redis connection closed after error`);
      } catch (closeError) {
        console.error(`[${new Date().toISOString()}] Error closing Redis connection:`, closeError);
      }
    }
    
    // Clear the script timeout
    clearTimeout(scriptTimeout);
    
    process.exit(1);
  }
}

// Run the test
console.log(`[${new Date().toISOString()}] Starting Redis population test...`);
testRedisPopulation().then(() => {
  console.log(`[${new Date().toISOString()}] Test completed successfully`);
}).catch(err => {
  console.error(`[${new Date().toISOString()}] Unhandled error:`, err);
  process.exit(1);
});