// Simple script to test AWS RDS database connection
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env.production' });

// Get the database URL from environment variables
const dbUrl = process.env.MAIN_DATABASE_URL;

console.log('Testing connection to AWS RDS database...');
console.log('Connection string (masked):', dbUrl.replace(/:[^:]*@/, ':****@'));

// Create connection pool with SSL options to handle self-signed certificates
const pool = new Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false // Disable SSL certificate verification
  }
});

async function testConnection() {
  try {
    // Try to connect
    const client = await pool.connect();
    console.log('✅ Connection successful!');
    
    // Execute a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log(`Database server time: ${result.rows[0].current_time}`);
    
    // Try to get database version
    const versionResult = await client.query('SELECT version()');
    console.log(`Database version: ${versionResult.rows[0].version}`);
    
    // Release client back to pool
    client.release();
    
    return true;
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
    return false;
  } finally {
    // Close pool
    await pool.end();
  }
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log('\nSuccessfully connected to AWS RDS database!');
      console.log('Next steps:');
      console.log('1. Update Vercel environment variables to disable SSL verification');
      console.log('2. Redeploy your application');
    } else {
      console.log('\nFailed to connect to AWS RDS database.');
      console.log('Possible issues:');
      console.log('1. RDS security group does not allow connections from your IP');
      console.log('2. Database credentials are incorrect');
      console.log('3. Database is not publicly accessible');
    }
  })
  .catch(err => {
    console.error('Unexpected error:', err);
  });