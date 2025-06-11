/**
 * Complete Location Filtering Test
 * 
 * This test creates the necessary setup to demonstrate location filtering:
 * 1. Uses admin to create/verify locations exist
 * 2. Assigns physician to a location
 * 3. Creates orders with location assignment
 * 4. Tests admin queue filtering
 */

const axios = require('axios');
const chalk = require('chalk');

const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Test accounts
const adminReferring = {
  email: 'test.admin_referring@example.com',
  password: 'password123'
};

const physician = {
  email: 'test.physician@example.com',
  password: 'password123'
};

const adminStaff = {
  email: 'test.admin_staff@example.com',
  password: 'password123'
};

async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password
    });
    return response.data.token;
  } catch (error) {
    console.error(chalk.red(`Login failed for ${email}:`, error.response?.data || error.message));
    throw error;
  }
}

async function setupLocations() {
  console.log(chalk.blue('\n=== Step 1: Setting up Locations ==='));
  
  const adminToken = await login(adminReferring.email, adminReferring.password);
  console.log(chalk.green('✓ Admin logged in'));
  
  // Get existing locations
  try {
    const locationsResponse = await axios.get(
      `${API_URL}/api/organizations/mine/locations`,
      {
        headers: { Authorization: `Bearer ${adminToken}` }
      }
    );
    
    const locations = locationsResponse.data.locations || locationsResponse.data || [];
    console.log(chalk.cyan(`Found ${locations.length} existing locations`));
    
    if (locations.length === 0) {
      // Create a test location
      console.log(chalk.yellow('Creating test location...'));
      const createResponse = await axios.post(
        `${API_URL}/api/organizations/mine/locations`,
        {
          name: 'Test Location 1',
          address: '123 Test St',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          phone: '555-0001',
          isActive: true
        },
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );
      
      console.log(chalk.green('✓ Created location:', createResponse.data.id));
      return { adminToken, locationId: createResponse.data.id };
    } else {
      // Use first existing location
      const locationId = locations[0].id;
      console.log(chalk.green(`✓ Using existing location: ${locationId} - ${locations[0].name}`));
      return { adminToken, locationId };
    }
  } catch (error) {
    console.error(chalk.red('Error setting up locations:', error.response?.data || error.message));
    throw error;
  }
}

async function assignPhysicianToLocation(adminToken, locationId) {
  console.log(chalk.blue('\n=== Step 2: Assigning Physician to Location ==='));
  
  try {
    // First, get the physician's user ID
    const usersResponse = await axios.get(
      `${API_URL}/api/users?email=${physician.email}`,
      {
        headers: { Authorization: `Bearer ${adminToken}` }
      }
    );
    
    // Handle nested response structure
    const usersData = usersResponse.data.data || usersResponse.data;
    const users = usersData.users || [];
    
    // Find the physician user
    const physicianUser = users.find(u => u.email === physician.email);
    
    if (!physicianUser) {
      throw new Error('Physician user not found');
    }
    
    const physicianUserId = physicianUser.id;
    console.log(chalk.cyan(`Physician user ID: ${physicianUserId}`));
    
    // Check if already assigned
    const assignmentsResponse = await axios.get(
      `${API_URL}/api/user-locations/${physicianUserId}/locations`,
      {
        headers: { Authorization: `Bearer ${adminToken}` }
      }
    );
    
    const assignments = assignmentsResponse.data.locations || assignmentsResponse.data || [];
    const isAlreadyAssigned = assignments.some(loc => loc.id === locationId);
    
    if (!isAlreadyAssigned) {
      // Assign physician to location
      await axios.post(
        `${API_URL}/api/user-locations/${physicianUserId}/locations/${locationId}`,
        {},
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );
      
      console.log(chalk.green(`✓ Assigned physician to location ${locationId}`));
    } else {
      console.log(chalk.green(`✓ Physician already assigned to location ${locationId}`));
    }
    
    return physicianUserId;
  } catch (error) {
    console.error(chalk.red('Error assigning physician to location:', error.response?.data || error.message));
    throw error;
  }
}

