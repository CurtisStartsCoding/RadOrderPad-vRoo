/**
 * Script to clear Redis and repopulate with ALL database records
 * This uses the main population function that doesn't have any limits
 */
const { getRedisClient, closeRedisConnection } = require('../../dist/config/redis');
const { populateRedisFromPostgres } = require('../../dist/utils/cache/redis-populate');

async function repopulateRedisAll() {
  try {
    console.log('Starting Redis repopulation with ALL records...');
    
    const client = getRedisClient();
    
    // Clear existing Redis data
    console.log('Clearing existing Redis data...');
    await client.flushdb();
    console.log('Redis data cleared.');
    
    // Repopulate with ALL records
    console.log('Populating Redis with ALL database records...');
    const startTime = Date.now();
    await populateRedisFromPostgres();
    const endTime = Date.now();
    
    console.log(`Redis population completed in ${(endTime - startTime) / 1000} seconds`);
    
    // Verify the counts
    const cptKeys = await client.keys('cpt:code:*');
    const icd10Keys = await client.keys('icd10:code:*');
    const mappingKeys = await client.keys('mapping:*');
    const markdownKeys = await client.keys('markdown:*');
    
    console.log('\nRedis population summary:');
    console.log(`- CPT codes: ${cptKeys.length}`);
    console.log(`- ICD-10 codes: ${icd10Keys.length}`);
    console.log(`- Mappings: ${mappingKeys.length}`);
    console.log(`- Markdown docs: ${markdownKeys.length}`);
    
  } catch (error) {
    console.error('Error repopulating Redis:', error);
  } finally {
    await closeRedisConnection();
  }
}

repopulateRedisAll();