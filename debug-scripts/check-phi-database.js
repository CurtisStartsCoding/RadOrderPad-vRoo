/**
 * Script to check the PHI database
 */
require('dotenv').config();
const { Pool } = require('pg');

// Get database connection details from environment variables
// Use the PHI database instead of the main database
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = 'radorder_phi'; // Use the PHI database
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
    console.log('Connecting to PHI database...');
    client = await pool.connect();
    console.log('Connected to PHI database');
    
    // List all tables in the PHI database
    console.log('\nListing all tables in the PHI database...');
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('No tables found in the PHI database.');
    } else {
      console.log('Tables in the PHI database:');
      tablesResult.rows.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    }
    
    // Check for tables related to orders or validation
    console.log('\nChecking for tables related to orders or validation...');
    const orderTablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND (table_name LIKE '%order%' OR table_name LIKE '%validation%')
      ORDER BY table_name;
    `);
    
    if (orderTablesResult.rows.length === 0) {
      console.log('No tables related to orders or validation found in the PHI database.');
    } else {
      console.log('Tables related to orders or validation in the PHI database:');
      orderTablesResult.rows.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
      
      // For each order-related table, check the most recent entries
      for (const table of orderTablesResult.rows) {
        console.log(`\nChecking most recent entries in ${table.table_name}...`);
        try {
          const entriesResult = await client.query(`
            SELECT *
            FROM ${table.table_name}
            ORDER BY created_at DESC
            LIMIT 5;
          `);
          
          if (entriesResult.rows.length === 0) {
            console.log(`No entries found in ${table.table_name}.`);
          } else {
            console.log(`Most recent entries in ${table.table_name}:`);
            entriesResult.rows.forEach(entry => {
              console.log(`ID: ${entry.id}, Created: ${entry.created_at}`);
              if (entry.status) {
                console.log(`Status: ${entry.status}`);
              }
              if (entry.validation_status) {
                console.log(`Validation Status: ${entry.validation_status}`);
              }
              console.log('---');
            });
          }
        } catch (error) {
          console.log(`Error checking ${table.table_name}: ${error.message}`);
          
          // Try to get the table structure
          try {
            const structureResult = await client.query(`
              SELECT column_name, data_type
              FROM information_schema.columns
              WHERE table_name = '${table.table_name}'
              ORDER BY ordinal_position;
            `);
            
            if (structureResult.rows.length > 0) {
              console.log(`Columns in ${table.table_name}:`);
              structureResult.rows.forEach(column => {
                console.log(`- ${column.column_name} (${column.data_type})`);
              });
            }
          } catch (structureError) {
            console.log(`Error getting structure of ${table.table_name}: ${structureError.message}`);
          }
        }
      }
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