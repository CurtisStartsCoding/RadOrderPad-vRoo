/**
 * Redis Cache Implementation v2 Test Script
 *
 * This script tests the Redis caching implementation for medical codes and search results.
 * It requires a Redis instance running locally or accessible via environment variables.
 *
 * Usage:
 * ```
 * node debug-scripts/redis-optimization/test-redis-cache-v2.js [command] [param]
 * ```
 *
 * Note: This script uses ES module syntax since package.json has "type": "module".
 * 
 * Commands:
 * - clear: Clear all cache keys
 * - cpt [code]: Test CPT code lookup
 * - icd10 [code]: Test ICD-10 code lookup
 * - mapping [icd10_code]: Test mapping lookup
 * - search-diagnosis [query]: Test diagnosis search
 * - search-procedure [query]: Test procedure search
 */

// Import required modules
import Redis from 'ioredis';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory (ES module equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  connectionName: 'redis-cache-v2-test'
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

try {
  // Try to import from compiled JavaScript files using dynamic imports
  const cptServiceModule = await import('../../dist/services/medical-codes/cpt-service.js');
  const icd10ServiceModule = await import('../../dist/services/medical-codes/icd10-service.js');
  const mappingServiceModule = await import('../../dist/services/medical-codes/mapping-service.js');
  const diagnosisSearchModule = await import('../../dist/services/search/diagnosis-search.js');
  const procedureSearchModule = await import('../../dist/services/search/procedure-search.js');
  
  cptService = cptServiceModule;
  icd10Service = icd10ServiceModule;
  mappingService = mappingServiceModule;
  diagnosisSearch = diagnosisSearchModule;
  procedureSearch = procedureSearchModule;
  
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

// Main function
const main = async () => {
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
      
      default:
        console.log('Usage:');
        console.log('  node test-redis-cache-v2.js clear');
        console.log('  node test-redis-cache-v2.js cpt <code>');
        console.log('  node test-redis-cache-v2.js icd10 <code>');
        console.log('  node test-redis-cache-v2.js mapping <icd10_code>');
        console.log('  node test-redis-cache-v2.js search-diagnosis "<query>"');
        console.log('  node test-redis-cache-v2.js search-procedure "<query>"');
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
};

// Run the main function
main();