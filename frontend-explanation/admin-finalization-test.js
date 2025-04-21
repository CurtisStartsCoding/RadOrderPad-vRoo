/**
 * Admin Finalization Test
 * 
 * This script tests the admin finalization workflow for orders created with PIDN:
 * 1. Login as Admin Staff
 * 2. Call /paste-summary to add EMR summary information
 * 3. Call /paste-supplemental to add supplemental clinical information
 * 4. Call /send-to-radiology to finalize the order and send it to the radiology group
 * 5. Verify the order status is now 'pending_radiology'
 */

// Base URL for API requests
const API_BASE_URL = 'https://radorderpad-fftrehu55-capecomas-projects.vercel.app/api';

// Test credentials
const TEST_CREDENTIALS = {
  physician: {
    email: 'test.physician@example.com',
    password: 'password123'
  },
  admin_staff: {
    email: 'test.admin_staff@example.com',
    password: 'password123'
  }
};

// Order IDs to process (from our PIDN validation test)
const ORDER_IDS = [606, 607];

// Test data
const testData = {
  summaryText: `PATIENT: Johnson, Robert
MRN: MRN12345A
PIDN: P12345
DOB: 05/15/1950
ADDRESS: 123 Main Street
CITY: Springfield
STATE: IL
ZIP: 62704
PHONE: (555) 123-4567
EMAIL: robert.johnson@example.com
REFERRING PHYSICIAN: Smith, Jane
CLINICAL INDICATION: Lower back pain radiating to left leg, history of degenerative disc disease
EXAM REQUESTED: MRI Lumbar Spine without contrast
INSURANCE: Medicare
POLICY #: 123456789A
GROUP #: MCARE2023`,
  
  supplementalText: `Patient reports pain level of 7/10, worse with movement. 
Previous conservative treatment with NSAIDs and physical therapy for 2 weeks with minimal improvement.
No bowel or bladder symptoms.
No recent trauma.`
};

/**
 * Main function to test admin finalization
 */
