/**
 * Script to test location permissions after setting up test environment
 * This verifies the GET /api/organizations/:orgId/locations endpoint
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'https://api.radorderpad.com';
const SUMMARY_FILE = path.join(__dirname, 'test-environment-summary.json');
const TOKEN_DIR = path.join(__dirname, '..', 'tokens');

// Test scenarios
const TEST_SCENARIOS = [
  {
    name: 'Admin can view own organization locations',
    user: 'admin.clinica@test.com',
    endpoint: '/api/organizations/mine/locations',
    expectedStatus: 200,
    description: 'Admin should see their own organization locations'
  },
  {
    name: 'Admin can view connected organization locations',
    user: 'admin.clinica@test.com', 
    targetOrg: 'Test Radiology Center X',
    endpoint: '/api/organizations/{orgId}/locations',
    expectedStatus: 200,
    description: 'Admin should see locations of connected radiology center'
  },
  {
    name: 'Admin cannot view non-connected organization locations',
    user: 'admin.clinicb@test.com',
    targetOrg: 'Test Radiology Center Y', 
    endpoint: '/api/organizations/{orgId}/locations',
    expectedStatus: 403,
    description: 'Admin should get 403 for non-connected organization'
  },
  {
    name: 'Non-admin cannot view connected organization locations',
    user: 'staff.clinica@test.com',
    targetOrg: 'Test Radiology Center X',
    endpoint: '/api/organizations/{orgId}/locations', 
    expectedStatus: 403,
    description: 'Admin staff should not have permission'
  },
  {
    name: 'Physician cannot view other organization locations',
    user: 'doc.clinica@test.com',
    targetOrg: 'Test Radiology Center X',
    endpoint: '/api/organizations/{orgId}/locations',
    expectedStatus: 403,
    description: 'Physician should not have permission'
  },
  {
    name: 'Radiology admin can view referring organization locations',
    user: 'admin.radx@test.com',
    targetOrg: 'Test Referring Clinic A',
    endpoint: '/api/organizations/{orgId}/locations',
    expectedStatus: 200,
    description: 'Connection works both ways'
  }
];

let testSummary = null;
let results = {
  passed: 0,
  failed: 0,
  details: []
};

// Load test environment summary
function loadTestSummary() {
  try {
    const data = fs.readFileSync(SUMMARY_FILE, 'utf8');
    testSummary = JSON.parse(data);
    console.log('✅ Loaded test environment summary');
    return true;
  } catch (error) {
    console.error('❌ Failed to load test environment summary. Run create-test-users-for-permissions.js first.');
    return false;
  }
}

// Get token for user
function getToken(email) {
  const tokenFile = `test-${email.replace('@', '-').replace('.', '-')}-token.txt`;
  const tokenPath = path.join(TOKEN_DIR, tokenFile);
  
  try {
    return fs.readFileSync(tokenPath, 'utf8').trim();
  } catch (error) {
    console.error(`❌ Token not found for ${email}. Run create-test-users-for-permissions.js first.`);
    return null;
  }
}

// Get organization ID by name
function getOrgId(orgName) {
  const org = testSummary.organizations.find(o => o.name === orgName);
  return org ? org.id : null;
}

// Run a single test scenario
async function runTest(scenario) {
  console.log(`\n📋 Testing: ${scenario.name}`);
  console.log(`   Description: ${scenario.description}`);
  
  const token = getToken(scenario.user);
  if (!token) {
    results.failed++;
    results.details.push({
      scenario: scenario.name,
      status: 'FAILED',
      error: 'Token not found'
    });
    return;
  }

  let endpoint = scenario.endpoint;
  if (scenario.targetOrg) {
    const orgId = getOrgId(scenario.targetOrg);
    if (!orgId) {
      console.error(`   ❌ Organization not found: ${scenario.targetOrg}`);
      results.failed++;
      results.details.push({
        scenario: scenario.name,
        status: 'FAILED',
        error: 'Target organization not found'
      });
      return;
    }
    endpoint = endpoint.replace('{orgId}', orgId);
  }

  try {
    const response = await axios.get(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === scenario.expectedStatus) {
      console.log(`   ✅ PASSED: Got expected status ${response.status}`);
      if (response.data.data || response.data.locations) {
        const locations = response.data.data || response.data.locations;
        console.log(`   📍 Found ${locations.length} locations`);
      }
      results.passed++;
      results.details.push({
        scenario: scenario.name,
        status: 'PASSED',
        actualStatus: response.status,
        expectedStatus: scenario.expectedStatus
      });
    } else {
      console.log(`   ❌ FAILED: Expected ${scenario.expectedStatus}, got ${response.status}`);
      results.failed++;
      results.details.push({
        scenario: scenario.name,
        status: 'FAILED',
        actualStatus: response.status,
        expectedStatus: scenario.expectedStatus
      });
    }
  } catch (error) {
    const actualStatus = error.response?.status || 'ERROR';
    
    if (error.response && error.response.status === scenario.expectedStatus) {
      console.log(`   ✅ PASSED: Got expected error status ${error.response.status}`);
      console.log(`   📝 Error message: ${error.response.data.error || error.response.data.message}`);
      results.passed++;
      results.details.push({
        scenario: scenario.name,
        status: 'PASSED',
        actualStatus: error.response.status,
        expectedStatus: scenario.expectedStatus
      });
    } else {
      console.log(`   ❌ FAILED: Expected ${scenario.expectedStatus}, got ${actualStatus}`);
      if (error.response?.data) {
        console.log(`   📝 Error: ${JSON.stringify(error.response.data)}`);
      } else {
        console.log(`   📝 Error: ${error.message}`);
      }
      results.failed++;
      results.details.push({
        scenario: scenario.name,
        status: 'FAILED',
        actualStatus: actualStatus,
        expectedStatus: scenario.expectedStatus,
        error: error.response?.data || error.message
      });
    }
  }
}

// Check connection status
async function checkConnections() {
  console.log('\n🔍 Checking connection status...');
  
  const adminToken = getToken('admin.clinica@test.com');
  if (!adminToken) return;

  try {
    const response = await axios.get(`${API_URL}/api/connections`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (response.data.connections) {
      console.log(`\n📊 Active Connections:`);
      response.data.connections.forEach(conn => {
        const status = conn.status === 'active' ? '✅ Active' : '⏳ ' + conn.status;
        console.log(`   ${conn.partnerOrgName}: ${status}`);
      });
    }
  } catch (error) {
    console.error('❌ Failed to check connections:', error.response?.data || error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log('=== LOCATION PERMISSIONS TEST SUITE ===');
  console.log(`API URL: ${API_URL}`);
  console.log('=====================================\n');

  // Load test environment
  if (!loadTestSummary()) {
    return;
  }

  // Check connections first
  await checkConnections();

  // Run all test scenarios
  console.log('\n🚀 Running permission tests...');
  for (const scenario of TEST_SCENARIOS) {
    await runTest(scenario);
  }

  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${TEST_SCENARIOS.length}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  
  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.details
      .filter(d => d.status === 'FAILED')
      .forEach(d => {
        console.log(`   - ${d.scenario}`);
        console.log(`     Expected: ${d.expectedStatus}, Got: ${d.actualStatus}`);
        if (d.error) {
          console.log(`     Error: ${JSON.stringify(d.error)}`);
        }
      });
  }

  // Save results
  const resultsFile = path.join(__dirname, 'location-permissions-test-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed results saved to: ${resultsFile}`);

  // Check if this might be the frontend issue
  console.log('\n💡 Frontend Troubleshooting Tips:');
  console.log('1. Make sure the frontend is using the correct endpoint:');
  console.log('   - Own locations: GET /api/organizations/mine/locations');
  console.log('   - Other org locations: GET /api/organizations/:orgId/locations');
  console.log('2. Verify the frontend is sending the Authorization header');
  console.log('3. Check if the frontend is handling 403 errors correctly');
  console.log('4. Ensure connections are active between organizations');
}

// Run the tests
runAllTests();