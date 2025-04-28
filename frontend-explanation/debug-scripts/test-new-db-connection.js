const { Pool } = require('pg');

// Replace these with your actual new database endpoints and credentials
const mainDbConfig = {
  user: 'postgres',
  password: 'SimplePassword123', // Use the password you set in create-public-rds.sh
  host: 'radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com', // Replace with your actual endpoint
  port: 5432,
  database: 'radorder_main',
  ssl: {
    rejectUnauthorized: false // Accept self-signed certificates
  }
};

const phiDbConfig = {
  user: 'postgres',
  password: 'SimplePassword123', // Use the password you set in create-public-rds.sh
  host: 'radorderpad-phi-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com', // Replace with your actual endpoint
  port: 5432,
  database: 'radorder_phi',
  ssl: {
    rejectUnauthorized: false // Accept self-signed certificates
  }
};

// Create connection pools
const mainDbPool = new Pool(mainDbConfig);
const phiDbPool = new Pool(phiDbConfig);

// Test main database connection
async function testMainDbConnection() {
  try {
    console.log('Testing main database connection...');
    const client = await mainDbPool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Main database connection successful:', result.rows[0].now);
    
    // Test if we can create a table
    try {
      await mainDbPool.query('CREATE TABLE IF NOT EXISTS connection_test (id SERIAL PRIMARY KEY, test_date TIMESTAMP DEFAULT NOW())');
      await mainDbPool.query('INSERT INTO connection_test (test_date) VALUES (NOW())');
      const countResult = await mainDbPool.query('SELECT COUNT(*) FROM connection_test');
      console.log('Created test table and inserted row. Row count:', countResult.rows[0].count);
    } catch (err) {
      console.log('Could not create test table:', err.message);
    }
    
    return true;
  } catch (error) {
    console.error('Main database connection test failed:', error);
    return false;
  }
}

// Test PHI database connection
async function testPhiDbConnection() {
  try {
    console.log('Testing PHI database connection...');
    const client = await phiDbPool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('PHI database connection successful:', result.rows[0].now);
    
    // Test if we can create a table
    try {
      await phiDbPool.query('CREATE TABLE IF NOT EXISTS connection_test (id SERIAL PRIMARY KEY, test_date TIMESTAMP DEFAULT NOW())');
      await phiDbPool.query('INSERT INTO connection_test (test_date) VALUES (NOW())');
      const countResult = await phiDbPool.query('SELECT COUNT(*) FROM connection_test');
      console.log('Created test table and inserted row. Row count:', countResult.rows[0].count);
    } catch (err) {
      console.log('Could not create test table:', err.message);
    }
    
    return true;
  } catch (error) {
    console.error('PHI database connection test failed:', error);
    return false;
  }
}

// Run tests
async function runTests() {
  const mainSuccess = await testMainDbConnection();
  const phiSuccess = await testPhiDbConnection();
  
  console.log('\nTest Results:');
  console.log('Main Database:', mainSuccess ? 'CONNECTED' : 'FAILED');
  console.log('PHI Database:', phiSuccess ? 'CONNECTED' : 'FAILED');
  
  if (mainSuccess && phiSuccess) {
    console.log('\nBoth databases are accessible! Your setup is working correctly.');
    console.log('You can now update your Vercel environment variables with these connection strings:');
    console.log(`MAIN_DATABASE_URL=postgresql://${mainDbConfig.user}:${mainDbConfig.password}@${mainDbConfig.host}:${mainDbConfig.port}/${mainDbConfig.database}?sslmode=require`);
    console.log(`PHI_DATABASE_URL=postgresql://${phiDbConfig.user}:${phiDbConfig.password}@${phiDbConfig.host}:${phiDbConfig.port}/${phiDbConfig.database}?sslmode=require`);
  } else {
    console.log('\nDatabase connection failed. Please check your security group settings and make sure the databases are publicly accessible.');
  }
  
  // Close connections
  await mainDbPool.end();
  await phiDbPool.end();
}

runTests().catch(console.error);