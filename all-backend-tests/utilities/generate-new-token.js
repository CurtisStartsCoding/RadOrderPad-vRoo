/**
 * Generate a new JWT token for testing
 * 
 * This script generates a new JWT token for testing purposes.
 * The token is valid for 24 hours and includes the necessary claims
 * for a scheduler role with organization ID 1.
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// JWT secret (should match the one used in the application)
const JWT_SECRET = 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';

// Create a token that expires in 24 hours
const token = jwt.sign(
  {
    userId: 1,
    orgId: 1,
    role: 'scheduler',
    email: 'test.scheduler@example.com'
  },
  JWT_SECRET,
  { expiresIn: '24h' }
);

// Save the token to a file
fs.writeFileSync(path.join(__dirname, 'new-test-token.txt'), token);

console.log('New test token generated and saved to new-test-token.txt');
console.log('Token:', token);