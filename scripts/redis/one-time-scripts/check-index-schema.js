/**
 * Redis Index Schema Check Script
 * 
 * This script checks the RedisSearch index schema and compares it with the actual
 * data structure in Redis to identify potential mismatches.
 */

import { getRedisClient } from '../../dist/config/redis.js';

async function checkIndexSchema() {
  console.log('Checking RedisSearch index schema...');
  
  try {
    const client = getRedisClient();
    
    // Test connection
    console.log('Testing Redis connection...');
    const pingResult = await client.ping();
    console.log(`Redis connection test result: ${pingResult}`);
    
    // Check CPT index
    console.log('\nChecking CPT index schema:');
    try {
      const cptIndexInfo = await client.call('FT.INFO', 'cpt_index');
      
      // Extract index attributes
      const attributes = [];
      let inAttributes = false;
      for (let i = 0; i < cptIndexInfo.length; i++) {
        if (cptIndexInfo[i] === 'attributes') {
          inAttributes = true;
          i++; // Skip the array length
          continue;
        }
        
        if (inAttributes && i < cptIndexInfo.length) {
          // Each attribute is a set of properties
          const attribute = {};
          for (let j = 0; j < 10 && i < cptIndexInfo.length; j += 2) {
            if (i + j + 1 < cptIndexInfo.length) {
              attribute[cptIndexInfo[i + j]] = cptIndexInfo[i + j + 1];
            }
          }
          attributes.push(attribute);
          i += Object.keys(attribute).length * 2 - 1;
        }
      }
      
      console.log('CPT index attributes:');
      console.log(JSON.stringify(attributes, null, 2));
      
      // Get a sample CPT code to compare
      const cptKeys = await client.keys('cpt:*');
      if (cptKeys.length > 0) {
        const sampleKey = cptKeys[0];
        const data = await client.call('JSON.GET', sampleKey);
        console.log(`\nSample CPT data structure (${sampleKey}):`);
        console.log(data);
        
        // Check if the indexed fields exist in the data
        const parsedData = JSON.parse(data);
        console.log('\nField existence check:');
        for (const attr of attributes) {
          if (attr.identifier) {
            const field = attr.identifier.replace(/^\$\./, '').split('.')[0];
            console.log(`Field '${field}': ${parsedData[field] !== undefined ? 'EXISTS' : 'MISSING'}`);
          }
        }
      } else {
        console.log('No CPT codes found to compare with index schema');
      }
    } catch (error) {
      console.log('Error checking CPT index:', error.message);
    }
    
    // Check ICD-10 index
    console.log('\nChecking ICD-10 index schema:');
    try {
      const icdIndexInfo = await client.call('FT.INFO', 'icd10_index');
      
      // Extract index attributes
      const attributes = [];
      let inAttributes = false;
      for (let i = 0; i < icdIndexInfo.length; i++) {
        if (icdIndexInfo[i] === 'attributes') {
          inAttributes = true;
          i++; // Skip the array length
          continue;
        }
        
        if (inAttributes && i < icdIndexInfo.length) {
          // Each attribute is a set of properties
          const attribute = {};
          for (let j = 0; j < 10 && i < icdIndexInfo.length; j += 2) {
            if (i + j + 1 < icdIndexInfo.length) {
              attribute[icdIndexInfo[i + j]] = icdIndexInfo[i + j + 1];
            }
          }
          attributes.push(attribute);
          i += Object.keys(attribute).length * 2 - 1;
        }
      }
      
      console.log('ICD-10 index attributes:');
      console.log(JSON.stringify(attributes, null, 2));
      
      // Get a sample ICD-10 code to compare
      const icdKeys = await client.keys('icd10:*');
      if (icdKeys.length > 0) {
        const sampleKey = icdKeys[0];
        const data = await client.call('JSON.GET', sampleKey);
        console.log(`\nSample ICD-10 data structure (${sampleKey}):`);
        console.log(data);
        
        // Check if the indexed fields exist in the data
        const parsedData = JSON.parse(data);
        console.log('\nField existence check:');
        for (const attr of attributes) {
          if (attr.identifier) {
            const field = attr.identifier.replace(/^\$\./, '').split('.')[0];
            console.log(`Field '${field}': ${parsedData[field] !== undefined ? 'EXISTS' : 'MISSING'}`);
          }
        }
      } else {
        console.log('No ICD-10 codes found to compare with index schema');
      }
    } catch (error) {
      console.log('Error checking ICD-10 index:', error.message);
    }
    
    // Close the connection
    await client.quit();
    console.log('\nRedis connection closed');
    
  } catch (error) {
    console.error('Error checking index schema:', error);
  }
}

// Run the function
checkIndexSchema().catch(console.error);