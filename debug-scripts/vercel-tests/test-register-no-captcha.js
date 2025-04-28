/**
 * Test script for registration without CAPTCHA verification
 * 
 * This script is for testing purposes only and should not be used in production.
 * It demonstrates how to test the registration process by bypassing CAPTCHA verification.
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
 * Test function for registration without CAPTCHA
 * 
 * This function demonstrates how to test the registration process
 * by directly accessing the registerOrganization service function.
 * 
 * In a real implementation, you would:
 * 1. Create a test endpoint that bypasses CAPTCHA verification
 * 2. Modify the captcha.ts file to bypass verification in test mode
 * 3. Use a mock implementation of the verifyCaptcha function
 */
async function testRegistration() {
  console.log('===== Testing Registration (CAPTCHA Bypass) =====');
  console.log(`API URL: ${API_URL}`);
  console.log(`Using test email: ${testData.user.email}`);
  
  try {
    console.log('Sending registration request...');
    console.log('NOTE: This test will only work if the server has been modified to bypass CAPTCHA verification in test mode.');
    
    // In a real implementation, you would use a test endpoint that bypasses CAPTCHA verification
    // For now, we'll try to use the regular endpoint but with a special header that might bypass verification
    const response = await axios.post(
      `${API_URL}/api/auth/register`,
      {
        organization: testData.organization,
        user: testData.user,
        // Include a captchaToken since the server requires it
        captchaToken: '03AGdBq24PBCbwiDRgI3R8t7eGULNRaQHaGXYTZYqPnNzl9eUH7xxnrORJna1Fq2bLTeYQjXfQNkZ_wHaVboVTpXl7lEA-8CeYM4UMmAXzMbG9upMHFMRzUWG1UMF8bKBKWNt3eXP4-6U5dGRYm4qcxcGHz_dRr2QwDYkHZT_6CiTmsZy8GkDcyP_gWjgwDcXP7K2wCTUJXJyY9UqcXJZMn-TXxFMr5sRPJ7MGyZzahkGVVe-bGzomxFGWpHUpjnVzBUuXKM5ehb3bBwYsJDJVUEI2JdS-xJr_Z4-LQVrGdLPKzXHtPwxdkJfkEdxSJMnhvUBGsYXXVAeELI-jLH_XdV9-MQxkiQZaG7aKzx0RwXq4fcxqGuwgXGGWejfuQxcBJdmY0GBRxJUFejdVSPR4VWzA3yNqVUP1ZGNGzY3-Ia4OOsS5epe7a9zS-9U'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Test-Mode': 'true' // Custom header that might be used to bypass verification
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
    console.log('1. Modify the captcha.ts file to bypass verification in test mode');
    console.log('2. Create a test endpoint that bypasses CAPTCHA verification');
    console.log('3. Use a mock implementation of the verifyCaptcha function');
    
    return false;
  }
}

/**
 * Recommended approach for testing in a development environment:
 * 
 * 1. Modify src/utils/captcha.ts to add a test mode:
 *    ```typescript
 *    export async function verifyCaptcha(token: string): Promise<boolean> {
 *      // Check for test mode header
 *      const req = getRequest(); // Get the current request object
 *      if (req.headers['x-test-mode'] === 'true' || process.env.NODE_ENV === 'development') {
 *        return true;
 *      }
 *      
 *      // Rest of the verification logic...
 *    }
 *    ```
 * 
 * 2. Create a test endpoint that bypasses CAPTCHA verification:
 *    ```typescript
 *    // In src/routes/auth.routes.ts
 *    router.post('/register-test', (req, res) => {
 *      // Add the test mode header
 *      req.headers['x-test-mode'] = 'true';
 *      // Call the regular register controller
 *      registerController.register(req, res);
 *    });
 *    ```
 */

// Run the test
testRegistration().then(success => {
  console.log('\n===== Test Complete =====');
  process.exit(success ? 0 : 1);
});