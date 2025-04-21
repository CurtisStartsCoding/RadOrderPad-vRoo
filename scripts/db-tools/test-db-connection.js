const { Pool } = require('pg');

// Get database connection details from environment variables
const mainDbConfig = {
  connectionString: process.env.PROD_MAIN_DATABASE_URL || 'postgresql://postgres:Nt35w912%23DietCoke86%21@radorder-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main',
};

const phiDbConfig = {
  connectionString: process.env.PROD_PHI_DATABASE_URL || 'postgresql://postgres:Normandy4950%23Nt35w912%23@radorder-phi-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_phi',
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
  
  // Close connections
  await mainDbPool.end();
  await phiDbPool.end();
}

runTests().catch(console.error);