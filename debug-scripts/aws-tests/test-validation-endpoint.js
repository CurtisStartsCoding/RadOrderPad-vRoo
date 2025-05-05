/**
 * Test script for validation endpoint
 * 
 * This script tests the validation endpoint with a sample payload
 * to compare the results with the expected output.
 */

const axios = require('axios');
require('dotenv').config();

// Get the API URL and token from environment variables
const apiUrl = process.env.API_URL || 'https://api.radorderpad.com';
const token = process.env.TEST_TOKEN || process.env.PHYSICIAN_TOKEN;

// Sample payload for validation
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

// Function to test the validation endpoint
async function testValidation() {
  try {
    console.log('Testing validation endpoint with sample payload...');
    console.log(`API URL: ${apiUrl}`);
    
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
    
    // Log the response
    console.log('Response status:', response.status);
    console.log('Validation result:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Compare with expected result
    console.log('\nExpected result from Claude 3.7 Sonnet:');
    console.log(`
{
  "diagnosisCodes": [
    {
      "code": "K59.1",
      "description": "Functional diarrhea"
    },
    {
      "code": "R10.13",
      "description": "Epigastric pain (Upper right quadrant pain)"
    },
    {
      "code": "R74.0",
      "description": "Nonspecific elevation of levels of transaminase"
    },
    {
      "code": "E83.110",
      "description": "Hemochromatosis, unspecified (suspected based on elevated ferritin)"
    }
  ],
  "procedureCodes": [
    {
      "code": "76700",
      "description": "Ultrasound, abdominal, complete"
    }
  ],
  "validationStatus": "valid",
  "complianceScore": 8,
  "feedback": "Abdominal ultrasound is appropriate for evaluating chronic diarrhea with RUQ pain and abnormal LFTs. Consider additional workup for possible hemochromatosis given the skin changes, elevated ferritin, and family history of cirrhosis."
}
    `);
    
    // Analyze differences
    console.log('\nAnalysis:');
    console.log('1. Check if the validation status matches');
    console.log('2. Compare the ICD-10 codes - are the same conditions identified?');
    console.log('3. Compare the CPT codes - is the same procedure recommended?');
    console.log('4. Compare the compliance score - is it similar?');
    console.log('5. Compare the feedback - does it mention similar clinical considerations?');
    
  } catch (error) {
    console.error('Error testing validation endpoint:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
}

// Run the test
testValidation();