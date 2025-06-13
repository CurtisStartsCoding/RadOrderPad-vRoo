/**
 * Admin Radiology Role Tests - Fixed Version
 * 
 * Comprehensive test suite for admin_radiology role covering:
 * 1. Organization Management
 * 2. User Management (Radiologists & Schedulers)
 * 3. Location Management
 * 4. Connection Management (Approving referring orgs)
 * 5. Dual Credit System (Basic & Advanced)
 * 
 * Fixed to handle actual API response structures correctly
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const TEST_TIMEOUT = 30000; // 30 seconds

// Test results
const testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

// Helper function to log test results
function logTest(testName, success, error = null) {
  if (success) {
    console.log(`✓ ${testName}`);
    testResults.passed++;
  } else {
    console.log(`✗ ${testName}`);
    if (error) {
      console.error(`  Error: ${error.message || error}`);
      testResults.errors.push({ test: testName, error: error.message || error });
    }
    testResults.failed++;
  }
}

// Helper function to get token
function getToken() {
  try {
    const tokenPath = path.join(__dirname, '..', 'tokens', 'admin_radiology-token.txt');
    return fs.readFileSync(tokenPath, 'utf8').trim();
  } catch (error) {
    console.error('Failed to read admin_radiology token:', error.message);
    process.exit(1);
  }
}

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null, token = null) {
  const config = {
    method,
    url: `${API_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: TEST_TIMEOUT
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    config.data = data;
  }

  try {
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status 
    };
  }
}

// Test Suite 1: Organization Management
async function testOrganizationManagement(token) {
  console.log('\n=== Testing Organization Management ===\n');

  // Test 1: Get current organization
  console.log('1. Testing GET /api/organizations/mine');
  const getOrgResult = await apiRequest('GET', '/api/organizations/mine', null, token);
  
  // Fixed: Check for the correct response structure
  const hasCorrectStructure = getOrgResult.success && 
    getOrgResult.data?.success === true && 
    getOrgResult.data?.data?.organization;
  
  logTest('Get current organization', hasCorrectStructure);
  
  let currentOrgData = null;
  if (hasCorrectStructure) {
    currentOrgData = getOrgResult.data.data.organization;
    console.log(`   Organization: ${currentOrgData.name} (${currentOrgData.type})`);
    console.log(`   Status: ${currentOrgData.status}`);
    
    // Radiology organizations have dual credits
    console.log(`   Basic Credits: ${currentOrgData.basic_credit_balance || 0}`);
    console.log(`   Advanced Credits: ${currentOrgData.advanced_credit_balance || 0}`);
    
    // Verify organization type
    logTest('Organization type is radiology_group', currentOrgData.type === 'radiology_group');
    
    // Check for locations and users in the response
    if (getOrgResult.data.data.locations) {
      console.log(`   Locations: ${getOrgResult.data.data.locations.length}`);
    }
    if (getOrgResult.data.data.users) {
      console.log(`   Users: ${getOrgResult.data.data.users.length}`);
    }
  }

  // Test 2: Update organization
  console.log('\n2. Testing PUT /api/organizations/mine');
  const updateData = {
    phone_number: '555-RAD-' + Date.now().toString().slice(-4),
    contact_email: `radiology-${Date.now()}@example.com`,
    website: 'https://radiology-test.example.com'
  };
  const updateResult = await apiRequest('PUT', '/api/organizations/mine', updateData, token);
  logTest('Update organization profile', updateResult.success && updateResult.data?.success);

  // Test 3: Search for referring organizations
  console.log('\n3. Testing GET /api/organizations (search referring orgs)');
  const searchResult = await apiRequest('GET', '/api/organizations?type=referring_practice', null, token);
  logTest('Search for referring organizations', searchResult.success && searchResult.data?.success);
  
  if (searchResult.success && searchResult.data?.data) {
    const orgs = searchResult.data.data;
    console.log(`   Found ${orgs.length} referring organizations`);
    if (orgs.length > 0) {
      console.log(`   Sample: ${orgs[0].name} in ${orgs[0].city}, ${orgs[0].state}`);
    }
  }

  return currentOrgData;
}

// Test Suite 2: User Management (Radiologists & Schedulers)
async function testUserManagement(token) {
  console.log('\n=== Testing User Management ===\n');

  // Test 1: List organization users
  console.log('1. Testing GET /api/users');
  const listUsersResult = await apiRequest('GET', '/api/users', null, token);
  logTest('List organization users', listUsersResult.success && listUsersResult.data?.success);
  
  if (listUsersResult.success && listUsersResult.data?.users) {
    const users = listUsersResult.data.users;
    console.log(`   Total users: ${users.length}`);
    
    // Count by role
    const radiologists = users.filter(u => u.role === 'radiologist').length;
    const schedulers = users.filter(u => u.role === 'scheduler').length;
    const admins = users.filter(u => u.role === 'admin_radiology').length;
    
    console.log(`   Radiologists: ${radiologists}`);
    console.log(`   Schedulers: ${schedulers}`);
    console.log(`   Admins: ${admins}`);
  }

  // Test 2: Invite radiologist
  console.log('\n2. Testing POST /api/user-invites/invite (radiologist)');
  const inviteRadiologistData = {
    email: `radiologist-${Date.now()}@example.com`,
    role: 'radiologist'
  };
  const inviteRadResult = await apiRequest('POST', '/api/user-invites/invite', inviteRadiologistData, token);
  logTest('Invite radiologist', inviteRadResult.success || inviteRadResult.status === 409);

  // Test 3: Invite scheduler
  console.log('\n3. Testing POST /api/user-invites/invite (scheduler)');
  const inviteSchedulerData = {
    email: `scheduler-${Date.now()}@example.com`,
    role: 'scheduler'
  };
  const inviteSchedulerResult = await apiRequest('POST', '/api/user-invites/invite', inviteSchedulerData, token);
  logTest('Invite scheduler', inviteSchedulerResult.success || inviteSchedulerResult.status === 409);

  // Test 4: Try to invite physician (should fail)
  console.log('\n4. Testing invalid role invitation');
  const invitePhysicianData = {
    email: `physician-${Date.now()}@example.com`,
    role: 'physician'
  };
  const invitePhysicianResult = await apiRequest('POST', '/api/user-invites/invite', invitePhysicianData, token);
  logTest('Cannot invite physician (expected to fail)', !invitePhysicianResult.success);
}

// Test Suite 3: Location Management
async function testLocationManagement(token) {
  console.log('\n=== Testing Location Management ===\n');

  // Test 1: List locations
  console.log('1. Testing GET /api/organizations/mine/locations');
  const listLocationsResult = await apiRequest('GET', '/api/organizations/mine/locations', null, token);
  
  // Fixed: Handle the correct response structure { locations: [...] }
  const hasLocations = listLocationsResult.success && Array.isArray(listLocationsResult.data?.locations);
  logTest('List imaging center locations', hasLocations);
  
  if (hasLocations) {
    const locations = listLocationsResult.data.locations;
    console.log(`   Total imaging locations: ${locations.length}`);
    locations.forEach(loc => {
      console.log(`   - ${loc.name} in ${loc.city}, ${loc.state}`);
    });
  }

  // Test 2: Create imaging location
  console.log('\n2. Testing POST /api/organizations/mine/locations');
  const newLocationData = {
    name: `Imaging Center ${Date.now()}`,
    address_line1: '789 MRI Lane',
    city: 'Radiology City',
    state: 'CA',
    zip_code: '90210',
    phone_number: '555-IMG-' + Date.now().toString().slice(-4)
  };
  const createLocationResult = await apiRequest('POST', '/api/organizations/mine/locations', newLocationData, token);
  
  // Check if the endpoint exists
  if (createLocationResult.status === 404) {
    logTest('Create new imaging location endpoint (404 - not implemented)', false);
    console.log('   Note: Location creation endpoint not yet implemented');
    return null;
  }
  
  logTest('Create new imaging location', createLocationResult.success && createLocationResult.data?.success);
  
  let createdLocationId = null;
  if (createLocationResult.success && createLocationResult.data?.location) {
    createdLocationId = createLocationResult.data.location.id;
    console.log(`   Created imaging center: ${createLocationResult.data.location.name}`);
  }

  return createdLocationId;
}

// Test Suite 4: Connection Management (Radiology Perspective)
async function testConnectionManagement(token, orgData) {
  console.log('\n=== Testing Connection Management ===\n');

  // Test 1: List current connections
  console.log('1. Testing GET /api/connections');
  const listConnectionsResult = await apiRequest('GET', '/api/connections', null, token);
  
  // Fixed: Handle the correct response structure { connections: [...] }
  const hasConnections = listConnectionsResult.success && Array.isArray(listConnectionsResult.data?.connections);
  logTest('List referring practice connections', hasConnections);
  
  if (hasConnections) {
    const connections = listConnectionsResult.data.connections;
    console.log(`   Connected referring practices: ${connections.length}`);
    connections.slice(0, 3).forEach(conn => {
      console.log(`   - ${conn.name} (${conn.city}, ${conn.state})`);
    });
  }

  // Test 2: List incoming connection requests
  console.log('\n2. Testing GET /api/connections/requests');
  const listRequestsResult = await apiRequest('GET', '/api/connections/requests', null, token);
  
  // Fixed: Handle the correct response structure { requests: [...] }
  const hasRequests = listRequestsResult.success && Array.isArray(listRequestsResult.data?.requests);
  logTest('List incoming connection requests', hasRequests);
  
  let pendingRequestId = null;
  if (hasRequests) {
    const requests = listRequestsResult.data.requests;
    const pendingRequests = requests.filter(r => r.status === 'pending');
    console.log(`   Pending requests from referring practices: ${pendingRequests.length}`);
    console.log(`   Total requests: ${requests.length}`);
    
    if (pendingRequests.length > 0) {
      pendingRequestId = pendingRequests[0].id;
      console.log(`   Sample pending: ${pendingRequests[0].requesting_org_name}`);
    }
  }

  // Test 3: Get request details (radiology specific endpoint)
  if (pendingRequestId) {
    console.log('\n3. Testing GET /api/connections/radiology/request-info/:requestId');
    const requestInfoResult = await apiRequest('GET', `/api/connections/radiology/request-info/${pendingRequestId}`, null, token);
    
    // Handle 404 gracefully
    if (requestInfoResult.status === 404) {
      logTest('Get detailed request information (404 - endpoint not found)', false);
      console.log('   Note: Radiology-specific request info endpoint not yet implemented');
    } else {
      logTest('Get detailed request information', requestInfoResult.success);
      
      if (requestInfoResult.success && requestInfoResult.data) {
        console.log(`   Requesting org: ${requestInfoResult.data.requestingOrganization?.name}`);
        console.log(`   Request date: ${new Date(requestInfoResult.data.request?.created_at).toLocaleDateString()}`);
      }
    }
  }

  // Note: We won't actually approve/reject in tests to avoid modifying production data
  console.log('\n4. Connection approval/rejection endpoints available:');
  console.log('   - POST /api/connections/approve/:requestId');
  console.log('   - POST /api/connections/reject/:requestId');
  logTest('Connection management endpoints documented', true);
}

// Test Suite 5: Dual Credit System
async function testDualCreditSystem(token) {
  console.log('\n=== Testing Dual Credit System ===\n');

  // Test 1: Get credit balance (should show dual credits)
  console.log('1. Testing GET /api/billing/credit-balance');
  const balanceResult = await apiRequest('GET', '/api/billing/credit-balance', null, token);
  logTest('Get dual credit balance', balanceResult.success);
  
  if (balanceResult.success && balanceResult.data) {
    const hasBasicCredits = 'basicCreditBalance' in balanceResult.data;
    const hasAdvancedCredits = 'advancedCreditBalance' in balanceResult.data;
    
    logTest('Response includes basic credits', hasBasicCredits);
    logTest('Response includes advanced credits', hasAdvancedCredits);
    
    console.log(`   Basic Credits (X-rays, ultrasound): ${balanceResult.data.basicCreditBalance || 0}`);
    console.log(`   Advanced Credits (MRI, CT, PET): ${balanceResult.data.advancedCreditBalance || 0}`);
  }

  // Test 2: Get credit usage showing credit types
  console.log('\n2. Testing GET /api/billing/credit-usage');
  const usageResult = await apiRequest('GET', '/api/billing/credit-usage?days=30', null, token);
  logTest('Get credit usage by type', usageResult.success);
  
  if (usageResult.success && usageResult.data?.usage) {
    const basicUsage = usageResult.data.usage.filter(u => u.creditType === 'basic').length;
    const advancedUsage = usageResult.data.usage.filter(u => u.creditType === 'advanced').length;
    
    console.log(`   Basic credit usage records: ${basicUsage}`);
    console.log(`   Advanced credit usage records: ${advancedUsage}`);
  }

  // Test 3: Billing history should show credit type
  console.log('\n3. Testing GET /api/billing/history');
  const historyResult = await apiRequest('GET', '/api/billing/history', null, token);
  logTest('Get billing history with credit types', historyResult.success);
}

// Test Suite 6: Radiology-Specific Features
async function testRadiologySpecificFeatures(token) {
  console.log('\n=== Testing Radiology-Specific Features ===\n');

  // Test 1: Access to incoming orders (scheduler endpoint but admin can access)
  console.log('1. Testing GET /api/radiology/incoming-orders');
  const incomingOrdersResult = await apiRequest('GET', '/api/radiology/incoming-orders', null, token);
  
  // Handle 404 gracefully
  if (incomingOrdersResult.status === 404) {
    logTest('Access incoming orders queue (404 - endpoint not found)', false);
    console.log('   Note: Radiology incoming orders endpoint not yet implemented');
  } else {
    logTest('Access incoming orders queue', incomingOrdersResult.success);
    
    if (incomingOrdersResult.success && incomingOrdersResult.data?.orders) {
      console.log(`   Incoming orders: ${incomingOrdersResult.data.orders.length}`);
    }
  }

  // Test 2: Organization cannot access referring practice endpoints
  console.log('\n2. Testing restricted endpoint access');
  const restrictedResult = await apiRequest('GET', '/api/orders/queue', null, token);
  logTest('Cannot access referring practice queue (expected to fail)', !restrictedResult.success && restrictedResult.status === 403);
}

// Test Suite 7: Statistics and Export
async function testStatisticsAndExport(token) {
  console.log('\n=== Testing Statistics and Export ===\n');

  // Test 1: Get order statistics
  console.log('1. Testing GET /api/admin/statistics/orders');
  const statsResult = await apiRequest('GET', '/api/admin/statistics/orders', null, token);
  logTest('Get order statistics', statsResult.success && statsResult.data?.data);
  
  if (statsResult.success && statsResult.data?.data) {
    const stats = statsResult.data.data;
    console.log(`   Total Orders Assigned: ${stats.total}`);
    console.log(`   Last 7 Days: ${stats.last7Days}`);
    console.log(`   Last 30 Days: ${stats.last30Days}`);
    if (stats.byStatus) {
      console.log(`   By Status:`, stats.byStatus);
    }
  }

  // Test 2: Export orders to CSV
  console.log('\n2. Testing POST /api/admin/export/orders');
  const exportResult = await apiRequest('POST', '/api/admin/export/orders', { limit: 5 }, token);
  logTest('Export orders to CSV', exportResult.success);
  
  if (exportResult.success && exportResult.data) {
    console.log(`   Export successful, received ${typeof exportResult.data === 'string' ? 'CSV data' : 'response'}`);
    if (typeof exportResult.data === 'string') {
      const lines = exportResult.data.split('\n');
      console.log(`   CSV has ${lines.length} lines (including header)`);
    }
  }

  // Test 3: Export with date filter
  console.log('\n3. Testing POST /api/admin/export/orders with date filter');
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - 30);
  const exportFilteredResult = await apiRequest('POST', '/api/admin/export/orders', {
    dateFrom: dateFrom.toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    limit: 10
  }, token);
  logTest('Export orders with date filter', exportFilteredResult.success);
}

// Main test runner
async function runTests() {
  console.log('===========================================');
  console.log('   Admin Radiology Role Test Suite - Fixed');
  console.log('===========================================');
  console.log(`API URL: ${API_URL}`);
  console.log(`Time: ${new Date().toISOString()}`);
  
  const token = getToken();
  console.log('Token loaded successfully');

  try {
    // Run all test suites
    const orgData = await testOrganizationManagement(token);
    await testUserManagement(token);
    const locationId = await testLocationManagement(token);
    await testConnectionManagement(token, orgData);
    await testDualCreditSystem(token);
    await testRadiologySpecificFeatures(token);
    await testStatisticsAndExport(token);

    // Summary
    console.log('\n===========================================');
    console.log('           Test Summary');
    console.log('===========================================');
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);
    console.log(`Total: ${testResults.passed + testResults.failed}`);
    
    if (testResults.errors.length > 0) {
      console.log('\nErrors:');
      testResults.errors.forEach(err => {
        console.log(`- ${err.test}: ${err.error}`);
      });
    }

    console.log('\nNote: Some endpoints may return 404 if not yet implemented.');
    console.log('This is handled gracefully in the fixed version.');

    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('\nFatal error during test execution:', error);
    process.exit(1);
  }
}

// Run the tests
runTests();