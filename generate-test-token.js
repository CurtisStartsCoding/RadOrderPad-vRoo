/**
 * Generate a JWT token for testing
 * 
 * This script generates a JWT token for a test user with the 'physician' role.
 * 
 * Usage:
 * node generate-test-token.js
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Get the JWT secret from the environment
const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Create a payload for a test user
const payload = {
  userId: 1,
  orgId: 1,
  role: 'physician',
  email: 'test.physician@example.com'
};

// Generate the token
const token = jwt.sign(payload, secret, { expiresIn: '24h' });

console.log('Generated JWT token for testing:');
console.log(token);
console.log('\nUse this token in your test script:');
console.log('export JWT_TOKEN=<token>');
console.log('node test-validation-engine.js');