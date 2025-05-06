/**
 * Simple Grok API Test
 * 
 * This script tests if the Grok API is working correctly.
 */

const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from .env.production
dotenv.config({ path: '.env.production' });

// Check if Grok API key is set
if (!process.env.GROK_API_KEY) {
  console.error('Error: GROK_API_KEY environment variable is not set.');
  console.log('Please set the GROK_API_KEY in your .env.production file.');
  process.exit(1);
}

// Simple test prompt
const testPrompt = "Hello, I'm testing the Grok API. Please respond with a simple greeting.";

// Function to call Grok API
async function testGrokAPI() {
  try {
    console.log('Testing Grok API connection...');
    console.log(`Using API key: ${process.env.GROK_API_KEY.substring(0, 5)}...${process.env.GROK_API_KEY.substring(process.env.GROK_API_KEY.length - 5)}`);
    
    const startTime = Date.now();
    
    const response = await axios.post(
      'https://api.xai.com/v1/chat/completions',
      {
        model: process.env.GROK_MODEL_NAME || 'grok-3-latest',
        messages: [
          { role: 'user', content: testPrompt }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROK_API_KEY}`
        }
      }
    );
    
    const responseTime = Date.now() - startTime;
    console.log(`Grok API call completed in ${responseTime}ms`);
    
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      console.log('Grok API response:');
      console.log(response.data.choices[0].message.content);
      console.log('\nGrok API is working correctly!');
    } else {
      console.log('Unexpected response format:');
      console.log(JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.error('Error calling Grok API:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:');
      console.error(JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.error('\n===== AUTHENTICATION ERROR =====');
        console.error('Authentication failed. Your Grok API key appears to be invalid.');
        console.error('\nPossible issues:');
        console.error('1. The API key may be expired or inactive');
        console.error('2. The API key format may be incorrect');
        console.error('3. Your account may not have access to the Grok API');
        console.error('\nSuggestions:');
        console.error('- Verify your API key at https://api.xai.com/');
        console.error('- Ensure your API key starts with "xai-" and is properly formatted');
        console.error('- Check if your account has an active subscription');
        console.error('- Try generating a new API key');
        console.error('\nChinese error message translation:');
        console.error('"Request access: /v1/chat/completions, authentication failed, unable to access system resources"');
        console.error('==============================');
      }
    } else if (error.request) {
      console.error('No response received from the server.');
      console.error('Please check your internet connection or if the Grok API endpoint is correct.');
    } else {
      console.error('Error setting up the request:');
      console.error(error.message);
    }
  }
}

// Run the test
testGrokAPI();