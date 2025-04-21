/**
 * Check Order Status Script
 * 
 * This script checks the status of specific orders in the database
 * to confirm whether they are in the pending_admin or pending_radiology queue.
 */

// Base URL for API requests
const API_BASE_URL = 'https://radorderpad-8zi108wpf-capecomas-projects.vercel.app/api';

// Test credentials
const TEST_CREDENTIALS = {
  email: 'test.physician@example.com',
  password: 'password123'
};

// Order IDs to check (from our test)
const ORDER_IDS = [606, 607];

/**
 * Main function to check order status
 */
async function checkOrderStatus() {
  console.log('=== CHECKING ORDER STATUS ===');
  console.log(`API URL: ${API_BASE_URL}`);
  console.log('============================\n');

  try {
    // Step 1: Login
    console.log('Step 1: Logging in...');
    const authToken = await login(TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
    console.log(`✅ Login successful!\n`);

    // Step 2: Check each order
    for (const orderId of ORDER_IDS) {
      console.log(`Checking status for Order #${orderId}...`);
      const orderDetails = await getOrderDetails(authToken, orderId);
      
      if (orderDetails.success) {
        console.log(`✅ Order #${orderId} found`);
        console.log(`Status: ${orderDetails.order.status}`);
        console.log(`Created: ${new Date(orderDetails.order.created_at).toLocaleString()}`);
        console.log(`Updated: ${new Date(orderDetails.order.updated_at).toLocaleString()}`);
        
        // Determine which queue the order is in
        let queueStatus = '';
        switch (orderDetails.order.status) {
          case 'pending_validation':
            queueStatus = 'Physician Validation Queue';
            break;
          case 'pending_admin':
            queueStatus = 'Admin Staff Queue';
            break;
          case 'pending_radiology':
            queueStatus = 'Radiology Queue';
            break;
          case 'scheduled':
            queueStatus = 'Scheduled for Imaging';
            break;
          case 'completed':
            queueStatus = 'Completed';
            break;
          default:
            queueStatus = `Unknown Queue (${orderDetails.order.status})`;
        }
        
        console.log(`Queue: ${queueStatus}`);
        console.log(`Patient PIDN: ${orderDetails.order.patient_pidn || 'Not specified'}`);
        console.log('');
      } else {
        console.log(`❌ Failed to retrieve Order #${orderId}`);
        console.log(`Error: ${orderDetails.error}`);
        if (orderDetails.status) {
          console.log(`Status Code: ${orderDetails.status}`);
        }
        console.log('');
      }
    }

    console.log('=== ORDER STATUS CHECK COMPLETE ===');

  } catch (error) {
    console.error('❌ Check failed with error:', error);
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

// Execute the check if this script is run directly
if (typeof window === 'undefined') {
  // Node.js environment
  checkOrderStatus().catch(console.error);
} else {
  // Browser environment
  console.log('To run this check, call checkOrderStatus() from your browser console');
}

// Export functions for use in other scripts
if (typeof module !== 'undefined') {
  module.exports = {
    checkOrderStatus,
    getOrderDetails
  };
}