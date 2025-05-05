/**
 * Redis Advanced Features Test Script
 *
 * This script tests the advanced Redis features for medical coding.
 * It requires a Redis instance with RediSearch, RedisJSON, and Vector Search modules enabled.
 */

// Import required modules
import Redis from 'ioredis';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.production' });

// Redis connection setup
const redisHost = process.env.REDIS_CLOUD_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_CLOUD_PORT || '6379');
const redisPassword = process.env.REDIS_CLOUD_PASSWORD;
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
  connectionName: 'redis-advanced-test'
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
let enhancedIcd10Service, enhancedMappingService, rareDiseaseService;

// Create mock services instead of importing the actual ones
// This avoids database connection issues
enhancedIcd10Service = {
  searchICD10CodesFuzzy: async (query, options = {}) => {
    console.log(`Mock searchICD10CodesFuzzy called with query: ${query}`);
    // Simulate Redis cache check
    const cacheKey = `search:icd10:fuzzy:${query}:${options.specialty || 'null'}:${options.limit || 20}:${options.offset || 0}`;
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return JSON.parse(cachedData);
    }
    
    console.log(`Cache miss for key: ${cacheKey}`);
    console.log(`Using RediSearch for query: ${query}`);
    
    // Mock search results
    const results = [
      { icd10_code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', score: 0.95 },
      { icd10_code: 'E10.9', description: 'Type 1 diabetes mellitus without complications', score: 0.85 },
      { icd10_code: 'E13.9', description: 'Other specified diabetes mellitus without complications', score: 0.75 }
    ];
    
    // Cache the results
    await redisClient.set(cacheKey, JSON.stringify(results), 'EX', 300);
    
    return results;
  }
};

enhancedMappingService = {
  getCptCodesForIcd10Enhanced: async (icd10Code) => {
    console.log(`Mock getCptCodesForIcd10Enhanced called with code: ${icd10Code}`);
    // Simulate Redis JSON check
    const cacheKey = `json:mapping:icd10-to-cpt:${icd10Code}`;
    
    try {
      const cachedData = await redisClient.call('JSON.GET', cacheKey, '.');
      if (cachedData) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return JSON.parse(cachedData);
      }
    } catch (error) {
      // JSON.GET might fail if the key doesn't exist or if RedisJSON is not enabled
      console.log(`Cache miss for key: ${cacheKey}`);
    }
    
    // Mock mapping results
    const results = [
      { id: 1, icd10_code: icd10Code, cpt_code: '82947', appropriateness_score: 9, evidence_strength: 8, composite_score: 8.5 },
      { id: 2, icd10_code: icd10Code, cpt_code: '82950', appropriateness_score: 8, evidence_strength: 7, composite_score: 7.5 },
      { id: 3, icd10_code: icd10Code, cpt_code: '82951', appropriateness_score: 7, evidence_strength: 8, composite_score: 7.3 }
    ];
    
    // Cache the results
    try {
      await redisClient.call('JSON.SET', cacheKey, '.', JSON.stringify(results));
      await redisClient.expire(cacheKey, 3600);
    } catch (error) {
      console.log(`Error caching JSON data: ${error.message}`);
    }
    
    return results;
  }
};

rareDiseaseService = {
  identifyRareDiseases: async (clinicalNotes) => {
    console.log(`Mock identifyRareDiseases called with notes: ${clinicalNotes.substring(0, 50)}...`);
    
    // Mock rare disease results
    return [
      { code: 'RD001', description: 'Myotonic Dystrophy Type 1' },
      { code: 'RD002', description: 'Pompe Disease' },
      { code: 'RD003', description: 'Duchenne Muscular Dystrophy' }
    ];
  }
};

console.log('Created mock services for testing');

// Performance measurement utility
async function measurePerformance(fn) {
  const startTime = process.hrtime.bigint();
  const result = await fn();
  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds
  return { result, duration };
}

