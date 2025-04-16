/**
 * Script to check the llm_validation_logs table
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
    
    // First, let's check the structure of the llm_validation_logs table
    console.log('\nChecking the structure of the llm_validation_logs table...');
    const structureResult = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'llm_validation_logs'
      ORDER BY ordinal_position;
    `);
    
    if (structureResult.rows.length === 0) {
      console.log('No columns found in the llm_validation_logs table.');
    } else {
      console.log('Columns in the llm_validation_logs table:');
      structureResult.rows.forEach(column => {
        console.log(`- ${column.column_name} (${column.data_type})`);
      });
    }
    
    // Now, let's check the most recent entries in the llm_validation_logs table
    console.log('\nChecking the most recent entries in the llm_validation_logs table...');
    const logsResult = await client.query(`
      SELECT *
      FROM llm_validation_logs
      ORDER BY created_at DESC
      LIMIT 10;
    `);
    
    if (logsResult.rows.length === 0) {
      console.log('No entries found in the llm_validation_logs table.');
    } else {
      console.log('Most recent entries in the llm_validation_logs table:');
      logsResult.rows.forEach(log => {
        console.log(`ID: ${log.id}, Created: ${log.created_at}`);
        console.log(`Request: ${JSON.stringify(log.request_data).substring(0, 100)}...`);
        console.log(`Response: ${JSON.stringify(log.response_data).substring(0, 100)}...`);
        console.log(`Status: ${log.status}`);
        console.log('---');
      });
    }
    
    // Check for successful validations
    console.log('\nChecking for successful validations...');
    const successResult = await client.query(`
      SELECT *
      FROM llm_validation_logs
      WHERE status = 'success'
      ORDER BY created_at DESC
      LIMIT 5;
    `);
    
    if (successResult.rows.length === 0) {
      console.log('No successful validations found in the llm_validation_logs table.');
    } else {
      console.log('Most recent successful validations:');
      successResult.rows.forEach(log => {
        console.log(`ID: ${log.id}, Created: ${log.created_at}`);
        console.log(`Status: ${log.status}`);
        console.log('---');
      });
    }
    
    // Check for failed validations
    console.log('\nChecking for failed validations...');
    const failureResult = await client.query(`
      SELECT *
      FROM llm_validation_logs
      WHERE status != 'success'
      ORDER BY created_at DESC
      LIMIT 5;
    `);
    
    if (failureResult.rows.length === 0) {
      console.log('No failed validations found in the llm_validation_logs table.');
    } else {
      console.log('Most recent failed validations:');
      failureResult.rows.forEach(log => {
        console.log(`ID: ${log.id}, Created: ${log.created_at}`);
        console.log(`Status: ${log.status}`);
        console.log(`Error: ${log.error_message || 'No error message'}`);
        console.log('---');
      });
    }
    
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