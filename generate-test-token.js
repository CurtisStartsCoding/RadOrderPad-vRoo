// Generate a JWT token for testing
import jwt from 'jsonwebtoken';
import fs from 'fs';

// Get JWT secret from environment or use default
const jwtSecret = process.env.JWT_SECRET || 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';

// Create a test user payload with scheduler role
const payload = {
  userId: 1,
  orgId: 1,
  role: 'scheduler',  // Changed from 'physician' to 'scheduler'
  email: 'test.scheduler@example.com',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
};

// Generate the token
const token = jwt.sign(payload, jwtSecret);

console.log('Generated JWT token for testing:');
console.log(token);

// Write token to file for easy access
fs.writeFileSync('test-token.txt', token);
console.log('\nToken has been written to test-token.txt');

console.log('\nUse this token in your test script:');
console.log('export JWT_TOKEN=<token>');
console.log('node test-validation-engine.js');