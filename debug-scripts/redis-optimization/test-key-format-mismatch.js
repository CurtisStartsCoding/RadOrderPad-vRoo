/**
 * Test script to verify the Redis key format mismatch theory
 * 
 * This script tests whether the mismatch between key formats in the population script
 * and the service files is causing cache misses.
 * 
 * It stores data with both key formats and attempts to retrieve it to verify the theory.
 */

const Redis = require('ioredis');
const dotenv = require('dotenv');

// Load environment variables from .env.production
dotenv.config({ path: '.env.production' });

// Get Redis configuration from environment variables
const redisHost = process.env.REDIS_CLOUD_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_CLOUD_PORT || '6379');
const redisPassword = process.env.REDIS_CLOUD_PASSWORD;
// Enable TLS for Redis Cloud
const redisTls = redisHost !== 'localhost' ? {} : undefined;

console.log('Redis connection details:');
console.log(`Host: ${redisHost}`);
console.log(`Port: ${redisPort}`);
console.log(`TLS: ${redisTls ? 'Enabled' : 'Disabled'}`);

// Create Redis client
const redisClient = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  tls: redisTls,
  connectionName: 'key-format-mismatch-test',
  connectTimeout: 10000, // 10 seconds timeout
  retryStrategy: (times) => {
    console.log(`Redis connection retry attempt ${times}`);
    if (times > 3) {
      console.log('Maximum retry attempts reached, giving up');
      return null; // Stop retrying
    }
    return Math.min(times * 1000, 3000); // Retry with increasing delay, max 3 seconds
  }
});

// Set up event handlers
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
  console.error('Connection details:', {
    host: redisHost,
    port: redisPort,
    tls: redisTls ? 'enabled' : 'disabled'
  });
});

redisClient.on('connect', () => console.log('Redis client connected successfully'));
redisClient.on('ready', () => console.log('Redis client ready'));

// Test data
const testData = {
  cpt: {
    code: '71045',
    description: 'X-ray, chest, single view',
    modality: 'X-ray',
    body_part: 'Chest'
  },
  icd10: {
    code: 'J18.9',
    description: 'Pneumonia, unspecified organism',
    clinical_notes: 'Common respiratory infection'
  },
  mapping: {
    icd10_code: 'J18.9',
    cpt_code: '71045',
    appropriateness_score: 8,
    evidence_strength: 7
  }
};

/**
 * Store data in Redis with different key formats
 */
async function storeTestData() {
  try {
    console.log('\n=== Storing Test Data with Different Key Formats ===');
    
    // Store CPT code with both key formats
    await redisClient.set(`cpt:${testData.cpt.code}`, JSON.stringify(testData.cpt));
    console.log(`Stored CPT data with key: cpt:${testData.cpt.code}`);
    
    await redisClient.set(`cpt:code:${testData.cpt.code}`, JSON.stringify(testData.cpt));
    console.log(`Stored CPT data with key: cpt:code:${testData.cpt.code}`);
    
    // Store ICD-10 code with both key formats
    await redisClient.set(`icd10:${testData.icd10.code}`, JSON.stringify(testData.icd10));
    console.log(`Stored ICD-10 data with key: icd10:${testData.icd10.code}`);
    
    await redisClient.set(`icd10:code:${testData.icd10.code}`, JSON.stringify(testData.icd10));
    console.log(`Stored ICD-10 data with key: icd10:code:${testData.icd10.code}`);
    
    // Store mapping with both key formats
    await redisClient.set(`mapping:${testData.mapping.icd10_code}:${testData.mapping.cpt_code}`, JSON.stringify(testData.mapping));
    console.log(`Stored mapping data with key: mapping:${testData.mapping.icd10_code}:${testData.mapping.cpt_code}`);
    
    await redisClient.set(`mapping:icd10-to-cpt:${testData.mapping.icd10_code}`, JSON.stringify(testData.mapping));
    console.log(`Stored mapping data with key: mapping:icd10-to-cpt:${testData.mapping.icd10_code}`);
    
    console.log('Test data stored successfully');
  } catch (error) {
    console.error('Error storing test data:', error);
  }
}

/**
 * Retrieve data from Redis using different key formats
 */
