/**
 * SCRIPT PURPOSE:
 * Call each of the identified but undocumented API endpoints once
 * to verify their existence in production and capture request/response
 * details for API documentation.
 *
 * PREREQUISITES:
 * 1. Node.js installed.
 * 2. Run `npm install axios jsonwebtoken` in the script's directory.
 * 3. Set the JWT_SECRET environment variable matching your production secret.
 * 4. Update placeholder IDs (USER_ID_ADMIN_STAFF, PHYSICIAN_TOKEN_USER_ID, etc.)
 *    and other placeholder data with VALID values from your production environment.
 * 5. Ensure the API_URL is correct for your production deployment.
 *
 * HOW TO RUN:
 * node test-all-missing-endpoints.js
 *
 * INTERPRETING OUTPUT:
 * - Look for "✅ PASSED" or "❌ FAILED".
 * - For PASSED requests, examine the logged "Response Data" to document the success structure.
 * - For FAILED requests, examine the "Status" and "Data" to document potential errors
 *   (e.g., 400 Bad Request for missing body fields, 403 Forbidden for wrong role,
 *    404 Not Found if an ID is invalid, 500 for server errors).
 * - A 404 specifically means the METHOD+PATH combination wasn't found by the router.
 */

const axios = require('axios');

// --- Configuration ---
const API_URL = process.env.API_URL || 'https://api.radorderpad.com'; // Your production API base URL

// Test user credentials for all roles (from test-login-all-roles.js)
const TEST_USERS = [
  {
    role: 'admin_staff',
    email: 'test.admin_staff@example.com',
    password: 'password123'
  },
  {
    role: 'physician',
    email: 'test.physician@example.com',
    password: 'password123'
  },
  {
    role: 'admin_referring',
    email: 'test.admin_referring@example.com',
    password: 'password123'
  },
  {
    role: 'super_admin',
    email: 'test.superadmin@example.com',
    password: 'password123'
  },
  {
    role: 'admin_radiology',
    email: 'test.admin_radiology@example.com',
    password: 'password123'
  },
  {
    role: 'scheduler',
    email: 'test.scheduler@example.com',
    password: 'password123'
  },
  {
    role: 'radiologist',
    email: 'test.radiologist@example.com',
    password: 'password123'
  }
];

// Store tokens for each role
const tokens = {};
// --- Placeholder IDs (IMPORTANT: Replace with valid IDs from your PRODUCTION DB) ---
// Try multiple order IDs to find one in pending_admin status
const ORDER_IDS_TO_TRY = [607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620];
// Try multiple relationship IDs to find valid ones
const RELATIONSHIP_IDS_TO_TRY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const VALID_PATIENT_ID = 1; // Replace with a real patient ID associated with the above order
const VALID_LOCATION_ID = 1; // Replace with a real location ID for the user's org
const VALID_UPLOAD_FILE_KEY = 'uploads/org/context/id/example_file.png'; // Replace with a key from a successful presigned URL test

// --- Helper Functions ---

