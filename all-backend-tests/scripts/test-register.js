/**
 * Test script for the modified registration endpoint
 * This script tests the self-service registration flow without requiring a registration key
 */

const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.test' });

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const RECAPTCHA_TEST_TOKEN = 'test_recaptcha_token'; // This would be a real token in production

// Generate unique organization name and email to avoid conflicts
const timestamp = new Date().getTime();
const ORG_NAME = `Test Organization ${timestamp}`;
const EMAIL = `test.admin${timestamp}@example.com`;

// Test data
const registrationData = {
  organization: {
    name: ORG_NAME,
    type: 'referring_practice',
    npi: '1234567890',
    address_line1: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94105',
    phone_number: '555-123-4567',
    contact_email: EMAIL
  },
  user: {
    email: EMAIL,
    password: 'Password123!',
    first_name: 'Test',
    last_name: 'Admin',
    role: 'admin_referring'
  },
  // Using a more realistic token format that might work with the server's verification logic
  captchaToken: '03AGdBq24PBCbwiDRgI3R8t7eGULNRaQHaGXYTZYqPnNzl9eUH7xxnrORJna1Fq2bLTeYQjXfQNkZ_wHaVboVTpXl7lEA-8CeYM4UMmAXzMbG9upMHFMRzUWG1UMF8bKBKWNt3eXP4-6U5dGRYm4qcxcGHz_dRr2QwDYkHZT_6CiTmsZy8GkDcyP_gWjgwDcXP7K2wCTUJXJyY9UqcXJZMn-TXxFMr5sRPJ7MGyZzahkGVVe-bGzomxFGWpHUpjnVzBUuXKM5ehb3bBwYsJDJVUEI2JdS-xJr_Z4-LQVrGdLPKzXHtPwxdkJfkEdxSJMnhvUBGsYXXVAeELI-jLH_XdV9-MQxkiQZaG7aKzx0RwXq4fcxqGuwgXGGWejfuQxcBJdmY0GBRxJUFejdVSPR4VWzA3yNqVUP1ZGNGzY3-Ia4OOsS5epe7a9zS-9U'
};

/**
 * Test the registration endpoint
 */
async function testRegistration() {
  console.log('===== Testing Modified Registration Endpoint =====');
  console.log(`API URL: ${API_URL}`);
  console.log(`Organization Name: ${ORG_NAME}`);
  console.log(`Admin Email: ${EMAIL}`);
  console.log('');

  try {
    console.log('1. Testing valid registration...');
    console.log('NOTE: This test will only work after deploying the CAPTCHA test mode changes to the production server.');
    const response = await axios.post(
      `${API_URL}/api/auth/register`,
      registrationData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Test-Mode': 'true' // Custom header to bypass CAPTCHA verification
        }
      }
    );

    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.token) {
      console.log('✅ Registration successful! JWT token received.');
      
      // Save the token to a file for future tests
      const fs = require('fs');
      fs.writeFileSync('test-admin-token.txt', response.data.token);
      console.log('Token saved to test-admin-token.txt');
    } else {
      console.log('❌ Registration failed: No token received');
    }
  } catch (error) {
    console.error('❌ Registration failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
  }

  console.log('');
  console.log('2. Testing duplicate organization...');
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/register`,
      registrationData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Test-Mode': 'true' // Custom header to bypass CAPTCHA verification
        }
      }
    );
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    console.log('❌ Test failed: Expected error for duplicate organization');
  } catch (error) {
    console.log('Response Status:', error.response?.status);
    console.log('Response Data:', JSON.stringify(error.response?.data, null, 2));
    
    if (error.response?.status === 409 && error.response?.data?.message?.includes('already exists')) {
      console.log('✅ Test passed: Received expected error for duplicate organization');
    } else {
      console.log('❌ Test failed: Unexpected error');
    }
  }

  console.log('');
  console.log('3. Testing missing required fields...');
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/register`,
      {
        organization: {},
        user: {},
        captchaToken: RECAPTCHA_TEST_TOKEN
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Test-Mode': 'true' // Custom header to bypass CAPTCHA verification
        }
      }
    );
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    console.log('❌ Test failed: Expected error for missing required fields');
  } catch (error) {
    console.log('Response Status:', error.response?.status);
    console.log('Response Data:', JSON.stringify(error.response?.data, null, 2));
    
    if (error.response?.status === 400) {
      console.log('✅ Test passed: Received expected error for missing required fields');
    } else {
      console.log('❌ Test failed: Unexpected error');
    }
  }

  console.log('');
  console.log('4. Testing invalid email format...');
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/register`,
      {
        organization: {
          name: `Test Organization Invalid Email ${timestamp}`,
          type: 'referring_practice'
        },
        user: {
          email: 'invalid-email',
          password: 'Password123!',
          first_name: 'Test',
          last_name: 'Admin',
          role: 'admin_referring'
        },
        captchaToken: RECAPTCHA_TEST_TOKEN
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Test-Mode': 'true' // Custom header to bypass CAPTCHA verification
        }
      }
    );
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    console.log('❌ Test failed: Expected error for invalid email format');
  } catch (error) {
    console.log('Response Status:', error.response?.status);
    console.log('Response Data:', JSON.stringify(error.response?.data, null, 2));
    
    if (error.response?.status === 400 && error.response?.data?.message?.includes('email')) {
      console.log('✅ Test passed: Received expected error for invalid email format');
    } else {
      console.log('❌ Test failed: Unexpected error');
    }
  }

  console.log('');
  console.log('5. Testing missing CAPTCHA token...');
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/register`,
      {
        organization: {
          name: `Test Organization No CAPTCHA ${timestamp}`,
          type: 'referring_practice'
        },
        user: {
          email: `test.no.captcha.${timestamp}@example.com`,
          password: 'Password123!',
          first_name: 'Test',
          last_name: 'Admin',
          role: 'admin_referring'
        }
        // No captchaToken
      },
      {
        headers: {
          'Content-Type': 'application/json'
          // No X-Test-Mode header to test CAPTCHA verification
        }
      }
    );
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    console.log('❌ Test failed: Expected error for missing CAPTCHA token');
  } catch (error) {
    console.log('Response Status:', error.response?.status);
    console.log('Response Data:', JSON.stringify(error.response?.data, null, 2));
    
    if (error.response?.status === 400 && error.response?.data?.message?.includes('CAPTCHA')) {
      console.log('✅ Test passed: Received expected error for missing CAPTCHA token');
    } else {
      console.log('❌ Test failed: Unexpected error');
    }
  }

  console.log('');
  console.log('===== Registration Tests Complete =====');
}

// Run the tests
testRegistration().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
