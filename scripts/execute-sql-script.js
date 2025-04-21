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

// Determine which database to use (PHI or MAIN) based on the second command line argument
const dbType = process.argv[3] && process.argv[3].toUpperCase() === 'MAIN' ? 'MAIN' : 'PHI';
console.log(`Using ${dbType} database`);

// Print environment variables for debugging
console.log('Environment variables:');
console.log('- MAIN_DATABASE_URL:', process.env.MAIN_DATABASE_URL ? 'Set' : 'Not set');
console.log('- PHI_DATABASE_URL:', process.env.PHI_DATABASE_URL ? 'Set' : 'Not set');
console.log('- PROD_MAIN_DATABASE_URL:', process.env.PROD_MAIN_DATABASE_URL ? 'Set' : 'Not set');
console.log('- PROD_PHI_DATABASE_URL:', process.env.PROD_PHI_DATABASE_URL ? 'Set' : 'Not set');

// Get the appropriate connection string
let connectionString;
let useSSL = false;

if (dbType === 'PHI') {
  // IMPORTANT: Always use PROD_PHI_DATABASE_URL for PHI database
  // This connects to the public PHI database
  connectionString = process.env.PROD_PHI_DATABASE_URL;
  if (connectionString) {
    console.log('Using PHI database connection string (PROD_PHI_DATABASE_URL)');
    console.log('Connecting to the public PHI database');
    useSSL = true;
  } else {
    console.error('ERROR: PROD_PHI_DATABASE_URL is not set. Cannot connect to public PHI database.');
    console.error('Please set PROD_PHI_DATABASE_URL in your environment variables.');
    process.exit(1);
  }
} else {
  // Try PROD_MAIN_DATABASE_URL first, then fall back to MAIN_DATABASE_URL
  connectionString = process.env.PROD_MAIN_DATABASE_URL;
  if (connectionString) {
    console.log('Using MAIN database connection string (PROD_MAIN_DATABASE_URL)');
    useSSL = true;
  } else {
    connectionString = process.env.MAIN_DATABASE_URL;
    if (connectionString) {
      console.log('Using MAIN database connection string (MAIN_DATABASE_URL)');
      // Check if this is a production URL or local
      useSSL = !connectionString.includes('localhost');
    } else {
      console.log('No MAIN database URL found, falling back to local connection');
      connectionString = `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres123'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5433}/${process.env.MAIN_DB || 'radorder_main'}`;
    }
  }
}

// Modify connection string to disable SSL verification if needed
if (useSSL) {
  connectionString = connectionString.replace('?sslmode=require', '?sslmode=no-verify');
  if (!connectionString.includes('sslmode=')) {
    connectionString += '?sslmode=no-verify';
  }
}

console.log('Connection string (masked):', connectionString.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
console.log('Using SSL:', useSSL);

// Create database connection pool with appropriate SSL settings
let poolConfig;
if (useSSL) {
  poolConfig = {
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  };
} else {
  poolConfig = {
    connectionString
  };
}

console.log('Pool config:', useSSL ? 'Using SSL with rejectUnauthorized: false' : 'Not using SSL');
const pool = new Pool(poolConfig);

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