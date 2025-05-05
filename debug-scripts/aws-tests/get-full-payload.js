/**
 * Script to get the full API payload in the same format as the Claude 3.7 Sonnet response
 */

const axios = require('axios');
require('dotenv').config();

// Get the API URL and token from environment variables
const apiUrl = process.env.API_URL || 'https://api.radorderpad.com';
const token = process.env.PHYSICIAN_TOKEN;

// Sample payload for validation - same as in the troubleshooting file
const payload = {
  dictationText: "48-year-old female with chronic diarrhea for past 4 months, typically 4-5 loose stools daily. Reports upper right quadrant discomfort after meals. Patient has noted darkening of skin on knuckles and neck folds. Recent lab work shows mildly elevated ferritin and transaminases. Family history significant for father with cirrhosis of \"unknown cause.\" Order abdominal ultrasound to evaluate for possible gallbladder disease.",
  patientInfo: {
    id: 1,
    firstName: 'Test',
    lastName: 'Patient',
    dateOfBirth: '1980-01-01',
    gender: 'female',
    phoneNumber: '555-123-4567',
    email: 'test.patient@example.com'
  },
  radiologyOrganizationId: 1
};

// Function to get the full API payload
async function getFullPayload() {
  try {
    console.log('Getting full API payload...');
    
    // Make the API call
    const response = await axios.post(
      `${apiUrl}/api/orders/validate`, 
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    // Format the response to match the Claude 3.7 Sonnet format
    const validationResult = response.data.validationResult;
    
    // Convert suggestedICD10Codes to diagnosisCodes format
    const diagnosisCodes = validationResult.suggestedICD10Codes.map(code => ({
      code: code.code,
      description: code.description
    }));
    
    // Convert suggestedCPTCodes to procedureCodes format
    const procedureCodes = validationResult.suggestedCPTCodes.map(code => ({
      code: code.code,
      description: code.description
    }));
    
    // Create the formatted response
    const formattedResponse = {
      diagnosisCodes,
      procedureCodes,
      validationStatus: validationResult.validationStatus,
      complianceScore: validationResult.complianceScore,
      feedback: validationResult.feedback
    };
    
    // Output the full API payload
    console.log('Full API payload:');
    console.log(JSON.stringify(formattedResponse, null, 2));
    
    // Also output the original response for reference
    console.log('\nOriginal API response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error getting full API payload:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

// Run the function
getFullPayload();