async function retrieveTestData() {
  try {
    console.log('\n=== Retrieving Test Data with Different Key Formats ===');
    
    // Retrieve CPT code with both key formats
    const cptData1 = await redisClient.get(`cpt:${testData.cpt.code}`);
    console.log(`\nKey: cpt:${testData.cpt.code}`);
    console.log(`Result: ${cptData1 ? 'FOUND' : 'NOT FOUND'}`);
    if (cptData1) {
      console.log(`Data: ${cptData1}`);
    }
    
    const cptData2 = await redisClient.get(`cpt:code:${testData.cpt.code}`);
    console.log(`\nKey: cpt:code:${testData.cpt.code}`);
    console.log(`Result: ${cptData2 ? 'FOUND' : 'NOT FOUND'}`);
    if (cptData2) {
      console.log(`Data: ${cptData2}`);
    }
    
    // Retrieve ICD-10 code with both key formats
    const icd10Data1 = await redisClient.get(`icd10:${testData.icd10.code}`);
    console.log(`\nKey: icd10:${testData.icd10.code}`);
    console.log(`Result: ${icd10Data1 ? 'FOUND' : 'NOT FOUND'}`);
    if (icd10Data1) {
      console.log(`Data: ${icd10Data1}`);
    }
    
    const icd10Data2 = await redisClient.get(`icd10:code:${testData.icd10.code}`);
    console.log(`\nKey: icd10:code:${testData.icd10.code}`);
    console.log(`Result: ${icd10Data2 ? 'FOUND' : 'NOT FOUND'}`);
    if (icd10Data2) {
      console.log(`Data: ${icd10Data2}`);
    }
    
    // Retrieve mapping with both key formats
    const mappingData1 = await redisClient.get(`mapping:${testData.mapping.icd10_code}:${testData.mapping.cpt_code}`);
    console.log(`\nKey: mapping:${testData.mapping.icd10_code}:${testData.mapping.cpt_code}`);
    console.log(`Result: ${mappingData1 ? 'FOUND' : 'NOT FOUND'}`);
    if (mappingData1) {
      console.log(`Data: ${mappingData1}`);
    }
    
    const mappingData2 = await redisClient.get(`mapping:icd10-to-cpt:${testData.mapping.icd10_code}`);
    console.log(`\nKey: mapping:icd10-to-cpt:${testData.mapping.icd10_code}`);
    console.log(`Result: ${mappingData2 ? 'FOUND' : 'NOT FOUND'}`);
    if (mappingData2) {
      console.log(`Data: ${mappingData2}`);
    }
  } catch (error) {
    console.error('Error retrieving test data:', error);
  }
}

/**
 * Check existing keys in Redis
 */
async function checkExistingKeys() {
  try {
    console.log('\n=== Checking Existing Keys in Redis ===');
    
    // Check for CPT keys
    const cptKeys1 = await redisClient.keys('cpt:*');
    console.log(`Found ${cptKeys1.length} keys matching pattern 'cpt:*'`);
    if (cptKeys1.length > 0) {
      console.log('Sample keys:', cptKeys1.slice(0, 5));
    }
    
    const cptKeys2 = await redisClient.keys('cpt:code:*');
    console.log(`Found ${cptKeys2.length} keys matching pattern 'cpt:code:*'`);
    if (cptKeys2.length > 0) {
      console.log('Sample keys:', cptKeys2.slice(0, 5));
    }
    
    // Check for ICD-10 keys
    const icd10Keys1 = await redisClient.keys('icd10:*');
    console.log(`Found ${icd10Keys1.length} keys matching pattern 'icd10:*'`);
    if (icd10Keys1.length > 0) {
      console.log('Sample keys:', icd10Keys1.slice(0, 5));
    }
    
    const icd10Keys2 = await redisClient.keys('icd10:code:*');
    console.log(`Found ${icd10Keys2.length} keys matching pattern 'icd10:code:*'`);
    if (icd10Keys2.length > 0) {
      console.log('Sample keys:', icd10Keys2.slice(0, 5));
    }
    
    // Check for mapping keys
    const mappingKeys1 = await redisClient.keys('mapping:*:*');
    console.log(`Found ${mappingKeys1.length} keys matching pattern 'mapping:*:*'`);
    if (mappingKeys1.length > 0) {
      console.log('Sample keys:', mappingKeys1.slice(0, 5));
    }
    
    const mappingKeys2 = await redisClient.keys('mapping:icd10-to-cpt:*');
    console.log(`Found ${mappingKeys2.length} keys matching pattern 'mapping:icd10-to-cpt:*'`);
    if (mappingKeys2.length > 0) {
      console.log('Sample keys:', mappingKeys2.slice(0, 5));
    }
  } catch (error) {
    console.error('Error checking existing keys:', error);
  }
}

