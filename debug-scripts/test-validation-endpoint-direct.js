/**
 * Script to test the validation endpoint directly with minimal dependencies
 */
const http = require('http');
const jwt = require('jsonwebtoken');

// Configuration
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112';

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

// Test case with minimal information
const TEST_CASE = {
  dictationText: "Patient with history of lung cancer. Need PET scan.",
  patientInfo: {
    id: 1,
    firstName: "Test",
    lastName: "Patient",
    dateOfBirth: "1980-01-01",
    gender: "male"
  },
  referringPhysicianId: 1,
  referringOrganizationId: 1
};

// Function to make a direct HTTP request
function makeRequest(endpoint, method, data, token) {
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
    
    console.log(`Making ${method} request to http://localhost:${PORT}${endpoint}`);
    console.log('Request payload:', postData);
    
    // Create the request
    const req = http.request(options, (res) => {
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Status Message: ${res.statusMessage}`);
      console.log('Response Headers:', res.headers);
      
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
            data: parsedData
          });
        } catch (e) {
          reject(new Error(`Error parsing response: ${e.message}`));
        }
      });
    });
    
    // Handle request errors
    req.on('error', (error) => {
      console.error(`Request error: ${error.message}`);
      reject(error);
    });
    
    // Handle request timeout
    req.on('timeout', () => {
      console.error('Request timed out');
      req.destroy();
      reject(new Error('Request timed out'));
    });
    
    // Send the request data
    req.write(postData);
    req.end();
  });
}

// Function to test the health endpoint
async function testHealthEndpoint() {
  try {
    console.log('\n=== Testing Health Endpoint ===');
    const response = await makeRequest('/api/health', 'GET', {}, '');
    console.log('Health endpoint response:', response.data);
    return true;
  } catch (error) {
    console.error('Error testing health endpoint:', error.message);
    return false;
  }
}

// Function to test the validation endpoint
async function testValidationEndpoint() {
  try {
    console.log('\n=== Testing Validation Endpoint ===');
    const token = generateToken();
    console.log('Generated token:', token);
    
    const response = await makeRequest('/api/orders/validate', 'POST', TEST_CASE, token);
    
    console.log('\nValidation endpoint response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error testing validation endpoint:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting validation endpoint test...');
  
  // First test the health endpoint to see if the server is responsive
  const healthOk = await testHealthEndpoint();
  
  if (healthOk) {
    console.log('Health endpoint is responsive, proceeding to test validation endpoint...');
  } else {
    console.log('Health endpoint is not responsive, but will try validation endpoint anyway...');
  }
  
  // Test the validation endpoint
  const validationOk = await testValidationEndpoint();
  
  if (validationOk) {
    console.log('\nValidation endpoint test completed successfully.');
  } else {
    console.log('\nValidation endpoint test failed.');
  }
}

// Run the main function
main().catch(err => {
  console.error('Unhandled error:', err);
});