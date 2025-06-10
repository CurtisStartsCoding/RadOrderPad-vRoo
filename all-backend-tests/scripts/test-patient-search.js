/**
 * Test script for Patient Search API - Dictation-based search
 * 
 * This script tests the patient search functionality for the dictation-only platform,
 * where physicians search by patient name and date of birth.
 */

const https = require('https');

// Get token from environment variable
const PHYSICIAN_TOKEN = process.env.PHYSICIAN_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.radorderpad.com';

if (!PHYSICIAN_TOKEN) {
  console.error('Error: PHYSICIAN_TOKEN environment variable not set');
  console.error('Please run: set PHYSICIAN_TOKEN=your_token_here');
  process.exit(1);
}

// Parse the base URL
const url = new URL(API_BASE_URL);
const options = {
  hostname: url.hostname,
  port: url.port || 443,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${PHYSICIAN_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  rejectUnauthorized: false // For self-signed certificates in development
};

/**
 * Make an HTTPS request
 */
function makeRequest(path, method = 'POST', body = null) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      ...options,
      path,
      method
    };

    console.log(`\n${method} ${API_BASE_URL}${path}`);
    if (body) {
      console.log('Request Body:', JSON.stringify(body, null, 2));
    }

    const req = https.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log('Status:', res.statusCode);
          console.log('Response:', JSON.stringify(jsonData, null, 2));
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          console.log('Raw response:', data);
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error.message);
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

/**
 * Run all patient search tests
 */
async function runTests() {
  console.log('=== Testing Patient Search API (Dictation-Based) ===');
  console.log('API Base URL:', API_BASE_URL);
  console.log('Token:', PHYSICIAN_TOKEN.substring(0, 20) + '...');

  try {
    // Test 1: Natural language date - "March 1st 1980"
    console.log('\n--- Test 1: Natural language date - "March 1st 1980" ---');
    await makeRequest('/api/patients/search', 'POST', {
      patientName: 'John Doe',
      dateOfBirth: 'March 1st 1980'
    });

    // Test 2: Natural language date - "March first nineteen eighty"
    console.log('\n--- Test 2: Natural language date - "March first nineteen eighty" ---');
    await makeRequest('/api/patients/search', 'POST', {
      patientName: 'John Doe',
      dateOfBirth: 'March first nineteen eighty'
    });

    // Test 3: Slash format date - "3/1/1980"
    console.log('\n--- Test 3: Slash format date - "3/1/1980" ---');
    await makeRequest('/api/patients/search', 'POST', {
      patientName: 'John Doe',
      dateOfBirth: '3/1/1980'
    });

    // Test 4: Two-digit year - "March 1 80"
    console.log('\n--- Test 4: Two-digit year - "March 1 80" ---');
    await makeRequest('/api/patients/search', 'POST', {
      patientName: 'John Doe',
      dateOfBirth: 'March 1 80'
    });

    // Test 5: Search with "Last, First" name format
    console.log('\n--- Test 5: Search with "Last, First" name format ---');
    await makeRequest('/api/patients/search', 'POST', {
      patientName: 'Doe, John',
      dateOfBirth: 'March 1st 1980'
    });

    // Test 6: Search with middle name
    console.log('\n--- Test 6: Search with middle name ---');
    await makeRequest('/api/patients/search', 'POST', {
      patientName: 'John Michael Doe',
      dateOfBirth: 'March 1st 1980'
    });

    // Test 7: Search with no matches expected
    console.log('\n--- Test 7: Search with no matches (should return empty with message) ---');
    await makeRequest('/api/patients/search', 'POST', {
      patientName: 'Nonexistent Patient',
      dateOfBirth: 'January 1st 1990'
    });

    // Test 8: Search with missing patient name (should fail)
    console.log('\n--- Test 8: Missing patient name (should fail) ---');
    await makeRequest('/api/patients/search', 'POST', {
      dateOfBirth: 'March 1st 1980'
    });

    // Test 9: Search with missing date of birth (should fail)
    console.log('\n--- Test 9: Missing date of birth (should fail) ---');
    await makeRequest('/api/patients/search', 'POST', {
      patientName: 'John Doe'
    });

    // Test 10: Search with unparseable date (returns empty)
    console.log('\n--- Test 10: Unparseable date (should return empty) ---');
    await makeRequest('/api/patients/search', 'POST', {
      patientName: 'John Doe',
      dateOfBirth: 'sometime in the eighties'
    });

    // Test 11: Search with empty parameters (should fail)
    console.log('\n--- Test 11: Empty parameters (should fail) ---');
    await makeRequest('/api/patients/search', 'POST', {});

    console.log('\n=== All tests completed ===');
  } catch (error) {
    console.error('Test suite error:', error);
  }
}

// Run the tests
runTests();