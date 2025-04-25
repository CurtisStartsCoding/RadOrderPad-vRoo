/**
 * Script to create the trial_users table in the production radorder_main database
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables from .env.production
const envConfig = dotenv.parse(fs.readFileSync('.env.production'));

// Use the production main database URL with SSL verification disabled
const connectionString = envConfig.MAIN_DATABASE_URL.replace('?sslmode=require', '?sslmode=no-verify');

// Create a connection pool with SSL settings
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required for self-signed certificates
  }
});

// SQL for creating the trial_users table
const createTableSQL = `
CREATE TABLE IF NOT EXISTS trial_users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  specialty TEXT,
  validation_count INTEGER NOT NULL DEFAULT 0,
  max_validations INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW(),
  last_validation_at TIMESTAMP NULL
);

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_trial_users_email ON trial_users(email);
`;

async function createTrialUsersTable() {
  console.log('Creating trial_users table in production radorder_main database...');
  console.log(`Using connection string: ${connectionString.replace(/:[^:]*@/, ':****@')}`);
  
  const client = await pool.connect();
  
  try {
    // Check if the table already exists
    const tableCheckResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'trial_users'
      );
    `);
    
    const tableExists = tableCheckResult.rows[0].exists;
    
    if (tableExists) {
      console.log('trial_users table already exists. Skipping creation.');
    } else {
      console.log('Creating trial_users table...');
      
      // Create the trial_users table
      await client.query(createTableSQL);
      
      console.log('trial_users table created successfully!');
    }
    
    // Verify the table structure
    const schemaResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'trial_users'
      ORDER BY ordinal_position
    `);
    
    console.log('\ntrial_users table schema:');
    schemaResult.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type}, ${row.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
    });
    
    console.log('\nTable creation completed successfully!');
  } catch (error) {
    console.error('Error creating trial_users table:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
createTrialUsersTable().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});