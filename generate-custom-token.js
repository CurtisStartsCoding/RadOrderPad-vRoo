/**
 * Script to generate an authentication token for a custom user
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'https://api.radorderpad.com';
const OUTPUT_DIR = path.join(__dirname, 'tokens');

// Custom user credentials - using one of our newly created admin users
const CUSTOM_USER = {
  role: 'admin_referring',
  email: 'referring.12.97e67c9d@example.com', // Replace with your actual user email
  password: 'password123'
};

// Function to generate token for the custom user
async function generateCustomToken() {
  console.log(`\n🔑 Generating token for custom ${CUSTOM_USER.role} user...`);
  console.log(`   Email: ${CUSTOM_USER.email}`);
  
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: CUSTOM_USER.email,
      password: CUSTOM_USER.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data || !response.data.token) {
      console.error(`❌ Error: No token received for custom user`);
      console.error('Response:', JSON.stringify(response.data, null, 2));
      return null;
    }
    
    const token = response.data.token;
    console.log(`✅ Token received successfully for custom user`);
    
    // Save token to file
    const outputFile = path.join(OUTPUT_DIR, `custom-admin-token.txt`);
    fs.writeFileSync(outputFile, token, 'utf8');
    console.log(`   Token saved to ${outputFile}`);
    
    return token;
  } catch (error) {
    console.error(`❌ Failed to generate token for custom user`);
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    return null;
  }
}

// Main function
async function main() {
  console.log('=== GENERATING TOKEN FOR CUSTOM USER ===');
  console.log(`API URL: ${API_URL}`);
  console.log('=======================================\n');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }
  
  // Generate token for custom user
  const token = await generateCustomToken();
  
  if (token) {
    console.log('\n=== TOKEN GENERATION SUCCESSFUL ===');
    console.log(`Token has been saved to ${path.join(OUTPUT_DIR, 'custom-admin-token.txt')}`);
    
    // Print instructions for using the token
    console.log('\n=== HOW TO USE THIS TOKEN ===');
    console.log('1. In your test script, replace:');
    console.log('   token = fs.readFileSync(path.join(__dirname, \'..\\..\\tokens\', \'admin_referring-token.txt\'), \'utf8\').trim();');
    console.log('   with:');
    console.log('   token = fs.readFileSync(path.join(__dirname, \'..\\..\\tokens\', \'custom-admin-token.txt\'), \'utf8\').trim();');
  } else {
    console.log('\n=== TOKEN GENERATION FAILED ===');
    console.log('Please check the error messages above for details.');
  }
}

// Run the main function
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});