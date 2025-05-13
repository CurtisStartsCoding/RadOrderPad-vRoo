/**
 * Direct Redis Test Script
 * 
 * This script tests Redis JSON storage and retrieval directly
 */

// Use the redis client directly
const Redis = require('ioredis');

// Redis Cloud connection details from .env.production
const redisHost = 'redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com';
const redisPort = 11584;
const redisPassword = 'zHUbspGPcewJsoT9G9TSQncuSl0v0MUH';

console.log('Starting Redis Production Test...');
console.log(`Connection details: { host: '${redisHost}', port: ${redisPort}, tls: enabled }`);

// Create a Redis client with production settings
const client = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  tls: {}, // Enable TLS for Redis Cloud
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    console.log(`Redis client reconnecting ${times * 50}`);
    return delay;
  }
});

// Set up event handlers
client.on('connect', () => {
  console.log('Redis client connected successfully');
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

/**
 * Test Redis JSON storage
 */
async function testRedisJSONStorage() {
  console.log('Testing Redis JSON storage');
  
  try {
    // Test multiple CPT codes to increase chances of finding data
    const cptCodes = ['73221', '70450', '72131', '71045', '74177'];
    let cptJsonFound = false;
    
    console.log('\n=== TESTING CPT CODES AS JSON ===');
    for (const code of cptCodes) {
      const cptKey = `cpt:code:${code}`;
      try {
        // First try JSON.GET to see if it's stored as JSON
        const cptJsonData = await client.call('JSON.GET', cptKey);
        
        if (cptJsonData) {
          console.log(`✅ SUCCESS: Found CPT code ${cptKey} stored as JSON:`);
          console.log(JSON.parse(cptJsonData));
          cptJsonFound = true;
          break; // Found one, no need to continue
        }
      } catch (jsonErr) {
        // If JSON.GET fails, try HGETALL to see if it's stored as a hash
        try {
          const cptHashData = await client.hgetall(cptKey);
          if (cptHashData && Object.keys(cptHashData).length > 0) {
            console.log(`❌ ISSUE: CPT code ${cptKey} is stored as a HASH, not JSON:`);
            console.log(cptHashData);
          }
        } catch (hashErr) {
          // Both JSON.GET and HGETALL failed
          console.log(`❓ CPT code ${cptKey} not found or access error`);
        }
      }
    }
    
    if (!cptJsonFound) {
      console.log('❌ WARNING: No CPT codes found stored as JSON documents');
    }
    
    // Test multiple ICD-10 codes to increase chances of finding data
    const icd10Codes = ['M54.5', 'R51', 'J18.9', 'R10.9', 'S83.9'];
    let icd10JsonFound = false;
    
    console.log('\n=== TESTING ICD-10 CODES AS JSON ===');
    for (const code of icd10Codes) {
      const icd10Key = `icd10:code:${code}`;
      try {
        // First try JSON.GET to see if it's stored as JSON
        const icd10JsonData = await client.call('JSON.GET', icd10Key);
        
        if (icd10JsonData) {
          console.log(`✅ SUCCESS: Found ICD-10 code ${icd10Key} stored as JSON:`);
          console.log(JSON.parse(icd10JsonData));
          icd10JsonFound = true;
          break; // Found one, no need to continue
        }
      } catch (jsonErr) {
        // If JSON.GET fails, try HGETALL to see if it's stored as a hash
        try {
          const icd10HashData = await client.hgetall(icd10Key);
          if (icd10HashData && Object.keys(icd10HashData).length > 0) {
            console.log(`❌ ISSUE: ICD-10 code ${icd10Key} is stored as a HASH, not JSON:`);
            console.log(icd10HashData);
          }
        } catch (hashErr) {
          // Both JSON.GET and HGETALL failed
          console.log(`❓ ICD-10 code ${icd10Key} not found or access error`);
        }
      }
    }
    
    if (!icd10JsonFound) {
      console.log('❌ WARNING: No ICD-10 codes found stored as JSON documents');
    }
    
    // Test markdown documents
    const markdownCodes = ['M54.5', 'R51', 'J18.9'];
    let markdownJsonFound = false;
    
    console.log('\n=== TESTING MARKDOWN DOCUMENTS AS JSON ===');
    for (const code of markdownCodes) {
      const markdownKey = `markdown:${code}`;
      try {
        // First try JSON.GET to see if it's stored as JSON
        const markdownJsonData = await client.call('JSON.GET', markdownKey);
        
        if (markdownJsonData) {
          console.log(`✅ SUCCESS: Found Markdown document ${markdownKey} stored as JSON:`);
          console.log(JSON.parse(markdownJsonData));
          markdownJsonFound = true;
          break; // Found one, no need to continue
        }
      } catch (jsonErr) {
        // If JSON.GET fails, try HGETALL to see if it's stored as a hash
        try {
          const markdownHashData = await client.hgetall(markdownKey);
          if (markdownHashData && Object.keys(markdownHashData).length > 0) {
            console.log(`❌ ISSUE: Markdown document ${markdownKey} is stored as a HASH, not JSON:`);
            console.log(markdownHashData);
          }
        } catch (hashErr) {
          // Both JSON.GET and HGETALL failed
          console.log(`❓ Markdown document ${markdownKey} not found or access error`);
        }
      }
    }
    
    if (!markdownJsonFound) {
      console.log('❌ WARNING: No Markdown documents found stored as JSON documents');
    }
    
    // Get a sample mapping (should still be a hash)
    console.log('\n=== TESTING MAPPINGS AS HASH (EXPECTED) ===');
    const mappingKey = 'mapping:icd10-to-cpt:M54.5';
    try {
      const mappingData = await client.hgetall(mappingKey);
      
      if (mappingData && Object.keys(mappingData).length > 0) {
        console.log(`✅ SUCCESS: Found mapping ${mappingKey} stored as Hash (as expected):`);
        console.log(mappingData);
      } else {
        console.warn(`❓ Mapping ${mappingKey} not found or empty`);
      }
    } catch (err) {
      console.error(`❌ Error getting mapping ${mappingKey}:`, err.message);
    }
    
    // Check Redis indices
    console.log('\n=== CHECKING REDIS INDICES ===');
    try {
      const cptIndexInfo = await client.call('FT.INFO', 'idx:cpt');
      console.log('CPT Index Information:');
      console.log('Index Type:', cptIndexInfo.indexOf('index_options') >= 0 ?
        cptIndexInfo[cptIndexInfo.indexOf('index_options') + 1] : 'Unknown');
      console.log('Index Definition:', cptIndexInfo.indexOf('index_definition') >= 0 ?
        cptIndexInfo[cptIndexInfo.indexOf('index_definition') + 1] : 'Unknown');
    } catch (err) {
      console.error('❌ Error getting CPT index info:', err.message);
    }
    
    try {
      const icd10IndexInfo = await client.call('FT.INFO', 'idx:icd10');
      console.log('\nICD-10 Index Information:');
      console.log('Index Type:', icd10IndexInfo.indexOf('index_options') >= 0 ?
        icd10IndexInfo[icd10IndexInfo.indexOf('index_options') + 1] : 'Unknown');
      console.log('Index Definition:', icd10IndexInfo.indexOf('index_definition') >= 0 ?
        icd10IndexInfo[icd10IndexInfo.indexOf('index_definition') + 1] : 'Unknown');
    } catch (err) {
      console.error('❌ Error getting ICD-10 index info:', err.message);
    }
    
  } catch (error) {
    console.error('Error testing Redis JSON storage:', error);
  } finally {
    // Close the Redis connection
    client.quit();
  }
}

/**
 * Main function to run all tests
 */
async function runTests() {
  console.log('Starting Redis Direct Storage tests');
  
  // Test Redis JSON storage
  await testRedisJSONStorage();
  
  console.log('All tests completed');
  process.exit(0);
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
  client.quit();
  process.exit(1);
});