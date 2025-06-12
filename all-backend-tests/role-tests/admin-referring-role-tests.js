const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env.test') });

// Set API URL
const API_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://api.radorderpad.com';

// Test statistics
let passedTests = 0;
let failedTests = 0;

// Helper function to log test results
function logTest(testName, passed) {
  if (passed) {
    console.log(`✓ ${testName}`);
    passedTests++;
  } else {
    console.log(`✗ ${testName}`);
    failedTests++;
  }
}

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || { message: error.message },
      status: error.response?.status
    };
  }
}

// Test Suite 1: Organization Management
async function testOrganizationManagement(token) {
  console.log('=== Testing Organization Management ===\n');

  // Test 1: Get current organization
  console.log('1. Testing GET /api/organizations/mine');
  const getOrgResult = await apiRequest('GET', '/api/organizations/mine', null, token);
  logTest('Get current organization', getOrgResult.success);
  
  let orgData = null;
  if (getOrgResult.success && getOrgResult.data?.data?.organization) {
    orgData = getOrgResult.data.data.organization;
    const responseData = getOrgResult.data.data;
    console.log(`   Organization: ${orgData.name} (${orgData.type})`);
    console.log(`   Status: ${orgData.status}`);
    console.log(`   Credit Balance: ${orgData.credit_balance}`);
    
    // Check response structure
    logTest('Response includes locations array', Array.isArray(responseData.locations));
    logTest('Response includes users array', Array.isArray(responseData.users));
  }

  // Test 2: Update organization profile
  console.log('\n2. Testing PUT /api/organizations/mine');
  const updateData = {
    phone_number: '555-TEST-' + Date.now().toString().slice(-4),
    email: `test-${Date.now()}@example.com`
  };
  const updateResult = await apiRequest('PUT', '/api/organizations/mine', updateData, token);
  logTest('Update organization profile', updateResult.success);
  
  if (updateResult.success && updateResult.data) {
    console.log(`   Updated phone: ${updateData.phone_number}`);
    console.log(`   Updated email: ${updateData.email}`);
  }

  // Test 3: Try to update restricted fields (should succeed but ignore the fields)
  console.log('\n3. Testing restricted field updates');
  const originalType = orgData?.type;
  const originalBalance = orgData?.credit_balance;
  
  const restrictedUpdate = {
    type: 'radiology_group',
    credit_balance: 9999,
    phone_number: '555-RESTRICT-TEST' // Include a valid field to ensure update works
  };
  const restrictedResult = await apiRequest('PUT', '/api/organizations/mine', restrictedUpdate, token);
  logTest('Update request succeeds', restrictedResult.success);
  
  // Verify restricted fields were not changed
  if (restrictedResult.success && restrictedResult.data?.data) {
    const updatedOrg = restrictedResult.data.data;
    const typeUnchanged = updatedOrg.type === originalType;
    const balanceIgnored = !('credit_balance' in updatedOrg);
    logTest('Organization type remains unchanged', typeUnchanged);
    logTest('Credit balance field not in update response', balanceIgnored);
  }

  // Test 4: Search organizations
  console.log('\n4. Testing GET /api/organizations (search)');
  const searchResult = await apiRequest('GET', '/api/organizations?type=radiology_group', null, token);
  logTest('Search organizations by type', searchResult.success && Array.isArray(searchResult.data?.data));
  
  if (searchResult.success && searchResult.data?.data) {
    console.log(`   Found ${searchResult.data.data.length} radiology organizations`);
    if (searchResult.data.data.length > 0) {
      const firstOrg = searchResult.data.data[0];
      console.log(`   Sample: ${firstOrg.name} in ${firstOrg.city}, ${firstOrg.state}`);
    }
  }

  // Test 5: Search with multiple filters
  console.log('\n5. Testing organization search with multiple filters');
  const multiSearchResult = await apiRequest('GET', '/api/organizations?type=radiology_group&state=CA', null, token);
  logTest('Search with multiple filters', multiSearchResult.success);

  return orgData;
}

