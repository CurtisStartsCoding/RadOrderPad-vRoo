/**
 * Script to check trial user validation count and max validations
 * This script connects to the database using the same connection method as other scripts
 */
const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.production
const envPath = path.resolve(process.cwd(), '.env.production');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

// Create a connection pool using the production database URL with sslmode=no-verify
const connectionString = envConfig.MAIN_DATABASE_URL.replace('sslmode=require', 'sslmode=no-verify');

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function checkTrialUser(userId = 31) {
  const client = await pool.connect();
  
  try {
    console.log(`Checking trial user with ID: ${userId}`);
    
    // Check if trial_users table exists
    const tableExistsResult = await client.query(`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'trial_users'
      );
    `);
    
    const tableExists = tableExistsResult.rows[0].exists;
    
    if (!tableExists) {
      console.error('Error: trial_users table does not exist in the database.');
      return;
    }
    
    // Query the trial user
    const userResult = await client.query(`
      SELECT id, email, validation_count, max_validations
      FROM trial_users
      WHERE id = $1
    `, [userId]);
    
    if (userResult.rows.length === 0) {
      console.log(`No trial user found with ID: ${userId}`);
      return;
    }
    
    const user = userResult.rows[0];
    console.log('\nTrial user details:');
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Validation count: ${user.validation_count}`);
    console.log(`Max validations: ${user.max_validations}`);
    console.log(`Remaining validations: ${user.max_validations - user.validation_count}`);
    
  } catch (error) {
    console.error('Error checking trial user:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Get user ID from command line argument or default to 31
const userId = process.argv[2] ? parseInt(process.argv[2]) : 31;
checkTrialUser(userId);