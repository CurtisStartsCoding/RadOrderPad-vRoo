/**
 * Test script for the GET /api/organizations/mine endpoint
 * 
 * This script tests the GET /api/organizations/mine endpoint, which returns
 * information about the authenticated user's organization, including locations and users.
 * 
 * Usage:
 * node test-organizations-mine-endpoint.js
 */

require('dotenv').config();
const axios = require('axios');
const chalk = require('chalk');

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const AUTH_TOKEN = process.env.AUTH_TOKEN;

if (!AUTH_TOKEN) {
  console.error(chalk.red('Error: AUTH_TOKEN environment variable is required'));
  process.exit(1);
}

async function testGetMyOrganization() {
  console.log(chalk.blue('Testing GET /api/organizations/mine endpoint...'));
  
  try {
    const response = await axios.get(`${API_URL}/api/organizations/mine`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(chalk.green('Success! Status code:'), response.status);
    console.log(chalk.green('Response data:'));
    
    // Print organization details
    const { organization, locations, users } = response.data.data;
    console.log(chalk.yellow('\nOrganization:'));
    console.log(`ID: ${organization.id}`);
    console.log(`Name: ${organization.name}`);
    console.log(`Type: ${organization.type}`);
    console.log(`Status: ${organization.status}`);
    
    // Print locations
    console.log(chalk.yellow('\nLocations:'));
    if (locations && locations.length > 0) {
      locations.forEach(location => {
        console.log(`- ${location.name} (ID: ${location.id})`);
      });
    } else {
      console.log('No locations found');
    }
    
    // Print users
    console.log(chalk.yellow('\nUsers:'));
    if (users && users.length > 0) {
      users.forEach(user => {
        console.log(`- ${user.firstName} ${user.lastName} (${user.email}, Role: ${user.role})`);
      });
    } else {
      console.log('No users found');
    }
    
    return true;
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    
    if (error.response) {
      console.error(chalk.red('Status code:'), error.response.status);
      console.error(chalk.red('Response data:'), error.response.data);
    }
    
    return false;
  }
}

// Run the test
(async () => {
  try {
    const success = await testGetMyOrganization();
    
    if (success) {
      console.log(chalk.green('\nTest completed successfully!'));
    } else {
      console.log(chalk.red('\nTest failed!'));
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red('Unexpected error:'), error);
    process.exit(1);
  }
})();