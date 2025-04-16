/**
 * Script to check database connection details
 */
require('dotenv').config();
const { Pool } = require('pg');

// Database connection
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

async function checkConnection() {
  let client;
  
  try {
    console.log('Connection details:');
    console.log(`Host: ${DB_HOST}`);
    console.log(`Port: ${DB_PORT}`);
    console.log(`Database: ${DB_NAME}`);
    console.log(`User: ${DB_USER}`);
    console.log(`Password: ${DB_PASSWORD ? '******' : 'not set'}`);
    
    console.log('\nAttempting to connect to database...');
    client = await pool.connect();
    console.log('Database connection established successfully');
    
    // Run a simple query
    console.log('\nRunning test query...');
    const result = await client.query('SELECT current_database(), current_user, version();');
    console.log('Query result:');
    console.log(result.rows[0]);
    
    // Check if we can access the tables
    console.log('\nChecking table counts:');
    const tables = [
      'medical_cpt_codes',
      'medical_icd10_codes',
      'medical_cpt_icd10_mappings',
      'medical_icd10_markdown_docs'
    ];
    
    for (const table of tables) {
      const countQuery = `SELECT COUNT(*) FROM ${table};`;
      const countResult = await client.query(countQuery);
      console.log(`${table}: ${countResult.rows[0].count.toLocaleString()} rows`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (client) {
      client.release();
      console.log('\nDatabase connection released');
    }
    
    // Close the pool
    await pool.end();
    console.log('Connection pool closed');
  }
}

// Run the function
checkConnection().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});