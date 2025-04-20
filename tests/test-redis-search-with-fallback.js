/* eslint-env node, es2022 */
/* eslint-disable no-console, no-undef */

/**
 * Enhanced test script for RedisSearch functionality with fallback testing
 *
 * This script tests both the RedisSearch functionality and the PostgreSQL fallback
 * for context generation by calling the validation endpoint with a sample dictation.
 *
 * It also verifies which path is being used by checking the logs.
 *
 * Usage:
 * ```
 * node tests/test-redis-search-with-fallback.js
 * ```
 */
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// We'll use dynamic imports for CommonJS modules
let redisIndexManager;
let memorydb;
let redis;

// Sample dictation for testing
const sampleDictation = `
Patient presents with right shoulder pain after a fall. 
The pain is worse with movement and there is limited range of motion.
Patient has a history of osteoarthritis.
Requesting MRI of the right shoulder to rule out rotator cuff tear.
`;

// Test token for authentication
// Read the token from the test-token.txt file
let testToken;
try {
  testToken = fs.readFileSync('test-token.txt', 'utf8').trim();
} catch (error) {
  console.error('Error reading test token:', error);
  testToken = process.env.TEST_TOKEN || 'test-token';
}

// Base URL for API
const baseUrl = process.env.API_URL || 'http://localhost:3000';

/**
 * Check logs for context path
 * @returns {Promise<string>} The context path used ('redis' or 'postgres')
 */
async function checkContextPathInLogs() {
  try {
    // Wait a moment for logs to be written
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Read the application log file
    const logFile = path.join(process.cwd(), 'logs', 'app.log');
    const logContent = fs.readFileSync(logFile, 'utf8');
    
    // Check for the context path markers
    const lines = logContent.split('\n').reverse(); // Start from the most recent logs
    
    for (let i = 0; i < 50 && i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('CONTEXT_PATH: Using RedisSearch as primary path')) {
        return 'redis';
      }
      if (line.includes('CONTEXT_PATH: Using PostgreSQL fallback')) {
        return 'postgres';
      }
    }
    
    return 'unknown';
  } catch (error) {
    console.error('Error checking logs:', error);
    return 'error';
  }
}

/**
 * Test the RedisSearch path
 */
