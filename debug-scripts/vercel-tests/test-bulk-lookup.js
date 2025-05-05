/**
 * Test script for Redis Lua-based bulk lookup
 * 
 * This script tests the bulk lookup service by:
 * 1. Setting some test data in Redis
 * 2. Performing individual lookups
 * 3. Performing bulk lookups
 * 4. Comparing performance and results
 */

const { getRedisClient } = require('../../dist/config/redis');
const { 
  bulkLookupCodes, 
  bulkLookupCptCodes, 
  bulkLookupIcd10Codes,
  loadAndCacheScripts
} = require('../../dist/services/bulk-lookup');
const dotenv = require('dotenv');
const Redis = require('ioredis');

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

// Test data
const TEST_CPT_CODES = [
  '71045', // X-ray chest, single view
  '71046', // X-ray chest, 2 views
  '70450', // CT head/brain without contrast
  '70486', // CT maxillofacial without contrast
  '70551'  // MRI brain without contrast
];

const TEST_ICD10_CODES = [
  'R51',    // Headache
  'J18.9',  // Pneumonia, unspecified
  'M54.5',  // Low back pain
  'I10',    // Essential (primary) hypertension
  'E11.9'   // Type 2 diabetes mellitus without complications
];

// Sample data for each code
function createSampleCptData(code) {
  return {
    code,
    description: `Sample CPT description for ${code}`,
    category: 'Radiology',
    relativeValue: Math.random() * 5 + 1,
    timestamp: new Date().toISOString()
  };
}

function createSampleIcd10Data(code) {
  return {
    code,
    description: `Sample ICD-10 description for ${code}`,
    category: 'Diagnosis',
    severity: Math.floor(Math.random() * 3) + 1,
    timestamp: new Date().toISOString()
  };
}

/**
 * Set test data in Redis
 */
async function setupTestData(redisClient) {
  console.log('Setting up test data in Redis...');
  
  // Set CPT codes
  for (const code of TEST_CPT_CODES) {
    const data = createSampleCptData(code);
    await redisClient.set(`cpt:code:${code}`, JSON.stringify(data));
    console.log(`Set CPT code: ${code}`);
  }
  
  // Set ICD-10 codes
  for (const code of TEST_ICD10_CODES) {
    const data = createSampleIcd10Data(code);
    await redisClient.set(`icd10:code:${code}`, JSON.stringify(data));
    console.log(`Set ICD-10 code: ${code}`);
  }
  
  console.log('Test data setup complete');
}

/**
 * Measure execution time of a function
 */
async function measurePerformance(fn) {
  const start = process.hrtime.bigint();
  const result = await fn();
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1_000_000; // Convert to milliseconds
  
  return { result, duration };
}

/**
 * Test individual lookups
 */
async function testIndividualLookups(redisClient) {
  console.log('\nTesting individual lookups...');
  
  // Individual CPT lookups
  const cptResults = [];
  const { result: cptDuration } = await measurePerformance(async () => {
    for (const code of TEST_CPT_CODES) {
      const data = await redisClient.get(`cpt:code:${code}`);
      cptResults.push(data ? JSON.parse(data) : null);
    }
    return cptResults.length;
  });
  
  // Individual ICD-10 lookups
  const icd10Results = [];
  const { result: icd10Duration } = await measurePerformance(async () => {
    for (const code of TEST_ICD10_CODES) {
      const data = await redisClient.get(`icd10:code:${code}`);
      icd10Results.push(data ? JSON.parse(data) : null);
    }
    return icd10Results.length;
  });
  
  console.log(`Individual CPT lookups: ${cptDuration.toFixed(2)}ms for ${TEST_CPT_CODES.length} codes`);
  console.log(`Individual ICD-10 lookups: ${icd10Duration.toFixed(2)}ms for ${TEST_ICD10_CODES.length} codes`);
  
  return { 
    cptResults, 
    icd10Results, 
    cptDuration, 
    icd10Duration 
  };
}

/**
 * Test bulk lookups
 */
