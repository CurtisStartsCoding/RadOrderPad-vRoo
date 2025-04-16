/**
 * Script to check the specialty table structure and content
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
    
    // Step 1: Get the table structure
    console.log('\nStep 1: Getting specialty table structure...');
    const structureResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'specialties'
      ORDER BY ordinal_position;
    `);
    
    if (structureResult.rows.length === 0) {
      console.error('No columns found for specialties table!');
      return;
    }
    
    console.log('Specialty table structure:');
    structureResult.rows.forEach(row => {
      console.log(`Column: ${row.column_name}, Type: ${row.data_type}, Nullable: ${row.is_nullable}`);
    });
    
    // Step 2: Get the table content
    console.log('\nStep 2: Getting specialty table content...');
    const contentResult = await client.query(`
      SELECT *
      FROM specialties
      LIMIT 5;
    `);
    
    if (contentResult.rows.length === 0) {
      console.error('No rows found in specialties table!');
      return;
    }
    
    console.log('Specialty table content (first 5 rows):');
    contentResult.rows.forEach((row, index) => {
      console.log(`\nRow ${index + 1}:`);
      Object.entries(row).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    });
    
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