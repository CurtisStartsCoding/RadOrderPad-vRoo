/**
 * API Health Check for Upload Functionality
 * 
 * This script performs a simple health check on the API endpoints
 * related to the upload functionality.
 */

const axios = require('axios');
const chalk = require('chalk');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env.test') });

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

/**
 * Test API health endpoint
 */
async function testApiHealth() {
  console.log(chalk.blue('Testing API health endpoint...'));
  
  try {
    const response = await axios.get(`${API_URL}/api/health`);
    console.log(chalk.green('✅ API health endpoint is working'));
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    if (error.response) {
      console.log(chalk.yellow('⚠️ API health endpoint responded with an error'));
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
      return false;
    } else {
      console.log(chalk.red('❌ API health endpoint is not reachable'));
      console.log('Error:', error.message);
      return false;
    }
  }
}

/**
 * Test uploads API endpoint
 */
async function testUploadsEndpoint() {
  console.log(chalk.blue('\nTesting uploads API endpoint...'));
  
  try {
    // Just make a simple OPTIONS request to check if the endpoint exists
    const response = await axios.options(`${API_URL}/api/uploads/presigned-url`);
    console.log(chalk.green('✅ Uploads API endpoint is reachable'));
    console.log('Status:', response.status);
    return true;
  } catch (error) {
    if (error.response) {
      // Even a 404 or other error means the API is reachable
      console.log(chalk.yellow('⚠️ Uploads API endpoint responded with an error'));
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
      return true; // Still reachable
    } else {
      console.log(chalk.red('❌ Uploads API endpoint is not reachable'));
      console.log('Error:', error.message);
      return false;
    }
  }
}

/**
 * Run all API health checks
 */
async function runApiHealthChecks() {
  console.log(chalk.bold('=== API Health Check for Upload Functionality ==='));
  console.log('API URL:', API_URL);
  
  const apiHealthWorking = await testApiHealth();
  const uploadsEndpointReachable = await testUploadsEndpoint();
  
  // Summary
  console.log(chalk.bold('\n=== API Health Check Summary ==='));
  console.log(`API Health Endpoint: ${apiHealthWorking ? chalk.green('✅ Working') : chalk.red('❌ Failed')}`);
  console.log(`Uploads API Endpoint: ${uploadsEndpointReachable ? chalk.green('✅ Reachable') : chalk.red('❌ Failed')}`);
  
  // Recommendations
  console.log(chalk.bold('\n=== Recommendations ==='));
  
  if (!apiHealthWorking) {
    console.log('- Check if the API server is running');
    console.log('- Verify the API_URL is correct');
    console.log('- Ensure there are no network issues preventing access to the API');
  }
  
  if (!uploadsEndpointReachable) {
    console.log('- Check if the API server is running');
    console.log('- Verify the API_URL is correct');
    console.log('- Ensure the uploads module is properly installed and configured');
  }
  
  console.log(chalk.bold('\n=== API Health Check Complete ==='));
}

// Run the health checks
runApiHealthChecks();