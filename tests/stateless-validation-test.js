/**
 * Test for Stateless Validation Endpoint
 *
 * This script tests the refactored stateless validation endpoint:
 * 1. Tests validation with only dictationText (stateless)
 * 2. Verifies no orderId is returned
 * 3. Verifies validation result is returned correctly
 */

const axios = require('axios');
const chalk = require('chalk');

// Base URL for API requests
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Test physician credentials
const testPhysician = {
  email: 'test.physician@example.com',
  password: 'password123'
};

// Test dictation
const testDictation = 'Patient with chest pain, shortness of breath. History of hypertension. Please evaluate for possible coronary artery disease.';

console.log('Using API URL:', API_URL);
console.log('Using physician email:', testPhysician.email);

// Test the physician login endpoint
async function testPhysicianLogin() {
  console.log(chalk.blue('Testing physician login endpoint...'));
  
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      {
        email: testPhysician.email,
        password: testPhysician.password
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    console.log(chalk.green('Physician logged in successfully'));
    console.log('Response status:', response.status);
    console.log('Success:', response.data.success);
    console.log('Token received:', !!response.data.token);
    
    return response.data.token;
  } catch (error) {
    console.log(chalk.red('Error logging in physician:'));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return null;
  }
}

// Test stateless validation
async function testStatelessValidation(token) {
  console.log(chalk.blue('Testing stateless validation...'));
  
  try {
    const validationEndpoint = `${API_URL}/api/orders/validate`;
    console.log(chalk.blue(`Making API call to: ${validationEndpoint}`));
    console.log(chalk.blue('Request payload:'));
    console.log(JSON.stringify({
      dictationText: testDictation
      // No patientInfo, orderId, or radiologyOrganizationId
    }, null, 2));
    
    const response = await axios.post(
      validationEndpoint,
      {
        dictationText: testDictation
        // No patientInfo, orderId, or radiologyOrganizationId
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log(chalk.green('Stateless validation successful'));
    console.log('Response status:', response.status);
    console.log('Success:', response.data.success);
    console.log('Full response data:', JSON.stringify(response.data, null, 2));
    
    // Verify no orderId is returned
    if (response.data.orderId === undefined) {
      console.log(chalk.green('✅ No orderId returned as expected'));
    } else {
      console.log(chalk.red('❌ orderId was returned, but should not be for stateless validation'));
    }
    
    // Check for validation result
    if (response.data.validationResult) {
      console.log(chalk.green('✅ Validation result returned'));
      console.log('Validation Result:');
      console.log('- Validation Status:', response.data.validationResult.validationStatus);
      console.log('- Compliance Score:', response.data.validationResult.complianceScore);
      
      if (response.data.validationResult.suggestedCPTCodes) {
        console.log('- Suggested CPT Codes:');
        response.data.validationResult.suggestedCPTCodes.forEach(code => {
          console.log(`  - ${code.code}: ${code.description}`);
        });
      }
      
      if (response.data.validationResult.suggestedICD10Codes) {
        console.log('- Suggested ICD-10 Codes:');
        response.data.validationResult.suggestedICD10Codes.forEach(code => {
          console.log(`  - ${code.code}: ${code.description}`);
        });
      }
    } else {
      console.log(chalk.red('❌ No validation result returned'));
    }
    
    return response.data.validationResult;
  } catch (error) {
    console.log(chalk.red('Error testing stateless validation:'));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return null;
  }
}

// Test multiple iterations
async function testMultipleIterations(token) {
  console.log(chalk.blue('Testing multiple validation iterations...'));
  
  const iterations = [
    'Patient with chest pain.',
    'Patient with chest pain radiating to left arm.',
    'Patient with chest pain radiating to left arm, shortness of breath.'
  ];
  
  try {
    for (let i = 0; i < iterations.length; i++) {
      const dictationText = iterations[i];
      console.log(chalk.blue(`Iteration ${i+1}: ${dictationText}`));
      
      const validationEndpoint = `${API_URL}/api/orders/validate`;
      const response = await axios.post(
        validationEndpoint,
        { dictationText },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log(chalk.green(`Iteration ${i+1} successful`));
      console.log('Response status:', response.status);
      console.log('Success:', response.data.success);
      
      // Verify no orderId is returned
      if (response.data.orderId === undefined) {
        console.log(chalk.green('✅ No orderId returned as expected'));
      } else {
        console.log(chalk.red('❌ orderId was returned, but should not be for stateless validation'));
      }
      
      // Check for validation result
      if (response.data.validationResult) {
        console.log(chalk.green('✅ Validation result returned'));
        console.log('Validation Status:', response.data.validationResult.validationStatus);
      } else {
        console.log(chalk.red('❌ No validation result returned'));
      }
      
      console.log('---');
    }
    
    return true;
  } catch (error) {
    console.log(chalk.red('Error testing multiple iterations:'));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

// Test error handling
async function testErrorHandling(token) {
  console.log(chalk.blue('Testing error handling...'));
  
  try {
    // Test empty dictation
    console.log(chalk.blue('Testing empty dictation...'));
    try {
      const validationEndpoint = `${API_URL}/api/orders/validate`;
      await axios.post(
        validationEndpoint,
        { dictationText: '' },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log(chalk.red('❌ Empty dictation did not throw an error'));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(chalk.green('✅ Empty dictation correctly returned 400 Bad Request'));
      } else {
        console.log(chalk.red('❌ Empty dictation threw an unexpected error:'));
        if (error.response) {
          console.log('Status:', error.response.status);
          console.log('Data:', error.response.data);
        } else {
          console.log('Error:', error.message);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.log(chalk.red('Error testing error handling:'));
    console.log('Error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log(chalk.yellow('=== Starting Stateless Validation Tests ==='));
  
  try {
    // Step 1: Login as physician
    console.log(chalk.blue('Attempting to login with existing physician...'));
    let token = await testPhysicianLogin();
    
    if (!token) {
      console.log(chalk.red('❌ Login failed. Cannot proceed with tests.'));
      return;
    } else {
      console.log(chalk.green('✅ Login successful.'));
    }
    
    // Step 2: Test stateless validation
    const validationResult = await testStatelessValidation(token);
    if (!validationResult) {
      console.log(chalk.red('❌ Stateless validation test failed.'));
    } else {
      console.log(chalk.green('✅ Stateless validation test passed.'));
    }
    
    // Step 3: Test multiple iterations
    const iterationsSuccess = await testMultipleIterations(token);
    if (!iterationsSuccess) {
      console.log(chalk.red('❌ Multiple iterations test failed.'));
    } else {
      console.log(chalk.green('✅ Multiple iterations test passed.'));
    }
    
    // Step 4: Test error handling
    const errorHandlingSuccess = await testErrorHandling(token);
    if (!errorHandlingSuccess) {
      console.log(chalk.red('❌ Error handling test failed.'));
    } else {
      console.log(chalk.green('✅ Error handling test passed.'));
    }
    
    console.log(chalk.yellow('=== Stateless Validation Tests Completed ==='));
  } catch (error) {
    console.log(chalk.red('Error running tests:'), error.message);
    process.exit(1);
  }
}

// Run the tests
runAllTests();