async function testAdminFinalization() {
  console.log('=== ADMIN FINALIZATION TEST ===');
  console.log(`API URL: ${API_BASE_URL}`);
  console.log('==============================\n');

  try {
    // Step 1: First try to login as Physician to get information about admin users
    console.log('Step 1: Logging in as Physician to get admin information...');
    const physicianToken = await login(TEST_CREDENTIALS.physician.email, TEST_CREDENTIALS.physician.password);
    console.log(`✅ Physician login successful!\n`);
    
    // Step 2: Try to get information about admin users
    console.log('Step 2: Attempting to get admin user information...');
    try {
      const usersInfo = await getUsersInfo(physicianToken);
      if (usersInfo.success && usersInfo.users) {
        const adminUsers = usersInfo.users.filter(user => user.role === 'admin');
        if (adminUsers.length > 0) {
          console.log(`Found ${adminUsers.length} admin users:`);
          adminUsers.forEach(admin => {
            console.log(`- ${admin.email} (${admin.firstName} ${admin.lastName})`);
          });
          // Update admin credentials with the first admin user found
          TEST_CREDENTIALS.admin.email = adminUsers[0].email;
          console.log(`\nUpdating admin email to: ${TEST_CREDENTIALS.admin.email}\n`);
        } else {
          console.log('No admin users found.');
        }
      } else {
        console.log('Could not retrieve user information.');
      }
    } catch (error) {
      console.log(`Could not retrieve user information: ${error.message}`);
    }
    
    // Step 3: Login as Admin Staff
    console.log('Step 3: Logging in as Admin Staff...');
    const adminToken = await login(TEST_CREDENTIALS.admin_staff.email, TEST_CREDENTIALS.admin_staff.password);
    console.log(`✅ Admin Staff login successful!\n`);

    // Process each order
    for (const orderId of ORDER_IDS) {
      console.log(`\n--- Processing Order #${orderId} ---`);
      
      // Step 2: Verify Initial Order State
      console.log('Step 2: Verifying Initial Order State...');
      const initialOrderDetails = await getOrderDetails(adminToken, orderId);
      
      if (initialOrderDetails.success) {
        console.log(`✅ Order #${orderId} found`);
        console.log(`Initial Status: ${initialOrderDetails.order.status}`);
        
        // Verify order is in pending_admin status
        if (initialOrderDetails.order.status !== 'pending_admin') {
          console.log(`❌ Order is not in pending_admin status. Current status: ${initialOrderDetails.order.status}`);
          console.log('Skipping this order...\n');
          continue;
        }
        
        console.log('✅ Initial order state verified: pending_admin\n');
        
        // Step 3: Paste Summary
        console.log('Step 3: Pasting EMR Summary...');
        const pasteSummaryResponse = await pasteSummary(adminToken, orderId, testData.summaryText);
        
        if (pasteSummaryResponse.success) {
          console.log('✅ Summary pasted successfully\n');
          
          // Step 4: Paste Supplemental Information
          console.log('Step 4: Pasting Supplemental Information...');
          const pasteSupplementalResponse = await pasteSupplemental(adminToken, orderId, testData.supplementalText);
          
          if (pasteSupplementalResponse.success) {
            console.log('✅ Supplemental information pasted successfully\n');
            
            // Step 5: Send to Radiology
            console.log('Step 5: Sending to Radiology...');
            const sendToRadiologyResponse = await sendToRadiology(adminToken, orderId);
            
            if (sendToRadiologyResponse.success) {
              console.log('✅ Order sent to radiology successfully');
              console.log(`Final Status: ${sendToRadiologyResponse.status || 'pending_radiology'}\n`);
              
              // Step 6: Verify Final Order State
              console.log('Step 6: Verifying Final Order State...');
              const finalOrderDetails = await getOrderDetails(adminToken, orderId);
              
              if (finalOrderDetails.success) {
                console.log(`Final Status: ${finalOrderDetails.order.status}`);
                
                if (finalOrderDetails.order.status === 'pending_radiology') {
                  console.log('✅ Order verification completed successfully');
                } else {
                  console.log(`❌ Unexpected order status: ${finalOrderDetails.order.status}`);
                }
              } else {
                console.log(`❌ Failed to retrieve final order details: ${finalOrderDetails.error}`);
              }
            } else {
              console.log(`❌ Failed to send order to radiology: ${sendToRadiologyResponse.error}`);
              if (sendToRadiologyResponse.status) {
                console.log(`Status Code: ${sendToRadiologyResponse.status}`);
              }
              if (sendToRadiologyResponse.details) {
                console.log(`Details: ${JSON.stringify(sendToRadiologyResponse.details, null, 2)}`);
              }
            }
          } else {
            console.log(`❌ Failed to paste supplemental information: ${pasteSupplementalResponse.error}`);
            if (pasteSupplementalResponse.status) {
              console.log(`Status Code: ${pasteSupplementalResponse.status}`);
            }
            if (pasteSupplementalResponse.details) {
              console.log(`Details: ${JSON.stringify(pasteSupplementalResponse.details, null, 2)}`);
            }
          }
        } else {
          console.log(`❌ Failed to paste summary: ${pasteSummaryResponse.error}`);
          if (pasteSummaryResponse.status) {
            console.log(`Status Code: ${pasteSummaryResponse.status}`);
          }
          if (pasteSummaryResponse.details) {
            console.log(`Details: ${JSON.stringify(pasteSummaryResponse.details, null, 2)}`);
          }
        }
      } else {
        console.log(`❌ Failed to retrieve Order #${orderId}`);
        console.log(`Error: ${initialOrderDetails.error}`);
        if (initialOrderDetails.status) {
          console.log(`Status Code: ${initialOrderDetails.status}`);
        }
        if (initialOrderDetails.details) {
          console.log(`Details: ${JSON.stringify(initialOrderDetails.details, null, 2)}`);
        }
      }
    }

    console.log('\n=== ADMIN FINALIZATION TEST COMPLETE ===');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

/**
 * Login to the API
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<string>} - Authentication token
 */
async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Login failed: ${errorData.message || response.statusText}`);
  }

  const data = await response.json();
  return data.token;
}

/**
 * Get order details
 * @param {string} token - Authentication token
 * @param {number} orderId - Order ID to check
 * @returns {Promise<Object>} - Order details
 */
async function getOrderDetails(token, orderId) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      return {
        success: false,
        error: errorData.message || response.statusText,
        status: response.status,
        details: errorData
      };
    }

    const data = await response.json();
    return {
      success: true,
      order: data.order || data // Handle different response formats
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Paste EMR summary
 * @param {string} token - Authentication token
 * @param {number} orderId - Order ID
 * @param {string} summaryText - EMR summary text
 * @returns {Promise<Object>} - Response
 */
async function pasteSummary(token, orderId, summaryText) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/paste-summary`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pastedText: summaryText
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      return {
        success: false,
        error: errorData.message || response.statusText,
        status: response.status,
        details: errorData
      };
    }

    const data = await response.json();
    return {
      success: true,
      ...data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Paste supplemental information
 * @param {string} token - Authentication token
 * @param {number} orderId - Order ID
 * @param {string} supplementalText - Supplemental text
 * @returns {Promise<Object>} - Response
 */
async function pasteSupplemental(token, orderId, supplementalText) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/paste-supplemental`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pastedText: supplementalText
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      return {
        success: false,
        error: errorData.message || response.statusText,
        status: response.status,
        details: errorData
      };
    }

    const data = await response.json();
    return {
      success: true,
      ...data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send order to radiology
 * @param {string} token - Authentication token
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} - Response
 */
async function sendToRadiology(token, orderId) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/send-to-radiology-fixed`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      return {
        success: false,
        error: errorData.message || response.statusText,
        status: response.status,
        details: errorData
      };
    }

    const data = await response.json();
    return {
      success: true,
      ...data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get users information
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Users information
 */
async function getUsersInfo(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      return {
        success: false,
        error: errorData.message || response.statusText,
        status: response.status,
        details: errorData
      };
    }

    const data = await response.json();
    return {
      success: true,
      users: data.users || []
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Execute the test if this script is run directly
if (typeof window === 'undefined') {
  // Node.js environment
  testAdminFinalization().catch(console.error);
} else {
  // Browser environment
  console.log('To run this test, call testAdminFinalization() from your browser console');
}

// Export functions for use in other scripts
if (typeof module !== 'undefined') {
  module.exports = {
    testAdminFinalization,
    getOrderDetails,
    pasteSummary,
    pasteSupplemental,
    sendToRadiology,
    getUsersInfo
  };
}