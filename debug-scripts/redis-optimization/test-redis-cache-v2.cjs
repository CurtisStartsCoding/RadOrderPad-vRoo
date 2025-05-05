/**
 * Redis Cache Implementation v2 Test Script
 * 
 * This script tests the Redis caching implementation for medical codes and search results.
 * It requires a Redis instance running locally or accessible via environment variables.
 * 
 * Usage:
 * ```
 * node debug-scripts/redis-optimization/test-redis-cache-v2.cjs [command] [param]
 * ```
 * 
 * Commands:
 * - clear: Clear all cache keys
 * - cpt [code]: Test CPT code lookup
 * - icd10 [code]: Test ICD-10 code lookup
 * - mapping [icd10_code]: Test mapping lookup
 * - search-diagnosis [query]: Test diagnosis search
 * - search-procedure [query]: Test procedure search
 * - pattern-invalidate [pattern]: Test pattern-based invalidation
 * - bulk-get: Test bulk data retrieval
 * - metrics: Show cache performance metrics
 */

// Import required modules
const Redis = require('ioredis');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.production
dotenv.config({ path: '.env.production' });
console.log('Loaded environment variables from .env.production');

// Get Redis configuration from environment variables
// Use Redis Cloud configuration from .env.production
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
  connectionName: 'redis-cache-v2-test',
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

// Import the services to test
// Note: These imports will work after the TypeScript files are compiled
let cptService, icd10Service, mappingService, diagnosisSearch, procedureSearch;
let cacheUtils;

try {
  // Try to import from compiled JavaScript files
  cptService = require('../../dist/services/medical-codes/cpt-service');
  icd10Service = require('../../dist/services/medical-codes/icd10-service');
  mappingService = require('../../dist/services/medical-codes/mapping-service');
  diagnosisSearch = require('../../dist/services/search/diagnosis-search');
  procedureSearch = require('../../dist/services/search/procedure-search');
  
  // Import cache utilities
  cacheUtils = require('../../dist/utils/cache');
  
  console.log('Successfully imported compiled services');
} catch (error) {
  console.error('Error importing compiled services:', error.message);
  console.log('Please make sure the TypeScript files are compiled before running this test');
  process.exit(1);
}

// Performance measurement utility
async function measurePerformance(fn) {
  const startTime = process.hrtime.bigint();
  const result = await fn();
  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds
  return { result, duration };
}

