/**
 * Script to check trial user validation count and max validations
 * Run this on the EC2 instance where the application is deployed
 */
const { Pool } = require('pg');

// Create a connection pool using the environment variable
const pool = new Pool({
  connectionString: process.env.MAIN_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkTrialUser(userId) {
  try {
    console.log(`Checking trial user with ID: ${userId}`);
    
    // Query the trial_users table
    const result = await pool.query(
      'SELECT id, email, validation_count, max_validations FROM trial_users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      console.log(`No trial user found with ID: ${userId}`);
      return;
    }
    
    const user = result.rows[0];
    console.log('Trial user details:');
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Validation count: ${user.validation_count}`);
    console.log(`Max validations: ${user.max_validations}`);
    console.log(`Remaining validations: ${user.max_validations - user.validation_count}`);
  } catch (error) {
    console.error('Error checking trial user:', error);
  } finally {
    await pool.end();
  }
}

// Check trial user with ID 31
checkTrialUser(31);