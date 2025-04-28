/**
 * Trace API Call Script
 * 
 * This script makes an API call to /api/organizations/mine and logs detailed
 * information about the request and response to help trace where the error occurs.
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
let AUTH_TOKEN = process.env.AUTH_TOKEN;

// Try to read token from file if not in environment variable
if (!AUTH_TOKEN) {
  const tokenFile = path.join(__dirname, 'clean-token.txt');
  if (fs.existsSync(tokenFile)) {
    AUTH_TOKEN = fs.readFileSync(tokenFile, 'utf8').trim();
    console.log('Read token from file');
  }
}

if (!AUTH_TOKEN) {
  console.error('Error: AUTH_TOKEN environment variable or clean-token.txt file is required');
  process.exit(1);
}

async function traceApiCall() {
  console.log('=== API CALL TRACING ===');
  console.log(`API URL: ${API_URL}`);
  console.log('=======================\n');
  
  try {
    // Make sure token doesn't have any whitespace or special characters
    const cleanToken = AUTH_TOKEN.trim();
    
    console.log('Using token (first 10 chars):', cleanToken.substring(0, 10) + '...');
    
    // Add headers that might help with tracing
    const headers = {
      'Authorization': `Bearer ${cleanToken}`,
      'Content-Type': 'application/json',
      'X-Debug-Trace': 'true',
      'X-Request-ID': `trace-${Date.now()}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    };
    
    console.log('\nRequest details:');
    console.log(`URL: ${API_URL}/api/organizations/mine`);
    console.log('Headers:', JSON.stringify(headers, null, 2));
    
    console.log('\nMaking API call...');
    const startTime = Date.now();
    
    try {
      const response = await axios.get(`${API_URL}/api/organizations/mine`, { headers });
      
      const endTime = Date.now();
      console.log(`\nResponse received in ${endTime - startTime}ms`);
      console.log('Status code:', response.status);
      console.log('Response headers:', JSON.stringify(response.headers, null, 2));
      console.log('Response data:', JSON.stringify(response.data, null, 2));
      
      return true;
    } catch (requestError) {
      const endTime = Date.now();
      console.log(`\nError response received in ${endTime - startTime}ms`);
      
      if (requestError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Status code:', requestError.response.status);
        console.log('Response headers:', JSON.stringify(requestError.response.headers, null, 2));
        console.log('Response data:', JSON.stringify(requestError.response.data, null, 2));
        
        // Check for specific error messages
        if (requestError.response.data && requestError.response.data.error) {
          console.log('\nDetailed error analysis:');
          const errorMessage = requestError.response.data.error;
          
          if (errorMessage.includes('column "status" does not exist')) {
            console.log('Error type: PostgreSQL column error');
            console.log('Error message indicates the "status" column does not exist in the organizations table.');
            console.log('This suggests a schema mismatch between what the code expects and what exists in the database.');
            
            // Try to extract more details from the error message
            const errorLines = errorMessage.split('\n');
            errorLines.forEach(line => {
              if (line.includes('at ')) {
                console.log('Error location:', line.trim());
              }
            });
          }
        }
      } else if (requestError.request) {
        // The request was made but no response was received
        console.log('No response received from server');
        console.log('Request details:', requestError.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error setting up request:', requestError.message);
      }
      
      return false;
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

// Run the trace
(async () => {
  try {
    const success = await traceApiCall();
    
    if (success) {
      console.log('\nAPI call completed successfully!');
    } else {
      console.log('\nAPI call failed!');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
})();