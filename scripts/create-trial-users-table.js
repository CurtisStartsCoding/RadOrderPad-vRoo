/**
 * Script to create the trial_users table in the radorder_main database
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables from .env.production
const envConfig = dotenv.parse(fs.readFileSync('.env.production'));

// Create a connection pool using the production database URL with sslmode=no-verify
const connectionString = envConfig.MAIN_DATABASE_URL.replace('sslmode=require', 'sslmode=no-verify');

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false } // Use this for testing
});

async function createTrialUsersTable() {
  console.log('Creating trial_users table in radorder_main database...');
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
      await client.query(`
        CREATE TABLE trial_users (
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
        CREATE INDEX idx_trial_users_email ON trial_users(email);
      `);
      
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
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
createTrialUsersTable().catch(err => {
  console.error('Unexpected error:', err);
});