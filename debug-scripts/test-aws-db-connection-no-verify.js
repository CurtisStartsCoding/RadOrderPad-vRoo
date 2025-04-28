// Test AWS RDS database connection with SSL verification disabled
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env.production' });

// Get the database URL from environment variables
const dbUrl = process.env.MAIN_DATABASE_URL;

// Create a modified connection string with SSL verification disabled
const noVerifyDbUrl = dbUrl.replace('?sslmode=require', '?sslmode=no-verify');

console.log('Testing connection to AWS RDS database with SSL verification disabled...');
console.log('Original connection string (masked):', dbUrl.replace(/:[^:]*@/, ':****@'));
console.log('Modified connection string (masked):', noVerifyDbUrl.replace(/:[^:]*@/, ':****@'));

// Create connection pool with SSL verification disabled
const pool = new Pool({
  connectionString: noVerifyDbUrl,
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
    
    // Try to list tables
    console.log('\nListing tables in the database:');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('No tables found in the public schema.');
    } else {
      tablesResult.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.table_name}`);
      });
    }
    
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
      console.log('\nSuccessfully connected to AWS RDS database with SSL verification disabled!');
      console.log('Next steps:');
      console.log('1. Update Vercel environment variables to disable SSL verification');
      console.log('2. Redeploy your application');
    } else {
      console.log('\nFailed to connect to AWS RDS database even with SSL verification disabled.');
      console.log('Possible issues:');
      console.log('1. RDS security group does not allow connections from your IP');
      console.log('2. Database credentials are incorrect');
      console.log('3. Database is not publicly accessible');
    }
  })
  .catch(err => {
    console.error('Unexpected error:', err);
  });