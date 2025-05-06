/**
 * Grok API Test using OpenAI client
 * 
 * This script tests the Grok API using the OpenAI client library
 * with the correct base URL for Grok.
 */

const { OpenAI } = require('openai');
const dotenv = require('dotenv');

// Load environment variables from .env.production
dotenv.config({ path: '.env.production' });

// Check if Grok API key is set
if (!process.env.GROK_API_KEY) {
  console.error('Error: GROK_API_KEY environment variable is not set.');
  console.log('Please set the GROK_API_KEY in your .env.production file.');
  process.exit(1);
}

// Initialize OpenAI client with Grok configuration
const client = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

// Function to test Grok API
async function testGrokAPI() {
  try {
    console.log('Testing Grok API connection...');
    console.log(`Using API key: ${process.env.GROK_API_KEY.substring(0, 5)}...${process.env.GROK_API_KEY.substring(process.env.GROK_API_KEY.length - 5)}`);
    console.log('Using base URL: https://api.x.ai/v1');
    
    const startTime = Date.now();
    
    const completion = await client.chat.completions.create({
      model: 'grok-3-beta',
      messages: [
        { role: 'system', content: 'You are RadValidator, an AI clinical decision support system for radiology order validation.' },
        { role: 'user', content: 'Please analyze this radiology order dictation: "48-year-old female with chronic diarrhea for past 4 months, typically 4-5 loose stools daily. Reports upper right quadrant discomfort after meals. Patient has noted darkening of skin on knuckles and neck folds. Recent lab work shows mildly elevated ferritin and transaminases. Family history significant for father with cirrhosis of \"unknown cause.\" Order abdominal ultrasound to evaluate for possible gallbladder disease."' }
      ],
    });
    
    const responseTime = Date.now() - startTime;
    console.log(`Grok API call completed in ${responseTime}ms`);
    
    console.log('Grok API response:');
    console.log(completion.choices[0].message);
    console.log('\nGrok API is working correctly!');
    
  } catch (error) {
    console.error('Error calling Grok API:');
    
    if (error.response) {
      console.error(`Status: ${error.status}`);
      console.error('Response data:');
      console.error(JSON.stringify(error.response, null, 2));
      
      if (error.status === 401) {
        console.error('\n===== AUTHENTICATION ERROR =====');
        console.error('Authentication failed. Your Grok API key appears to be invalid.');
        console.error('\nPossible issues:');
        console.error('1. The API key may be expired or inactive');
        console.error('2. The API key format may be incorrect');
        console.error('3. Your account may not have access to the Grok API');
        console.error('\nSuggestions:');
        console.error('- Verify your API key at https://api.x.ai/');
        console.error('- Ensure your API key is properly formatted');
        console.error('- Check if your account has an active subscription');
        console.error('- Try generating a new API key');
        console.error('==============================');
      }
    } else {
      console.error('Error details:');
      console.error(error);
    }
  }
}

// Run the test
testGrokAPI();