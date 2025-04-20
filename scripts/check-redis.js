/**
 * Script to check Redis database
 */
import { getRedisClient, closeRedisConnection } from '../dist/config/redis.js';

async function checkRedisDatabase() {
  try {
    console.log('Checking Redis database...');
    const client = getRedisClient();
    
    // Check if Redis is connected
    const pingResult = await client.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Check if the indexes exist
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cptIndexInfo = await (client).call('FT.INFO', 'cpt_index');
      console.log('CPT index exists:', cptIndexInfo ? 'Yes' : 'No');
      console.log('CPT index info:', cptIndexInfo);
    } catch (error) {
      console.error('Error checking CPT index:', error.message);
    }
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const icd10IndexInfo = await (client).call('FT.INFO', 'icd10_index');
      console.log('ICD-10 index exists:', icd10IndexInfo ? 'Yes' : 'No');
      console.log('ICD-10 index info:', icd10IndexInfo);
    } catch (error) {
      console.error('Error checking ICD-10 index:', error.message);
    }
    
    // Check if there are any keys in Redis
    const keys = await client.keys('*');
    console.log(`Total Redis keys: ${keys.length}`);
    
    // Check for specific key patterns
    const cptKeys = await client.keys('cpt:*');
    console.log(`CPT keys: ${cptKeys.length}`);
    
    const icd10Keys = await client.keys('icd10:*');
    console.log(`ICD-10 keys: ${icd10Keys.length}`);
    
    const mappingKeys = await client.keys('mapping:*');
    console.log(`Mapping keys: ${mappingKeys.length}`);
    
    const markdownKeys = await client.keys('markdown:*');
    console.log(`Markdown keys: ${markdownKeys.length}`);
    
    // Sample a few keys
    if (cptKeys.length > 0) {
      console.log('\nSample CPT keys:');
      for (let i = 0; i < Math.min(5, cptKeys.length); i++) {
        const key = cptKeys[i];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await (client).call('JSON.GET', key);
        console.log(`${key}: ${data}`);
      }
    }
    
    if (icd10Keys.length > 0) {
      console.log('\nSample ICD-10 keys:');
      for (let i = 0; i < Math.min(5, icd10Keys.length); i++) {
        const key = icd10Keys[i];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await (client).call('JSON.GET', key);
        console.log(`${key}: ${data}`);
      }
    }
    
    // Try a direct search for shoulder-related codes
    try {
      console.log('\nSearching for shoulder-related CPT codes:');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results = await (client).call(
        'FT.SEARCH',
        'cpt_index',
        '@description|body_part:(shoulder)',
        'LIMIT', '0', '5'
      );
      console.log('Search results:', results);
    } catch (error) {
      console.error('Error searching for shoulder-related CPT codes:', error.message);
    }
    
  } catch (error) {
    console.error('Error checking Redis database:', error);
  } finally {
    await closeRedisConnection();
  }
}

checkRedisDatabase();