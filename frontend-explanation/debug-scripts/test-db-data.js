const { Pool } = require('pg');

// Replace these with your actual new database endpoints and credentials
const mainDbConfig = {
  user: 'postgres',
  password: 'SimplePassword123',
  host: 'radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com',
  port: 5432,
  database: 'radorder_main',
  ssl: {
    rejectUnauthorized: false
  }
};

const phiDbConfig = {
  user: 'postgres',
  password: 'SimplePassword123',
  host: 'radorderpad-phi-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com',
  port: 5432,
  database: 'radorder_phi',
  ssl: {
    rejectUnauthorized: false
  }
};

// Create connection pools
const mainDbPool = new Pool(mainDbConfig);
const phiDbPool = new Pool(phiDbConfig);

// Test main database data
async function testMainDbData() {
  try {
    console.log('Testing main database data...');
    
    // Check users table
    const usersResult = await mainDbPool.query('SELECT COUNT(*) FROM users');
    console.log('Users count:', usersResult.rows[0].count);
    
    // Check organizations table
    const orgsResult = await mainDbPool.query('SELECT COUNT(*) FROM organizations');
    console.log('Organizations count:', orgsResult.rows[0].count);
    
    // Check medical_cpt_codes table
    const cptResult = await mainDbPool.query('SELECT COUNT(*) FROM medical_cpt_codes');
    console.log('CPT codes count:', cptResult.rows[0].count);
    
    // Check medical_icd10_codes table
    const icd10Result = await mainDbPool.query('SELECT COUNT(*) FROM medical_icd10_codes');
    console.log('ICD-10 codes count:', icd10Result.rows[0].count);
    
    return true;
  } catch (error) {
    console.error('Main database data test failed:', error);
    return false;
  }
}

// Test PHI database data
async function testPhiDbData() {
  try {
    console.log('Testing PHI database data...');
    
    // Check orders table
    const ordersResult = await phiDbPool.query('SELECT COUNT(*) FROM orders');
    console.log('Orders count:', ordersResult.rows[0].count);
    
    // Check patients table
    const patientsResult = await phiDbPool.query('SELECT COUNT(*) FROM patients');
    console.log('Patients count:', patientsResult.rows[0].count);
    
    // Check validation_attempts table
    const attemptsResult = await phiDbPool.query('SELECT COUNT(*) FROM validation_attempts');
    console.log('Validation attempts count:', attemptsResult.rows[0].count);
    
    return true;
  } catch (error) {
    console.error('PHI database data test failed:', error);
    return false;
  }
}

// Run tests
async function runTests() {
  const mainSuccess = await testMainDbData();
  const phiSuccess = await testPhiDbData();
  
  console.log('\nTest Results:');
  console.log('Main Database Data:', mainSuccess ? 'AVAILABLE' : 'FAILED');
  console.log('PHI Database Data:', phiSuccess ? 'AVAILABLE' : 'FAILED');
  
  if (mainSuccess && phiSuccess) {
    console.log('\nBoth databases have data! Your migration was successful.');
    console.log('You can now update your Vercel environment variables with these connection strings:');
    console.log(`MAIN_DATABASE_URL=postgresql://${mainDbConfig.user}:${mainDbConfig.password}@${mainDbConfig.host}:${mainDbConfig.port}/${mainDbConfig.database}?sslmode=require`);
    console.log(`PHI_DATABASE_URL=postgresql://${phiDbConfig.user}:${phiDbConfig.password}@${phiDbConfig.host}:${phiDbConfig.port}/${phiDbConfig.database}?sslmode=require`);
  } else {
    console.log('\nDatabase data test failed. Some tables might be empty or not properly migrated.');
  }
  
  // Close connections
  await mainDbPool.end();
  await phiDbPool.end();
}

runTests().catch(console.error);