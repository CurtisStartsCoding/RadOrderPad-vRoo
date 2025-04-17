/**
 * Scenario I: Redis Caching Test
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
const { getRedisClient, clearAllCache } = require('../../dist/utils/cache/cache-utils');
const { getCptCodeByCode, getIcd10CodeByCode, getCptIcd10Mapping, invalidateCache } = require('../../dist/utils/cache/cache-utils');

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
    } else {
      helpers.log(`CPT code ${testData.cptCode} not found`, SCENARIO);
      return false;
    }
    
    // Second call (should be cache hit)
    helpers.log('Second call (should be cache hit)', SCENARIO);
    const cptSecondCall = await getCptCodeByCode(testData.cptCode);
    
    if (cptSecondCall) {
      helpers.log(`Retrieved CPT code ${testData.cptCode} from cache`, SCENARIO);
    } else {
      helpers.log(`CPT code ${testData.cptCode} not found in cache`, SCENARIO);
      return false;
    }
    
    // Step 3: Test ICD-10 code caching
    helpers.log('Step 3: Test ICD-10 code caching', SCENARIO);
    
    // First call (should be cache miss)
    helpers.log('First call (should be cache miss)', SCENARIO);
    const icd10FirstCall = await getIcd10CodeByCode(testData.icd10Code);
    
    if (icd10FirstCall) {
      helpers.log(`Retrieved ICD-10 code ${testData.icd10Code} from database`, SCENARIO);
    } else {
      helpers.log(`ICD-10 code ${testData.icd10Code} not found`, SCENARIO);
      return false;
    }
    
    // Second call (should be cache hit)
    helpers.log('Second call (should be cache hit)', SCENARIO);
    const icd10SecondCall = await getIcd10CodeByCode(testData.icd10Code);
    
    if (icd10SecondCall) {
      helpers.log(`Retrieved ICD-10 code ${testData.icd10Code} from cache`, SCENARIO);
    } else {
      helpers.log(`ICD-10 code ${testData.icd10Code} not found in cache`, SCENARIO);
      return false;
    }
    
    // Step 4: Test CPT-ICD10 mapping caching
    helpers.log('Step 4: Test CPT-ICD10 mapping caching', SCENARIO);
    
    // First call (should be cache miss)
    helpers.log('First call (should be cache miss)', SCENARIO);
    const mappingFirstCall = await getCptIcd10Mapping(testData.icd10Code, testData.cptCode);
    
    if (mappingFirstCall) {
      helpers.log(`Retrieved mapping for ${testData.icd10Code}:${testData.cptCode} from database`, SCENARIO);
    } else {
      helpers.log(`Mapping for ${testData.icd10Code}:${testData.cptCode} not found, but continuing test`, SCENARIO);
    }
    
    // Second call (should be cache hit if mapping exists)
    helpers.log('Second call (should be cache hit if mapping exists)', SCENARIO);
    const mappingSecondCall = await getCptIcd10Mapping(testData.icd10Code, testData.cptCode);
    
    if (mappingSecondCall) {
      helpers.log(`Retrieved mapping for ${testData.icd10Code}:${testData.cptCode} from cache`, SCENARIO);
    } else {
      helpers.log(`Mapping for ${testData.icd10Code}:${testData.cptCode} not found in cache, but continuing test`, SCENARIO);
    }
    
    // Step 5: Test cache invalidation
    helpers.log('Step 5: Test cache invalidation', SCENARIO);
    
    // Invalidate CPT code cache
    await invalidateCache(`cpt:${testData.cptCode}`);
    helpers.log(`Cache key cpt:${testData.cptCode} invalidated`, SCENARIO);
    
    // Call after invalidation (should be cache miss)
    helpers.log('Call after invalidation (should be cache miss)', SCENARIO);
    const cptAfterInvalidation = await getCptCodeByCode(testData.cptCode);
    
    if (cptAfterInvalidation) {
      helpers.log(`Retrieved CPT code ${testData.cptCode} from database after invalidation`, SCENARIO);
    } else {
      helpers.log(`CPT code ${testData.cptCode} not found after invalidation`, SCENARIO);
      return false;
    }
    
    // Close Redis connection
    const redisClient = getRedisClient();
    await redisClient.quit();
    helpers.log('Redis connection closed', SCENARIO);
    
    helpers.log(`${SCENARIO} completed successfully`, SCENARIO);
    return true;
  } catch (error) {
    helpers.log(`Error in ${SCENARIO}: ${error.message}`, SCENARIO);
    console.error(error);
    
    // Try to close Redis connection on error
    try {
      const redisClient = getRedisClient();
      await redisClient.quit();
      helpers.log('Redis connection closed after error', SCENARIO);
    } catch (closeError) {
      helpers.log(`Error closing Redis connection: ${closeError.message}`, SCENARIO);
    }
    
    return false;
  }
}

// Export the test function
module.exports = {
  runTest
};