/**
 * Script to check Redis indexes with the correct syntax
 */
import { getRedisClient, closeRedisConnection } from '../dist/config/redis.js';

async function checkRedisIndexesFixed() {
  try {
    console.log('Checking Redis indexes with the correct syntax...');
    const client = getRedisClient();
    
    // Check if Redis is connected
    const pingResult = await client.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Check if CPT index exists
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cptIndexInfo = await (client).call('FT.INFO', 'cpt_index');
      console.log('CPT index exists: Yes');
      console.log(`CPT index num_docs: ${cptIndexInfo[11]}`);
    } catch (error) {
      console.log('CPT index exists: No');
      console.error('Error checking CPT index:', error.message);
    }
    
    // Check if ICD-10 index exists
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const icd10IndexInfo = await (client).call('FT.INFO', 'icd10_index');
      console.log('ICD-10 index exists: Yes');
      console.log(`ICD-10 index num_docs: ${icd10IndexInfo[11]}`);
    } catch (error) {
      console.log('ICD-10 index exists: No');
      console.error('Error checking ICD-10 index:', error.message);
    }
    
    // Count Redis keys
    const keys = await client.keys('*');
    console.log(`Total Redis keys: ${keys.length}`);
    
    const cptKeys = await client.keys('cpt:*');
    console.log(`CPT keys: ${cptKeys.length}`);
    
    const icd10Keys = await client.keys('icd10:*');
    console.log(`ICD-10 keys: ${icd10Keys.length}`);
    
    // Try a direct search for shoulder-related CPT codes
    try {
      console.log('\nSearching for shoulder-related CPT codes:');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results = await (client).call(
        'FT.SEARCH',
        'cpt_index',
        'shoulder',
        'LIMIT', '0', '5'
      );
      console.log('Search results count:', results[0]);
      
      if (results[0] > 0) {
        console.log('Found shoulder-related CPT codes:');
        for (let i = 1; i < results.length; i += 2) {
          const key = results[i];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = await (client).call('JSON.GET', key);
          const parsedData = JSON.parse(data);
          console.log(`${key}: ${parsedData.cpt_code} - ${parsedData.description}`);
        }
      }
    } catch (error) {
      console.error('Error searching for shoulder-related CPT codes:', error.message);
    }
    
    // Try a direct search for MRI-related CPT codes
    try {
      console.log('\nSearching for MRI-related CPT codes:');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results = await (client).call(
        'FT.SEARCH',
        'cpt_index',
        'MRI',
        'LIMIT', '0', '5'
      );
      console.log('Search results count:', results[0]);
      
      if (results[0] > 0) {
        console.log('Found MRI-related CPT codes:');
        for (let i = 1; i < results.length; i += 2) {
          const key = results[i];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = await (client).call('JSON.GET', key);
          const parsedData = JSON.parse(data);
          console.log(`${key}: ${parsedData.cpt_code} - ${parsedData.description}`);
        }
      }
    } catch (error) {
      console.error('Error searching for MRI-related CPT codes:', error.message);
    }
    
    // Try a direct search for headache-related ICD-10 codes
    try {
      console.log('\nSearching for headache-related ICD-10 codes:');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results = await (client).call(
        'FT.SEARCH',
        'icd10_index',
        'headache',
        'LIMIT', '0', '5'
      );
      console.log('Search results count:', results[0]);
      
      if (results[0] > 0) {
        console.log('Found headache-related ICD-10 codes:');
        for (let i = 1; i < results.length; i += 2) {
          const key = results[i];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = await (client).call('JSON.GET', key);
          const parsedData = JSON.parse(data);
          console.log(`${key}: ${parsedData.icd10_code} - ${parsedData.description}`);
        }
      }
    } catch (error) {
      console.error('Error searching for headache-related ICD-10 codes:', error.message);
    }
    
  } catch (error) {
    console.error('Error checking Redis indexes:', error);
  } finally {
    await closeRedisConnection();
  }
}

checkRedisIndexesFixed();