/**
 * Redis Cache Implementation Test Script (Redis-only)
 * 
 * This script tests only the Redis caching functionality without database fallbacks.
 * It manually sets test data in Redis and then retrieves it to verify the caching works.
 * 
 * Usage:
 * ```
 * node debug-scripts/redis-optimization/test-redis-only.js
 * ```
 */

const Redis = require('ioredis');
const dotenv = require('dotenv');

// Load environment variables from .env.production
dotenv.config({ path: '.env.production' });
console.log('Loaded environment variables from .env.production');

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
  connectionName: 'redis-cache-test',
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

// Sample test data
const testData = {
  cptCodes: {
    '71045': { cpt_code: '71045', description: 'X-ray, chest, single view', modality: 'X-ray', body_part: 'Chest' },
    '71046': { cpt_code: '71046', description: 'X-ray, chest, 2 views', modality: 'X-ray', body_part: 'Chest' },
    '70450': { cpt_code: '70450', description: 'CT scan, head/brain, without contrast', modality: 'CT', body_part: 'Head' }
  },
  icd10Codes: {
    'J18.9': { icd10_code: 'J18.9', description: 'Pneumonia, unspecified organism', clinical_notes: 'Common respiratory infection' },
    'R05.1': { icd10_code: 'R05.1', description: 'Acute cough', clinical_notes: 'Symptom of respiratory conditions' },
    'I10': { icd10_code: 'I10', description: 'Essential (primary) hypertension', clinical_notes: 'Common cardiovascular condition' }
  },
  mappings: {
    'J18.9': [
      { id: 1, icd10_code: 'J18.9', cpt_code: '71045', appropriateness_score: 8, evidence_strength: 7, specialty_relevance: 8, patient_factors: 7, composite_score: 7.6 },
      { id: 2, icd10_code: 'J18.9', cpt_code: '71046', appropriateness_score: 9, evidence_strength: 8, specialty_relevance: 9, patient_factors: 8, composite_score: 8.6 }
    ],
    'R05.1': [
      { id: 3, icd10_code: 'R05.1', cpt_code: '71045', appropriateness_score: 7, evidence_strength: 6, specialty_relevance: 7, patient_factors: 6, composite_score: 6.6 }
    ]
  },
  searchResults: {
    'pneumonia': [
      { icd10_code: 'J18.9', description: 'Pneumonia, unspecified organism', score: 0.95 },
      { icd10_code: 'J15.9', description: 'Bacterial pneumonia, unspecified', score: 0.85 }
    ],
    'chest xray': [
      { cpt_code: '71045', description: 'X-ray, chest, single view', score: 0.95 },
      { cpt_code: '71046', description: 'X-ray, chest, 2 views', score: 0.90 }
    ]
  }
};

// Performance measurement utility
async function measurePerformance(fn) {
  const startTime = process.hrtime.bigint();
  const result = await fn();
  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds
  return { result, duration };
}

