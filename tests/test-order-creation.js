/**
 * Test script for order creation endpoint (PUT /api/orders/new)
 *
 * This script tests the new order creation endpoint that was implemented
 * as part of the stateless validation approach.
 */

const axios = require('axios');
const chalk = require('chalk');

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const ORDER_CREATION_ENDPOINT = `${API_URL}/api/orders/new`;

// Test physician credentials
const testPhysician = {
  email: 'test.physician@example.com',
  password: 'password123'
};

// Test the physician login endpoint to get a valid token
async function getAuthToken() {
  console.log(chalk.blue('Logging in to get authentication token...'));
  
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      {
        email: testPhysician.email,
        password: testPhysician.password
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    console.log(chalk.green('Login successful'));
    console.log('Token received:', !!response.data.token);
    
    return response.data.token;
  } catch (error) {
    console.log(chalk.red('Error logging in:'));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return null;
  }
}

// Test patient data - minimal version with only ID as recommended in working tests
const testPatient = {
  id: 1 // Only include patient ID, no PHI
};

// Sample validation result (simulating what would come from the validation endpoint)
const sampleValidationResult = {
  validationStatus: "appropriate",
  complianceScore: 8,
  feedback: "This order is appropriate for the clinical indication.",
  suggestedICD10Codes: [
    { code: "R51.9", description: "Headache, unspecified", isPrimary: true },
    { code: "G44.309", description: "Migraine, unspecified, not intractable", isPrimary: false }
  ],
  suggestedCPTCodes: [
    { code: "70551", description: "MRI brain without contrast", isPrimary: true }
  ]
};

// Sample dictation text
const sampleDictation = `
Patient with persistent headache for 3 weeks, worsening with movement. 
History of migraines. Request MRI brain to rule out structural abnormalities.
`;

// Test the order creation endpoint
async function testOrderCreation() {
  console.log(chalk.blue('Testing order creation endpoint...'));
  console.log(`API URL: ${API_URL}`);
  console.log(`Endpoint: ${ORDER_CREATION_ENDPOINT}`);
  
  try {
    // Get authentication token by logging in
    const token = await getAuthToken();
    if (!token) {
      console.log(chalk.red('Failed to get authentication token. Cannot proceed with test.'));
      return false;
    }
    console.log(chalk.green('Successfully obtained authentication token'));
    
    // Prepare request data - following the pattern from physician-role-tests.js
    const requestData = {
      dictationText: sampleDictation,
      patientInfo: testPatient, // Use minimal patient data with just ID
      status: 'pending_admin',
      finalValidationStatus: sampleValidationResult.validationStatus,
      finalCPTCode: sampleValidationResult.suggestedCPTCodes[0].code,
      clinicalIndication: sampleDictation,
      finalICD10Codes: sampleValidationResult.suggestedICD10Codes.map(code => code.code),
      referring_organization_name: 'Test Organization',
      validationResult: sampleValidationResult
    };
    
    console.log('Request payload:');
    console.log(JSON.stringify(requestData, null, 2));
    
    // Make the request
    console.log('Sending request to order creation endpoint...');
    const response = await axios.put(
      ORDER_CREATION_ENDPOINT,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    // Check the response
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 201 && response.data.success) {
      console.log(chalk.green('✅ Order creation successful!'));
      console.log('Order ID:', response.data.orderId);
      return true;
    } else {
      console.log(chalk.red('❌ Unexpected response'));
      return false;
    }
  } catch (error) {
    console.log('❌ Error creating order:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

// Run the test
(async () => {
  try {
    console.log(chalk.yellow('=== ORDER CREATION TEST ==='));
    const success = await testOrderCreation();
    console.log(chalk.yellow('=== TEST COMPLETED ==='));
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error(chalk.red('Unexpected error:'), error);
    process.exit(1);
  }
})();