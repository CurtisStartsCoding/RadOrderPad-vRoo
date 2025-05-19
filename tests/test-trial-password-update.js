/**
 * Simple test script for trial user password update endpoint
 *
 * This script tests the trial user password update endpoint by:
 * 1. Creating a test trial user via the API
 * 2. Updating the password via the API
 * 3. Verifying the update by logging in with the new password
 *
 * Usage:
 * ```
 * node tests/test-trial-password-update.js
 * ```
 */

const axios = require('axios');

// Base URL for API requests
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Test data
const testUser = {
  email: 'trial-password-test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User',
  specialty: 'Cardiology'
};

const newPassword = 'newPassword456';

async function runTest() {
  try {
    console.log('Starting trial user password update endpoint test...');
    
    // Step 1: Create a test trial user
    console.log('Creating test trial user...');
    const registerResponse = await axios.post(`${API_URL}/api/auth/trial/register`, testUser);
    console.log('Trial user created:', registerResponse.data.success);
    
    if (!registerResponse.data.success) {
      console.error('Failed to create trial user');
      return;
    }
    
    // Step 2: Update the password
    console.log('Updating password...');
    const updateResponse = await axios.post(`${API_URL}/api/auth/trial/update-password`, {
      email: testUser.email,
      newPassword: newPassword
    });
    console.log('Password update response:', updateResponse.data);
    
    if (!updateResponse.data.success) {
      console.error('Failed to update password');
      return;
    }
    
    // Step 3: Verify by logging in with the new password
    console.log('Testing login with new password...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/trial/login`, {
      email: testUser.email,
      password: newPassword
    });
    
    if (loginResponse.data.success) {
      console.log('✅ TEST PASSED: Successfully logged in with new password');
    } else {
      console.log('❌ TEST FAILED: Could not log in with new password');
    }
    
    // Step 4: Verify that old password no longer works
    console.log('Testing login with old password (should fail)...');
    try {
      const oldPasswordResponse = await axios.post(`${API_URL}/api/auth/trial/login`, {
        email: testUser.email,
        password: testUser.password
      });
      
      if (oldPasswordResponse.data.success) {
        console.log('❌ TEST FAILED: Old password still works');
      } else {
        console.log('✅ TEST PASSED: Old password no longer works');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ TEST PASSED: Old password correctly rejected');
      } else {
        throw error;
      }
    }
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Error during test:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
runTest();