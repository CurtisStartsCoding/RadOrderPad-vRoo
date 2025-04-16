/**
 * Script to import the SQL file using psql directly
 * This should handle multiline statements better than Node.js
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

async function importUsingPsql() {
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
    
    // Create a temporary SQL file with just the mappings and markdown docs
    console.log('\n=== EXTRACTING MAPPINGS AND MARKDOWN DOCS ===');
    
    // Use the findstr command (Windows equivalent of grep) to extract the relevant statements
    const extractCommand = `findstr /C:"INSERT INTO medical_cpt_icd10_mappings" /C:"INSERT INTO medical_icd10_markdown_docs" ${sourceFile} > Data/extracted_mappings_and_docs.sql`;
    
    console.log(`Executing extraction command: ${extractCommand}`);
    exec(extractCommand, (extractError, extractStdout, extractStderr) => {
      if (extractError) {
        console.error(`Extraction error: ${extractError.message}`);
        return;
      }
      
      if (extractStderr) {
        console.error(`Extraction stderr: ${extractStderr}`);
      }
      
      console.log('Extraction completed successfully');
      
      // Import the extracted SQL using psql
      console.log('\n=== IMPORTING USING PSQL ===');
      
      // Build the psql command
      const psqlCommand = `set PGPASSWORD=${DB_PASSWORD} && psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f Data/extracted_mappings_and_docs.sql`;
      
      console.log('Executing psql command...');
      exec(psqlCommand, (importError, importStdout, importStderr) => {
        if (importError) {
          console.error(`Import error: ${importError.message}`);
          return;
        }
        
        if (importStderr) {
          console.error(`Import stderr: ${importStderr}`);
        }
        
        console.log(`Import stdout: ${importStdout}`);
        console.log('Import completed successfully');
        
        // Verify the import
        verifyImport();
      });
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    if (client) {
      await client.query('ROLLBACK');
      console.error('Transaction rolled back');
    }
  }
}

// Verify the import
async function verifyImport() {
  let client;
  
  try {
    client = await pool.connect();
    
    console.log('\n=== VERIFYING IMPORT ===');
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
    
    // Check for a variety of ICD-10 codes
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
    console.error('Error verifying import:', error.message);
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
importUsingPsql().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});