// Test Suite 2: User Management
async function testUserManagement(token) {
  console.log('\n=== Testing User Management ===\n');

  // Test 1: List users
  console.log('1. Testing GET /api/users');
  const listUsersResult = await apiRequest('GET', '/api/users', null, token);
  logTest('List organization users', listUsersResult.success);

  // Test 4: Invite new user
  console.log('\n4. Testing POST /api/user-invites/invite');
  const inviteData = {
    email: `physician-${Date.now()}@testclinic.com`,
    firstName: 'Test',
    lastName: 'Physician',
    role: 'physician',
    specialty: 'Cardiology'
  };
  const inviteResult = await apiRequest('POST', '/api/user-invites/invite', inviteData, token);
  logTest('Invite new user', inviteResult.success);
}

// Test Suite 3: Location Management
async function testLocationManagement(token) {
  console.log('\n=== Testing Location Management ===\n');

  // Test 1: List locations
  console.log('1. Testing GET /api/organizations/mine/locations');
  const listLocationsResult = await apiRequest('GET', '/api/organizations/mine/locations', null, token);
  logTest('List organization locations', listLocationsResult.success && Array.isArray(listLocationsResult.data?.locations));
  
  if (listLocationsResult.success && listLocationsResult.data?.locations) {
    console.log(`   Total locations: ${listLocationsResult.data.locations.length}`);
    if (listLocationsResult.data.locations.length > 0) {
      console.log(`   Primary location: ${listLocationsResult.data.locations[0].name}`);
    }
  }

  // Test 2: Create new location
  console.log('\n2. Testing POST /api/organizations/mine/locations');
  const newLocationData = {
    name: `Test Location ${Date.now()}`,
    address_line1: '123 Test Street',
    city: 'Test City',
    state: 'CA',
    zip_code: '12345',
    phone_number: '555-LOC-' + Date.now().toString().slice(-4)
  };
  const createLocationResult = await apiRequest('POST', '/api/organizations/mine/locations', newLocationData, token);
  logTest('Create new location', createLocationResult.success && createLocationResult.data?.location);
  
  let createdLocationId = null;
  if (createLocationResult.success && createLocationResult.data?.location) {
    createdLocationId = createLocationResult.data.location.id;
    console.log(`   Created location ID: ${createdLocationId}`);
  }

  // Test 3: Update location
  if (createdLocationId) {
    console.log('\n3. Testing PUT /api/organizations/mine/locations/:locationId');
    const updateLocationData = {
      name: `Updated Test Location ${Date.now()}`,
      phone_number: '555-UPD-' + Date.now().toString().slice(-4)
    };
    const updateLocationResult = await apiRequest('PUT', `/api/organizations/mine/locations/${createdLocationId}`, updateLocationData, token);
    logTest('Update location', updateLocationResult.success && updateLocationResult.data?.location);
  }

  // Test 4: Get specific location
  if (createdLocationId) {
    console.log('\n4. Testing GET /api/organizations/mine/locations/:locationId');
    const getLocationResult = await apiRequest('GET', `/api/organizations/mine/locations/${createdLocationId}`, null, token);
    logTest('Get specific location', getLocationResult.success && getLocationResult.data?.location);
  }

  // Test 5: Deactivate location
  if (createdLocationId) {
    console.log('\n5. Testing DELETE /api/organizations/mine/locations/:locationId');
    const deleteLocationResult = await apiRequest('DELETE', `/api/organizations/mine/locations/${createdLocationId}`, null, token);
    logTest('Deactivate location', deleteLocationResult.success && deleteLocationResult.data?.message);
  }
}

