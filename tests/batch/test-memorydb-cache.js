/**
 * Test script for MemoryDB caching functionality
 * 
 * This script tests the basic functionality of the MemoryDB caching layer,
 * including connection, caching operations, and cache invalidation.
 */

const { testMemoryDbConnection, getRedisClient, closeMemoryDbConnection } = require('../../dist/config/memorydb');
const { 
  getActiveDefaultPromptTemplate,
  getCptCodeByCode,
  getIcd10CodeByCode,
  getCptIcd10Mapping,
  getIcd10MarkdownDoc,
  invalidateCache
} = require('../../dist/utils/cache/cache-utils');

// Import cache utilities
const {
  clearAllCache
} = require('../../dist/utils/cache/cache-utils');

// Test configuration
const TEST_NAME = 'MemoryDB Cache Test';

// Sample test data
const TEST_CPT_CODE = '70450';  // CT scan of head/brain without contrast
const TEST_ICD10_CODE = 'R51';  // Headache

/**
 * Run the MemoryDB cache tests
 */
async function runMemoryDbCacheTests() {
  let success = true;
  let testResults = [];
  
  console.log(`\n${TEST_NAME} started`);
  
  // Clear all cache entries before running tests
  console.log('\nClearing all cache entries before tests...');
  await clearAllCache();
  
  try {
    // Test 1: Test MemoryDB connection
    console.log('\nTest 1: Testing MemoryDB connection...');
    const connectionResult = await testMemoryDbConnection();
    
    if (connectionResult) {
      console.log('✓ MemoryDB connection successful');
      testResults.push('Test 1: MemoryDB connection - PASSED');
    } else {
      console.error('✗ MemoryDB connection failed');
      testResults.push('Test 1: MemoryDB connection - FAILED');
      success = false;
      // If connection fails, we can't continue with other tests
      return { success, testResults };
    }
    
    // Test 2: Test caching CPT code
    console.log('\nTest 2: Testing CPT code caching...');
    
    // First call should be a cache miss
    console.log('First call (should be cache miss):');
    const cptResult1 = await getCptCodeByCode(TEST_CPT_CODE);
    
    if (cptResult1 && cptResult1.cpt_code === TEST_CPT_CODE) {
      console.log(`✓ Retrieved CPT code ${TEST_CPT_CODE} from database`);
      
      // Second call should be a cache hit
      console.log('Second call (should be cache hit):');
      const cptResult2 = await getCptCodeByCode(TEST_CPT_CODE);
      
      if (cptResult2 && cptResult2.cpt_code === TEST_CPT_CODE) {
        console.log(`✓ Retrieved CPT code ${TEST_CPT_CODE} from cache`);
        testResults.push('Test 2: CPT code caching - PASSED');
      } else {
        console.error(`✗ Failed to retrieve CPT code ${TEST_CPT_CODE} from cache`);
        testResults.push('Test 2: CPT code caching - FAILED');
        success = false;
      }
    } else {
      console.error(`✗ Failed to retrieve CPT code ${TEST_CPT_CODE} from database`);
      testResults.push('Test 2: CPT code caching - FAILED (database retrieval failed)');
      success = false;
    }
    
    // Test 3: Test caching ICD-10 code
    console.log('\nTest 3: Testing ICD-10 code caching...');
    
    // First call should be a cache miss
    console.log('First call (should be cache miss):');
    const icd10Result1 = await getIcd10CodeByCode(TEST_ICD10_CODE);
    
    if (icd10Result1 && icd10Result1.icd10_code === TEST_ICD10_CODE) {
      console.log(`✓ Retrieved ICD-10 code ${TEST_ICD10_CODE} from database`);
      
      // Second call should be a cache hit
      console.log('Second call (should be cache hit):');
      const icd10Result2 = await getIcd10CodeByCode(TEST_ICD10_CODE);
      
      if (icd10Result2 && icd10Result2.icd10_code === TEST_ICD10_CODE) {
        console.log(`✓ Retrieved ICD-10 code ${TEST_ICD10_CODE} from cache`);
        testResults.push('Test 3: ICD-10 code caching - PASSED');
      } else {
        console.error(`✗ Failed to retrieve ICD-10 code ${TEST_ICD10_CODE} from cache`);
        testResults.push('Test 3: ICD-10 code caching - FAILED');
        success = false;
      }
    } else {
      console.error(`✗ Failed to retrieve ICD-10 code ${TEST_ICD10_CODE} from database`);
      testResults.push('Test 3: ICD-10 code caching - FAILED (database retrieval failed)');
      success = false;
    }
    
    // Test 4: Test cache invalidation
    console.log('\nTest 4: Testing cache invalidation...');
    
    // Invalidate the CPT code cache
    const cptCacheKey = `cpt:${TEST_CPT_CODE}`;
    await invalidateCache(cptCacheKey);
    
    // Next call should be a cache miss again
    console.log('Call after invalidation (should be cache miss):');
    const cptResult3 = await getCptCodeByCode(TEST_CPT_CODE);
    
    if (cptResult3 && cptResult3.cpt_code === TEST_CPT_CODE) {
      console.log(`✓ Retrieved CPT code ${TEST_CPT_CODE} from database after invalidation`);
      testResults.push('Test 4: Cache invalidation - PASSED');
    } else {
      console.error(`✗ Failed to retrieve CPT code ${TEST_CPT_CODE} from database after invalidation`);
      testResults.push('Test 4: Cache invalidation - FAILED');
      success = false;
    }
    
  } catch (error) {
    console.error('Error during MemoryDB cache tests:', error);
    testResults.push(`Error: ${error.message}`);
    success = false;
  } finally {
    // Close the MemoryDB connection
    await closeMemoryDbConnection();
    console.log('\nMemoryDB connection closed');
  }
  
  return { success, testResults };
}

/**
 * Main function
 */
async function main() {
  try {
    const { success, testResults } = await runMemoryDbCacheTests();
    
    // Log test results
    console.log(`\n${TEST_NAME}: ${success ? 'PASSED' : 'FAILED'}`);
    
    // Exit with appropriate code
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('Unhandled error in test script:', error);
    process.exit(1);
  }
}

// Run the tests
main();