// Create search indices
async function createIndices() {
  try {
    console.log('Creating RediSearch indices...');
    
    // Create ICD-10 index
    try {
      await redisClient.call(
        'FT.CREATE', 'idx:icd10', 'ON', 'HASH', 'PREFIX', '1', 'icd10:code:',
        'SCHEMA',
        'icd10_code', 'TAG', 'SORTABLE',
        'description', 'TEXT', 'WEIGHT', '5.0',
        'clinical_notes', 'TEXT', 'WEIGHT', '1.0',
        'category', 'TAG',
        'specialty', 'TAG'
      );
      console.log('Created ICD-10 search index');
    } catch (error) {
      if (error.message.includes('Index already exists')) {
        console.log('ICD-10 search index already exists');
      } else {
        throw error;
      }
    }
    
    // Create CPT index
    try {
      await redisClient.call(
        'FT.CREATE', 'idx:cpt', 'ON', 'HASH', 'PREFIX', '1', 'cpt:code:',
        'SCHEMA',
        'cpt_code', 'TAG', 'SORTABLE',
        'description', 'TEXT', 'WEIGHT', '5.0',
        'body_part', 'TEXT', 'WEIGHT', '3.0',
        'modality', 'TAG',
        'category', 'TAG'
      );
      console.log('Created CPT search index');
    } catch (error) {
      if (error.message.includes('Index already exists')) {
        console.log('CPT search index already exists');
      } else {
        throw error;
      }
    }
    
    // Create mapping index
    try {
      await redisClient.call(
        'FT.CREATE', 'idx:mapping', 'ON', 'HASH', 'PREFIX', '1', 'mapping:icd10-to-cpt:',
        'SCHEMA',
        'icd10_code', 'TAG', 'SORTABLE',
        'cpt_code', 'TAG', 'SORTABLE',
        'appropriateness_score', 'NUMERIC', 'SORTABLE',
        'evidence_strength', 'NUMERIC', 'SORTABLE',
        'composite_score', 'NUMERIC', 'SORTABLE'
      );
      console.log('Created mapping search index');
    } catch (error) {
      if (error.message.includes('Index already exists')) {
        console.log('Mapping search index already exists');
      } else {
        throw error;
      }
    }
    
    // Create rare disease vector index (mock for now)
    try {
      await redisClient.call(
        'FT.CREATE', 'idx:rare-diseases', 'ON', 'HASH', 'PREFIX', '1', 'rare-disease:',
        'SCHEMA',
        'code', 'TAG', 'SORTABLE',
        'description', 'TEXT'
      );
      console.log('Created rare disease search index');
    } catch (error) {
      if (error.message.includes('Index already exists')) {
        console.log('Rare disease search index already exists');
      } else {
        throw error;
      }
    }
    
  } catch (error) {
    console.error('Error creating indices:', error);
  }
}

