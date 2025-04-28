/**
 * Test script for the validate endpoint
 */

const axios = require('axios');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Configuration
const API_URL = 'https://api.radorderpad.com';
const JWT_SECRET = process.env.JWT_SECRET || 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';
const NUM_REQUESTS = 2; // Number of requests to make to test caching

// Generate token for physician role
function generatePhysicianToken() {
  const payload = {
    userId: 3,
    orgId: 1,
    role: 'physician',
    email: 'test.physician@example.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return jwt.sign(payload, JWT_SECRET);
}

// Function to measure response time
function calculateResponseTime(startTime) {
  const endTime = process.hrtime.bigint();
  return Number(endTime - startTime) / 1000000; // Convert to milliseconds
}

// Test validate endpoint with the same parameters multiple times to check for caching
async function testValidateEndpoint() {
  try {
    console.log('\n🔍 Testing POST /api/orders/validate with physician role to check Redis caching...');
    
    const token = generatePhysicianToken();
    const client = axios.create({
      baseURL: API_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Debug-Redis': 'true' // Add a custom header to request Redis debugging info
      },
      timeout: 30000 // Increase timeout to 30 seconds to allow for LLM processing
    });
    
    // Base data with a known valid patient ID
    const baseData = {
      dictationText: "72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy.",
      patientInfo: {
        id: 1,
        firstName: "Test",
        lastName: "Patient",
        dateOfBirth: "1980-01-01",
        gender: "male",
        mrn: "MRN12345A"
      },
      debug: true, // Request debug information if available
      includeRedisInfo: true // Request Redis cache information if available
    };
    
    // Make multiple requests with the same parameters to check for caching
    const results = [];
    
    // First request with unique ID to ensure no cache hit
    console.log('\n🔍 Request 1: First request with unique ID (should be a cache miss)');
    const uniqueData = {
      ...baseData,
      requestId: uuidv4(), // Add a unique ID to ensure this is a cache miss
      dictationText: baseData.dictationText + " " + uuidv4() // Make the dictation text unique
    };
    
    const startTime1 = process.hrtime.bigint();
    try {
      const response1 = await client.post('/api/orders/validate', uniqueData);
      const responseTime1 = calculateResponseTime(startTime1);
      console.log(`✅ PASSED: First request completed in ${responseTime1.toFixed(2)}ms`);
      console.log('Response Headers:', JSON.stringify(response1.headers, null, 2));
      console.log('Response Data:', JSON.stringify(response1.data, null, 2));
      
      // Check for Redis indicators in the response
      const redisIndicators = checkForRedisIndicators(response1);
      console.log('Redis Indicators:', redisIndicators);
      
      results.push({
        request: 'unique',
        responseTime: responseTime1,
        redisIndicators,
        success: true
      });
    } catch (error) {
      console.log(`❌ FAILED: First request failed after ${calculateResponseTime(startTime1).toFixed(2)}ms`);
      console.log('Error:', error.message);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', JSON.stringify(error.response.data, null, 2));
      }
      results.push({
        request: 'unique',
        success: false,
        error: error.message
      });
    }
    
    // Second request with the exact same parameters as a previous successful validation
    // This should potentially hit Redis cache if it's being used
    console.log('\n🔍 Request 2: Repeat request with same parameters (should be a cache hit if Redis is used)');
    
    // Use a known successful validation from a previous test
    const cachedData = {
      dictationText: "72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy.",
      patientInfo: {
        id: 1,
        firstName: "Test",
        lastName: "Patient",
        dateOfBirth: "1980-01-01",
        gender: "male",
        mrn: "MRN12345A"
      },
      debug: true,
      includeRedisInfo: true,
      checkCache: true // Signal to check cache
    };
    
    const startTime2 = process.hrtime.bigint();
    try {
      const response2 = await client.post('/api/orders/validate', cachedData);
      const responseTime2 = calculateResponseTime(startTime2);
      console.log(`✅ PASSED: Second request completed in ${responseTime2.toFixed(2)}ms`);
      console.log('Response Headers:', JSON.stringify(response2.headers, null, 2));
      console.log('Response Data:', JSON.stringify(response2.data, null, 2));
      
      // Check for Redis indicators in the response
      const redisIndicators = checkForRedisIndicators(response2);
      console.log('Redis Indicators:', redisIndicators);
      
      results.push({
        request: 'cached',
        responseTime: responseTime2,
        redisIndicators,
        success: true
      });
      
      // Compare response times to check for caching
      if (results[0].success) {
        const speedup = results[0].responseTime / responseTime2;
        console.log(`\n🔍 Cache Analysis: Second request was ${speedup.toFixed(2)}x ${speedup > 1 ? 'faster' : 'slower'} than first request`);
        console.log(`First request: ${results[0].responseTime.toFixed(2)}ms, Second request: ${responseTime2.toFixed(2)}ms`);
        
        if (speedup > 1.5) {
          console.log('✅ LIKELY USING REDIS: Second request was significantly faster, suggesting Redis cache hit');
        } else {
          console.log('❓ INCONCLUSIVE: Response times do not clearly indicate Redis caching');
        }
      }
    } catch (error) {
      console.log(`❌ FAILED: Second request failed after ${calculateResponseTime(startTime2).toFixed(2)}ms`);
      console.log('Error:', error.message);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', JSON.stringify(error.response.data, null, 2));
      }
      results.push({
        request: 'cached',
        success: false,
        error: error.message
      });
    }
    
    return results;
  } catch (error) {
    console.log('❌ FAILED: Overall test execution failed');
    console.log('Error:', error.message);
    return null;
  }
}

// Function to check for Redis indicators in the response
function checkForRedisIndicators(response) {
  const indicators = {
    redisHeadersPresent: false,
    cacheHitHeader: false,
    responseTimeIndicative: false,
    redisInfoInResponse: false,
    conclusion: 'No clear Redis indicators found'
  };
  
  // Check headers for Redis-related information
  if (response.headers) {
    const headers = response.headers;
    if (headers['x-redis-cache'] || headers['x-cache'] || headers['x-cache-hit']) {
      indicators.redisHeadersPresent = true;
      indicators.cacheHitHeader = headers['x-cache-hit'] === 'true' || headers['x-redis-cache'] === 'hit';
    }
  }
  
  // Check response body for Redis information
  if (response.data) {
    const data = response.data;
    if (data.redisInfo || data.cacheInfo || data.debug?.redis || data.debug?.cache) {
      indicators.redisInfoInResponse = true;
    }
    
    // Look for Redis-related properties in the response
    const responseStr = JSON.stringify(data);
    if (responseStr.includes('redis') || responseStr.includes('cache')) {
      indicators.redisInfoInResponse = true;
    }
  }
  
  // Update conclusion based on findings
  if (indicators.redisHeadersPresent || indicators.redisInfoInResponse) {
    indicators.conclusion = 'Redis indicators found in response';
    if (indicators.cacheHitHeader) {
      indicators.conclusion += ' (cache hit confirmed)';
    }
  }
  
  return indicators;
}

// Run test
console.log('=== TESTING VALIDATE ENDPOINT WITH REDIS DEBUGGING ===');
console.log(`Testing API at: ${API_URL}`);
console.log('====================================================\n');

testValidateEndpoint().catch(error => {
  console.error('Error running test:', error);
});