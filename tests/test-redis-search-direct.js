/**
 * Direct test script for RedisSearch functionality
 * 
 * This script directly tests the RedisSearch functionality without going through the API.
 * It tests both the primary Redis path and the PostgreSQL fallback path.
 * 
 * Usage:
 * ```
 * node tests/test-redis-search-direct.js
 * ```
 */
import { generateDatabaseContextWithRedis } from '../dist/utils/database/redis-context-generator.js';
import { getRedisClient, closeRedisConnection } from '../dist/config/redis.js';
import * as fs from 'fs';
import * as path from 'path';

// Sample keywords for testing
const sampleKeywords = [
  'shoulder',
  'pain',
  'MRI',
  'rotator cuff',
  'tear',
  'osteoarthritis'
];

/**
 * Test the RedisSearch path
 */
async function testRedisSearchPath() {
  try {
    console.log('\n--- Testing RedisSearch Path ---');
    
    // Generate database context using RedisSearch
    console.log('Generating database context with RedisSearch...');
    const context = await generateDatabaseContextWithRedis(sampleKeywords);
    
    // Check if the context was generated successfully
    if (context && context.length > 0) {
      console.log('✅ SUCCESS: Database context generated successfully using RedisSearch');
      console.log('Context length:', context.length);
      console.log('Context preview:', context.substring(0, 200) + '...');
      
      // Check if the context contains relevant information
      const containsRelevantInfo = 
        context.includes('CPT') || 
        context.includes('ICD') || 
        context.includes('shoulder') || 
        context.includes('MRI');
      
      if (containsRelevantInfo) {
        console.log('✅ SUCCESS: Context contains relevant information');
      } else {
        console.log('❌ FAILURE: Context does not contain relevant information');
      }
      
      // Write the context to a file for inspection
      const outputDir = path.join(process.cwd(), 'test-results');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const outputFile = path.join(outputDir, 'redis-search-context.txt');
      fs.writeFileSync(outputFile, context);
      console.log(`Context written to ${outputFile}`);
      
      return true;
    } else {
      console.log('❌ FAILURE: No context generated');
      return false;
    }
  } catch (error) {
    console.error('Error in RedisSearch path test:', error);
    return false;
  }
}

/**
 * Test the PostgreSQL fallback path
 */
async function testPostgreSQLFallbackPath() {
  try {
    console.log('\n--- Testing PostgreSQL Fallback Path ---');
    
    // Save the original Redis configuration
    const originalRedisHost = process.env.REDIS_CLOUD_HOST;
    const originalRedisPort = process.env.REDIS_CLOUD_PORT;
    
    // Set invalid Redis configuration to force fallback
    process.env.REDIS_CLOUD_HOST = 'invalid-host';
    process.env.REDIS_CLOUD_PORT = '9999';
    
    // Close any existing Redis connections
    await closeRedisConnection();
    
    // Generate database context using PostgreSQL fallback
    console.log('Generating database context with PostgreSQL fallback...');
    const context = await generateDatabaseContextWithRedis(sampleKeywords);
    
    // Check if the context was generated successfully
    if (context && context.length > 0) {
      console.log('✅ SUCCESS: Database context generated successfully using PostgreSQL fallback');
      console.log('Context length:', context.length);
      console.log('Context preview:', context.substring(0, 200) + '...');
      
      // Check if the context contains relevant information
      const containsRelevantInfo = 
        context.includes('CPT') || 
        context.includes('ICD') || 
        context.includes('shoulder') || 
        context.includes('MRI');
      
      if (containsRelevantInfo) {
        console.log('✅ SUCCESS: Context contains relevant information');
      } else {
        console.log('❌ FAILURE: Context does not contain relevant information');
      }
      
      // Write the context to a file for inspection
      const outputDir = path.join(process.cwd(), 'test-results');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const outputFile = path.join(outputDir, 'postgres-fallback-context.txt');
      fs.writeFileSync(outputFile, context);
      console.log(`Context written to ${outputFile}`);
      
      // Restore the original Redis configuration
      process.env.REDIS_CLOUD_HOST = originalRedisHost;
      process.env.REDIS_CLOUD_PORT = originalRedisPort;
      
      return true;
    } else {
      console.log('❌ FAILURE: No context generated');
      
      // Restore the original Redis configuration
      process.env.REDIS_CLOUD_HOST = originalRedisHost;
      process.env.REDIS_CLOUD_PORT = originalRedisPort;
      
      return false;
    }
  } catch (error) {
    console.error('Error in PostgreSQL fallback path test:', error);
    
    // Restore the original Redis configuration
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
    console.log('Starting direct RedisSearch test...');
    
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
    await closeRedisConnection();
  }
}

// Run the tests
runTests();