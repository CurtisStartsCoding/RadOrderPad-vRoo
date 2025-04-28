/**
 * Test script for the update user profile endpoint
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
// Use any valid token - this endpoint is available to all authenticated users
const USER_TOKEN = process.env.PHYSICIAN_TOKEN || process.env.ADMIN_REFERRING_TOKEN || process.env.ADMIN_TOKEN;

// Validate configuration
if (!USER_TOKEN) {
  console.error('Error: No valid user token found in environment variables');
  process.exit(1);
}

// Test the update user profile endpoint
async function testUpdateUserProfile() {
  console.log('Testing update user profile endpoint...');
  console.log(`API URL: ${API_URL}`);
  
  try {
    // First, get the current user profile to see what we're working with
    console.log('Fetching current user profile...');
    const currentProfileResponse = await axios.get(
      `${API_URL}/api/users/me`,
      {
        headers: {
          'Authorization': `Bearer ${USER_TOKEN}`
        }
      }
    );
    
    if (currentProfileResponse.status !== 200 || !currentProfileResponse.data.success) {
      console.log(chalk.red('Failed to fetch current user profile:'));
      console.log(`Status: ${currentProfileResponse.status}`);
      console.log('Response:', JSON.stringify(currentProfileResponse.data, null, 2));
      return false;
    }
    
    const currentProfile = currentProfileResponse.data.data;
    console.log(chalk.green('Current user profile:'));
    console.log(JSON.stringify(currentProfile, null, 2));
    
    // Generate update data - append a timestamp to make it unique
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const updateData = {
      firstName: `${currentProfile.first_name} (Updated ${timestamp})`,
      lastName: currentProfile.last_name,
      phoneNumber: currentProfile.phone_number || '555-123-4567',
      specialty: currentProfile.specialty || 'General Practice'
    };
    
    console.log(chalk.blue('Updating user profile with:'));
    console.log(JSON.stringify(updateData, null, 2));
    
    // Make the update request
    const updateResponse = await axios.put(
      `${API_URL}/api/users/me`,
      updateData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${USER_TOKEN}`
        }
      }
    );
    
    // Check the response
    if (updateResponse.status === 200 && updateResponse.data.success) {
      console.log(chalk.green('User profile update successful!'));
      console.log(`Status: ${updateResponse.status}`);
      console.log('Response:', JSON.stringify(updateResponse.data, null, 2));
      
      // Verify the changes were applied
      const updatedProfile = updateResponse.data.data;
      if (updatedProfile.first_name === updateData.firstName) {
        console.log(chalk.green('✓ First name was updated correctly'));
      } else {
        console.log(chalk.red(`✗ First name was not updated correctly. Expected: ${updateData.firstName}, Got: ${updatedProfile.first_name}`));
        return false;
      }
      
      return true;
    } else {
      console.log(chalk.yellow('Unexpected response:'));
      console.log(`Status: ${updateResponse.status}`);
      console.log('Response:', JSON.stringify(updateResponse.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log(chalk.red('Error updating user profile:'));
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
    return false;
  }
}

// Test sending invalid data
async function testInvalidUpdate() {
  console.log('\nTesting update with invalid data...');
  
  try {
    // Send an empty update
    const emptyUpdateResponse = await axios.put(
      `${API_URL}/api/users/me`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${USER_TOKEN}`
        }
      }
    );
    
    // This should fail with a 400 Bad Request
    console.log(chalk.red('Empty update should have failed but succeeded:'));
    console.log(`Status: ${emptyUpdateResponse.status}`);
    console.log('Response:', JSON.stringify(emptyUpdateResponse.data, null, 2));
    return false;
  } catch (error) {
    // We expect a 400 Bad Request for an empty update
    if (error.response && error.response.status === 400) {
      console.log(chalk.green('✓ Empty update correctly rejected with 400 Bad Request'));
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
      return true;
    } else {
      console.log(chalk.red('Unexpected error for empty update:'));
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log(error.message);
      }
      return false;
    }
  }
}

// Test sending restricted fields
async function testRestrictedFields() {
  console.log('\nTesting update with restricted fields...');
  
  try {
    // Try to update role and email (which should be ignored)
    const restrictedUpdateData = {
      firstName: 'Valid Name',
      role: 'super_admin',
      email: 'hacked@example.com',
      is_active: false
    };
    
    const restrictedUpdateResponse = await axios.put(
      `${API_URL}/api/users/me`,
      restrictedUpdateData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${USER_TOKEN}`
        }
      }
    );
    
    // This should succeed but ignore the restricted fields
    if (restrictedUpdateResponse.status === 200 && restrictedUpdateResponse.data.success) {
      console.log(chalk.green('✓ Update with restricted fields succeeded (restricted fields should be ignored)'));
      console.log('Response:', JSON.stringify(restrictedUpdateResponse.data, null, 2));
      
      const updatedProfile = restrictedUpdateResponse.data.data;
      
      // Verify the valid field was updated
      if (updatedProfile.first_name === 'Valid Name') {
        console.log(chalk.green('✓ Valid field (firstName) was updated correctly'));
      } else {
        console.log(chalk.red(`✗ Valid field (firstName) was not updated correctly. Expected: 'Valid Name', Got: ${updatedProfile.first_name}`));
        return false;
      }
      
      // Verify the restricted fields were ignored
      if (updatedProfile.role !== 'super_admin') {
        console.log(chalk.green('✓ Restricted field (role) was correctly ignored'));
      } else {
        console.log(chalk.red('✗ Restricted field (role) was incorrectly updated'));
        return false;
      }
      
      if (updatedProfile.email !== 'hacked@example.com') {
        console.log(chalk.green('✓ Restricted field (email) was correctly ignored'));
      } else {
        console.log(chalk.red('✗ Restricted field (email) was incorrectly updated'));
        return false;
      }
      
      return true;
    } else {
      console.log(chalk.yellow('Unexpected response:'));
      console.log(`Status: ${restrictedUpdateResponse.status}`);
      console.log('Response:', JSON.stringify(restrictedUpdateResponse.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log(chalk.red('Error testing restricted fields:'));
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
    return false;
  }
}

// Test without authentication
async function testUnauthenticated() {
  console.log('\nTesting update without authentication...');
  
  try {
    // Send a request without a token
    const unauthResponse = await axios.put(
      `${API_URL}/api/users/me`,
      { firstName: 'Unauthorized User' },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // This should fail with a 401 Unauthorized
    console.log(chalk.red('Unauthenticated request should have failed but succeeded:'));
    console.log(`Status: ${unauthResponse.status}`);
    console.log('Response:', JSON.stringify(unauthResponse.data, null, 2));
    return false;
  } catch (error) {
    // We expect a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.log(chalk.green('✓ Unauthenticated request correctly rejected with 401 Unauthorized'));
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
      return true;
    } else {
      console.log(chalk.red('Unexpected error for unauthenticated request:'));
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log(error.message);
      }
      return false;
    }
  }
}

// Run the tests
(async () => {
  try {
    // Run the main test
    const mainTestSuccess = await testUpdateUserProfile();
    
    // Run additional tests
    const invalidTestSuccess = await testInvalidUpdate();
    const restrictedFieldsSuccess = await testRestrictedFields();
    const unauthTestSuccess = await testUnauthenticated();
    
    // Overall success if all tests pass
    const overallSuccess = mainTestSuccess && invalidTestSuccess && restrictedFieldsSuccess && unauthTestSuccess;
    
    if (overallSuccess) {
      console.log(chalk.green('\n✓ All tests passed!'));
    } else {
      console.log(chalk.red('\n✗ Some tests failed!'));
    }
    
    process.exit(overallSuccess ? 0 : 1);
  } catch (error) {
    console.error(chalk.red('Unexpected error:'), error);
    process.exit(1);
  }
})();