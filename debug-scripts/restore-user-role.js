// Script to restore the test user's role to 'admin_referring'
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env.production' });

// Get the database URL from environment variables
const mainDbUrl = process.env.MAIN_DATABASE_URL;

// Create modified connection string with SSL verification disabled
const noVerifyMainDbUrl = mainDbUrl.replace('?sslmode=require', '?sslmode=no-verify');

console.log('=== User Role Restoration Tool ===');
console.log('This tool will restore the test user\'s role to \'admin_referring\'.');

// Create connection pool with SSL verification disabled
const pool = new Pool({
  connectionString: noVerifyMainDbUrl,
  ssl: {
    rejectUnauthorized: false // Disable SSL certificate verification
  }
});

// Function to update the user's role
async function restoreUserRole(email, originalRole) {
  console.log(`\nRestoring role for user with email '${email}' to '${originalRole}'...`);
  
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
    console.log(`  Current Role: ${user.role}`);
    
    // Update the user's role
    await pool.query(
      'UPDATE users SET role = $1 WHERE email = $2',
      [originalRole, email]
    );
    
    console.log(`✅ Role restored for user with email '${email}' to '${originalRole}'.`);
    
    // Verify the update
    const updatedUserResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const updatedUser = updatedUserResult.rows[0];
    
    if (updatedUser.role === originalRole) {
      console.log(`✅ Role verified in database.`);
      return true;
    } else {
      console.log(`❌ Role not updated in database. Current role: ${updatedUser.role}`);
      return false;
    }
  } catch (err) {
    console.error('❌ Error restoring user role:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
    return false;
  }
}

// Run the update
async function run() {
  try {
    // Restore the test user's role
    const testEmail = 'test.admin@example.com';
    const originalRole = 'admin_referring';
    
    await restoreUserRole(testEmail, originalRole);
  } catch (err) {
    console.error('Unexpected error:', err);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the update
run();