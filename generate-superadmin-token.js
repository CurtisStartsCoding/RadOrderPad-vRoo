// Generate a JWT token for testing with super_admin role
import jwt from 'jsonwebtoken';
import fs from 'fs';

// Get JWT secret from environment or use default
const jwtSecret = process.env.JWT_SECRET || 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';

// Create a test user payload with super_admin role
const payload = {
  userId: 999,
  orgId: 1,
  role: 'super_admin',  // Super admin role
  email: 'test.superadmin@example.com',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
};

// Generate the token
const token = jwt.sign(payload, jwtSecret);

console.log('Generated JWT token for super_admin testing:');
console.log(token);

// Write token to file for easy access
fs.writeFileSync('superadmin-test-token.txt', token);
console.log('\nToken has been written to superadmin-test-token.txt');

console.log('\nUse this token in your test script:');
console.log('export JWT_TOKEN=<token>');
console.log('node test-superadmin-api.js');