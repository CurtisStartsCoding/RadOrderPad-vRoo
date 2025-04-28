// Script to check if the test user exists in the database and if their password hash is valid
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env.production' });

// Get the database URL from environment variables
const mainDbUrl = process.env.MAIN_DATABASE_URL;

// Create modified connection string with SSL verification disabled
const noVerifyMainDbUrl = mainDbUrl.replace('?sslmode=require', '?sslmode=no-verify');

console.log('=== User Data Check Tool ===');
console.log('This tool will check if the test user exists in the database and if their password hash is valid.');

// Create connection pool with SSL verification disabled
const pool = new Pool({
  connectionString: noVerifyMainDbUrl,
  ssl: {
    rejectUnauthorized: false // Disable SSL certificate verification
  }
});

// Function to check if the test user exists
async function checkTestUser(email) {
  console.log(`\nChecking if user with email '${email}' exists in the database...`);
  
  try {
    // Query the database for the user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      console.log(`❌ User with email '${email}' not found in the database.`);
      return null;
    }
    
    const user = result.rows[0];
    console.log(`✅ User found:`);
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Organization ID: ${user.org_id}`);
    
    // Check if the password hash exists
    if (!user.password_hash) {
      console.log(`❌ User has no password hash.`);
    } else {
      console.log(`✅ Password hash exists: ${user.password_hash.substring(0, 10)}...`);
    }
    
    return user;
  } catch (err) {
    console.error('❌ Error querying the database:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
    return null;
  }
}

// Function to create a test user if it doesn't exist
async function createTestUser(email, password) {
  console.log(`\nCreating test user with email '${email}'...`);
  
  try {
    // Check if the user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      console.log(`User with email '${email}' already exists. Updating password...`);
      
      // Generate a bcrypt hash for the password
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      // Update the user's password hash
      await pool.query(
        'UPDATE users SET password_hash = $1 WHERE email = $2',
        [passwordHash, email]
      );
      
      console.log(`✅ Password updated for user with email '${email}'.`);
      return true;
    }
    
    // Generate a bcrypt hash for the password
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Insert the new user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role, org_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id`,
      [email, passwordHash, 'admin', 1]
    );
    
    console.log(`✅ Test user created with ID ${result.rows[0].id}.`);
    return true;
  } catch (err) {
    console.error('❌ Error creating test user:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
    return false;
  }
}

// Run the tests
async function runTests() {
  try {
    // Check if the test user exists
    const testEmail = 'test.admin@example.com';
    const testPassword = 'password123';
    
    const user = await checkTestUser(testEmail);
    
    if (!user) {
      // Create the test user if it doesn't exist
      await createTestUser(testEmail, testPassword);
      
      // Check if the user was created successfully
      await checkTestUser(testEmail);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the tests
runTests();