/**
 * Script to set all specialty word counts to 33
 */
require('dotenv').config();
const { Pool } = require('pg');

// Get database connection details from environment variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = process.env.DB_NAME || 'radorder_main';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres123';

// Create a connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

async function run() {
  let client;
  
  try {
    console.log('Connecting to database...');
    client = await pool.connect();
    console.log('Connected to database');
    
    // Step 1: Get current specialty configurations
    console.log('\nStep 1: Getting current specialty configurations...');
    const result = await client.query(`
      SELECT specialty_name, optimal_word_count
      FROM specialty_configurations
      ORDER BY specialty_name;
    `);
    
    if (result.rows.length === 0) {
      console.error('No specialty configurations found!');
      return;
    }
    
    console.log('Current specialty configurations:');
    result.rows.forEach(row => {
      console.log(`${row.specialty_name}: ${row.optimal_word_count} words`);
    });
    
    // Step 2: Update all specialty word counts to 33
    console.log('\nStep 2: Updating all specialty word counts to 33...');
    await client.query(`
      UPDATE specialty_configurations
      SET optimal_word_count = 33,
          updated_at = NOW();
    `);
    console.log('All specialty word counts updated to 33');
    
    // Step 3: Verify the update
    console.log('\nStep 3: Verifying the update...');
    const verifyResult = await client.query(`
      SELECT specialty_name, optimal_word_count
      FROM specialty_configurations
      ORDER BY specialty_name;
    `);
    
    console.log('Updated specialty configurations:');
    verifyResult.rows.forEach(row => {
      console.log(`${row.specialty_name}: ${row.optimal_word_count} words`);
    });
    
    console.log('\nUpdate completed successfully.');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (client) {
      client.release();
    }
    // Close the pool
    await pool.end();
  }
}

// Run the function
run().catch(err => {
  console.error('Unhandled error:', err);
});