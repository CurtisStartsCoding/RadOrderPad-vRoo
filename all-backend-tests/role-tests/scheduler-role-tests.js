/**
 * Comprehensive Test Suite for Scheduler Role
 * 
 * This script tests all endpoints available to the scheduler role:
 * 1. Authentication
 * 2. View incoming orders queue
 * 3. Get order details
 * 4. Request additional information
 * 5. Update order status
 * 6. Export order data
 * 
 * Date: June 11, 2025
 */

const axios = require('axios');
const chalk = require('chalk');

// Base URL for API requests
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Test data
const testScheduler = {
  email: process.env.SCHEDULER_EMAIL || 'test.scheduler@example.com',
  password: process.env.SCHEDULER_PASSWORD || 'password123',
  firstName: 'Test',
  lastName: 'Scheduler'
};

console.log('Using scheduler email:', testScheduler.email);

// Test the scheduler login endpoint
async function testSchedulerLogin() {
  console.log(chalk.blue('Testing scheduler login endpoint...'));
  
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      {
        email: testScheduler.email,
        password: testScheduler.password
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    console.log(chalk.green('Scheduler logged in successfully'));
    console.log('Response status:', response.status);
    console.log('Token received:', !!response.data.token);
    console.log('User role:', response.data.user?.role);
    
    return response.data.token;
  } catch (error) {
    console.log(chalk.red('Error logging in scheduler:'));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return null;
  }
}