// Function to login and get a token for a specific role
async function getToken(role) {
  if (tokens[role]) {
    return tokens[role];
  }
  
  const user = TEST_USERS.find(u => u.role === role);
  if (!user) {
    console.error(`No user found for role: ${role}`);
    return null;
  }
  
  try {
    console.log(`\n🔍 Logging in as ${role} (${user.email})...`);
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: user.email,
      password: user.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.token) {
      console.log(`✅ Login successful for ${role}`);
      tokens[role] = response.data.token;
      return response.data.token;
    } else {
      console.log(`❌ Login failed for ${role}: No token in response`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Login failed for ${role}`);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
    return null;
  }
}

async function makeRequest(method, path, role, data = null) {
  const token = await getToken(role);
  if (!token) {
    console.log(`\n❌ Cannot test ${method.toUpperCase()} ${path} - No token for role ${role}`);
    return null;
  }
  
  const config = {
    method: method,
    url: `${API_URL}${path}`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: data,
    // Add timeout to prevent hanging indefinitely
    timeout: 30000, // 30 seconds
  };
  console.log(`\n🔍 Testing ${method.toUpperCase()} ${path} with ${role} role...`);
  try {
    const response = await axios(config);
    console.log(`✅ PASSED: ${method.toUpperCase()} ${path}`);
    console.log('Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log(`❌ FAILED: ${method.toUpperCase()} ${path}`);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('Error: No response received', error.message);
    } else {
      console.log('Error:', error.message);
    }
    return null;
  }
}

// --- Test Functions ---

async function testRegistrationEndpoints() {
  console.log('\n--- Testing Registration ---');
  // 1. POST /api/auth/register (Public - No token needed, but requires valid REGISTRATION_KEY)
  // NOTE: This requires the REGISTRATION_KEY env var to be set where this script runs
  // AND on the server. It will also create a *new* org/user each time.
  // Use with caution or mock the request if needed.
  console.log(`\n⚠️ SKIPPING: POST /api/auth/register (Requires valid REGISTRATION_KEY and creates data)`);
  /*
  await makeRequest('post', '/api/auth/register', null, {
      organization: {
          name: `Test Org ${Date.now()}`,
          type: 'referring_practice', // or 'radiology_group'
          contact_email: `test${Date.now()}@example.com`,
          registration_key: process.env.REGISTRATION_KEY || 'YOUR_VALID_REG_KEY' // Needs valid key
      },
      user: {
          email: `testadmin${Date.now()}@example.com`,
          password: 'Password123!',
          first_name: 'Test',
          last_name: 'Admin',
          role: 'admin_referring' // Should match org type
      }
  });
  */
}

async function testOrganizationLocationEndpoints() {
    console.log('\n--- Testing Organization Location Management ---');

    // 2. POST /api/organizations/mine/locations
    await makeRequest('post', '/api/organizations/mine/locations', 'admin_referring', {
        name: `Test Location ${Date.now()}`,
        address_line1: '123 Test St',
        city: 'Testville',
        state: 'TS',
        zip_code: '12345'
    });
}

async function testUserManagementEndpoints() {
    console.log('\n--- Testing User Management ---');

    // 3. POST /api/users/invite
    // NOTE: This will send an email if notifications are enabled.
    console.log(`\n⚠️ SKIPPING: POST /api/users/invite (Sends email, requires specific handling)`);
    /*
    await makeRequest('post', '/api/users/invite', 'admin_referring', {
        email: `inviteduser${Date.now()}@example.com`,
        role: 'physician' // Or other valid role within the org
    });
    */

    // 4. POST /api/users/accept-invitation (Public, but needs a valid token from the invite email)
    console.log(`\n⚠️ SKIPPING: POST /api/users/accept-invitation (Requires valid token from email)`);
    /*
    await makeRequest('post', '/api/users/accept-invitation', null, {
        token: 'VALID_INVITATION_TOKEN_FROM_EMAIL', // Replace with actual token
        password: 'NewPassword123!',
        first_name: 'Invited',
        last_name: 'User'
    });
    */
}

async function testUploadEndpoints() {
    console.log('\n--- Testing Uploads ---');

    // Use a default order ID for testing
    const testOrderId = ORDER_IDS_TO_TRY[0]; // Use the first order ID from the array
    
    console.log(`\n🔍 Using order ID ${testOrderId} for uploads testing`);

    // 5. POST /api/uploads/presigned-url
    const presignedData = await makeRequest('post', '/api/uploads/presigned-url', 'physician', {
        fileName: 'test-signature.png',
        fileType: 'image/png',        // Added this field based on error message
        contentType: 'image/png',
        documentType: 'signature',
        orderId: testOrderId, // Associate with an order
        patientId: VALID_PATIENT_ID
    });

    // 6. POST /api/uploads/confirm
    // NOTE: This assumes a file was *actually* uploaded to the URL from the step above.
    // This test will likely fail logically if no file exists at the fileKey location in S3,
    // but it verifies the endpoint exists and takes the correct payload.
    if (presignedData?.fileKey) {
        await makeRequest('post', '/api/uploads/confirm', 'physician', {
            fileKey: presignedData.fileKey, // Use the key from the previous step
            orderId: testOrderId,
            patientId: VALID_PATIENT_ID,
            documentType: 'signature',
            fileName: 'test-signature.png',
            fileSize: 10240, // Example size in bytes
            contentType: 'image/png'
        });
    } else {
         console.log(`\n⚠️ SKIPPING: POST /api/uploads/confirm (Requires valid fileKey from previous step)`);
    }
}

async function testAdminOrderEndpoints() {
    console.log('\n--- Testing Admin Order Management ---');

    // 7. GET /api/admin/orders/queue (Route Missing)
    console.log(`\n⚠️ KNOWN ISSUE: GET /api/admin/orders/queue (Route definition missing in code)`);
    await makeRequest('get', '/api/admin/orders/queue', 'admin_staff', {}); // Expected 404

    // Try multiple order IDs to find one in pending_admin status
    let foundWorkingOrder = false;
    let workingOrderId = null;

    for (const orderId of ORDER_IDS_TO_TRY) {
        console.log(`\n🔍 Trying order ID: ${orderId}`);
        
        // 8. POST /api/admin/orders/{orderId}/paste-summary
        const summaryResult = await makeRequest('post', `/api/admin/orders/${orderId}/paste-summary`, 'admin_staff', {
            pastedText: "EMR Summary: Patient John Doe, DOB 1980-01-01. Insurance: BCBS Policy: 123"
        });
        
        // If this worked, we found a valid order ID
        if (summaryResult) {
            console.log(`\n✅ Found working order ID: ${orderId}`);
            foundWorkingOrder = true;
            workingOrderId = orderId;
            break;
        }
    }

    // If we found a working order ID, test the other endpoints with it
    if (foundWorkingOrder && workingOrderId) {
        console.log(`\n🔍 Testing remaining endpoints with order ID: ${workingOrderId}`);
        
        // 9. POST /api/admin/orders/{orderId}/paste-supplemental
        await makeRequest('post', `/api/admin/orders/${workingOrderId}/paste-supplemental`, 'admin_staff', {
            pastedText: "Supplemental Info: Prior imaging report attached."
        });

        // 10. PUT /api/admin/orders/{orderId}/patient-info
        await makeRequest('put', `/api/admin/orders/${workingOrderId}/patient-info`, 'admin_staff', {
            // Include fields you want to update
            city: 'Updated City',
            phoneNumber: '555-555-1212'
        });

        // 11. PUT /api/admin/orders/{orderId}/insurance-info
        await makeRequest('put', `/api/admin/orders/${workingOrderId}/insurance-info`, 'admin_staff', {
            // Include fields you want to update/create
            insurerName: 'Updated Insurer',
            policyNumber: 'UPDATEDPOL123'
        });
    } else {
        console.log(`\n❌ No working order ID found in pending_admin status`);
    }
}

async function testConnectionEndpoints() {
    console.log('\n--- Testing Connection Management ---');

    // 12. GET /api/connections/requests
    await makeRequest('get', '/api/connections/requests', 'admin_radiology', {});

    // Try multiple relationship IDs for approve endpoint
    let foundWorkingApproveId = false;
    let workingApproveId = null;

    console.log('\n🔍 Testing POST /api/connections/{relationshipId}/approve with multiple IDs');
    for (const relationshipId of RELATIONSHIP_IDS_TO_TRY) {
        console.log(`\n🔍 Trying relationship ID: ${relationshipId} for approve`);
        
        // 13. POST /api/connections/{relationshipId}/approve
        const approveResult = await makeRequest('post', `/api/connections/${relationshipId}/approve`, 'admin_radiology', {});
        
        // If this worked, we found a valid relationship ID
        if (approveResult) {
            console.log(`\n✅ Found working relationship ID for approve: ${relationshipId}`);
            foundWorkingApproveId = true;
            workingApproveId = relationshipId;
            break;
        }
    }

    // Try multiple relationship IDs for reject endpoint
    let foundWorkingRejectId = false;
    let workingRejectId = null;

    console.log('\n🔍 Testing POST /api/connections/{relationshipId}/reject with multiple IDs');
    for (const relationshipId of RELATIONSHIP_IDS_TO_TRY) {
        // Skip the ID we already approved
        if (foundWorkingApproveId && relationshipId === workingApproveId) {
            console.log(`\n⚠️ Skipping relationship ID: ${relationshipId} for reject (already approved)`);
            continue;
        }
        
        console.log(`\n🔍 Trying relationship ID: ${relationshipId} for reject`);
        
        // 14. POST /api/connections/{relationshipId}/reject
        const rejectResult = await makeRequest('post', `/api/connections/${relationshipId}/reject`, 'admin_radiology', {});
        
        // If this worked, we found a valid relationship ID
        if (rejectResult) {
            console.log(`\n✅ Found working relationship ID for reject: ${relationshipId}`);
            foundWorkingRejectId = true;
            workingRejectId = relationshipId;
            break;
        }
    }

    // Try multiple relationship IDs for delete endpoint
    let foundWorkingDeleteId = false;

    console.log('\n🔍 Testing DELETE /api/connections/{relationshipId} with multiple IDs');
    for (const relationshipId of RELATIONSHIP_IDS_TO_TRY) {
        // Skip IDs we already used
        if ((foundWorkingApproveId && relationshipId === workingApproveId) ||
            (foundWorkingRejectId && relationshipId === workingRejectId)) {
            console.log(`\n⚠️ Skipping relationship ID: ${relationshipId} for delete (already used)`);
            continue;
        }
        
        console.log(`\n🔍 Trying relationship ID: ${relationshipId} for delete`);
        
        // 15. DELETE /api/connections/{relationshipId}
        const deleteResult = await makeRequest('delete', `/api/connections/${relationshipId}`, 'admin_radiology', {});
        
        // If this worked, we found a valid relationship ID
        if (deleteResult) {
            console.log(`\n✅ Found working relationship ID for delete: ${relationshipId}`);
            foundWorkingDeleteId = true;
            break;
        }
    }

    // Summary
    console.log('\n--- Connection Endpoints Testing Summary ---');
    console.log(`Approve Endpoint: ${foundWorkingApproveId ? 'Found working ID' : 'No working ID found'}`);
    console.log(`Reject Endpoint: ${foundWorkingRejectId ? 'Found working ID' : 'No working ID found'}`);
    console.log(`Delete Endpoint: ${foundWorkingDeleteId ? 'Found working ID' : 'No working ID found'}`);
}


// --- Main Execution ---
async function runAllTests() {
    console.log('\n--- Authenticating with all roles ---');
    // Pre-authenticate all roles to get tokens
    for (const user of TEST_USERS) {
        await getToken(user.role);
    }
    
    // await testRegistrationEndpoints(); // Usually skip in prod tests
    await testOrganizationLocationEndpoints();
    // await testUserManagementEndpoints(); // Usually skip invite/accept in simple tests
    await testUploadEndpoints();
    await testAdminOrderEndpoints();
    await testConnectionEndpoints();

    console.log('\n--- All Tests Called ---');
    console.log('Review output above for PASS/FAIL and details.');
}

console.log('=== SCRIPT TO HIT UNDOCUMENTED ENDPOINTS ===');
console.log(`Testing API at: ${API_URL}`);
console.log('NOTE: Using real credentials from test-login-all-roles.js');
console.log('============================================\n');

runAllTests().catch(error => {
    console.error('\n--- UNEXPECTED SCRIPT ERROR ---');
    console.error(error);
});