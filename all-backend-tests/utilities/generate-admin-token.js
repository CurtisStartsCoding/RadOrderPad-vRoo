/**
 * Generate a new JWT token for testing the user invitation endpoint
 * 
 * This script generates a new JWT token for an admin_referring role,
 * which is required for testing the user invitation endpoint.
 * The token is valid for 24 hours.
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
    role: 'admin_referring',
    email: 'test.admin@example.com'
  },
  JWT_SECRET,
  { expiresIn: '24h' }
);

// Save the token to a file
fs.writeFileSync(path.join(__dirname, 'admin-test-token.txt'), token);

console.log('New admin test token generated and saved to admin-test-token.txt');
console.log('Token:', token);