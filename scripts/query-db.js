/**
 * Database Query Utility for Stripe Webhook Testing
 * 
 * This script executes SQL queries against the database and formats the results.
 * It's used by the Stripe webhook test scripts to verify database changes.
 * 
 * Usage:
 * node scripts/query-db.js --query="SELECT * FROM organizations WHERE id = 1"
 */

const { Pool } = require('pg');
const { parseArgs } = require('util');
require('dotenv').config();

// Parse command line arguments
const options = {
  'query': { type: 'string' }
};

const { values } = parseArgs({ options, strict: false });
const query = values['query'];

if (!query) {
  console.error('Error: No query provided. Use --query="YOUR SQL QUERY"');
  process.exit(1);
}

// Database connection
const pool = new Pool({
  connectionString: process.env.MAIN_DATABASE_URL
});

/**
 * Execute a SQL query and format the results
 */
async function executeQuery(sql) {
  const client = await pool.connect();
  
  try {
    const result = await client.query(sql);
    
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      // For SELECT queries, display the results
      if (result.rowCount === 0) {
        console.log('No results found.');
      } else {
        // Format the results as a table
        console.table(result.rows);
      }
      
      // Return the row count
      console.log(`${result.rowCount} row(s) returned.`);
    } else {
      // For non-SELECT queries (INSERT, UPDATE, DELETE), display the affected rows
      console.log(`Query executed successfully. ${result.rowCount} row(s) affected.`);
    }
    
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
    await executeQuery(query);
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