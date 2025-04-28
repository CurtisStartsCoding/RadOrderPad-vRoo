/**
 * Test script for Super Admin log viewing endpoints
 * 
 * This script tests all four log viewing endpoints:
 * 1. GET /api/superadmin/logs/validation - Basic LLM validation logs
 * 2. GET /api/superadmin/logs/validation/enhanced - Enhanced LLM validation logs
 * 3. GET /api/superadmin/logs/credits - Credit usage logs
 * 4. GET /api/superadmin/logs/purgatory - Purgatory events
 * 
 * Usage:
 *   node debug-scripts/vercel-tests/test-superadmin-logs.js [endpoint]
 * 
 * Where [endpoint] is one of:
 *   - validation (default if not specified)
 *   - validation-enhanced
 *   - credits
 *   - purgatory
 *   - all (test all endpoints)
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.radorderpad.com/api';
const JWT_SECRET = process.env.JWT_SECRET || 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';

// Generate a JWT token for a super_admin user
function generateSuperAdminToken() {
  const payload = {
    userId: 1,
    orgId: 1,
    role: 'super_admin',
    email: 'test.superadmin@example.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return jwt.sign(payload, JWT_SECRET);
}

// Get the super_admin token
const token = generateSuperAdminToken();

// Test the basic LLM validation logs endpoint
async function testLlmValidationLogs() {
  try {
    console.log('\n=== Testing Basic LLM Validation Logs ===\n');
    
    const response = await axios.get(`${API_BASE_URL}/superadmin/logs/validation`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        limit: 10
      }
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Total logs: ${response.data.pagination?.total || 'N/A'}`);
    console.log('Sample log entry:');
    
    if (response.data.data && response.data.data.length > 0) {
      const sample = response.data.data[0];
      console.log(JSON.stringify(sample, null, 2));
    } else {
      console.log('No log entries found');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error testing LLM validation logs:');
    console.error(error.response?.data || error.message);
    throw error;
  }
}

// Test the enhanced LLM validation logs endpoint
async function testEnhancedLlmValidationLogs() {
  try {
    console.log('\n=== Testing Enhanced LLM Validation Logs ===\n');
    
    const response = await axios.get(`${API_BASE_URL}/superadmin/logs/validation/enhanced`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        limit: 10,
        date_preset: 'last_30_days',
        sort_by: 'created_at',
        sort_direction: 'desc'
      }
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Total logs: ${response.data.pagination?.total || 'N/A'}`);
    console.log('Sample log entry:');
    
    if (response.data.data && response.data.data.length > 0) {
      const sample = response.data.data[0];
      console.log(JSON.stringify(sample, null, 2));
    } else {
      console.log('No log entries found');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error testing enhanced LLM validation logs:');
    console.error(error.response?.data || error.message);
    throw error;
  }
}

// Test the credit usage logs endpoint
async function testCreditUsageLogs() {
  try {
    console.log('\n=== Testing Credit Usage Logs ===\n');
    
    const response = await axios.get(`${API_BASE_URL}/superadmin/logs/credits`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        limit: 10
      }
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Total logs: ${response.data.pagination?.total || 'N/A'}`);
    console.log('Sample log entry:');
    
    if (response.data.data && response.data.data.length > 0) {
      const sample = response.data.data[0];
      console.log(JSON.stringify(sample, null, 2));
    } else {
      console.log('No log entries found');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error testing credit usage logs:');
    console.error(error.response?.data || error.message);
    throw error;
  }
}

// Test the purgatory events endpoint
async function testPurgatoryEvents() {
  try {
    console.log('\n=== Testing Purgatory Events ===\n');
    
    const response = await axios.get(`${API_BASE_URL}/superadmin/logs/purgatory`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        limit: 10
      }
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Total events: ${response.data.pagination?.total || 'N/A'}`);
    console.log('Sample event:');
    
    if (response.data.data && response.data.data.length > 0) {
      const sample = response.data.data[0];
      console.log(JSON.stringify(sample, null, 2));
    } else {
      console.log('No purgatory events found');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error testing purgatory events:');
    console.error(error.response?.data || error.message);
    throw error;
  }
}

// Run the tests
async function runTests() {
  try {
    // Get the endpoint to test from command line arguments
    const endpoint = process.argv[2] || 'validation';
    
    switch (endpoint) {
      case 'validation':
        await testLlmValidationLogs();
        break;
      case 'validation-enhanced':
        await testEnhancedLlmValidationLogs();
        break;
      case 'credits':
        await testCreditUsageLogs();
        break;
      case 'purgatory':
        await testPurgatoryEvents();
        break;
      case 'all':
        await testLlmValidationLogs();
        await testEnhancedLlmValidationLogs();
        await testCreditUsageLogs();
        await testPurgatoryEvents();
        break;
      default:
        console.error(`Unknown endpoint: ${endpoint}`);
        console.error('Valid endpoints: validation, validation-enhanced, credits, purgatory, all');
        process.exit(1);
    }
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('\nTest failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
runTests();