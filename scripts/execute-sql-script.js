/**
 * Script to execute SQL scripts using environment variables for database connection
 * This avoids password prompt issues with direct psql commands
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Get script path from command line arguments
const scriptPath = process.argv[2];
if (!scriptPath) {
  console.error('Error: No SQL script path provided');
  console.error('Usage: node execute-sql-script.js <path-to-sql-script>');
  process.exit(1);
}

// Read SQL script
let sqlScript;
try {
  sqlScript = fs.readFileSync(path.resolve(scriptPath), 'utf8');
  console.log(`Successfully read SQL script: ${scriptPath}`);
} catch (err) {
  console.error(`Error reading SQL script: ${err.message}`);
  process.exit(1);
}

// Create database connection pool using environment variables
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: process.env.PHI_DB || 'radorder_phi',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123'
});

// Execute the SQL script
async function executeScript() {
  const client = await pool.connect();
  try {
    console.log('Connected to database. Executing SQL script...');
    await client.query(sqlScript);
    console.log('SQL script executed successfully');
  } catch (err) {
    console.error(`Error executing SQL script: ${err.message}`);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

executeScript();