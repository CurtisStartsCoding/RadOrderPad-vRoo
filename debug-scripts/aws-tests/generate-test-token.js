/**
 * Generate a test token for API authentication
 * 
 * This script generates a JWT token that can be used for testing the API endpoints.
 * It creates a trial user token that can be used with the validation endpoint.
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Get the JWT secret from environment variables or use the known server secret
const jwtSecret = process.env.JWT_SECRET || 'radorderpad-secure-jwt-secret-f8a72c1e9b5d3e7f4a6b2c8d9e0f1a2b3c4d5e6f';

// Create a trial user payload
const trialUserPayload = {
  userId: 999, // Use a test ID
  orgId: null,
  role: 'trial_user',
  email: 'test.trial@example.com',
  is_trial: true, // This is important for trial user access
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
};

// Generate the token
const token = jwt.sign(trialUserPayload, jwtSecret);

// Output the token
console.log('Generated test token for trial user:');
console.log(token);
console.log('\nThis token will expire in 24 hours.');
console.log('\nTo use this token, set it as an environment variable:');
console.log('set TEST_TOKEN=<token>');
console.log('\nOr update your .env file with:');
console.log('TEST_TOKEN=<token>');

// Save the token to a file
const fs = require('fs');
fs.writeFileSync('trial-test-token.txt', token);
console.log('\nToken has been saved to trial-test-token.txt');

// Also output the server's test token
console.log('\nServer test token (scheduler role):');
console.log('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoic2NoZWR1bGVyIiwiZW1haWwiOiJ0ZXN0LnNjaGVkdWxlckBleGFtcGxlLmNvbSIsImlhdCI6MTc0NTE5OTkxNSwiZXhwIjoxNzQ1Mjg2MzE1fQ._8xhMbsxxB1yEBnI_Nbciog4I66FuTBSTfd-CIa5WXw');