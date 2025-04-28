/**
 * Test script for registration using the test endpoint
 * 
 * This script tests the registration process using the /api/auth/register-test endpoint,
 * which bypasses CAPTCHA verification.
 * 
 * Note: This script will only work after implementing the server modifications
 * using the implement-captcha-test-mode.js script.
 */

const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: '.env.test' });

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Test data
const testData = {
  organization: {
    name: `Test Registration Org ${Date.now()}`, // Unique name
    type: 'referring',
    address_line1: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip_code: '90210',
    phone_number: '555-123-4567'
  },
  user: {
    first_name: 'Test',
    last_name: 'User',
    email: `test.user.${Date.now()}@example.com`, // Unique email
    password: 'Password123!',
    role: 'admin_referring'
  }
};

/**
 * Test function for registration using the test endpoint
 */
async function testRegistration() {
  console.log('===== Testing Registration (Test Endpoint) =====');
  console.log(`API URL: ${API_URL}`);
  console.log(`Using test email: ${testData.user.email}`);
  
  try {
    console.log('Sending registration request to test endpoint...');
    console.log('NOTE: This test will only work after implementing the server modifications.');
    
    // Use the test endpoint that bypasses CAPTCHA verification
    const response = await axios.post(
      `${API_URL}/api/auth/register-test`,
      {
        organization: testData.organization,
        user: testData.user
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 201 && response.data.token) {
      console.log('✅ Registration successful!');
      console.log('Organization ID:', response.data.organization.id);
      console.log('User ID:', response.data.user.id);
      console.log('Message:', response.data.message);
      
      // Create tokens directory if it doesn't exist
      const tokensDir = path.join(__dirname, 'tokens');
      if (!fs.existsSync(tokensDir)) {
        fs.mkdirSync(tokensDir, { recursive: true });
      }
      
      // Save token for future tests
      const tokenPath = path.join(tokensDir, 'test-registration-token.txt');
      fs.writeFileSync(tokenPath, response.data.token);
      console.log(`Token saved to ${tokenPath}`);
      
      // Save test data for reference
      const testDataPath = path.join(tokensDir, 'test-registration-data.json');
      fs.writeFileSync(testDataPath, JSON.stringify({
        email: testData.user.email,
        password: testData.user.password,
        organizationId: response.data.organization.id,
        userId: response.data.user.id,
        timestamp: new Date().toISOString()
      }, null, 2));
      console.log(`Test data saved to ${testDataPath}`);
      
      console.log('\nNOTE: The organization is in "pending_verification" status.');
      console.log('To complete the registration, you would need to verify the email,');
      console.log('but since email verification is not available yet, the test stops here.');
      
      return true;
    } else {
      console.log('❌ Registration failed: Unexpected response');
      return false;
    }
  } catch (error) {
    console.error('❌ Registration failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
    
    console.log('\nTo make this test pass, you need to:');
    console.log('1. Run the implement-captcha-test-mode.js script');
    console.log('2. Rebuild and redeploy the application');
    console.log('3. Run this test again');
    
    return false;
  }
}

// Run the test
testRegistration().then(success => {
  console.log('\n===== Test Complete =====');
  process.exit(success ? 0 : 1);
});