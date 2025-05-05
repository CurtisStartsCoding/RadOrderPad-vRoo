/**
 * Debug script for Redis usage in validation endpoint
 * 
 * This script sends the hemochromatosis case to the validation endpoint
 * with debug headers to get information about Redis queries.
 */

const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

// Get the API URL and token from environment variables
const apiUrl = process.env.API_URL || 'https://api.radorderpad.com';
const token = process.env.PHYSICIAN_TOKEN;

// Function to measure response time
function calculateResponseTime(startTime) {
  const endTime = process.hrtime.bigint();
  return Number(endTime - startTime) / 1000000; // Convert to milliseconds
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

// Hemochromatosis case payload
const hemochromatosisPayload = {
  dictationText: "48-year-old female with chronic diarrhea for past 4 months, typically 4-5 loose stools daily. Reports upper right quadrant discomfort after meals. Patient has noted darkening of skin on knuckles and neck folds. Recent lab work shows mildly elevated ferritin and transaminases. Family history significant for father with cirrhosis of \"unknown cause.\" Order abdominal ultrasound to evaluate for possible gallbladder disease.",
  patientInfo: {
    id: 1,
    firstName: 'Test',
    lastName: 'Patient',
    dateOfBirth: '1980-01-01',
    gender: 'female',
    phoneNumber: '555-123-4567',
    email: 'test.patient@example.com'
  },
  radiologyOrganizationId: 1,
  debug: true,                // Request debug information
  includeRedisInfo: true,     // Request Redis cache information
  includePromptDetails: true, // Request prompt details
  includeKeywords: true,      // Request extracted keywords
  includeDatabaseContext: true // Request database context
};

// Function to debug Redis validation
async function debugRedisValidation() {
  try {
    console.log('Debugging Redis usage in validation endpoint...');
    console.log(`API URL: ${apiUrl}`);
    
    // Create axios client with debug headers
    const client = axios.create({
      baseURL: apiUrl,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Debug-Redis': 'true',
        'X-Debug-Mode': 'true',
        'X-Include-Context': 'true'
      },
      timeout: 60000 // 60 second timeout for LLM processing
    });
    
    // Make the request
    console.log('\nSending hemochromatosis case with debug headers...');
    const startTime = process.hrtime.bigint();
    
    const response = await client.post('/api/orders/validate', hemochromatosisPayload);
    
    const responseTime = calculateResponseTime(startTime);
    console.log(`Request completed in ${responseTime.toFixed(2)}ms`);
    
    // Check for Redis indicators
    const redisIndicators = checkForRedisIndicators(response);
    console.log('\nRedis Indicators:');
    console.log(JSON.stringify(redisIndicators, null, 2));
    
    // Extract and save the full response
    console.log('\nFull Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Save the response to a file for analysis
    fs.writeFileSync('redis-debug-response.json', JSON.stringify(response.data, null, 2));
    console.log('\nResponse saved to redis-debug-response.json');
    
    // Extract key information
    console.log('\nKey Information:');
    
    // Extract keywords if available
    if (response.data.debug?.keywords) {
      console.log('\nExtracted Keywords:');
      console.log(response.data.debug.keywords);
    }
    
    // Extract database context if available
    if (response.data.debug?.databaseContext) {
      console.log('\nDatabase Context:');
      console.log(response.data.debug.databaseContext);
    }
    
    // Extract prompt if available
    if (response.data.debug?.prompt) {
      console.log('\nPrompt:');
      console.log(response.data.debug.prompt);
    }
    
    // Extract Redis info if available
    if (response.data.debug?.redis) {
      console.log('\nRedis Info:');
      console.log(JSON.stringify(response.data.debug.redis, null, 2));
    }
    
  } catch (error) {
    console.error('Error debugging Redis validation:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

// Run the debug function
debugRedisValidation();