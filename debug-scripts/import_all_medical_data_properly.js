/**
 * Script to import ALL medical data properly
 * This uses the psql command directly to import from the SQL file
 */
require('dotenv').config();
const { exec } = require('child_process');
const { Pool } = require('pg');

// Database connection
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = process.env.DB_NAME || 'radorder_main';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres123';

// Source file
const sourceFile = 'Data/medical_tables_export_2025-04-11T23-40-51-963Z.sql';

// Create a connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

async function importAllMedicalData() {
  let client;
  
  try {
    console.log('Connecting to database...');
    console.log(`Host: ${DB_HOST}, Port: ${DB_PORT}, Database: ${DB_NAME}`);
    
    client = await pool.connect();
    console.log('Database connection established successfully');
    
    // First check current table counts
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
    
    // Clean up the database first (delete mappings and markdown docs)
    console.log('\n=== CLEANING UP DATABASE ===');
    
    // Start a transaction
    await client.query('BEGIN');
    
    // Delete from tables in the correct order (to avoid foreign key constraint issues)
    console.log('Deleting from medical_cpt_icd10_mappings...');
    await client.query('DELETE FROM medical_cpt_icd10_mappings;');
    
    console.log('Deleting from medical_icd10_markdown_docs...');
    await client.query('DELETE FROM medical_icd10_markdown_docs;');
    
    // Commit the transaction
    await client.query('COMMIT');
    console.log('Database cleanup completed successfully');
    
    // Import the mappings and markdown docs using psql
    console.log('\n=== IMPORTING ALL MAPPINGS AND MARKDOWN DOCS ===');
    console.log(`Using source file: ${sourceFile}`);
    
    // Create a temporary SQL file with just the mappings and markdown docs
    const tempSqlFile = 'Data/temp_mappings_and_docs.sql';
    const command = `
      type ${sourceFile} | findstr /C:"INSERT INTO medical_cpt_icd10_mappings" /C:"INSERT INTO medical_icd10_markdown_docs" > ${tempSqlFile} && 
      set PGPASSWORD=${DB_PASSWORD} && 
      psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f ${tempSqlFile}
    `;
    
    console.log('Executing import command...');
    
    // Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      
      console.log(`stdout: ${stdout}`);
      console.log('Import command executed successfully');
      
      // Check the final table counts
      checkFinalCounts();
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    if (client) {
      await client.query('ROLLBACK');
      console.error('Transaction rolled back');
    }
  }
}

// Check the final table counts
async function checkFinalCounts() {
  let client;
  
  try {
    client = await pool.connect();
    
    console.log('\n=== FINAL TABLE COUNTS ===');
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
    
    // Check for a variety of ICD-10 codes (not just J18.9)
    console.log('\n=== CHECKING FOR VARIOUS ICD-10 CODES ===');
    const sampleCodes = ['A41.9', 'E11.9', 'I21.3', 'J18.9', 'K29.0', 'M54.5', 'R51', 'S06.0'];
    
    for (const code of sampleCodes) {
      const codeQuery = `
        SELECT i.icd10_code, i.description, 
               (SELECT COUNT(*) FROM medical_cpt_icd10_mappings m WHERE m.icd10_code = i.icd10_code) as mapping_count,
               (SELECT COUNT(*) FROM medical_icd10_markdown_docs d WHERE d.icd10_code = i.icd10_code) as doc_count
        FROM medical_icd10_codes i
        WHERE i.icd10_code = $1;
      `;
      
      const codeResult = await client.query(codeQuery, [code]);
      
      if (codeResult.rows.length > 0) {
        console.log(`${code}: FOUND - ${codeResult.rows[0].description}`);
        console.log(`  Mappings: ${codeResult.rows[0].mapping_count}`);
        console.log(`  Markdown docs: ${codeResult.rows[0].doc_count}`);
      } else {
        console.log(`${code}: NOT FOUND`);
      }
    }
    
  } catch (error) {
    console.error('Error checking final counts:', error.message);
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
importAllMedicalData().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});