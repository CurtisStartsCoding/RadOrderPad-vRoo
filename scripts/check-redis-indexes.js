/**
 * Script to check Redis indexes
 */
import { getRedisClient, closeRedisConnection } from '../dist/config/redis.js';

async function checkRedisIndexes() {
  try {
    console.log('Checking Redis indexes...');
    const client = getRedisClient();
    
    // Check if Redis is connected
    const pingResult = await client.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Check if the indexes exist
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cptIndexInfo = await (client).call('FT.INFO', 'cpt_index');
      console.log('CPT index exists:', cptIndexInfo ? 'Yes' : 'No');
      console.log('CPT index num_docs:', cptIndexInfo[11]);
    } catch (error) {
      console.error('Error checking CPT index:', error.message);
    }
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const icd10IndexInfo = await (client).call('FT.INFO', 'icd10_index');
      console.log('ICD-10 index exists:', icd10IndexInfo ? 'Yes' : 'No');
      console.log('ICD-10 index num_docs:', icd10IndexInfo[11]);
    } catch (error) {
      console.error('Error checking ICD-10 index:', error.message);
    }
    
    // Check for specific key patterns
    const keys = await client.keys('*');
    console.log(`Total Redis keys: ${keys.length}`);
    
    const cptKeys = await client.keys('cpt:*');
    console.log(`CPT keys: ${cptKeys.length}`);
    
    const icd10Keys = await client.keys('icd10:*');
    console.log(`ICD-10 keys: ${icd10Keys.length}`);
    
    // Try a direct search for specific CPT codes we know exist
    if (cptKeys.length > 0) {
      console.log('\nSearching for specific CPT codes:');
      for (let i = 0; i < Math.min(5, cptKeys.length); i++) {
        const key = cptKeys[i];
        const cptCode = key.split(':')[1];
        
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const results = await (client).call(
            'FT.SEARCH',
            'cpt_index',
            `@$.cpt_code:{${cptCode}}`,
            'LIMIT', '0', '1'
          );
          console.log(`Search for CPT code ${cptCode}: ${results[0]} results`);
        } catch (error) {
          console.error(`Error searching for CPT code ${cptCode}:`, error.message);
        }
      }
    }
    
    // Try a direct search for specific ICD-10 codes we know exist
    if (icd10Keys.length > 0) {
      console.log('\nSearching for specific ICD-10 codes:');
      for (let i = 0; i < Math.min(5, icd10Keys.length); i++) {
        const key = icd10Keys[i];
        const icd10Code = key.split(':')[1];
        
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const results = await (client).call(
            'FT.SEARCH',
            'icd10_index',
            `@$.icd10_code:{${icd10Code}}`,
            'LIMIT', '0', '1'
          );
          console.log(`Search for ICD-10 code ${icd10Code}: ${results[0]} results`);
        } catch (error) {
          console.error(`Error searching for ICD-10 code ${icd10Code}:`, error.message);
        }
      }
    }
    
    // Try a direct search for shoulder-related CPT codes
    try {
      console.log('\nSearching for shoulder-related CPT codes:');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results = await (client).call(
        'FT.SEARCH',
        'cpt_index',
        '@description:(shoulder)',
        'LIMIT', '0', '5'
      );
      console.log('Search results:', results);
      
      if (results[0] > 0) {
        console.log('Found shoulder-related CPT codes:');
        for (let i = 1; i < results.length; i += 2) {
          const key = results[i];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = await (client).call('JSON.GET', key);
          console.log(`${key}: ${data}`);
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
        '@description:(MRI)',
        'LIMIT', '0', '5'
      );
      console.log('Search results:', results);
      
      if (results[0] > 0) {
        console.log('Found MRI-related CPT codes:');
        for (let i = 1; i < results.length; i += 2) {
          const key = results[i];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = await (client).call('JSON.GET', key);
          console.log(`${key}: ${data}`);
        }
      }
    } catch (error) {
      console.error('Error searching for MRI-related CPT codes:', error.message);
    }
    
  } catch (error) {
    console.error('Error checking Redis indexes:', error);
  } finally {
    await closeRedisConnection();
  }
}

checkRedisIndexes();