#!/usr/bin/env node

/**
 * Test script for NPI lookup endpoint
 * Run with: node debug-scripts/test-npi-lookup.js
 */

const fs = require('fs');
const path = require('path');

// Test NPIs (these are example NPIs from CMS documentation)
const TEST_NPIS = [
  '1003000126', // Valid individual NPI (example from CMS docs)
  '1234567890', // Invalid NPI (not in registry)
  'abcdefghij', // Invalid format
  '123'         // Too short
];

// Get super admin token
let token;
try {
  token = fs.readFileSync(path.join(__dirname, '../all-backend-tests/tokens/super_admin-token.txt'), 'utf8').trim();
} catch (error) {
  console.error('Could not read super admin token. Using placeholder.');
  token = 'YOUR_AUTH_TOKEN';
}

const API_URL = 'https://api.radorderpad.com';

async function testNPILookup(npi) {
  console.log(`\nTesting NPI: ${npi}`);
  console.log('='.repeat(40));
  
  try {
    const response = await fetch(`${API_URL}/api/utilities/npi-lookup?number=${npi}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Success!');
      console.log(`Name: ${data.data.basic.firstName} ${data.data.basic.lastName}`);
      console.log(`Credential: ${data.data.basic.credential}`);
      console.log(`Primary Specialty: ${data.data.primaryTaxonomy}`);
      console.log(`Status: ${data.data.basic.status}`);
      
      if (data.data.addresses.length > 0) {
        const primaryAddr = data.data.addresses.find(a => a.addressPurpose === 'LOCATION') || data.data.addresses[0];
        console.log(`Location: ${primaryAddr.city}, ${primaryAddr.state}`);
      }
    } else {
      console.log(`❌ Error: ${data.error || 'Unknown error'}`);
      console.log(`Status Code: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }
}

async function runTests() {
  console.log('NPI Lookup Endpoint Test');
  console.log('========================\n');
  console.log(`API URL: ${API_URL}`);
  console.log(`Token: ${token.substring(0, 20)}...`);
  
  for (const npi of TEST_NPIS) {
    await testNPILookup(npi);
  }
  
  console.log('\n\nTest with curl command:');
  console.log(`curl -X GET "${API_URL}/api/utilities/npi-lookup?number=1003000126" -H "Authorization: Bearer ${token}"`);
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  console.error('This script requires Node.js 18+ for native fetch support.');
  console.error('Alternatively, install node-fetch: npm install node-fetch');
  process.exit(1);
}

runTests();