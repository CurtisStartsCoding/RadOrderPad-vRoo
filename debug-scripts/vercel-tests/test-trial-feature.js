/**
 * Test script for the Physician Trial Sandbox feature
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
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

// Test data
const testTrialUser = {
  email: 'trial-test@example.com',
  password: 'password123',
  firstName: 'Trial',
  lastName: 'User',
  specialty: 'Cardiology'
};

// Test the trial registration endpoint
async function testTrialRegistration() {
  console.log(chalk.blue('Testing trial registration endpoint...'));
  
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/trial/register`,
      testTrialUser,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.status === 201 && response.data.success) {
      console.log(chalk.green('Trial registration successful!'));
      console.log(`Status: ${response.status}`);
      console.log('Token:', response.data.token);
      return response.data.token;
    } else {
      console.log(chalk.yellow('Unexpected response:'));
      console.log(`Status: ${response.status}`);
      console.log('Response:', JSON.stringify(response.data, null, 2));
      return null;
    }
  } catch (error) {
    // If the error is due to the user already existing, we'll try to login instead
    if (error.response && error.response.status === 409) {
      console.log(chalk.yellow('User already exists, trying login instead...'));
      return await testTrialLogin();
    }
    
    console.log(chalk.red('Error registering trial user:'));
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
    return null;
  }
}

// Test the trial login endpoint
async function testTrialLogin() {
  console.log(chalk.blue('Testing trial login endpoint...'));
  
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/trial/login`,
      {
        email: testTrialUser.email,
        password: testTrialUser.password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.status === 200 && response.data.success) {
      console.log(chalk.green('Trial login successful!'));
      console.log(`Status: ${response.status}`);
      console.log('Token:', response.data.token);
      return response.data.token;
    } else {
      console.log(chalk.yellow('Unexpected response:'));
      console.log(`Status: ${response.status}`);
      console.log('Response:', JSON.stringify(response.data, null, 2));
      return null;
    }
  } catch (error) {
    console.log(chalk.red('Error logging in trial user:'));
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
    return null;
  }
}

// Test the trial validation endpoint
async function testTrialValidation(token) {
  console.log(chalk.blue('Testing trial validation endpoint...'));
  
  try {
    const response = await axios.post(
      `${API_URL}/api/orders/validate/trial`,
      {
        dictationText: "Patient with chest pain, shortness of breath. History of hypertension. Please evaluate for possible coronary artery disease."
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (response.status === 200 && response.data.success) {
      console.log(chalk.green('Trial validation successful!'));
      console.log(`Status: ${response.status}`);
      console.log('Validation Result:', JSON.stringify(response.data.validationResult, null, 2));
      return true;
    } else {
      console.log(chalk.yellow('Unexpected response:'));
      console.log(`Status: ${response.status}`);
      console.log('Response:', JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log(chalk.red('Error validating in trial mode:'));
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
    return false;
  }
}

// Test validation limit
async function testValidationLimit(token) {
  console.log(chalk.blue('Testing validation limit...'));
  
  // Try multiple validations to test the limit
  for (let i = 1; i <= 11; i++) {
    console.log(`Validation attempt ${i}...`);
    
    try {
      const response = await axios.post(
        `${API_URL}/api/orders/validate/trial`,
        {
          dictationText: `Validation attempt ${i}: Patient with chest pain, shortness of breath. History of hypertension. Please evaluate for possible coronary artery disease.`
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log(chalk.green(`Attempt ${i} successful`));
    } catch (error) {
      if (error.response && error.response.status === 403 && 
          error.response.data.message && error.response.data.message.includes('Validation limit reached')) {
        console.log(chalk.green('Validation limit test passed! Received expected 403 error:'));
        console.log(`Status: ${error.response.status}`);
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
        return true;
      } else {
        console.log(chalk.red(`Unexpected error on attempt ${i}:`));
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
  
  console.log(chalk.yellow('Warning: Validation limit not reached after 11 attempts'));
  return false;
}

// Run the tests
(async () => {
  try {
    console.log(chalk.blue('=== PHYSICIAN TRIAL SANDBOX FEATURE TEST ==='));
    console.log(`API URL: ${API_URL}`);
    
    // Step 1: Register or login a trial user
    const token = await testTrialRegistration();
    if (!token) {
      console.log(chalk.red('Failed to get trial token. Aborting test.'));
      process.exit(1);
    }
    
    // Step 2: Test trial validation
    const validationSuccess = await testTrialValidation(token);
    if (!validationSuccess) {
      console.log(chalk.red('Trial validation test failed. Aborting test.'));
      process.exit(1);
    }
    
    // Step 3: Test validation limit (if requested via command line)
    if (process.argv.includes('limit')) {
      console.log(chalk.blue('Running validation limit test...'));
      const limitSuccess = await testValidationLimit(token);
      if (!limitSuccess) {
        console.log(chalk.red('Validation limit test failed.'));
        process.exit(1);
      }
    }
    
    console.log(chalk.green('All tests passed successfully!'));
    process.exit(0);
  } catch (error) {
    console.error(chalk.red('Unexpected error:'), error);
    process.exit(1);
  }
})();