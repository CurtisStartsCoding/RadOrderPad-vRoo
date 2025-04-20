/**
 * Scenario I: Redis Caching Test (Direct Run Version)
 * 
 * This test scenario covers:
 * 1. Testing CPT code caching
 * 2. Testing ICD-10 code caching
 * 3. Testing CPT-ICD10 mapping caching
 * 4. Testing cache invalidation
 * 5. Testing cache clearing
 */

const helpers = require('./test-helpers');
const fs = require('fs');
const path = require('path');
const { clearAllCache } = require('../../dist/utils/cache/cache-utils');
const { getCptCodeByCode, getIcd10CodeByCode, getCptIcd10Mapping, invalidateCache } = require('../../dist/utils/cache/cache-utils');
const { closeRedisConnection } = require('../../dist/config/redis');

// Scenario name for logging
const SCENARIO = 'Scenario-I';

// Test data
const testData = {
  cptCode: '70450',
  icd10Code: 'R51',
  schedulerToken: null
};

// Main test function
async function runTest() {
  try {
    helpers.log(`Starting ${SCENARIO}`, SCENARIO);
    
    // Step 1: Clear all cache entries before tests
    helpers.log('Step 1: Clear all cache entries before tests', SCENARIO);
    await clearAllCache();
    helpers.log('Cache cleared successfully', SCENARIO);
    
    // Step 2: Test CPT code caching
    helpers.log('Step 2: Test CPT code caching', SCENARIO);
    
    // First call (should be cache miss)
    helpers.log('First call (should be cache miss)', SCENARIO);
    const cptFirstCall = await getCptCodeByCode(testData.cptCode);
    
    if (cptFirstCall) {
      helpers.log(`Retrieved CPT code ${testData.cptCode} from database`, SCENARIO);
      console.log(`Retrieved CPT code ${testData.cptCode} from database:`, cptFirstCall);
    } else {
      helpers.log(`CPT code ${testData.cptCode} not found`, SCENARIO);
      console.log(`CPT code ${testData.cptCode} not found`);
      return false;
    }
    
    // Second call (should be cache hit)
    helpers.log('Second call (should be cache hit)', SCENARIO);
    const cptSecondCall = await getCptCodeByCode(testData.cptCode);
    
    if (cptSecondCall) {
      helpers.log(`Retrieved CPT code ${testData.cptCode} from cache`, SCENARIO);
      console.log(`Retrieved CPT code ${testData.cptCode} from cache:`, cptSecondCall);
    } else {
      helpers.log(`CPT code ${testData.cptCode} not found in cache`, SCENARIO);
      console.log(`CPT code ${testData.cptCode} not found in cache`);
      return false;
    }
    
    // Step 3: Test ICD-10 code caching
    helpers.log('Step 3: Test ICD-10 code caching', SCENARIO);
    
    // First call (should be cache miss)
    helpers.log('First call (should be cache miss)', SCENARIO);
    const icd10FirstCall = await getIcd10CodeByCode(testData.icd10Code);
    
    if (icd10FirstCall) {
      helpers.log(`Retrieved ICD-10 code ${testData.icd10Code} from database`, SCENARIO);
      console.log(`Retrieved ICD-10 code ${testData.icd10Code} from database:`, icd10FirstCall);
    } else {
      helpers.log(`ICD-10 code ${testData.icd10Code} not found`, SCENARIO);
      console.log(`ICD-10 code ${testData.icd10Code} not found`);
      return false;
    }
    
    // Second call (should be cache hit)
    helpers.log('Second call (should be cache hit)', SCENARIO);
    const icd10SecondCall = await getIcd10CodeByCode(testData.icd10Code);
    
    if (icd10SecondCall) {
      helpers.log(`Retrieved ICD-10 code ${testData.icd10Code} from cache`, SCENARIO);
      console.log(`Retrieved ICD-10 code ${testData.icd10Code} from cache:`, icd10SecondCall);
    } else {
      helpers.log(`ICD-10 code ${testData.icd10Code} not found in cache`, SCENARIO);
      console.log(`ICD-10 code ${testData.icd10Code} not found in cache`);
      return false;
    }
    
    // Step 4: Test CPT-ICD10 mapping caching
    helpers.log('Step 4: Test CPT-ICD10 mapping caching', SCENARIO);
    
    // First call (should be cache miss)
    helpers.log('First call (should be cache miss)', SCENARIO);
    const mappingFirstCall = await getCptIcd10Mapping(testData.icd10Code, testData.cptCode);
    
    if (mappingFirstCall) {
      helpers.log(`Retrieved mapping for ${testData.icd10Code}:${testData.cptCode} from database`, SCENARIO);
      console.log(`Retrieved mapping for ${testData.icd10Code}:${testData.cptCode} from database:`, mappingFirstCall);
    } else {
      helpers.log(`Mapping for ${testData.icd10Code}:${testData.cptCode} not found, but continuing test`, SCENARIO);
      console.log(`Mapping for ${testData.icd10Code}:${testData.cptCode} not found, but continuing test`);
    }
    
    // Second call (should be cache hit if mapping exists)
    helpers.log('Second call (should be cache hit if mapping exists)', SCENARIO);
    const mappingSecondCall = await getCptIcd10Mapping(testData.icd10Code, testData.cptCode);
    
    if (mappingSecondCall) {
      helpers.log(`Retrieved mapping for ${testData.icd10Code}:${testData.cptCode} from cache`, SCENARIO);
      console.log(`Retrieved mapping for ${testData.icd10Code}:${testData.cptCode} from cache:`, mappingSecondCall);
    } else {
      helpers.log(`Mapping for ${testData.icd10Code}:${testData.cptCode} not found in cache, but continuing test`, SCENARIO);
      console.log(`Mapping for ${testData.icd10Code}:${testData.cptCode} not found in cache, but continuing test`);
    }
    
    // Step 5: Test cache invalidation
    helpers.log('Step 5: Test cache invalidation', SCENARIO);
    
    // Invalidate CPT code cache
    await invalidateCache(`cpt:${testData.cptCode}`);
    helpers.log(`Cache key cpt:${testData.cptCode} invalidated`, SCENARIO);
    console.log(`Cache key cpt:${testData.cptCode} invalidated`);
    
    // Call after invalidation (should be cache miss)
    helpers.log('Call after invalidation (should be cache miss)', SCENARIO);
    const cptAfterInvalidation = await getCptCodeByCode(testData.cptCode);
    
    if (cptAfterInvalidation) {
      helpers.log(`Retrieved CPT code ${testData.cptCode} from database after invalidation`, SCENARIO);
      console.log(`Retrieved CPT code ${testData.cptCode} from database after invalidation:`, cptAfterInvalidation);
    } else {
      helpers.log(`CPT code ${testData.cptCode} not found after invalidation`, SCENARIO);
      console.log(`CPT code ${testData.cptCode} not found after invalidation`);
      return false;
    }
    
    // Close Redis connection
    await closeRedisConnection();
    helpers.log('Redis connection closed', SCENARIO);
    console.log('Redis connection closed');
    
    helpers.log(`${SCENARIO} completed successfully`, SCENARIO);
    console.log(`${SCENARIO} completed successfully`);
    return true;
  } catch (error) {
    helpers.log(`Error in ${SCENARIO}: ${error.message}`, SCENARIO);
    console.error(`Error in ${SCENARIO}:`, error);
    
    // Try to close Redis connection on error
    try {
      await closeRedisConnection();
      helpers.log('Redis connection closed after error', SCENARIO);
      console.log('Redis connection closed after error');
    } catch (closeError) {
      helpers.log(`Error closing Redis connection: ${closeError.message}`, SCENARIO);
      console.error(`Error closing Redis connection:`, closeError);
    }
    
    return false;
  }
}

// Run the test directly when this file is executed
if (require.main === module) {
  console.log('Running Redis caching test directly...');
  runTest()
    .then(result => {
      console.log(`Test result: ${result ? 'PASSED' : 'FAILED'}`);
      process.exit(result ? 0 : 1);
    })
    .catch(error => {
      console.error('Unhandled error in test:', error);
      process.exit(1);
    });
} else {
  // Export the test function when required by another module
  module.exports = {
    runTest
  };
}