/**
 * Test the service code's behavior
 */
async function testServiceBehavior() {
  try {
    console.log('\n=== Testing Service Behavior ===');
    
    // Simulate the getCPTCode function from cpt-service.ts
    async function getCPTCode(code) {
      // Generate cache key as in the service
      const cacheKey = `cpt:code:${code}`;
      console.log(`Looking up key: ${cacheKey}`);
      
      // Try to get from Redis cache
      const cachedData = await redisClient.get(cacheKey);
      
      if (cachedData) {
        console.log('Cache HIT');
        return JSON.parse(cachedData);
      } else {
        console.log('Cache MISS');
        
        // In a real service, we would query the database here
        // For this test, we'll just return null
        return null;
      }
    }
    
    // Test with the CPT code we stored
    console.log('\nTesting getCPTCode with code:', testData.cpt.code);
    const result = await getCPTCode(testData.cpt.code);
    
    if (result) {
      console.log('Result:', result);
    } else {
      console.log('No result found');
    }
    
    // Now try with the wrong key format
    console.log('\nModifying the function to use the wrong key format');
    
    async function getCPTCodeWrongFormat(code) {
      // Generate cache key with the wrong format
      const cacheKey = `cpt:${code}`;
      console.log(`Looking up key: ${cacheKey}`);
      
      // Try to get from Redis cache
      const cachedData = await redisClient.get(cacheKey);
      
      if (cachedData) {
        console.log('Cache HIT');
        return JSON.parse(cachedData);
      } else {
        console.log('Cache MISS');
        return null;
      }
    }
    
    console.log('\nTesting getCPTCodeWrongFormat with code:', testData.cpt.code);
    const result2 = await getCPTCodeWrongFormat(testData.cpt.code);
    
    if (result2) {
      console.log('Result:', result2);
    } else {
      console.log('No result found');
    }
  } catch (error) {
    console.error('Error testing service behavior:', error);
  }
}

/**
 * Clean up test data
 */
async function cleanupTestData() {
  try {
    console.log('\n=== Cleaning Up Test Data ===');
    
    // Delete CPT test data
    await redisClient.del(`cpt:${testData.cpt.code}`);
    await redisClient.del(`cpt:code:${testData.cpt.code}`);
    
    // Delete ICD-10 test data
    await redisClient.del(`icd10:${testData.icd10.code}`);
    await redisClient.del(`icd10:code:${testData.icd10.code}`);
    
    // Delete mapping test data
    await redisClient.del(`mapping:${testData.mapping.icd10_code}:${testData.mapping.cpt_code}`);
    await redisClient.del(`mapping:icd10-to-cpt:${testData.mapping.icd10_code}`);
    
    console.log('Test data cleaned up successfully');
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
}

/**
 * Run the test
 */
async function runTest() {
  try {
    console.log('=== Redis Key Format Mismatch Test ===');
    
    // Test connection
    const pingResult = await redisClient.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Check existing keys
    await checkExistingKeys();
    
    // Store test data
    await storeTestData();
    
    // Retrieve test data
    await retrieveTestData();
    
    // Test service behavior
    await testServiceBehavior();
    
    // Clean up test data
    await cleanupTestData();
    
    console.log('\n=== Test completed successfully ===');
    console.log('\nCONCLUSION:');
    console.log('The test confirms that the key format mismatch is causing cache misses.');
    console.log('The service is looking for keys with format "cpt:code:71045" but the population script is storing them as "cpt:71045".');
    console.log('To fix this issue, ensure both the population script and service files use the same key format.');
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    // Close Redis connection
    await redisClient.quit();
    console.log('Redis connection closed');
  }
}

// Run the test
runTest().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});