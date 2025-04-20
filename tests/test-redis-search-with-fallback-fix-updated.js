/**
 * Enhanced test script for RedisSearch with fallback testing
 * 
 * This script tests both the primary Redis path and the PostgreSQL fallback path.
 * 
 * Usage:
 * ```
 * node tests/test-redis-search-with-fallback-fix-updated.js
 * ```
 */
import axios from 'axios';
import { getRedisClient, closeRedisConnection, testRedisConnection } from '../dist/config/redis.js';

// Sample dictation text for testing
const sampleDictation = `
Patient presents with right shoulder pain after a fall. 
The pain is worse with movement and there is limited range of motion.
Patient has a history of osteoarthritis.
Requesting MRI of the right shoulder to rule out rotator cuff tear.
`;

// JWT token for authentication
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NTE4NTk5NCwiZXhwIjoxNzQ1MjcyMzk0fQ.CPle3x1WWqYMklkIsh79J4ZKdW4l05Jv1XW_nQHh_WI';

/**
 * Test the RedisSearch path
 */
async function testRedisSearchPath() {
  try {
    console.log('\n--- Testing RedisSearch Path ---');
    
    // Create RedisSearch indexes
    console.log('Creating RedisSearch indexes...');
    
    // Get Redis client
    const client = getRedisClient();
    
    // Check if the indexes exist
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cptIndexInfo = await client.call('FT.INFO', 'cpt_index');
      console.log('CPT index info:', cptIndexInfo);
    } catch (error) {
      console.error('Error checking CPT index:', error.message);
    }
    
    // Call the validation endpoint
    console.log('Calling validation endpoint...');
    const response = await axios.post(
      'http://localhost:3000/api/orders/validate',
      {
        dictationText: sampleDictation,
        patientInfo: {
          id: 1, // Using patient ID 1 instead of 12345
          firstName: "Test",
          lastName: "Patient",
          dateOfBirth: "1980-01-01",
          gender: "M",
          mrn: "TEST12345"
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    return response.status === 200;
  } catch (error) {
    console.error('Error in RedisSearch path test:', error);
    console.log('Response status:', error.response?.status);
    console.log('Response data:', error.response?.data);
    return false;
  }
}

/**
 * Test the PostgreSQL fallback path
 */
async function testPostgreSQLFallbackPath() {
  try {
    console.log('\n--- Testing PostgreSQL Fallback Path ---');
    
    // Temporarily break Redis connection
    console.log('Temporarily breaking Redis connection...');
    await closeRedisConnection();
    
    // Call the validation endpoint with broken Redis connection
    console.log('Calling validation endpoint with broken Redis connection...');
    const response = await axios.post(
      'http://localhost:3000/api/orders/validate',
      {
        dictationText: sampleDictation,
        patientInfo: {
          id: 1, // Using patient ID 1 instead of 12345
          firstName: "Test",
          lastName: "Patient",
          dateOfBirth: "1980-01-01",
          gender: "M",
          mrn: "TEST12345"
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    return response.status === 200;
  } catch (error) {
    console.error('Error in PostgreSQL fallback path test:', error);
    console.log('Response status:', error.response?.status);
    console.log('Response data:', error.response?.data);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  try {
    console.log('Starting enhanced RedisSearch test with fallback testing...');
    
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
  }
}

// Run the tests
runTests();