async function testRedisSearchPath() {
  try {
    console.log('\n--- Testing RedisSearch Path ---');
    
    // Step 1: Create the RedisSearch indexes
    console.log('Creating RedisSearch indexes...');
    await redisIndexManager.createRedisSearchIndexes();
    
    // Step 2: Verify the indexes were created
    try {
      const cptIndexInfo = await redisIndexManager.getIndexInfo('cpt_index');
      console.log('CPT index info:', JSON.stringify(cptIndexInfo, null, 2));
      
      const icd10IndexInfo = await redisIndexManager.getIndexInfo('icd10_index');
      console.log('ICD-10 index info:', JSON.stringify(icd10IndexInfo, null, 2));
    } catch (error) {
      console.error('Error getting index info:', error);
    }
    
    // Step 3: Call the validation endpoint
    console.log('Calling validation endpoint...');
    const response = await axios.post(
      `${baseUrl}/api/orders/validate`,
      {
        text: sampleDictation,
        testMode: true
      },
      {
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Step 4: Check which path was used
    const contextPath = await checkContextPathInLogs();
    console.log(`Context path used: ${contextPath}`);
    
    if (contextPath === 'redis') {
      console.log('✅ SUCCESS: RedisSearch path was used as expected');
    } else {
      console.log('❌ FAILURE: RedisSearch path was not used');
    }
    
    // Step 5: Display the validation results
    console.log('Validation status:', response.data.validationStatus);
    console.log('Suggested ICD-10 codes:', response.data.suggestedICD10Codes);
    console.log('Suggested CPT codes:', response.data.suggestedCPTCodes);
    
    return contextPath === 'redis';
  } catch (error) {
    console.error('Error in RedisSearch path test:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

/**
 * Test the PostgreSQL fallback path
 */
async function testPostgreSQLFallbackPath() {
  try {
    console.log('\n--- Testing PostgreSQL Fallback Path ---');
    
    // Step 1: Temporarily break the Redis connection
    console.log('Temporarily breaking Redis connection...');
    
    // Save the original Redis configuration
    const originalRedisHost = process.env.REDIS_CLOUD_HOST;
    const originalRedisPort = process.env.REDIS_CLOUD_PORT;
    
    // Set invalid Redis configuration to force fallback
    process.env.REDIS_CLOUD_HOST = 'invalid-host';
    process.env.REDIS_CLOUD_PORT = '9999';
    
    // Close any existing Redis connections
    await redis.closeRedisConnection();
    
    // Step 2: Call the validation endpoint
    console.log('Calling validation endpoint with broken Redis connection...');
    const response = await axios.post(
      `${baseUrl}/api/orders/validate`,
      {
        text: sampleDictation,
        testMode: true
      },
      {
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Step 3: Check which path was used
    const contextPath = await checkContextPathInLogs();
    console.log(`Context path used: ${contextPath}`);
    
    if (contextPath === 'postgres') {
      console.log('✅ SUCCESS: PostgreSQL fallback path was used as expected');
    } else {
      console.log('❌ FAILURE: PostgreSQL fallback path was not used');
    }
    
    // Step 4: Display the validation results
    console.log('Validation status:', response.data.validationStatus);
    console.log('Suggested ICD-10 codes:', response.data.suggestedICD10Codes);
    console.log('Suggested CPT codes:', response.data.suggestedCPTCodes);
    
    // Step 5: Restore the original Redis configuration
    process.env.REDIS_CLOUD_HOST = originalRedisHost;
    process.env.REDIS_CLOUD_PORT = originalRedisPort;
    
    return contextPath === 'postgres';
  } catch (error) {
    console.error('Error in PostgreSQL fallback path test:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    // Restore Redis configuration even if there's an error
    process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;
    process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;
    
    return false;
  }
}

/**
 * Main test function
 */
async function runTests() {
  try {
    console.log('Starting enhanced RedisSearch test with fallback testing...');
    
    // Dynamically import the CommonJS modules
    const redisIndexManagerModule = await import('../dist/utils/redis/redis-index-manager.js');
    redisIndexManager = redisIndexManagerModule;
    
    const memorydbModule = await import('../dist/config/memorydb.js');
    memorydb = memorydbModule;
    
    const redisModule = await import('../dist/config/redis.js');
    redis = redisModule;
    
    // Save original Redis configuration
    process.env.REDIS_CLOUD_HOST_ORIGINAL = process.env.REDIS_CLOUD_HOST;
    process.env.REDIS_CLOUD_PORT_ORIGINAL = process.env.REDIS_CLOUD_PORT;
    
    // Test the RedisSearch path
    const redisSearchSuccess = await testRedisSearchPath();
    
    // Test the PostgreSQL fallback path
    const postgresqlFallbackSuccess = await testPostgreSQLFallbackPath();
    
    // Overall test result
    console.log('\n--- Test Results ---');
    console.log(`RedisSearch path test: ${redisSearchSuccess ? 'PASSED' : 'FAILED'}`);
    console.log(`PostgreSQL fallback path test: ${postgresqlFallbackSuccess ? 'PASSED' : 'FAILED'}`);
    console.log(`Overall test result: ${redisSearchSuccess && postgresqlFallbackSuccess ? 'PASSED' : 'FAILED'}`);
    
  } catch (error) {
    console.error('Error in test suite:', error);
  } finally {
    // Restore original Redis configuration
    process.env.REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST_ORIGINAL;
    process.env.REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT_ORIGINAL;
    
    // Close the Redis connection
    if (redis) {
      await redis.closeRedisConnection();
    }
    if (memorydb) {
      await memorydb.closeMemoryDbConnection();
    }
  }
}

// Run the tests
runTests();