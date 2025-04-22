/**
 * Test script for enhanced Super Admin log viewing functionality
 */
const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const TOKEN_FILE = path.join(__dirname, '..', 'superadmin-test-token.txt');

// Read the token from file
let token;
try {
  token = fs.readFileSync(TOKEN_FILE, 'utf8').trim();
  console.log('Using token from file');
} catch (error) {
  console.error('Error reading token file:', error.message);
  console.error('Please generate a token using generate-superadmin-token.js');
  process.exit(1);
}

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Test the enhanced LLM validation logs endpoint
 */
async function testEnhancedLlmValidationLogs() {
  console.log('\n=== Testing Enhanced LLM Validation Logs ===\n');
  
  try {
    // Test 1: Basic request with pagination
    console.log('Test 1: Basic request with pagination');
    const basicResponse = await api.get('/superadmin/logs/validation/enhanced?limit=5&offset=0');
    console.log(`Status: ${basicResponse.status}`);
    console.log(`Total logs: ${basicResponse.data.pagination.total}`);
    console.log(`Returned logs: ${basicResponse.data.data.length}`);
    
    if (basicResponse.data.data.length > 0) {
      console.log('First log:', JSON.stringify(basicResponse.data.data[0], null, 2).substring(0, 200) + '...');
    } else {
      console.log('No logs found in the database.');
    }
    
    // Test 2: Date preset filtering
    console.log('\nTest 2: Date preset filtering (last 7 days)');
    const datePresetResponse = await api.get('/superadmin/logs/validation/enhanced?date_preset=last_7_days&limit=5');
    console.log(`Status: ${datePresetResponse.status}`);
    console.log(`Total logs: ${datePresetResponse.data.pagination.total}`);
    
    // Test 3: Multiple status filtering
    console.log('\nTest 3: Multiple status filtering');
    const statusResponse = await api.get('/superadmin/logs/validation/enhanced?statuses=success,failed&limit=5');
    console.log(`Status: ${statusResponse.status}`);
    console.log(`Total logs: ${statusResponse.data.pagination.total}`);
    
    // Test 4: Text search
    console.log('\nTest 4: Text search');
    const searchResponse = await api.get('/superadmin/logs/validation/enhanced?search_text=error&limit=5');
    console.log(`Status: ${searchResponse.status}`);
    console.log(`Total logs: ${searchResponse.data.pagination.total}`);
    
    // Test 5: Sorting
    console.log('\nTest 5: Sorting by latency (descending)');
    const sortResponse = await api.get('/superadmin/logs/validation/enhanced?sort_by=latency_ms&sort_direction=desc&limit=5');
    console.log(`Status: ${sortResponse.status}`);
    console.log(`Total logs: ${sortResponse.data.pagination.total}`);
    console.log(`Returned logs: ${sortResponse.data.data.length}`);
    if (sortResponse.data.data.length > 0) {
      console.log('Latencies:', sortResponse.data.data.map(log => log.latency_ms));
    } else {
      console.log('No logs found in the database.');
    }
    
    // Test 6: Combined filters
    console.log('\nTest 6: Combined filters');
    const combinedResponse = await api.get('/superadmin/logs/validation/enhanced?date_preset=last_30_days&statuses=success&sort_by=created_at&sort_direction=desc&limit=5');
    console.log(`Status: ${combinedResponse.status}`);
    console.log(`Total logs: ${combinedResponse.data.pagination.total}`);
    
    console.log('\n=== Enhanced LLM Validation Logs Tests Completed ===\n');
    return true;
  } catch (error) {
    console.error('Error testing enhanced LLM validation logs:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  try {
    const testResult = await testEnhancedLlmValidationLogs();
    
    if (testResult) {
      console.log('\nAll tests completed successfully!');
    } else {
      console.log('\nTests completed with errors. See above for details.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error running tests:', error.message);
    process.exit(1);
  }
}

// Run the tests
runTests();