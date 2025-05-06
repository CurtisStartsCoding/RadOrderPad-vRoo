/**
 * Simple Grok API Test
 * 
 * This script tests the Grok API with a very simple prompt
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

// Function to test Grok API with a simple prompt
async function testGrokSimple() {
  try {
    console.log('Testing Grok API with simple prompt...');
    console.log(`Using API key: ${process.env.GROK_API_KEY.substring(0, 5)}...${process.env.GROK_API_KEY.substring(process.env.GROK_API_KEY.length - 5)}`);
    console.log('Using base URL: https://api.x.ai/v1');
    
    const startTime = Date.now();
    
    const completion = await client.chat.completions.create({
      model: 'grok-3-beta',
      messages: [
        { role: 'user', content: 'Say hello world' }
      ],
      max_tokens: 50,
      temperature: 0.7,
    });
    
    const responseTime = Date.now() - startTime;
    console.log(`Grok API call completed in ${responseTime}ms`);
    
    console.log('Grok API response:');
    console.log(completion.choices[0].message);
    console.log('\nGrok API is working correctly!');
    
  } catch (error) {
    console.error('Error calling Grok API:');
    
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
    } else {
      console.error('Error details:');
      console.error(error);
    }
  }
}

// Run the test
testGrokSimple();