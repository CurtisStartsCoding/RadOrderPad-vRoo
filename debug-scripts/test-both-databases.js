// Test script to verify connection to both main and PHI databases with SSL verification disabled
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env.production' });

// Get the database URLs from environment variables
const mainDbUrl = process.env.MAIN_DATABASE_URL;
const phiDbUrl = process.env.PHI_DATABASE_URL;

// Create modified connection strings with SSL verification disabled
const noVerifyMainDbUrl = mainDbUrl.replace('?sslmode=require', '?sslmode=no-verify');
const noVerifyPhiDbUrl = phiDbUrl.replace('?sslmode=require', '?sslmode=no-verify');

console.log('=== Database Connection Test Tool ===');
console.log('This tool will test the connection to both PostgreSQL databases with SSL verification disabled.');

// Function to test database connection
async function testConnection(name, connectionString) {
  console.log(`\n--- Testing connection to ${name} database ---`);
  console.log('Connection string (masked):', connectionString.replace(/:[^:]*@/, ':****@'));
  
  // Create connection pool with SSL verification disabled
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Disable SSL certificate verification
    }
  });
  
  try {
    // Try to connect
    const client = await pool.connect();
    console.log(`✅ Connection to ${name} database successful!`);
    
    // Execute a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log(`Database server time: ${result.rows[0].current_time}`);
    
    // Try to get database version
    const versionResult = await client.query('SELECT version()');
    console.log(`Database version: ${versionResult.rows[0].version}`);
    
    // Release client back to pool
    client.release();
    
    // Close pool
    await pool.end();
    
    return true;
  } catch (err) {
    console.error(`❌ Connection to ${name} database failed:`, err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
    
    // Close pool
    await pool.end();
    
    return false;
  }
}

// Run the tests
async function runTests() {
  // Test main database
  const mainSuccess = await testConnection('MAIN', noVerifyMainDbUrl);
  
  // Test PHI database
  const phiSuccess = await testConnection('PHI', noVerifyPhiDbUrl);
  
  // Summary
  console.log('\n=== Test Results ===');
  console.log(`MAIN database: ${mainSuccess ? '✅ Connected' : '❌ Failed'}`);
  console.log(`PHI database: ${phiSuccess ? '✅ Connected' : '❌ Failed'}`);
  
  if (mainSuccess && phiSuccess) {
    console.log('\n✅ Both database connections successful with SSL verification disabled!');
    console.log('\nNext steps:');
    console.log('1. Update Vercel environment variables to use ?sslmode=no-verify');
    console.log('2. Redeploy your application');
    console.log('3. Test the login endpoint');
  } else {
    console.log('\n❌ One or both database connections failed.');
    console.log('Please check your database credentials and network connectivity.');
  }
}

// Run the tests
runTests();