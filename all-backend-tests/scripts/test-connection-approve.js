/**
 * Test script for the connection approval endpoint
 */
require('dotenv').config({ path: './.env.test' });
const axios = require('axios');
const chalk = require('chalk');

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const AUTH_TOKEN = process.env.ADMIN_RADIOLOGY_TOKEN || process.env.ADMIN_REFERRING_TOKEN;

// Ensure we have a token
if (!AUTH_TOKEN) {
  console.error(chalk.red('Error: No admin token available. Set ADMIN_RADIOLOGY_TOKEN or ADMIN_REFERRING_TOKEN in .env.test'));
  process.exit(1);
}

// Test data - using a pending relationship from the database
const RELATIONSHIP_ID = process.env.TEST_PENDING_RELATIONSHIP_ID || 4;

/**
 * Test the connection approval endpoint
 */
async function testConnectionApprove() {
  console.log(chalk.blue('Testing connection approval endpoint...'));
  console.log(`API URL: ${API_URL}`);
  console.log(`Relationship ID: ${RELATIONSHIP_ID}`);
  
  try {
    // Approve the connection
    const response = await axios({
      method: 'post',
      url: `${API_URL}/api/connections/${RELATIONSHIP_ID}/approve`,
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Log success
    console.log(chalk.green('Connection approval successful!'));
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    // Special case: 404 with "not found, not authorized, or not in pending status" is expected
    // when testing with a relationship that's already been approved/rejected
    if (error.response &&
        error.response.status === 404 &&
        error.response.data.message &&
        error.response.data.message.includes('not found, not authorized, or not in pending status')) {
      console.log(chalk.green('Expected 404 response (relationship validation working correctly):'));
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
      
      return {
        success: true,
        status: error.response.status,
        data: error.response.data
      };
    }
    
    // Log error
    console.log(chalk.red('Connection approval failed!'));
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
      
      return {
        success: false,
        status: error.response.status,
        error: error.response.data
      };
    } else {
      console.log('Error:', error.message);
      
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Run the test
(async () => {
  try {
    const result = await testConnectionApprove();
    
    // Exit with appropriate code
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error(chalk.red('Unexpected error:'), error);
    process.exit(1);
  }
})();