async function testBulkLookups() {
  console.log('\nTesting bulk lookups...');
  
  // Bulk CPT lookups
  const { result: bulkCptResults, duration: bulkCptDuration } = await measurePerformance(async () => {
    return bulkLookupCptCodes(TEST_CPT_CODES);
  });
  
  // Bulk ICD-10 lookups
  const { result: bulkIcd10Results, duration: bulkIcd10Duration } = await measurePerformance(async () => {
    return bulkLookupIcd10Codes(TEST_ICD10_CODES);
  });
  
  console.log(`Bulk CPT lookups: ${bulkCptDuration.toFixed(2)}ms for ${TEST_CPT_CODES.length} codes`);
  console.log(`Bulk ICD-10 lookups: ${bulkIcd10Duration.toFixed(2)}ms for ${TEST_ICD10_CODES.length} codes`);
  
  return { 
    bulkCptResults, 
    bulkIcd10Results, 
    bulkCptDuration, 
    bulkIcd10Duration 
  };
}

/**
 * Compare results and performance
 */
function compareResults(individual, bulk) {
  console.log('\n=== Performance Comparison ===');
  
  // CPT comparison
  const cptImprovement = ((individual.cptDuration - bulk.bulkCptDuration) / individual.cptDuration) * 100;
  console.log(`CPT lookups: ${cptImprovement.toFixed(2)}% faster with bulk operation`);
  
  // ICD-10 comparison
  const icd10Improvement = ((individual.icd10Duration - bulk.bulkIcd10Duration) / individual.icd10Duration) * 100;
  console.log(`ICD-10 lookups: ${icd10Improvement.toFixed(2)}% faster with bulk operation`);
  
  // Verify results match
  let cptMatch = true;
  for (let i = 0; i < TEST_CPT_CODES.length; i++) {
    if (JSON.stringify(individual.cptResults[i]) !== JSON.stringify(bulk.bulkCptResults[i])) {
      cptMatch = false;
      console.error(`CPT result mismatch for code ${TEST_CPT_CODES[i]}`);
    }
  }
  
  let icd10Match = true;
  for (let i = 0; i < TEST_ICD10_CODES.length; i++) {
    if (JSON.stringify(individual.icd10Results[i]) !== JSON.stringify(bulk.bulkIcd10Results[i])) {
      icd10Match = false;
      console.error(`ICD-10 result mismatch for code ${TEST_ICD10_CODES[i]}`);
    }
  }
  
  console.log(`CPT results match: ${cptMatch ? '✅' : '❌'}`);
  console.log(`ICD-10 results match: ${icd10Match ? '✅' : '❌'}`);
  
  return {
    cptImprovement,
    icd10Improvement,
    cptMatch,
    icd10Match
  };
}

/**
 * Clean up test data
 */
async function cleanupTestData(redisClient) {
  console.log('\nCleaning up test data...');
  
  // Delete CPT codes
  for (const code of TEST_CPT_CODES) {
    await redisClient.del(`cpt:code:${code}`);
  }
  
  // Delete ICD-10 codes
  for (const code of TEST_ICD10_CODES) {
    await redisClient.del(`icd10:code:${code}`);
  }
  
  console.log('Cleanup complete');
}

/**
 * Run the test
 */
async function runTest() {
  console.log('=== Bulk Lookup Test ===');
  
  let redisClient;
  
  try {
    // Create Redis client with custom configuration
    redisClient = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      tls: redisTls,
      connectionName: 'bulk-lookup-test',
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
    
    // Test connection
    const pingResult = await redisClient.ping();
    console.log(`Redis PING result: ${pingResult}`);
    
    // Load Lua scripts
    await loadAndCacheScripts();
    console.log('Lua scripts loaded successfully');
    
    // Setup test data
    await setupTestData(redisClient);
    
    // Run individual lookups
    const individualResults = await testIndividualLookups(redisClient);
    
    // Run bulk lookups
    const bulkResults = await testBulkLookups();
    
    // Compare results
    const comparison = compareResults(individualResults, bulkResults);
    
    // Determine test outcome
    const testPassed = comparison.cptMatch && comparison.icd10Match && 
                      comparison.cptImprovement > 0 && comparison.icd10Improvement > 0;
    
    console.log('\n=== Test Result ===');
    console.log(testPassed ? '✅ TEST PASSED: Bulk lookup is working correctly and provides performance benefits' : 
                           '❌ TEST FAILED: Issues detected with bulk lookup');
    
    // Clean up
    await cleanupTestData(redisClient);
    
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    // Close Redis connection
    if (redisClient) {
      await redisClient.quit();
      console.log('Redis connection closed');
    }
  }
}

// Run the test
runTest().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});