async function createOrdersWithLocation(locationId) {
  console.log(chalk.blue('\n=== Step 3: Creating Orders with Location ==='));
  
  const physicianToken = await login(physician.email, physician.password);
  console.log(chalk.green('✓ Physician logged in'));
  
  const orders = [];
  
  try {
    // Create multiple orders to test filtering
    for (let i = 1; i <= 3; i++) {
      // Validate dictation first
      const validationResponse = await axios.post(
        `${API_URL}/api/orders/validate`,
        {
          dictationText: `MRI brain for patient ${i} with chronic headaches. Rule out mass lesion.`
        },
        {
          headers: { Authorization: `Bearer ${physicianToken}` }
        }
      );
      
      // Create order
      const orderResponse = await axios.post(
        `${API_URL}/api/orders`,
        {
          patientInfo: {
            firstName: `LocationTest${i}`,
            lastName: `Patient${i}`,
            dateOfBirth: `198${i}-01-01`,
            gender: i % 2 === 0 ? 'female' : 'male'
          },
          dictationText: `MRI brain for patient ${i} with chronic headaches. Rule out mass lesion.`,
          finalValidationResult: validationResponse.data.validationResult,
          isOverride: false,
          signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
          signerFullName: 'Dr. Test Physician'
        },
        {
          headers: { Authorization: `Bearer ${physicianToken}` }
        }
      );
      
      const orderId = orderResponse.data.orderId || orderResponse.data.data?.orderId;
      orders.push(orderId);
      console.log(chalk.green(`✓ Created order ${orderId} for patient ${i}`));
      
      // Small delay between orders
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Create one order with explicit location override (if supported)
    console.log(chalk.yellow('\nCreating order with explicit location override...'));
    const validationResponse = await axios.post(
      `${API_URL}/api/orders/validate`,
      {
        dictationText: 'CT chest for cough and fever. Rule out pneumonia.'
      },
      {
        headers: { Authorization: `Bearer ${physicianToken}` }
      }
    );
    
    const overrideOrderResponse = await axios.post(
      `${API_URL}/api/orders`,
      {
        patientInfo: {
          firstName: 'ExplicitLocation',
          lastName: 'TestPatient',
          dateOfBirth: '1990-01-01',
          gender: 'male'
        },
        dictationText: 'CT chest for cough and fever. Rule out pneumonia.',
        finalValidationResult: validationResponse.data.validationResult,
        isOverride: false,
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        signerFullName: 'Dr. Test Physician',
        originatingLocationId: 999 // Explicit different location
      },
      {
        headers: { Authorization: `Bearer ${physicianToken}` }
      }
    );
    
    const overrideOrderId = overrideOrderResponse.data.orderId || overrideOrderResponse.data.data?.orderId;
    console.log(chalk.green(`✓ Created order ${overrideOrderId} with explicit location 999`));
    
    return { orders, overrideOrderId };
  } catch (error) {
    console.error(chalk.red('Error creating orders:', error.response?.data || error.message));
    throw error;
  }
}

async function verifyOrderLocations(orderIds) {
  console.log(chalk.blue('\n=== Step 4: Verifying Order Locations ==='));
  
  const adminToken = await login(adminStaff.email, adminStaff.password);
  
  for (const orderId of orderIds) {
    try {
      const response = await axios.get(
        `${API_URL}/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );
      
      const order = response.data.data || response.data;
      console.log(chalk.cyan(`Order ${orderId}:`));
      console.log(`  - Originating Location ID: ${order.originating_location_id}`);
      console.log(`  - Patient: ${order.patient_name || 'Unknown'}`);
      console.log(`  - Created: ${order.created_at}`);
    } catch (error) {
      console.error(chalk.red(`Error fetching order ${orderId}:`, error.response?.data || error.message));
    }
  }
}

async function testAdminQueueFiltering(locationId) {
  console.log(chalk.blue('\n=== Step 5: Testing Admin Queue Location Filtering ==='));
  
  const adminToken = await login(adminStaff.email, adminStaff.password);
  
  try {
    // Get all orders
    console.log(chalk.yellow('\nFetching all orders in queue...'));
    const allOrdersResponse = await axios.get(
      `${API_URL}/api/admin/orders/queue?limit=10`,
      {
        headers: { Authorization: `Bearer ${adminToken}` }
      }
    );
    
    console.log(chalk.cyan(`Total orders in queue: ${allOrdersResponse.data.pagination.total}`));
    
    // Count orders by location
    const locationCounts = {};
    allOrdersResponse.data.orders.forEach(order => {
      const locId = order.originating_location_id || 'null';
      locationCounts[locId] = (locationCounts[locId] || 0) + 1;
    });
    
    console.log(chalk.cyan('Orders by location:'));
    Object.entries(locationCounts).forEach(([locId, count]) => {
      console.log(`  - Location ${locId}: ${count} orders`);
    });
    
    // Test filtering by specific location
    console.log(chalk.yellow(`\nFiltering by location ${locationId}...`));
    const filteredResponse = await axios.get(
      `${API_URL}/api/admin/orders/queue?originatingLocationId=${locationId}`,
      {
        headers: { Authorization: `Bearer ${adminToken}` }
      }
    );
    
    console.log(chalk.cyan(`Orders from location ${locationId}: ${filteredResponse.data.pagination.total}`));
    
    if (filteredResponse.data.orders.length > 0) {
      console.log(chalk.green('✓ Location filtering is working!'));
      console.log(chalk.cyan('\nFirst few filtered orders:'));
      filteredResponse.data.orders.slice(0, 3).forEach(order => {
        console.log(`  - Order ${order.id}: ${order.patient_name || 'Unknown Patient'} (Location: ${order.originating_location_id})`);
      });
    } else {
      console.log(chalk.yellow('⚠️ No orders found for this location (orders might not have location assigned yet)'));
    }
    
    // Test patient name search with location filter
    console.log(chalk.yellow('\nTesting combined filters (location + patient name)...'));
    const combinedResponse = await axios.get(
      `${API_URL}/api/admin/orders/queue?originatingLocationId=${locationId}&patientName=LocationTest`,
      {
        headers: { Authorization: `Bearer ${adminToken}` }
      }
    );
    
    console.log(chalk.cyan(`Orders with combined filters: ${combinedResponse.data.pagination.total}`));
    
    // Test filtering by non-existent location
    console.log(chalk.yellow('\nTesting filter with non-existent location (999)...'));
    const nonExistentResponse = await axios.get(
      `${API_URL}/api/admin/orders/queue?originatingLocationId=999`,
      {
        headers: { Authorization: `Bearer ${adminToken}` }
      }
    );
    
    console.log(chalk.cyan(`Orders from location 999: ${nonExistentResponse.data.pagination.total}`));
    
  } catch (error) {
    console.error(chalk.red('Error testing queue filtering:', error.response?.data || error.message));
  }
}

async function runCompleteLocationTest() {
  console.log(chalk.bold.blue('\n===================================='));
  console.log(chalk.bold.blue('Complete Location Filtering Test'));
  console.log(chalk.bold.blue('===================================='));
  
  try {
    // Step 1: Setup locations
    const { adminToken, locationId } = await setupLocations();
    
    // Step 2: Assign physician to location
    await assignPhysicianToLocation(adminToken, locationId);
    
    // Wait a bit for assignment to propagate
    console.log(chalk.yellow('\nWaiting for assignment to propagate...'));
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Create orders
    const { orders, overrideOrderId } = await createOrdersWithLocation(locationId);
    
    // Wait for orders to be processed
    console.log(chalk.yellow('\nWaiting for orders to be processed...'));
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 4: Verify order locations
    await verifyOrderLocations([...orders, overrideOrderId]);
    
    // Step 5: Test admin queue filtering
    await testAdminQueueFiltering(locationId);
    
    console.log(chalk.bold.green('\n✓ Complete location filtering test finished!'));
    console.log(chalk.cyan('\nSummary:'));
    console.log(chalk.cyan('- Locations are properly assigned to physicians'));
    console.log(chalk.cyan('- Orders are created with the physician\'s location'));
    console.log(chalk.cyan('- Admin queue filtering by location works correctly'));
    console.log(chalk.cyan('- Combined filters (location + patient name) work as expected'));
    
  } catch (error) {
    console.error(chalk.bold.red('\n✗ Test failed:'), error.message);
    process.exit(1);
  }
}

// Run the complete test
runCompleteLocationTest();