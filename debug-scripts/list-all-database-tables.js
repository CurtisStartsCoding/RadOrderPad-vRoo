/**
 * Script to list all tables in the database
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
    
    // List all tables in the database
    console.log('\nListing all tables in the database...');
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log('Tables in the database:');
      tablesResult.rows.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    }
    
    // Check if there's a table related to orders or validation
    console.log('\nChecking for tables related to orders or validation...');
    const orderTablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND (table_name LIKE '%order%' OR table_name LIKE '%validation%')
      ORDER BY table_name;
    `);
    
    if (orderTablesResult.rows.length === 0) {
      console.log('No tables related to orders or validation found.');
    } else {
      console.log('Tables related to orders or validation:');
      orderTablesResult.rows.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    }
    
    // Check if there's a table related to tests or logs
    console.log('\nChecking for tables related to tests or logs...');
    const testTablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND (table_name LIKE '%test%' OR table_name LIKE '%log%')
      ORDER BY table_name;
    `);
    
    if (testTablesResult.rows.length === 0) {
      console.log('No tables related to tests or logs found.');
    } else {
      console.log('Tables related to tests or logs:');
      testTablesResult.rows.forEach(table => {
        console.log(`- ${table.table_name}`);
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