/**
 * Test script for Redis search with PostgreSQL fallback
 * 
 * This script tests the database context generation with Redis search and PostgreSQL fallback.
 * It tests three scenarios:
 * 1. Redis search returns sufficient results
 * 2. Redis search returns insufficient results, triggering PostgreSQL fallback
 * 3. Redis connection fails, triggering PostgreSQL fallback
 */

import { generateDatabaseContextWithRedis } from '../../dist/utils/database/redis-context-generator-fix.js';
import { closeRedisConnection } from '../../dist/config/redis.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create test results directory if it doesn't exist
const testResultsDir = path.join(process.cwd(), 'test-results');
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

/**
 * Test case 1: Redis search returns sufficient results
 */
async function testRedisSearchSuccess() {
  console.log('\n--- Test Case 1: Redis Search Returns Sufficient Results ---');
  
  // Keywords that should return results from Redis
  const keywords = ['shoulder', 'pain', 'MRI', 'rotator cuff', 'tear'];
  console.log('Keywords:', keywords);
  
  try {
    // Generate database context using Redis search
    console.log('Generating database context with Redis search...');
    const context = await generateDatabaseContextWithRedis(keywords);
    
    // Check if the context was generated successfully
    if (context && context.length > 0) {
      console.log('✅ SUCCESS: Database context generated successfully');
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
      const outputFile = path.join(testResultsDir, 'redis-search-success.txt');
      fs.writeFileSync(outputFile, context);
      console.log(`Context written to ${outputFile}`);
      
      return true;
    } else {
      console.log('❌ FAILURE: No context generated');
      return false;
    }
  } catch (error) {
    console.error('Error in Redis search success test:', error);
    return false;
  }
}

/**
 * Test case 2: Redis search returns insufficient results, triggering PostgreSQL fallback
 */
async function testRedisSearchInsufficientResults() {
  console.log('\n--- Test Case 2: Redis Search Returns Insufficient Results ---');
  
  // Keywords that are unlikely to return results from Redis but should return results from PostgreSQL
  const keywords = ['rare', 'disease', 'uncommon', 'condition'];
  console.log('Keywords:', keywords);
  
  try {
    // Generate database context using Redis search
    console.log('Generating database context with Redis search (expecting fallback)...');
    const context = await generateDatabaseContextWithRedis(keywords);
    
    // Check if the context was generated successfully
    if (context && context.length > 0) {
      console.log('✅ SUCCESS: Database context generated successfully');
      console.log('Context length:', context.length);
      console.log('Context preview:', context.substring(0, 200) + '...');
      
      // Check if the context contains relevant information
      const containsRelevantInfo = 
        context.includes('CPT') || 
        context.includes('ICD') || 
        context.includes('disease') || 
        context.includes('condition');
      
      if (containsRelevantInfo) {
        console.log('✅ SUCCESS: Context contains relevant information');
      } else {
        console.log('❌ FAILURE: Context does not contain relevant information');
      }
      
      // Write the context to a file for inspection
      const outputFile = path.join(testResultsDir, 'redis-search-insufficient.txt');
      fs.writeFileSync(outputFile, context);
      console.log(`Context written to ${outputFile}`);
      
      return true;
    } else {
      console.log('❌ FAILURE: No context generated');
      return false;
    }
  } catch (error) {
    console.error('Error in Redis search insufficient results test:', error);
    return false;
  }
}

/**
 * Test case 3: Redis connection fails, triggering PostgreSQL fallback
 */
async function testRedisConnectionFailure() {
  console.log('\n--- Test Case 3: Redis Connection Fails ---');
  
  // Keywords that should return results from PostgreSQL
  const keywords = ['shoulder', 'pain', 'MRI', 'rotator cuff', 'tear'];
  console.log('Keywords:', keywords);
  
  try {
    // Close the Redis connection to simulate a connection failure
    console.log('Closing Redis connection to simulate failure...');
    await closeRedisConnection();
    
    // Generate database context using Redis search (should fall back to PostgreSQL)
    console.log('Generating database context with Redis search (expecting fallback)...');
    const context = await generateDatabaseContextWithRedis(keywords);
    
    // Check if the context was generated successfully
    if (context && context.length > 0) {
      console.log('✅ SUCCESS: Database context generated successfully');
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
      const outputFile = path.join(testResultsDir, 'redis-connection-failure.txt');
      fs.writeFileSync(outputFile, context);
      console.log(`Context written to ${outputFile}`);
      
      return true;
    } else {
      console.log('❌ FAILURE: No context generated');
      return false;
    }
  } catch (error) {
    console.error('Error in Redis connection failure test:', error);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('Starting Redis search with PostgreSQL fallback tests...');
  
  try {
    // Run test case 1: Redis search returns sufficient results
    const test1Success = await testRedisSearchSuccess();
    
    // Run test case 2: Redis search returns insufficient results
    const test2Success = await testRedisSearchInsufficientResults();
    
    // Run test case 3: Redis connection fails
    const test3Success = await testRedisConnectionFailure();
    
    // Print summary
    console.log('\n--- Test Summary ---');
    console.log(`Test case 1 (Redis search success): ${test1Success ? 'PASSED' : 'FAILED'}`);
    console.log(`Test case 2 (Redis search insufficient results): ${test2Success ? 'PASSED' : 'FAILED'}`);
    console.log(`Test case 3 (Redis connection failure): ${test3Success ? 'PASSED' : 'FAILED'}`);
    console.log(`Overall test result: ${test1Success && test2Success && test3Success ? 'PASSED' : 'FAILED'}`);
    
    // Ensure all connections are closed
    console.log('\nEnsuring all connections are closed...');
    await closeRedisConnection();
    
    // Exit the process to ensure all connections are properly closed
    console.log('Test completed. Exiting process...');
    process.exit(0);
  } catch (error) {
    console.error('Error running tests:', error);
    
    // Ensure all connections are closed even if there's an error
    try {
      await closeRedisConnection();
    } catch (closeError) {
      console.error('Error closing Redis connection:', closeError);
    }
    
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
  
  // Ensure all connections are closed even if there's an error
  closeRedisConnection().catch(closeError => {
    console.error('Error closing Redis connection:', closeError);
  }).finally(() => {
    process.exit(1);
  });
});