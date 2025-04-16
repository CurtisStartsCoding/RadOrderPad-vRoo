/**
 * Script to clean up the database and prepare it for a proper import
 * This will delete data from tables in the correct order to avoid foreign key constraint issues
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

async function cleanDatabase() {
  let client;
  
  try {
    console.log('Connecting to database...');
    console.log(`Host: ${DB_HOST}, Port: ${DB_PORT}, Database: ${DB_NAME}`);
    
    client = await pool.connect();
    console.log('Database connection established successfully');
    
    // Start a transaction
    await client.query('BEGIN');
    
    // 1. First check current table counts
    console.log('\n=== CURRENT TABLE COUNTS ===');
    const tables = [
      'medical_cpt_codes',
      'medical_icd10_codes',
      'medical_cpt_icd10_mappings',
      'medical_icd10_markdown_docs'
    ];
    
    for (const table of tables) {
      const countQuery = `SELECT COUNT(*) FROM ${table};`;
      const countResult = await client.query(countQuery);
      console.log(`${table}: ${countResult.rows[0].count.toLocaleString()} rows`);
    }
    
    // 2. Delete from tables in the correct order (to avoid foreign key constraint issues)
    console.log('\n=== DELETING DATA FROM TABLES ===');
    
    // First delete from mappings (has foreign keys to both CPT and ICD-10)
    console.log('Deleting from medical_cpt_icd10_mappings...');
    await client.query('DELETE FROM medical_cpt_icd10_mappings;');
    
    // Then delete from markdown docs (has foreign key to ICD-10)
    console.log('Deleting from medical_icd10_markdown_docs...');
    await client.query('DELETE FROM medical_icd10_markdown_docs;');
    
    // Then delete from ICD-10 codes
    console.log('Deleting from medical_icd10_codes...');
    await client.query('DELETE FROM medical_icd10_codes;');
    
    // We'll keep the CPT codes since they've been successfully imported
    console.log('Keeping medical_cpt_codes intact');
    
    // 3. Verify that tables are empty
    console.log('\n=== VERIFYING TABLES ARE EMPTY ===');
    for (const table of tables) {
      if (table !== 'medical_cpt_codes') {
        const countQuery = `SELECT COUNT(*) FROM ${table};`;
        const countResult = await client.query(countQuery);
        console.log(`${table}: ${countResult.rows[0].count.toLocaleString()} rows`);
        
        if (countResult.rows[0].count > 0) {
          console.log(`WARNING: ${table} still has data!`);
        }
      }
    }
    
    // Check CPT codes count
    const cptCountQuery = `SELECT COUNT(*) FROM medical_cpt_codes;`;
    const cptCountResult = await client.query(cptCountQuery);
    console.log(`medical_cpt_codes: ${cptCountResult.rows[0].count.toLocaleString()} rows (kept intact)`);
    
    // Commit the transaction
    await client.query('COMMIT');
    console.log('\nDatabase cleanup completed successfully');
    
    console.log('\n=== NEXT STEPS ===');
    console.log('1. Import ICD-10 codes');
    console.log('2. Import mappings');
    console.log('3. Import markdown docs');
    
  } catch (error) {
    // Rollback the transaction in case of error
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error('Error:', error.message);
    console.error('Transaction rolled back');
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
cleanDatabase().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});