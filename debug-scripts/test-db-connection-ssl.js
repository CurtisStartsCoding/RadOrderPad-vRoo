// Test script to verify database connection with different SSL configurations
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env.production' });

async function testDatabaseConnection() {
  // Get the database URL from environment variables
  const dbUrl = process.env.MAIN_DATABASE_URL;
  
  // Create two connection configurations:
  // 1. With SSL verification (original)
  // 2. With SSL verification disabled
  
  const originalPool = new Pool({
    connectionString: dbUrl
  });
  
  const noVerifyPool = new Pool({
    connectionString: dbUrl.replace('?sslmode=require', '?sslmode=no-verify')
  });
  
  const rejectUnauthorizedPool = new Pool({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  // Test original connection
  console.log('\n--- Testing original connection ---');
  console.log('Connection string (masked):', dbUrl.replace(/:[^:]*@/, ':****@'));
  try {
    const client = await originalPool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Original connection successful!');
    console.log('Database timestamp:', result.rows[0].now);
    client.release();
    await originalPool.end();
  } catch (err) {
    console.error('❌ Original connection failed:', err.message);
    await originalPool.end();
  }
  
  // Test with sslmode=no-verify
  console.log('\n--- Testing with sslmode=no-verify ---');
  console.log('Connection string (masked):', 
    dbUrl.replace('?sslmode=require', '?sslmode=no-verify').replace(/:[^:]*@/, ':****@'));
  try {
    const client = await noVerifyPool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ no-verify connection successful!');
    console.log('Database timestamp:', result.rows[0].now);
    client.release();
    await noVerifyPool.end();
  } catch (err) {
    console.error('❌ no-verify connection failed:', err.message);
    await noVerifyPool.end();
  }
  
  // Test with rejectUnauthorized: false
  console.log('\n--- Testing with rejectUnauthorized: false ---');
  console.log('Connection string (masked):', dbUrl.replace(/:[^:]*@/, ':****@'));
  console.log('SSL options: { rejectUnauthorized: false }');
  try {
    const client = await rejectUnauthorizedPool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ rejectUnauthorized=false connection successful!');
    console.log('Database timestamp:', result.rows[0].now);
    client.release();
    await rejectUnauthorizedPool.end();
  } catch (err) {
    console.error('❌ rejectUnauthorized=false connection failed:', err.message);
    await rejectUnauthorizedPool.end();
  }
}

testDatabaseConnection()
  .then(() => {
    console.log('\nDatabase connection tests completed.');
  })
  .catch(err => {
    console.error('Unexpected error:', err);
  });