// Test Suite 4: Connection Management
async function testConnectionManagement(token, orgData) {
  console.log('\n=== Testing Connection Management ===\n');

  // Test 1: List current connections
  console.log('1. Testing GET /api/connections');
  const listConnectionsResult = await apiRequest('GET', '/api/connections', null, token);
  logTest('List current connections', listConnectionsResult.success && Array.isArray(listConnectionsResult.data?.connections));
  
  if (listConnectionsResult.success && listConnectionsResult.data?.connections) {
    console.log(`   Active connections: ${listConnectionsResult.data.connections.length}`);
  }

  // Test 2: List connection requests
  console.log('\n2. Testing GET /api/connections/requests');
  const listRequestsResult = await apiRequest('GET', '/api/connections/requests', null, token);
  logTest('List connection requests', listRequestsResult.success && Array.isArray(listRequestsResult.data?.requests));
  
  if (listRequestsResult.success && listRequestsResult.data?.requests) {
    const requests = listRequestsResult.data.requests;
    console.log(`   Pending requests: ${requests.filter(r => r.status === 'pending').length}`);
    console.log(`   Total requests: ${requests.length}`);
  }

  // Test 3: Search for potential partners
  console.log('\n3. Testing partner search');
  const searchPartnersResult = await apiRequest('GET', '/api/organizations?type=radiology_group', null, token);
  logTest('Search for radiology partners', searchPartnersResult.success && Array.isArray(searchPartnersResult.data?.data));
  
  let targetOrgId = null;
  if (searchPartnersResult.success && searchPartnersResult.data?.data?.length > 0) {
    targetOrgId = searchPartnersResult.data.data[0].id;
    console.log(`   Found partner: ${searchPartnersResult.data.data[0].name}`);
  }

  // Test 4: Create connection request (skip if already connected)
  if (targetOrgId && orgData) {
    console.log('\n4. Testing POST /api/connections');
    const connectionData = {
      targetOrgId: targetOrgId,
      notes: `Test connection request from admin test ${Date.now()}`
    };
    const createRequestResult = await apiRequest('POST', '/api/connections', connectionData, token);
    logTest('Create connection request', 
      createRequestResult.success || 
      createRequestResult.error?.message?.includes('already exists') ||
      createRequestResult.error?.message?.includes('already connected')
    );
  }
}

// Test Suite 5: Billing and Credits
async function testBillingAndCredits(token) {
  console.log('\n=== Testing Billing and Credits ===\n');

  // Test 1: Get credit balance
  console.log('1. Testing GET /api/billing/credit-balance');
  const balanceResult = await apiRequest('GET', '/api/billing/credit-balance', null, token);
  logTest('Get credit balance', balanceResult.success);
  
  if (balanceResult.success && balanceResult.data?.data) {
    const balance = balanceResult.data.data;
    console.log(`   Credit Balance: ${balance.creditBalance || 0}`);
    console.log(`   Basic Credits: ${balance.basicCredits || 0}`);
    console.log(`   Advanced Credits: ${balance.advancedCredits || 0}`);
  }

  // Test 2: Get credit usage history
  console.log('\n2. Testing GET /api/billing/credit-usage');
  const usageResult = await apiRequest('GET', '/api/billing/credit-usage', null, token);
  logTest('Get credit usage history', usageResult.success);

  // Test 3: Get billing history (endpoint might not exist)
  console.log('\n3. Testing GET /api/billing/history');
  const historyResult = await apiRequest('GET', '/api/billing/history', null, token);
  logTest('Get billing history', historyResult.success || historyResult.status === 404);
  if (historyResult.status === 404) {
    console.log('   Note: Billing history endpoint not implemented');
  }
}

// Main test runner
async function runTests() {
  console.log('===========================================');
  console.log('   Admin Referring Role Test Suite');
  console.log('===========================================');
  console.log(`API URL: ${API_URL}`);
  console.log(`Time: ${new Date().toISOString()}`);

  // Load token
  let token;
  try {
    token = fs.readFileSync(path.join(__dirname, '..', '..', 'tokens', 'admin_referring-token.txt'), 'utf8').trim();
    console.log('Token loaded successfully\n');
  } catch (error) {
    console.error('Error: Could not load admin_referring token');
    console.error('Please ensure the token file exists at tokens/admin_referring-token.txt');
    process.exit(1);
  }

  // Run all test suites
  const orgData = await testOrganizationManagement(token);
  await testUserManagement(token);
  await testLocationManagement(token);
  await testConnectionManagement(token, orgData);
  await testBillingAndCredits(token);

  // Print summary
  console.log('\n===========================================');
  console.log('           Test Summary');
  console.log('===========================================');
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Total: ${passedTests + failedTests}`);
}

// Run the tests
runTests().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});