/**
 * Script to check if the status column exists in the organizations table
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

// Get the connection string and modify it to use sslmode=no-verify
let connectionString = process.env.PROD_MAIN_DATABASE_URL;
connectionString = connectionString.replace('sslmode=require', 'sslmode=no-verify');

// Database connection
const pool = new Pool({
  connectionString: connectionString
});

/**
 * Execute a SQL query and format the results
 */
async function executeQuery(sql) {
  const client = await pool.connect();
  
  try {
    const result = await client.query(sql);
    
    if (result.rowCount === 0) {
      console.log('No results found.');
    } else {
      // Format the results as a table
      console.table(result.rows);
    }
    
    // Return the row count
    console.log(`${result.rowCount} row(s) returned.`);
    
    return result;
  } catch (error) {
    console.error('Error executing query:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Checking if status column exists in organizations table...');
    console.log('Using connection string:', connectionString);
    
    // Query to check if the status column exists
    const query = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'organizations' AND column_name = 'status'
    `;
    
    await executeQuery(query);
    
    // Query to get a sample organization with status
    console.log('\nGetting a sample organization with status...');
    const sampleQuery = `
      SELECT id, name, type, status
      FROM organizations
      LIMIT 1
    `;
    
    await executeQuery(sampleQuery);
    
    process.exit(0);
  } catch (error) {
    console.error('Query execution failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the main function
main();