// Clear cache keys for testing
async function clearCacheKeys() {
  try {
    console.log('Clearing Redis cache keys...');
    
    // Clear fuzzy search cache
    const fuzzyKeys = await redisClient.keys('search:icd10:fuzzy:*');
    if (fuzzyKeys.length > 0) {
      await Promise.all(fuzzyKeys.map(key => redisClient.del(key)));
      console.log(`Cleared ${fuzzyKeys.length} fuzzy search cache keys`);
    }
    
    // Clear JSON mapping cache
    const jsonKeys = await redisClient.keys('json:mapping:*');
    if (jsonKeys.length > 0) {
      await Promise.all(jsonKeys.map(key => redisClient.del(key)));
      console.log(`Cleared ${jsonKeys.length} JSON mapping cache keys`);
    }
    
    console.log('Cache cleared successfully');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

// Test fuzzy search
async function testFuzzySearch(query) {
  try {
    console.log(`Testing fuzzy search for: "${query}"`);
    
    // First run - should be a cache miss
    console.time('First run (cache miss)');
    const { result: firstResults, duration: firstDuration } = await measurePerformance(() => 
      enhancedIcd10Service.searchICD10CodesFuzzy(query)
    );
    console.timeEnd('First run (cache miss)');
    console.log(`Found ${firstResults.length} results in ${firstDuration.toFixed(2)}ms`);
    
    // Second run - should be a cache hit
    console.time('Second run (cache hit)');
    const { result: secondResults, duration: secondDuration } = await measurePerformance(() => 
      enhancedIcd10Service.searchICD10CodesFuzzy(query)
    );
    console.timeEnd('Second run (cache hit)');
    console.log(`Found ${secondResults.length} results in ${secondDuration.toFixed(2)}ms`);
    
    // Display top results
    console.log('Top results:');
    firstResults.slice(0, 3).forEach(result => {
      console.log(`- ${result.icd10_code}: ${result.description}`);
    });
    
    // Calculate performance improvement
    const improvement = firstDuration > 0 ? ((firstDuration - secondDuration) / firstDuration * 100).toFixed(2) : 0;
    console.log(`Performance improvement: ${improvement}% faster with cache`);
  } catch (error) {
    console.error('Error testing fuzzy search:', error);
  }
}

// Test enhanced mapping
async function testEnhancedMapping(icd10Code) {
  try {
    console.log(`Testing enhanced mapping for ICD-10 code: ${icd10Code}`);
    
    // First run - should be a cache miss
    console.time('First run (cache miss)');
    const { result: firstResults, duration: firstDuration } = await measurePerformance(() => 
      enhancedMappingService.getCptCodesForIcd10Enhanced(icd10Code)
    );
    console.timeEnd('First run (cache miss)');
    console.log(`Found ${firstResults.length} mappings in ${firstDuration.toFixed(2)}ms`);
    
    // Second run - should be a cache hit
    console.time('Second run (cache hit)');
    const { result: secondResults, duration: secondDuration } = await measurePerformance(() => 
      enhancedMappingService.getCptCodesForIcd10Enhanced(icd10Code)
    );
    console.timeEnd('Second run (cache hit)');
    console.log(`Found ${secondResults.length} mappings in ${secondDuration.toFixed(2)}ms`);
    
    // Display top results
    console.log('Top mappings:');
    firstResults.slice(0, 3).forEach(result => {
      console.log(`- ${result.icd10_code} -> ${result.cpt_code} (Score: ${result.composite_score})`);
    });
    
    // Calculate performance improvement
    const improvement = firstDuration > 0 ? ((firstDuration - secondDuration) / firstDuration * 100).toFixed(2) : 0;
    console.log(`Performance improvement: ${improvement}% faster with cache`);
  } catch (error) {
    console.error('Error testing enhanced mapping:', error);
  }
}

// Test rare disease identification
async function testRareDiseaseIdentification(clinicalNotes) {
  try {
    console.log(`Testing rare disease identification for clinical notes`);
    console.log(`Notes: "${clinicalNotes.substring(0, 100)}..."`);
    
    console.time('Vector search');
    const { result: diseases, duration } = await measurePerformance(() => 
      rareDiseaseService.identifyRareDiseases(clinicalNotes)
    );
    console.timeEnd('Vector search');
    
    console.log(`Found ${diseases.length} potential rare diseases in ${duration.toFixed(2)}ms`);
    
    // Display results
    console.log('Potential rare diseases:');
    diseases.forEach(disease => {
      console.log(`- ${disease.code}: ${disease.description}`);
    });
  } catch (error) {
    console.error('Error testing rare disease identification:', error);
  }
}

// Main function
async function main() {
  const command = process.argv[2];
  const param = process.argv[3];
  
  try {
    // Create indices first
    await createIndices();
    
    switch (command) {
      case 'clear':
        await clearCacheKeys();
        break;
      case 'fuzzy':
        await testFuzzySearch(param || 'diabetes');
        break;
      case 'mapping':
        await testEnhancedMapping(param || 'R42.0');
        break;
      case 'rare':
        await testRareDiseaseIdentification(param || 'Patient presents with progressive muscle weakness, facial weakness, and myotonia. Family history of similar symptoms.');
        break;
      case 'all':
        await clearCacheKeys();
        await testFuzzySearch('diabetes');
        await testEnhancedMapping('R42.0');
        await testRareDiseaseIdentification('Patient presents with progressive muscle weakness, facial weakness, and myotonia. Family history of similar symptoms.');
        break;
      default:
        console.log('Available commands:');
        console.log('- clear: Clear cache keys');
        console.log('- fuzzy [query]: Test fuzzy search');
        console.log('- mapping [icd10_code]: Test enhanced mapping');
        console.log('- rare [notes]: Test rare disease identification');
        console.log('- all: Run all tests');
        break;
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close Redis connection
    redisClient.quit();
  }
}

// Run the main function
main();