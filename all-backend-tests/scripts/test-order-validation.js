/**
 * Test script for the order validation endpoint
 */
// Load environment variables from .env.test file
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env.test file
const envPath = path.resolve(__dirname, '..', '.env.test');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error('Error: .env.test file not found');
  process.exit(1);
}

const axios = require('axios');
const chalk = require('chalk');

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const PHYSICIAN_TOKEN = process.env.PHYSICIAN_TOKEN;

// Validate configuration
if (!PHYSICIAN_TOKEN) {
  console.error('Error: PHYSICIAN_TOKEN environment variable is required');
  process.exit(1);
}

// Test data for order validation - stateless approach only requires dictation text
const testOrderData = {
  dictationText: "55 yo F with right shoulder pain x 3 weeks, worse with overhead activity. Rule out rotator cuff tear. Request MRI right shoulder without contrast."
  // No patientInfo or radiologyOrganizationId in stateless validation
};

// Test the order validation endpoint
async function testOrderValidation() {
  console.log('Testing order validation endpoint...');
  console.log(`API URL: ${API_URL}`);

  try {
    // Make the request
    const response = await axios.post(
      `${API_URL}/api/orders/validate`,
      testOrderData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PHYSICIAN_TOKEN}`
        }
      }
    );

    // Check the response
    if (response.status === 200 && response.data.success) {
      console.log(chalk.green('Stateless validation successful!'));
      console.log(`Status: ${response.status}`);
      
      // Verify no orderId is returned
      if (response.data.orderId === undefined) {
        console.log(chalk.green('No orderId returned as expected for stateless validation'));
      } else {
        console.log(chalk.yellow('Warning: orderId was returned, but should not be for stateless validation'));
      }
      
      console.log('Response:', JSON.stringify(response.data, null, 2));
      return true;
    } else {
      console.log(chalk.yellow('Unexpected response:'));
      console.log(`Status: ${response.status}`);
      console.log('Response:', JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log(chalk.red('Error validating order:'));
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
    return false;
  }
}

// Run the test
(async () => {
  try {
    const success = await testOrderValidation();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error(chalk.red('Unexpected error:'), error);
    process.exit(1);
  }
})();
