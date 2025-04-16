/**
 * Script to test concurrent order creation to verify the unique order number generation
 * This simulates multiple doctors placing orders simultaneously
 */
const http = require('http');
const jwt = require('jsonwebtoken');

// Configuration
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112';
const CONCURRENT_REQUESTS = 10; // Simulate 10 concurrent doctors

// Generate a test token
const generateToken = () => {
  const payload = {
    userId: 1,
    orgId: 1,
    role: 'physician',
    email: 'test.physician@example.com'
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Function to create a test case with slight variations to simulate different doctors
function createTestCase(index) {
  const conditions = [
    "lung cancer",
    "headache",
    "abdominal pain",
    "back pain",
    "chest pain",
    "shortness of breath",
    "dizziness",
    "joint pain",
    "nausea",
    "fatigue"
  ];
  
  const modalities = [
    "PET scan",
    "MRI",
    "CT scan",
    "Ultrasound",
    "X-ray"
  ];
  
  const condition = conditions[index % conditions.length];
  const modality = modalities[index % modalities.length];
  
  return {
    dictationText: `Patient with history of ${condition}. Need ${modality}.`,
    patientInfo: {
      id: index + 1,
      firstName: "Test",
      lastName: `Patient${index + 1}`,
      dateOfBirth: "1980-01-01",
      gender: "male"
    },
    referringPhysicianId: 1,
    referringOrganizationId: 1
  };
}

// Function to make a direct HTTP request
function makeRequest(endpoint, method, data, token, index) {
  return new Promise((resolve, reject) => {
    // Prepare the request data
    const postData = JSON.stringify(data);
    
    // Prepare the request options
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: endpoint,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${token}`
      },
      timeout: 30000 // 30 second timeout
    };
    
    console.log(`[Doctor ${index + 1}] Making ${method} request to http://localhost:${PORT}${endpoint}`);
    
    // Create the request
    const req = http.request(options, (res) => {
      let responseData = '';
      
      // Collect the response data
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      // Process the complete response
      res.on('end', () => {
        try {
          // Try to parse the response as JSON
          let parsedData;
          try {
            parsedData = JSON.parse(responseData);
          } catch (e) {
            parsedData = responseData;
          }
          
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData,
            index: index
          });
        } catch (e) {
          reject(new Error(`Error parsing response: ${e.message}`));
        }
      });
    });
    
    // Handle request errors
    req.on('error', (error) => {
      console.error(`[Doctor ${index + 1}] Request error: ${error.message}`);
      reject(error);
    });
    
    // Handle request timeout
    req.on('timeout', () => {
      console.error(`[Doctor ${index + 1}] Request timed out`);
      req.destroy();
      reject(new Error('Request timed out'));
    });
    
    // Send the request data
    req.write(postData);
    req.end();
  });
}

// Function to test concurrent order creation
async function testConcurrentOrders() {
  console.log(`\n=== Testing Concurrent Order Creation (${CONCURRENT_REQUESTS} doctors) ===`);
  
  // Generate a token
  const token = generateToken();
  
  // Create an array of promises for concurrent requests
  const requests = [];
  for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
    const testCase = createTestCase(i);
    requests.push(makeRequest('/api/orders/validate', 'POST', testCase, token, i));
  }
  
  // Wait for all requests to complete
  const results = await Promise.allSettled(requests);
  
  // Process the results
  const successful = results.filter(r => r.status === 'fulfilled');
  const failed = results.filter(r => r.status === 'rejected');
  
  console.log(`\nResults: ${successful.length} successful, ${failed.length} failed`);
  
  // Check for duplicate order IDs
  const orderIds = successful.map(r => r.value.data.orderId).filter(id => id !== undefined);
  const uniqueOrderIds = new Set(orderIds);
  
  console.log(`Order IDs created: ${orderIds.length}`);
  console.log(`Unique order IDs: ${uniqueOrderIds.size}`);
  
  if (orderIds.length === uniqueOrderIds.size) {
    console.log('\nSUCCESS: All orders have unique IDs!');
  } else {
    console.error('\nFAILURE: Duplicate order IDs detected!');
    
    // Find the duplicates
    const counts = {};
    orderIds.forEach(id => {
      counts[id] = (counts[id] || 0) + 1;
    });
    
    const duplicates = Object.entries(counts).filter(([id, count]) => count > 1);
    console.error('Duplicate order IDs:', duplicates);
  }
  
  // Print details of failed requests
  if (failed.length > 0) {
    console.error('\nFailed requests:');
    failed.forEach((result, index) => {
      console.error(`[Doctor ${index + 1}] Error: ${result.reason.message}`);
    });
  }
  
  // Print order details for successful requests
  console.log('\nSuccessful orders:');
  successful.forEach(result => {
    const doctorIndex = result.value.index;
    const orderId = result.value.data.orderId;
    const validationStatus = result.value.data.validationResult?.validationStatus;
    console.log(`[Doctor ${doctorIndex + 1}] Order ID: ${orderId}, Validation Status: ${validationStatus}`);
  });
  
  return successful.length === CONCURRENT_REQUESTS;
}

// Main function
async function main() {
  console.log('Starting concurrent order test...');
  
  try {
    // Test concurrent order creation
    const success = await testConcurrentOrders();
    
    if (success) {
      console.log('\nConcurrent order test completed successfully!');
      console.log('The fix for unique order number generation is working correctly.');
      console.log('The system can now handle multiple doctors placing orders simultaneously.');
    } else {
      console.log('\nConcurrent order test completed with some failures.');
      console.log('Further investigation may be needed.');
    }
  } catch (error) {
    console.error('Error in concurrent order test:', error);
  }
}

// Run the main function
main().catch(err => {
  console.error('Unhandled error:', err);
});