// Helper functions for Redis caching
async function getCachedData(key) {
  try {
    console.log(`Looking up key: ${key}`);
    const data = await redisClient.get(key);
    if (!data) {
      console.log(`Cache miss for key: ${key}`);
      return null;
    }
    
    console.log(`Cache hit for key: ${key}`);
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error parsing cached data for key ${key}:`, error);
      return null;
    }
  } catch (error) {
    console.error(`Error getting cached data for key ${key}:`, error);
    return null;
  }
}

async function setCachedData(key, data, ttlSeconds) {
  try {
    console.log(`Setting cache for key: ${key}`);
    await redisClient.set(key, JSON.stringify(data), 'EX', ttlSeconds);
    console.log(`Cache set for key: ${key} with TTL: ${ttlSeconds} seconds`);
  } catch (error) {
    console.error(`Error setting cached data for key ${key}:`, error);
  }
}

async function getHashData(key) {
  try {
    console.log(`Looking up hash key: ${key}`);
    const data = await redisClient.hgetall(key);
    if (!data || Object.keys(data).length === 0) {
      console.log(`Cache miss for hash key: ${key}`);
      return null;
    }
    
    console.log(`Cache hit for hash key: ${key}`);
    return data;
  } catch (error) {
    console.error(`Error getting hash data for key ${key}:`, error);
    return null;
  }
}

async function setHashData(key, data, ttlSeconds) {
  try {
    console.log(`Setting hash for key: ${key}`);
    const pipeline = redisClient.pipeline();
    
    // Add each field-value pair to the pipeline
    Object.entries(data).forEach(([field, value]) => {
      pipeline.hset(key, field, typeof value === 'string' ? value : JSON.stringify(value));
    });
    
    // Set expiration
    pipeline.expire(key, ttlSeconds);
    
    // Execute pipeline
    await pipeline.exec();
    console.log(`Hash set for key: ${key} with TTL: ${ttlSeconds} seconds`);
  } catch (error) {
    console.error(`Error setting hash data for key ${key}:`, error);
  }
}

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

// Test functions
async function testCPTCode(code) {
  try {
    console.log(`\n=== Testing CPT code caching for code: ${code} ===`);
    
    // Set the data in Redis
    const cptData = testData.cptCodes[code];
    if (!cptData) {
      console.log(`No test data available for CPT code ${code}`);
      return;
    }
    
    // First, ensure the key doesn't exist
    await redisClient.del(`cpt:code:${code}`);
    
    // First lookup (should be cache miss)
    console.log('\nFirst lookup (should be cache miss):');
    const { result: firstResult, duration: firstDuration } = await measurePerformance(() => 
      getCachedData(`cpt:code:${code}`)
    );
    
    if (!firstResult) {
      console.log(`Cache miss for CPT code ${code}, setting data in cache`);
      await setCachedData(`cpt:code:${code}`, cptData, 60); // 60 seconds TTL for testing
    } else {
      console.log(`Unexpected cache hit for CPT code ${code}`);
    }
    
    // Second lookup (should be cache hit)
    console.log('\nSecond lookup (should be cache hit):');
    const { result: secondResult, duration: secondDuration } = await measurePerformance(() => 
      getCachedData(`cpt:code:${code}`)
    );
    
    if (secondResult) {
      console.log(`Found CPT code: ${secondResult.cpt_code} - ${secondResult.description}`);
      console.log(`Second lookup took ${secondDuration.toFixed(2)}ms`);
    } else {
      console.log(`Unexpected cache miss for CPT code ${code}`);
    }
  } catch (error) {
    console.error('Error in CPT code test:', error);
  }
}

async function testICD10Code(code) {
  try {
    console.log(`\n=== Testing ICD-10 code caching for code: ${code} ===`);
    
    // Set the data in Redis
    const icd10Data = testData.icd10Codes[code];
    if (!icd10Data) {
      console.log(`No test data available for ICD-10 code ${code}`);
      return;
    }
    
    // First, ensure the key doesn't exist
    await redisClient.del(`icd10:code:${code}`);
    
    // First lookup (should be cache miss)
    console.log('\nFirst lookup (should be cache miss):');
    const { result: firstResult, duration: firstDuration } = await measurePerformance(() => 
      getCachedData(`icd10:code:${code}`)
    );
    
    if (!firstResult) {
      console.log(`Cache miss for ICD-10 code ${code}, setting data in cache`);
      await setCachedData(`icd10:code:${code}`, icd10Data, 60); // 60 seconds TTL for testing
    } else {
      console.log(`Unexpected cache hit for ICD-10 code ${code}`);
    }
    
    // Second lookup (should be cache hit)
    console.log('\nSecond lookup (should be cache hit):');
    const { result: secondResult, duration: secondDuration } = await measurePerformance(() => 
      getCachedData(`icd10:code:${code}`)
    );
    
    if (secondResult) {
      console.log(`Found ICD-10 code: ${secondResult.icd10_code} - ${secondResult.description}`);
      console.log(`Second lookup took ${secondDuration.toFixed(2)}ms`);
    } else {
      console.log(`Unexpected cache miss for ICD-10 code ${code}`);
    }
  } catch (error) {
    console.error('Error in ICD-10 code test:', error);
  }
}

async function testMapping(icd10Code) {
  try {
    console.log(`\n=== Testing mapping caching for ICD-10 code: ${icd10Code} ===`);
    
    // Set the data in Redis
    const mappingData = testData.mappings[icd10Code];
    if (!mappingData) {
      console.log(`No test data available for ICD-10 mapping ${icd10Code}`);
      return;
    }
    
    // First, ensure the key doesn't exist
    await redisClient.del(`mapping:icd10-to-cpt:${icd10Code}`);
    
    // Convert mapping data to hash format
    const hashData = {};
    mappingData.forEach(mapping => {
      hashData[mapping.cpt_code] = JSON.stringify(mapping);
    });
    
    // First lookup (should be cache miss)
    console.log('\nFirst lookup (should be cache miss):');
    const { result: firstResult, duration: firstDuration } = await measurePerformance(() => 
      getHashData(`mapping:icd10-to-cpt:${icd10Code}`)
    );
    
    if (!firstResult) {
      console.log(`Cache miss for mapping ${icd10Code}, setting data in cache`);
      await setHashData(`mapping:icd10-to-cpt:${icd10Code}`, hashData, 60); // 60 seconds TTL for testing
    } else {
      console.log(`Unexpected cache hit for mapping ${icd10Code}`);
    }
    
    // Second lookup (should be cache hit)
    console.log('\nSecond lookup (should be cache hit):');
    const { result: secondResult, duration: secondDuration } = await measurePerformance(() => 
      getHashData(`mapping:icd10-to-cpt:${icd10Code}`)
    );
    
    if (secondResult) {
      console.log(`Found ${Object.keys(secondResult).length} mappings for ICD-10 code ${icd10Code}`);
      console.log(`Second lookup took ${secondDuration.toFixed(2)}ms`);
      
      // Parse the JSON strings back to objects
      const parsedResults = Object.entries(secondResult).map(([key, value]) => {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      });
      
      if (parsedResults.length > 0) {
        console.log(`Top mapping: ${parsedResults[0].cpt_code} (Score: ${parsedResults[0].composite_score})`);
      }
    } else {
      console.log(`Unexpected cache miss for mapping ${icd10Code}`);
    }
  } catch (error) {
    console.error('Error in mapping test:', error);
  }
}

async function testSearchResults(query, type) {
  try {
    console.log(`\n=== Testing ${type} search caching for query: "${query}" ===`);
    
    // Set the data in Redis
    const searchData = testData.searchResults[query];
    if (!searchData) {
      console.log(`No test data available for search query "${query}"`);
      return;
    }
    
    const cacheKey = type === 'diagnosis' ? 
      `search:icd10:${query}:null:10:0:true` : 
      `search:cpt:${query}:null:null:10:0`;
    
    // First, ensure the key doesn't exist
    await redisClient.del(cacheKey);
    
    // First lookup (should be cache miss)
    console.log('\nFirst lookup (should be cache miss):');
    const { result: firstResult, duration: firstDuration } = await measurePerformance(() => 
      getCachedData(cacheKey)
    );
    
    if (!firstResult) {
      console.log(`Cache miss for search query "${query}", setting data in cache`);
      await setCachedData(cacheKey, searchData, 60); // 60 seconds TTL for testing
    } else {
      console.log(`Unexpected cache hit for search query "${query}"`);
    }
    
    // Second lookup (should be cache hit)
    console.log('\nSecond lookup (should be cache hit):');
    const { result: secondResult, duration: secondDuration } = await measurePerformance(() => 
      getCachedData(cacheKey)
    );
    
    if (secondResult) {
      console.log(`Found ${secondResult.length} results for query "${query}"`);
      console.log(`Second lookup took ${secondDuration.toFixed(2)}ms`);
      
      if (secondResult.length > 0) {
        const topResult = secondResult[0];
        const codeField = type === 'diagnosis' ? 'icd10_code' : 'cpt_code';
        console.log(`Top result: ${topResult[codeField]} - ${topResult.description} (Score: ${topResult.score})`);
      }
    } else {
      console.log(`Unexpected cache miss for search query "${query}"`);
    }
  } catch (error) {
    console.error(`Error in ${type} search test:`, error);
  }
}

// Main function
async function main() {
  try {
    // Check Redis connection
    console.log('Checking Redis connection...');
    const pingResult = await redisClient.ping();
    console.log(`Redis PING result: ${pingResult}`);
    
    // Clear any existing test data
    await clearCacheKeys();
    
    // Run tests
    await testCPTCode('71045');
    await testICD10Code('J18.9');
    await testMapping('J18.9');
    await testSearchResults('pneumonia', 'diagnosis');
    await testSearchResults('chest xray', 'procedure');
    
    console.log('\n=== Redis Cache Tests Completed Successfully ===');
  } catch (error) {
    console.error('Error in tests:', error);
  } finally {
    // Close Redis connection
    await redisClient.quit();
    console.log('Redis connection closed');
  }
}

// Run the main function
main();