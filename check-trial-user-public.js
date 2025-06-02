/**
 * Script to check trial user validation count and max validations
 * This script connects to the public database for testing
 */
const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.production
const envPath = path.resolve(process.cwd(), '.env.production');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

// Create a connection pool using the production database URL with SSL verification disabled
const connectionString = envConfig.PROD_MAIN_DATABASE_URL ?
  envConfig.PROD_MAIN_DATABASE_URL.replace('sslmode=require', 'sslmode=no-verify') :
  envConfig.MAIN_DATABASE_URL.replace('sslmode=require', 'sslmode=no-verify');

console.log('Using connection string:', connectionString.replace(/:[^:]*@/, ':****@'));

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function checkTrialUser(userId = null, email = null) {
  const client = await pool.connect();
  
  try {
    if (userId) {
      console.log(`Checking trial user with ID: ${userId}`);
    } else if (email) {
      console.log(`Checking trial user with email: ${email}`);
    } else {
      console.log('Checking all trial users');
    }
    
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
    
    // Query the trial user(s)
    let userResult;
    
    if (userId) {
      userResult = await client.query(`
        SELECT id, email, validation_count, max_validations
        FROM trial_users
        WHERE id = $1
      `, [userId]);
    } else if (email) {
      userResult = await client.query(`
        SELECT id, email, validation_count, max_validations
        FROM trial_users
        WHERE email = $1
      `, [email]);
    } else {
      // List all trial users without ID limit
      userResult = await client.query(`
        SELECT id, email, validation_count, max_validations
        FROM trial_users
        ORDER BY id
      `);
    }
    
    if (userResult.rows.length === 0) {
      if (userId) {
        console.log(`No trial user found with ID: ${userId}`);
      } else if (email) {
        console.log(`No trial user found with email: ${email}`);
      } else {
        console.log('No trial users found in the database.');
      }
      return;
    }
    
    if (userId || email) {
      // Display single user
      const user = userResult.rows[0];
      console.log('\nTrial user details:');
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Validation count: ${user.validation_count}`);
      console.log(`Max validations: ${user.max_validations}`);
      console.log(`Remaining validations: ${user.max_validations - user.validation_count}`);
    } else {
      // Display all users
      console.log('\nAll trial users:');
      userResult.rows.forEach(user => {
        console.log('-----------------------------------');
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Validation count: ${user.validation_count}`);
        console.log(`Max validations: ${user.max_validations}`);
        console.log(`Remaining validations: ${user.max_validations - user.validation_count}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking trial user:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Get parameters from command line arguments
const args = process.argv.slice(2);
if (args.length > 0) {
  if (args[0].includes('@')) {
    // If argument contains @, treat it as an email
    checkTrialUser(null, args[0]);
  } else if (!isNaN(args[0])) {
    // If argument is a number, treat it as user ID
    checkTrialUser(parseInt(args[0]));
  } else {
    console.log('Invalid argument. Please provide a user ID or email.');
  }
} else {
  // No arguments, list all users
  checkTrialUser();
}