// Clear cache keys for testing
async function clearCacheKeys() {
  try {
    console.log('Clearing Redis cache keys...');
    
    // Clear CPT code cache
    const cptKeys = await redisClient.keys('cpt:code:*');
    if (cptKeys.length > 0) {
      await Promise.all(cptKeys.map(key => redisClient.del(key)));
      console.log(`Cleared ${cptKeys.length} CPT code cache keys`);
    }
    
    // Clear ICD-10 code cache
    const icd10Keys = await redisClient.keys('icd10:code:*');
    if (icd10Keys.length > 0) {
      await Promise.all(icd10Keys.map(key => redisClient.del(key)));
      console.log(`Cleared ${icd10Keys.length} ICD-10 code cache keys`);
    }
    
    // Clear mapping cache
    const mappingKeys = await redisClient.keys('mapping:icd10-to-cpt:*');
    if (mappingKeys.length > 0) {
      await Promise.all(mappingKeys.map(key => redisClient.del(key)));
      console.log(`Cleared ${mappingKeys.length} mapping cache keys`);
    }
    
    // Clear search cache
    const searchKeys = await redisClient.keys('search:*');
    if (searchKeys.length > 0) {
      await Promise.all(searchKeys.map(key => redisClient.del(key)));
      console.log(`Cleared ${searchKeys.length} search cache keys`);
    }
    
    console.log('Cache cleared successfully');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

// Test CPT code lookup
async function testCPTCode(code) {
  try {
    console.log(`Looking up CPT code: ${code}`);
    
    // First call (should be cache miss)
    console.log('First call (should be cache miss):');
    const { result: firstResult, duration: firstDuration } = await measurePerformance(() => 
      cptService.getCPTCode(code)
    );
    
    if (firstResult) {
      console.log(`Found CPT code: ${firstResult.cpt_code} - ${firstResult.description}`);
      console.log(`First lookup took ${firstDuration.toFixed(2)}ms`);
    } else {
      console.log(`CPT code ${code} not found`);
      return;
    }
    
    // Second call (should be cache hit)
    console.log('\nSecond call (should be cache hit):');
    const { result: secondResult, duration: secondDuration } = await measurePerformance(() => 
      cptService.getCPTCode(code)
    );
    
    if (secondResult) {
      console.log(`Found CPT code: ${secondResult.cpt_code} - ${secondResult.description}`);
      console.log(`Second lookup took ${secondDuration.toFixed(2)}ms`);
      
      // Calculate performance improvement
      const improvement = ((firstDuration - secondDuration) / firstDuration) * 100;
      console.log(`Performance improvement: ${improvement.toFixed(2)}%`);
    } else {
      console.log(`CPT code ${code} not found on second lookup (unexpected)`);
    }
  } catch (error) {
    console.error('Error in CPT code lookup:', error);
  }
}

// Test ICD-10 code lookup
async function testICD10Code(code) {
  try {
    console.log(`Looking up ICD-10 code: ${code}`);
    
    // First call (should be cache miss)
    console.log('First call (should be cache miss):');
    const { result: firstResult, duration: firstDuration } = await measurePerformance(() => 
      icd10Service.getICD10Code(code)
    );
    
    if (firstResult) {
      console.log(`Found ICD-10 code: ${firstResult.icd10_code} - ${firstResult.description}`);
      console.log(`First lookup took ${firstDuration.toFixed(2)}ms`);
    } else {
      console.log(`ICD-10 code ${code} not found`);
      return;
    }
    
    // Second call (should be cache hit)
    console.log('\nSecond call (should be cache hit):');
    const { result: secondResult, duration: secondDuration } = await measurePerformance(() => 
      icd10Service.getICD10Code(code)
    );
    
    if (secondResult) {
      console.log(`Found ICD-10 code: ${secondResult.icd10_code} - ${secondResult.description}`);
      console.log(`Second lookup took ${secondDuration.toFixed(2)}ms`);
      
      // Calculate performance improvement
      const improvement = ((firstDuration - secondDuration) / firstDuration) * 100;
      console.log(`Performance improvement: ${improvement.toFixed(2)}%`);
    } else {
      console.log(`ICD-10 code ${code} not found on second lookup (unexpected)`);
    }
  } catch (error) {
    console.error('Error in ICD-10 code lookup:', error);
  }
}

// Test mapping lookup
async function testMapping(icd10Code) {
  try {
    console.log(`Looking up mappings for ICD-10 code: ${icd10Code}`);
    
    // First call (should be cache miss)
    console.log('First call (should be cache miss):');
    const { result: firstResult, duration: firstDuration } = await measurePerformance(() => 
      mappingService.getCptCodesForIcd10(icd10Code)
    );
    
    if (firstResult && firstResult.length > 0) {
      console.log(`Found ${firstResult.length} mappings for ICD-10 code ${icd10Code}`);
      console.log(`Top mapping: ${firstResult[0].cpt_code} (Score: ${firstResult[0].composite_score})`);
      console.log(`First lookup took ${firstDuration.toFixed(2)}ms`);
    } else {
      console.log(`No mappings found for ICD-10 code ${icd10Code}`);
      return;
    }
    
    // Second call (should be cache hit)
    console.log('\nSecond call (should be cache hit):');
    const { result: secondResult, duration: secondDuration } = await measurePerformance(() => 
      mappingService.getCptCodesForIcd10(icd10Code)
    );
    
    if (secondResult && secondResult.length > 0) {
      console.log(`Found ${secondResult.length} mappings for ICD-10 code ${icd10Code}`);
      console.log(`Top mapping: ${secondResult[0].cpt_code} (Score: ${secondResult[0].composite_score})`);
      console.log(`Second lookup took ${secondDuration.toFixed(2)}ms`);
      
      // Calculate performance improvement
      const improvement = ((firstDuration - secondDuration) / firstDuration) * 100;
      console.log(`Performance improvement: ${improvement.toFixed(2)}%`);
    } else {
      console.log(`No mappings found for ICD-10 code ${icd10Code} on second lookup (unexpected)`);
    }
  } catch (error) {
    console.error('Error in mapping lookup:', error);
  }
}

// Test diagnosis search
async function testDiagnosisSearch(query) {
  try {
    console.log(`Searching for diagnosis codes with query: "${query}"`);
    
    // First call (should be cache miss)
    console.log('First call (should be cache miss):');
    const { result: firstResult, duration: firstDuration } = await measurePerformance(() => 
      diagnosisSearch.searchDiagnosisCodes(query, { limit: 10 })
    );
    
    if (firstResult && firstResult.length > 0) {
      console.log(`Found ${firstResult.length} diagnosis codes for query "${query}"`);
      console.log(`Top result: ${firstResult[0].icd10_code} - ${firstResult[0].description} (Score: ${firstResult[0].score})`);
      console.log(`First search took ${firstDuration.toFixed(2)}ms`);
    } else {
      console.log(`No diagnosis codes found for query "${query}"`);
      return;
    }
    
    // Second call (should be cache hit)
    console.log('\nSecond call (should be cache hit):');
    const { result: secondResult, duration: secondDuration } = await measurePerformance(() => 
      diagnosisSearch.searchDiagnosisCodes(query, { limit: 10 })
    );
    
    if (secondResult && secondResult.length > 0) {
      console.log(`Found ${secondResult.length} diagnosis codes for query "${query}"`);
      console.log(`Top result: ${secondResult[0].icd10_code} - ${secondResult[0].description} (Score: ${secondResult[0].score})`);
      console.log(`Second search took ${secondDuration.toFixed(2)}ms`);
      
      // Calculate performance improvement
      const improvement = ((firstDuration - secondDuration) / firstDuration) * 100;
      console.log(`Performance improvement: ${improvement.toFixed(2)}%`);
    } else {
      console.log(`No diagnosis codes found for query "${query}" on second search (unexpected)`);
    }
  } catch (error) {
    console.error('Error in diagnosis search:', error);
  }
}

// Test procedure search
async function testProcedureSearch(query) {
  try {
    console.log(`Searching for procedure codes with query: "${query}"`);
    
    // First call (should be cache miss)
    console.log('First call (should be cache miss):');
    const { result: firstResult, duration: firstDuration } = await measurePerformance(() =>
      procedureSearch.searchProcedureCodes(query, { limit: 10 })
    );
    
    if (firstResult && firstResult.length > 0) {
      console.log(`Found ${firstResult.length} procedure codes for query "${query}"`);
      console.log(`Top result: ${firstResult[0].cpt_code} - ${firstResult[0].description} (Score: ${firstResult[0].score})`);
      console.log(`First search took ${firstDuration.toFixed(2)}ms`);
    } else {
      console.log(`No procedure codes found for query "${query}"`);
      return;
    }
    
    // Second call (should be cache hit)
    console.log('\nSecond call (should be cache hit):');
    const { result: secondResult, duration: secondDuration } = await measurePerformance(() =>
      procedureSearch.searchProcedureCodes(query, { limit: 10 })
    );
    
    if (secondResult && secondResult.length > 0) {
      console.log(`Found ${secondResult.length} procedure codes for query "${query}"`);
      console.log(`Top result: ${secondResult[0].cpt_code} - ${secondResult[0].description} (Score: ${secondResult[0].score})`);
      console.log(`Second search took ${secondDuration.toFixed(2)}ms`);
      
      // Calculate performance improvement
      const improvement = ((firstDuration - secondDuration) / firstDuration) * 100;
      console.log(`Performance improvement: ${improvement.toFixed(2)}%`);
    } else {
      console.log(`No procedure codes found for query "${query}" on second search (unexpected)`);
    }
  } catch (error) {
    console.error('Error in procedure search:', error);
  }
}

// Test pattern-based invalidation
async function testPatternInvalidation(pattern) {
  try {
    console.log(`Testing pattern-based invalidation with pattern: "${pattern}"`);
    
    // First, set some test data with keys matching the pattern
    const testKeys = [
      `test:${pattern}:1`,
      `test:${pattern}:2`,
      `test:${pattern}:3`
    ];
    
    console.log(`Setting ${testKeys.length} test keys...`);
    for (const key of testKeys) {
      await redisClient.set(key, JSON.stringify({ testData: `Value for ${key}` }), 'EX', 300);
    }
    
    // Verify keys were set
    const keysExist = await Promise.all(testKeys.map(key => redisClient.exists(key)));
    const existingCount = keysExist.filter(Boolean).length;
    console.log(`Verified ${existingCount}/${testKeys.length} keys were set successfully`);
    
    // Now invalidate using pattern
    console.log(`\nInvalidating keys with pattern: "test:${pattern}:*"`);
    const { result: invalidatedCount, duration } = await measurePerformance(() =>
      cacheUtils.invalidateCachePattern(`test:${pattern}:*`)
    );
    
    console.log(`Invalidated ${invalidatedCount} keys in ${duration.toFixed(2)}ms`);
    
    // Verify keys were invalidated
    const keysExistAfter = await Promise.all(testKeys.map(key => redisClient.exists(key)));
    const existingCountAfter = keysExistAfter.filter(Boolean).length;
    console.log(`Verified ${existingCountAfter}/${testKeys.length} keys remain after invalidation`);
    
    if (existingCountAfter === 0) {
      console.log('Pattern invalidation successful!');
    } else {
      console.log('Pattern invalidation partially successful or failed');
    }
  } catch (error) {
    console.error('Error in pattern invalidation test:', error);
  }
}

// Test bulk data retrieval
async function testBulkGet() {
  try {
    console.log('Testing bulk data retrieval...');
    
    // First, set some test data
    const testData = {
      'bulk:test:1': { id: 1, name: 'Test 1', value: 100 },
      'bulk:test:2': { id: 2, name: 'Test 2', value: 200 },
      'bulk:test:3': { id: 3, name: 'Test 3', value: 300 },
      'bulk:test:4': { id: 4, name: 'Test 4', value: 400 },
      'bulk:test:5': { id: 5, name: 'Test 5', value: 500 }
    };
    
    const testKeys = Object.keys(testData);
    
    // Clear any existing test data
    await Promise.all(testKeys.map(key => redisClient.del(key)));
    
    // Set test data
    console.log(`Setting ${testKeys.length} test keys...`);
    await Promise.all(
      testKeys.map(key => redisClient.set(key, JSON.stringify(testData[key]), 'EX', 300))
    );
    
    // Test individual gets (sequential)
    console.log('\nTesting individual gets (sequential):');
    const startTimeIndividual = process.hrtime.bigint();
    const individualResults = [];
    
    for (const key of testKeys) {
      const data = await redisClient.get(key);
      if (data) {
        individualResults.push(JSON.parse(data));
      } else {
        individualResults.push(null);
      }
    }
    
    const endTimeIndividual = process.hrtime.bigint();
    const durationIndividual = Number(endTimeIndividual - startTimeIndividual) / 1_000_000;
    
    console.log(`Retrieved ${individualResults.filter(Boolean).length}/${testKeys.length} items individually`);
    console.log(`Individual retrieval took ${durationIndividual.toFixed(2)}ms`);
    
    // Test bulk get
    console.log('\nTesting bulk get:');
    const { result: bulkResults, duration: durationBulk } = await measurePerformance(() =>
      cacheUtils.bulkGetCachedData(testKeys)
    );
    
    console.log(`Retrieved ${bulkResults.filter(Boolean).length}/${testKeys.length} items in bulk`);
    console.log(`Bulk retrieval took ${durationBulk.toFixed(2)}ms`);
    
    // Calculate performance improvement
    const improvement = ((durationIndividual - durationBulk) / durationIndividual) * 100;
    console.log(`Performance improvement: ${improvement.toFixed(2)}%`);
    
    // Clean up test data
    await Promise.all(testKeys.map(key => redisClient.del(key)));
  } catch (error) {
    console.error('Error in bulk get test:', error);
  }
}

// Show cache metrics
async function showCacheMetrics() {
  try {
    console.log('Retrieving cache performance metrics...');
    
    const metrics = cacheUtils.getCacheMetrics();
    
    console.log('\n=== Cache Performance Metrics ===');
    console.log(`Hits: ${metrics.hits}`);
    console.log(`Misses: ${metrics.misses}`);
    console.log(`Hit Rate: ${metrics.hitRate}`);
    console.log(`Errors: ${metrics.errors}`);
    console.log(`Average Latency: ${metrics.avgLatencyMs}ms`);
    console.log(`Operations Tracked: ${metrics.operationsTracked}`);
    console.log('================================');
  } catch (error) {
    console.error('Error retrieving cache metrics:', error);
  }
}

// Main function
async function main() {
  const command = process.argv[2];
  const param = process.argv[3];
  
  try {
    // Check Redis connection
    console.log('Checking Redis connection...');
    const pingResult = await redisClient.ping();
    console.log(`Redis PING result: ${pingResult}`);
    
    switch (command) {
      case 'clear':
        await clearCacheKeys();
        break;
      
      case 'cpt':
        await testCPTCode(param);
        break;
      
      case 'icd10':
        await testICD10Code(param);
        break;
      
      case 'mapping':
        await testMapping(param);
        break;
      
      case 'search-diagnosis':
        await testDiagnosisSearch(param);
        break;
      
      case 'search-procedure':
        await testProcedureSearch(param);
        break;
      
      case 'pattern-invalidate':
        await testPatternInvalidation(param || 'test');
        break;
      
      case 'bulk-get':
        await testBulkGet();
        break;
      
      case 'metrics':
        await showCacheMetrics();
        break;
      
      default:
        console.log('Usage:');
        console.log('  node test-redis-cache-v2.cjs clear');
        console.log('  node test-redis-cache-v2.cjs cpt <code>');
        console.log('  node test-redis-cache-v2.cjs icd10 <code>');
        console.log('  node test-redis-cache-v2.cjs mapping <icd10_code>');
        console.log('  node test-redis-cache-v2.cjs search-diagnosis "<query>"');
        console.log('  node test-redis-cache-v2.cjs search-procedure "<query>"');
        console.log('  node test-redis-cache-v2.cjs pattern-invalidate <pattern>');
        console.log('  node test-redis-cache-v2.cjs bulk-get');
        console.log('  node test-redis-cache-v2.cjs metrics');
        break;
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close Redis connection
    await redisClient.quit();
    console.log('Redis connection closed');
    process.exit(0);
  }
}

// Run the main function
main();