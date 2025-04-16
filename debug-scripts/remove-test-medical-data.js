/**
 * Script to remove ONLY the test medical data we added
 */
require('dotenv').config();
const { Pool } = require('pg');

// Database connection
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = process.env.DB_NAME || 'radorder_main';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres123';

// Create a connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

// The specific test data we added
const testICD10Codes = ['M54.5', 'R10.31', 'R51'];
const testCPTCodes = ['72110', '74177', '70551'];

async function removeTestData() {
  let client;
  
  try {
    console.log('Connecting to database...');
    console.log(`Host: ${DB_HOST}, Port: ${DB_PORT}, Database: ${DB_NAME}`);
    
    client = await pool.connect();
    console.log('Database connection established successfully');
    
    // Start a transaction
    await client.query('BEGIN');
    
    // Remove only our test data
    console.log('Removing test data...');
    
    // Remove markdown docs for our test ICD-10 codes
    for (const code of testICD10Codes) {
      await client.query(`
        DELETE FROM medical_icd10_markdown_docs
        WHERE icd10_code = $1
      `, [code]);
    }
    
    // Remove mappings for our test codes
    for (const icd10Code of testICD10Codes) {
      for (const cptCode of testCPTCodes) {
        await client.query(`
          DELETE FROM medical_cpt_icd10_mappings
          WHERE icd10_code = $1 AND cpt_code = $2
        `, [icd10Code, cptCode]);
      }
    }
    
    // Remove our test CPT codes
    for (const code of testCPTCodes) {
      await client.query(`
        DELETE FROM medical_cpt_codes
        WHERE cpt_code = $1
      `, [code]);
    }
    
    // Remove our test ICD-10 codes
    for (const code of testICD10Codes) {
      await client.query(`
        DELETE FROM medical_icd10_codes
        WHERE icd10_code = $1
      `, [code]);
    }
    
    // Commit the transaction
    await client.query('COMMIT');
    console.log('Test data removed successfully');
    
    // Count rows in each table to verify
    console.log('\nVerifying row counts after removal:');
    
    const tables = [
      'medical_icd10_codes',
      'medical_cpt_codes',
      'medical_cpt_icd10_mappings',
      'medical_icd10_markdown_docs'
    ];
    
    for (const table of tables) {
      const countResult = await client.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`${table}: ${countResult.rows[0].count} rows`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    
    // Rollback the transaction on error
    if (client) {
      await client.query('ROLLBACK');
      console.log('Transaction rolled back due to error');
    }
  } finally {
    if (client) {
      client.release();
      console.log('\nDatabase connection released');
    }
    
    // Close the pool
    await pool.end();
    console.log('Connection pool closed');
  }
}

// Run the function
removeTestData().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});