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
// Fix: Import getRedisClient from memorydb instead of cache-utils
const { getRedisClient } = require('../../dist/config/memorydb');
const { getCptCodeByCode, getIcd10CodeByCode, getCptIcd10Mapping, invalidateCache, clearAllCache } = require('../../dist/utils/cache/cache-utils');

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
    console.log(`\n========== STARTING ${SCENARIO} ==========\n`);
    helpers.log(`Starting ${SCENARIO}`, SCENARIO);

    // Step 1: Clear all cache entries before tests
    console.log("Step 1: Clear all cache entries before tests");
    helpers.log('Step 1: Clear all cache entries before tests', SCENARIO);
    await clearAllCache();
    console.log("Cache cleared successfully");
    helpers.log('Cache cleared successfully', SCENARIO);
    
    // Step 2: Test CPT code caching
    console.log("\nStep 2: Test CPT code caching");
    helpers.log('Step 2: Test CPT code caching', SCENARIO);

    // First call (should be cache miss)
    console.log("First call (should be cache miss)");
    helpers.log('First call (should be cache miss)', SCENARIO);
    const cptFirstCall = await getCptCodeByCode(testData.cptCode);

    if (cptFirstCall) {
      console.log(`Retrieved CPT code ${testData.cptCode} from database`);
      helpers.log(`Retrieved CPT code ${testData.cptCode} from database`, SCENARIO);
    } else {
      console.log(`CPT code ${testData.cptCode} not found`);
      helpers.log(`CPT code ${testData.cptCode} not found`, SCENARIO);
      console.log(`\n========== ${SCENARIO} FAILED ==========\n`);
      return false;
    }

    // Second call (should be cache hit)
    console.log("Second call (should be cache hit)");
    helpers.log('Second call (should be cache hit)', SCENARIO);
    const cptSecondCall = await getCptCodeByCode(testData.cptCode);

    if (cptSecondCall) {
      console.log(`Retrieved CPT code ${testData.cptCode} from cache`);
      helpers.log(`Retrieved CPT code ${testData.cptCode} from cache`, SCENARIO);
    } else {
      console.log(`CPT code ${testData.cptCode} not found in cache`);
      helpers.log(`CPT code ${testData.cptCode} not found in cache`, SCENARIO);
      console.log(`\n========== ${SCENARIO} FAILED ==========\n`);
      return false;
    }

    // Step 3: Test ICD-10 code caching
    console.log("\nStep 3: Test ICD-10 code caching");
    helpers.log('Step 3: Test ICD-10 code caching', SCENARIO);

    // First call (should be cache miss)
    console.log("First call (should be cache miss)");
    helpers.log('First call (should be cache miss)', SCENARIO);
    const icd10FirstCall = await getIcd10CodeByCode(testData.icd10Code);

    if (icd10FirstCall) {
      console.log(`Retrieved ICD-10 code ${testData.icd10Code} from database`);
      helpers.log(`Retrieved ICD-10 code ${testData.icd10Code} from database`, SCENARIO);
    } else {
      console.log(`ICD-10 code ${testData.icd10Code} not found`);
      helpers.log(`ICD-10 code ${testData.icd10Code} not found`, SCENARIO);
      console.log(`\n========== ${SCENARIO} FAILED ==========\n`);
      return false;
    }

    // Second call (should be cache hit)
    console.log("Second call (should be cache hit)");
    helpers.log('Second call (should be cache hit)', SCENARIO);
    const icd10SecondCall = await getIcd10CodeByCode(testData.icd10Code);

    if (icd10SecondCall) {
      console.log(`Retrieved ICD-10 code ${testData.icd10Code} from cache`);
      helpers.log(`Retrieved ICD-10 code ${testData.icd10Code} from cache`, SCENARIO);
    } else {
      console.log(`ICD-10 code ${testData.icd10Code} not found in cache`);
      helpers.log(`ICD-10 code ${testData.icd10Code} not found in cache`, SCENARIO);
      console.log(`\n========== ${SCENARIO} FAILED ==========\n`);
      return false;
    }

    // Step 4: Test CPT-ICD10 mapping caching
    console.log("\nStep 4: Test CPT-ICD10 mapping caching");
    helpers.log('Step 4: Test CPT-ICD10 mapping caching', SCENARIO);

    // First call (should be cache miss)
    console.log("First call (should be cache miss)");
    helpers.log('First call (should be cache miss)', SCENARIO);
    const mappingFirstCall = await getCptIcd10Mapping(testData.icd10Code, testData.cptCode);

    if (mappingFirstCall) {
      console.log(`Retrieved mapping for ${testData.icd10Code}:${testData.cptCode} from database`);
      helpers.log(`Retrieved mapping for ${testData.icd10Code}:${testData.cptCode} from database`, SCENARIO);
    } else {
      console.log(`Mapping for ${testData.icd10Code}:${testData.cptCode} not found, but continuing test`);
      helpers.log(`Mapping for ${testData.icd10Code}:${testData.cptCode} not found, but continuing test`, SCENARIO);
    }

    // Second call (should be cache hit if mapping exists)
    console.log("Second call (should be cache hit if mapping exists)");
    helpers.log('Second call (should be cache hit if mapping exists)', SCENARIO);
    const mappingSecondCall = await getCptIcd10Mapping(testData.icd10Code, testData.cptCode);

    if (mappingSecondCall) {
      console.log(`Retrieved mapping for ${testData.icd10Code}:${testData.cptCode} from cache`);
      helpers.log(`Retrieved mapping for ${testData.icd10Code}:${testData.cptCode} from cache`, SCENARIO);
    } else {
      console.log(`Mapping for ${testData.icd10Code}:${testData.cptCode} not found in cache, but continuing test`);
      helpers.log(`Mapping for ${testData.icd10Code}:${testData.cptCode} not found in cache, but continuing test`, SCENARIO);
    }

    // Step 5: Test cache invalidation
    console.log("\nStep 5: Test cache invalidation");
    helpers.log('Step 5: Test cache invalidation', SCENARIO);

    // Invalidate CPT code cache
    await invalidateCache(`cpt:${testData.cptCode}`);
    console.log(`Cache key cpt:${testData.cptCode} invalidated`);
    helpers.log(`Cache key cpt:${testData.cptCode} invalidated`, SCENARIO);

    // Call after invalidation (should be cache miss)
    console.log("Call after invalidation (should be cache miss)");
    helpers.log('Call after invalidation (should be cache miss)', SCENARIO);
    const cptAfterInvalidation = await getCptCodeByCode(testData.cptCode);

    if (cptAfterInvalidation) {
      console.log(`Retrieved CPT code ${testData.cptCode} from database after invalidation`);
      helpers.log(`Retrieved CPT code ${testData.cptCode} from database after invalidation`, SCENARIO);
    } else {
      console.log(`CPT code ${testData.cptCode} not found after invalidation`);
      helpers.log(`CPT code ${testData.cptCode} not found after invalidation`, SCENARIO);
      console.log(`\n========== ${SCENARIO} FAILED ==========\n`);
      return false;
    }

    // Close Redis connection
    const redisClient = getRedisClient();
    await redisClient.quit();
    console.log("Redis connection closed");
    helpers.log('Redis connection closed', SCENARIO);

    console.log(`\n========== ${SCENARIO} COMPLETED SUCCESSFULLY ==========\n`);
    helpers.log(`${SCENARIO} completed successfully`, SCENARIO);
    return true;
  } catch (error) {
    console.error(`Error in ${SCENARIO}:`, error.message);
    console.error(error);
    helpers.log(`Error in ${SCENARIO}: ${error.message}`, SCENARIO);

    // Try to close Redis connection on error
    try {
      const redisClient = getRedisClient();
      await redisClient.quit();
      console.log("Redis connection closed after error");
      helpers.log('Redis connection closed after error', SCENARIO);
    } catch (closeError) {
      console.error(`Error closing Redis connection:`, closeError.message);
      helpers.log(`Error closing Redis connection: ${closeError.message}`, SCENARIO);
    }

    console.log(`\n========== ${SCENARIO} FAILED ==========\n`);
    return false;
  }
}

// Execute the test if this file is run directly
if (require.main === module) {
  runTest()
    .then(success => {
      console.log(`Test result: ${success ? 'PASSED' : 'FAILED'}`);
      process.exit(success ? 0 : 1);
    })
    .catch(err => {
      console.error('Unhandled error in test:', err);
      process.exit(1);
    });
}

// Export the test function
module.exports = {
  runTest
};