// Test getting incoming orders queue
async function testGetIncomingOrders(token) {
  console.log(chalk.blue('Testing incoming orders queue retrieval...'));
  
  try {
    const response = await axios.get(
      `${API_URL}/api/radiology/orders`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log(chalk.green('Incoming orders retrieved successfully'));
    console.log('Response status:', response.status);
    console.log('Number of orders:', response.data.orders ? response.data.orders.length : 0);
    
    if (response.data.orders && response.data.orders.length > 0) {
      console.log('First order:');
      const order = response.data.orders[0];
      console.log('- Order ID:', order.id);
      console.log('- Order Number:', order.orderNumber);
      console.log('- Status:', order.status);
      console.log('- Priority:', order.priority);
      console.log('- Modality:', order.modality);
      console.log('- Referring Org:', order.referringOrganization?.name);
      
      return order.id;
    } else {
      console.log('No orders found in the queue');
      return null;
    }
  } catch (error) {
    console.log(chalk.red('Error retrieving incoming orders:'));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return null;
  }
}

// Test getting incoming orders with filters
async function testGetIncomingOrdersWithFilters(token) {
  console.log(chalk.blue('Testing incoming orders queue with filters...'));
  
  try {
    const response = await axios.get(
      `${API_URL}/api/radiology/orders`,
      {
        params: {
          priority: 'routine',
          modality: 'CT',
          limit: 5,
          sortBy: 'created_at',
          sortOrder: 'desc'
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log(chalk.green('Filtered orders retrieved successfully'));
    console.log('Response status:', response.status);
    console.log('Number of orders:', response.data.orders ? response.data.orders.length : 0);
    console.log('Pagination:', JSON.stringify(response.data.pagination));
    
    return true;
  } catch (error) {
    console.log(chalk.red('Error retrieving filtered orders:'));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

// Test getting order details
async function testGetOrderDetails(token, orderId) {
  console.log(chalk.blue(`Testing order details retrieval for order ${orderId}...`));
  
  try {
    const response = await axios.get(
      `${API_URL}/api/radiology/orders/${orderId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log(chalk.green('Order details retrieved successfully'));
    console.log('Response status:', response.status);
    
    const order = response.data.order;
    console.log('Order Details:');
    console.log('- Order Number:', order.orderNumber);
    console.log('- Status:', order.status);
    console.log('- Patient:', order.patient ? `${order.patient.firstName} ${order.patient.lastName}` : 'N/A');
    console.log('- Has Insurance:', !!order.insurance);
    console.log('- Clinical Indication:', order.clinicalIndication);
    console.log('- CPT Code:', order.cptCode, '-', order.cptCodeDescription);
    console.log('- Documents:', order.documents ? order.documents.length : 0);
    
    return true;
  } catch (error) {
    console.log(chalk.red('Error retrieving order details:'));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

// Test requesting additional information
async function testRequestInformation(token, orderId) {
  console.log(chalk.blue(`Testing request information for order ${orderId}...`));
  
  try {
    const response = await axios.post(
      `${API_URL}/api/radiology/orders/${orderId}/request-info`,
      {
        requestedInfoType: 'labs',
        requestedInfoDetails: 'Please provide recent CBC and BMP results. Need creatinine level for contrast administration.'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log(chalk.green('Information request sent successfully'));
    console.log('Response status:', response.status);
    console.log('Success:', response.data.success);
    console.log('Info Request ID:', response.data.infoRequestId);
    
    return true;
  } catch (error) {
    console.log(chalk.red('Error requesting information:'));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

// Test updating order status
async function testUpdateOrderStatus(token, orderId) {
  console.log(chalk.blue(`Testing update order status for order ${orderId}...`));
  
  try {
    const response = await axios.post(
      `${API_URL}/api/radiology/orders/${orderId}/update-status`,
      {
        newStatus: 'scheduled',
        notes: 'Scheduled for June 15, 2025 at 2:00 PM'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log(chalk.green('Order status updated successfully'));
    console.log('Response status:', response.status);
    console.log('Success:', response.data.success);
    console.log('Previous Status:', response.data.previousStatus);
    console.log('New Status:', response.data.newStatus);
    
    return true;
  } catch (error) {
    console.log(chalk.red('Error updating order status:'));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

// Test exporting order data
async function testExportOrder(token, orderId, format) {
  console.log(chalk.blue(`Testing export order ${orderId} in ${format} format...`));
  
  try {
    const response = await axios.get(
      `${API_URL}/api/radiology/orders/${orderId}/export/${format}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log(chalk.green(`Order exported in ${format} format successfully`));
    console.log('Response status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);
    
    if (format === 'json') {
      console.log('Exported data sample:', JSON.stringify(response.data).substring(0, 200) + '...');
    } else {
      console.log('Data length:', response.data.length, 'characters');
    }
    
    return true;
  } catch (error) {
    console.log(chalk.red(`Error exporting order in ${format} format:`));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

// Test profile management
async function testProfileManagement(token) {
  console.log(chalk.blue('Testing profile management...'));
  
  try {
    // Get profile
    console.log('Getting user profile...');
    const getResponse = await axios.get(
      `${API_URL}/api/users/me`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log(chalk.green('User profile retrieved successfully'));
    console.log('Response status:', getResponse.status);
    console.log('User Email:', getResponse.data.user?.email);
    console.log('User Role:', getResponse.data.user?.role);
    console.log('Organization ID:', getResponse.data.user?.organization_id);
    
    // Update profile
    console.log('\nUpdating user profile...');
    const updateResponse = await axios.put(
      `${API_URL}/api/users/me`,
      {
        firstName: 'Updated',
        lastName: 'Scheduler',
        phoneNumber: '(555) 123-4567'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log(chalk.green('User profile updated successfully'));
    console.log('Response status:', updateResponse.status);
    
    return true;
  } catch (error) {
    console.log(chalk.red('Error in profile management:'));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

// Test unauthorized access (should fail)
async function testUnauthorizedAccess(token) {
  console.log(chalk.blue('Testing unauthorized access to admin endpoints...'));
  
  try {
    // Try to access admin staff queue (should fail)
    const response = await axios.get(
      `${API_URL}/api/admin/orders/queue`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log(chalk.red('ERROR: Scheduler was able to access admin queue (should have been denied)'));
    return false;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log(chalk.green('Correctly denied access to admin queue'));
      console.log('Status:', error.response.status);
      console.log('Message:', error.response.data.message);
      return true;
    } else {
      console.log(chalk.red('Unexpected error:'));
      console.log('Error:', error.message);
      return false;
    }
  }
}

// Main function to run all tests
async function runAllTests() {
  console.log(chalk.bold('=== Scheduler Role Test Suite ==='));
  console.log(`API URL: ${API_URL}`);
  console.log(`Test Date: June 11, 2025`);
  console.log(chalk.bold('================================\n'));
  
  try {
    // Step 1: Login
    const token = await testSchedulerLogin();
    if (!token) {
      console.log(chalk.red('Login failed. Cannot proceed with tests.'));
      return;
    }
    
    // Step 2: Get incoming orders
    const orderId = await testGetIncomingOrders(token);
    
    // Step 3: Test filtered orders
    console.log(chalk.bold('\n=== Testing Filtered Orders ==='));
    await testGetIncomingOrdersWithFilters(token);
    
    if (orderId) {
      // Step 4: Get order details
      console.log(chalk.bold('\n=== Testing Order Details ==='));
      await testGetOrderDetails(token, orderId);
      
      // Step 5: Request information
      console.log(chalk.bold('\n=== Testing Information Request ==='));
      await testRequestInformation(token, orderId);
      
      // Step 6: Update order status
      console.log(chalk.bold('\n=== Testing Status Update ==='));
      await testUpdateOrderStatus(token, orderId);
      
      // Step 7: Export order data
      console.log(chalk.bold('\n=== Testing Order Export ==='));
      await testExportOrder(token, orderId, 'json');
      await testExportOrder(token, orderId, 'csv');
      await testExportOrder(token, orderId, 'hl7');
    } else {
      console.log(chalk.yellow('\nNo orders available for detailed testing'));
      console.log('Note: In production, orders would be sent from referring organizations');
    }
    
    // Step 8: Profile management
    console.log(chalk.bold('\n=== Testing Profile Management ==='));
    await testProfileManagement(token);
    
    // Step 9: Test unauthorized access
    console.log(chalk.bold('\n=== Testing Access Control ==='));
    await testUnauthorizedAccess(token);
    
    console.log(chalk.bold('\n=== Scheduler Role Test Suite Complete ==='));
  } catch (error) {
    console.error(chalk.red('Unexpected error during test execution:'));
    console.error(error);
  }
}

// Run all tests
runAllTests();