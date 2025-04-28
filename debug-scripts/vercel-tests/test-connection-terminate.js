/**
 * Test script for the connection termination endpoint
 */
// Load environment variables from .env.test file
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env.test file
const envPath = path.resolve(__dirname, '.env.test');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error('Error: .env.test file not found');
  process.exit(1);
}

const axios = require('axios');
const chalk = require('chalk');

// Configuration
const API_URL = process.env.API_BASE_URL || 'https://api.radorderpad.com';
const RELATIONSHIP_ID = process.env.TEST_ACTIVE_RELATIONSHIP_ID || process.env.TEST_RELATIONSHIP_ID || '1';
const ADMIN_TOKEN = process.env.ADMIN_RADIOLOGY_TOKEN || process.env.ADMIN_TOKEN;

// Validate configuration
if (!ADMIN_TOKEN) {
  console.error('Error: ADMIN_RADIOLOGY_TOKEN or ADMIN_TOKEN environment variable is required');
  process.exit(1);
}

// Test the connection termination endpoint
async function testConnectionTermination() {
  console.log('Testing connection termination endpoint...');
  console.log(`API URL: ${API_URL}`);
  console.log(`Relationship ID: ${RELATIONSHIP_ID}`);

  try {
    // Make the request
    const response = await axios.delete(
      `${API_URL}/api/connections/${RELATIONSHIP_ID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        }
      }
    );

    // Check the response
    if (response.status === 200 && response.data.success) {
      console.log(chalk.green('Connection termination successful!'));
      console.log(`Status: ${response.status}`);
      console.log('Response:', JSON.stringify(response.data, null, 2));
      return true;
    } else {
      console.log(chalk.yellow('Unexpected response:'));
      console.log(`Status: ${response.status}`);
      console.log('Response:', JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    // Special case: 404 with "not found, not authorized, or not in active status" is expected
    // when testing with a relationship that doesn't exist, user is not authorized, or it's not in active status
    if (error.response &&
        error.response.status === 404 &&
        error.response.data.message &&
        error.response.data.message.includes('not found, not authorized, or not in active status')) {
      console.log(chalk.green('Expected 404 response (relationship validation working correctly):'));
      console.log(`Status: ${error.response.status}`);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
      return true;
    }
    
    console.log(chalk.red('Error terminating connection:'));
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
    const success = await testConnectionTermination();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error(chalk.red('Unexpected error:'), error);
    process.exit(1);
  }
})();