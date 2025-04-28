// Script to update the test user's password hash
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '../.env.production' });

// Get the database URL from environment variables
const mainDbUrl = process.env.MAIN_DATABASE_URL;

// Create modified connection string with SSL verification disabled
const noVerifyMainDbUrl = mainDbUrl.replace('?sslmode=require', '?sslmode=no-verify');

console.log('=== User Password Update Tool ===');
console.log('This tool will update the test user\'s password hash.');

// Create connection pool with SSL verification disabled
const pool = new Pool({
  connectionString: noVerifyMainDbUrl,
  ssl: {
    rejectUnauthorized: false // Disable SSL certificate verification
  }
});

// Function to update the user's password hash
async function updateUserPassword(email, password) {
  console.log(`\nUpdating password for user with email '${email}'...`);
  
  try {
    // Check if the user exists
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      console.log(`❌ User with email '${email}' not found in the database.`);
      return false;
    }
    
    const user = userResult.rows[0];
    console.log(`✅ User found:`);
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    
    // Generate a bcrypt hash for the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Update the user's password hash
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2',
      [passwordHash, email]
    );
    
    console.log(`✅ Password updated for user with email '${email}'.`);
    console.log(`New password hash: ${passwordHash}`);
    
    // Verify the update
    const updatedUserResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const updatedUser = updatedUserResult.rows[0];
    
    if (updatedUser.password_hash) {
      console.log(`✅ Password hash verified in database.`);
      return true;
    } else {
      console.log(`❌ Password hash not found in database after update.`);
      return false;
    }
  } catch (err) {
    console.error('❌ Error updating user password:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
    return false;
  }
}

// Run the update
async function run() {
  try {
    // Update the test user's password
    const testEmail = 'test.admin@example.com';
    const testPassword = 'password123';
    
    await updateUserPassword(testEmail, testPassword);
  } catch (err) {
    console.error('Unexpected error:', err);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the update
run();