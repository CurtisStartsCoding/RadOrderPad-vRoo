/**
 * Script to import the SQL file using psql directly
 * This should handle multiline statements better than Node.js
 */
require('dotenv').config();
const { exec } = require('child_process');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Database connection
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = process.env.DB_NAME || 'radorder_main';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres123';

// Source file with full path
const sourceFile = path.resolve(__dirname, '..', 'Data', 'medical_tables_export_2025-04-11T23-40-51-963Z.sql');
const extractedFile = path.resolve(__dirname, '..', 'Data', 'extracted_mappings_and_docs.sql');

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
    console.log(`Source file: ${sourceFile}`);
    console.log(`Extracted file: ${extractedFile}`);
    
    // Check if the source file exists
    if (!fs.existsSync(sourceFile)) {
      console.error(`Source file does not exist: ${sourceFile}`);
      return;
    }
    
    // Use a different approach to extract the statements - read the file line by line
    const readStream = fs.createReadStream(sourceFile, { encoding: 'utf8' });
    const writeStream = fs.createWriteStream(extractedFile);
    
    let lineReader = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity
    });
    
    let mappingCount = 0;
    let docCount = 0;
    
    console.log('Reading source file and extracting relevant statements...');
    
    for await (const line of lineReader) {
      if (line.includes('INSERT INTO medical_cpt_icd10_mappings')) {
        writeStream.write(line + '\n');
        mappingCount++;
      } else if (line.includes('INSERT INTO medical_icd10_markdown_docs')) {
        writeStream.write(line + '\n');
        docCount++;
      }
    }
    
    writeStream.end();
    console.log(`Extracted ${mappingCount} mapping statements and ${docCount} markdown doc statements`);
    
    // Import the extracted SQL using psql
    console.log('\n=== IMPORTING USING PSQL ===');
    
    // Build the psql command
    const psqlCommand = `set PGPASSWORD=${DB_PASSWORD} && psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f "${extractedFile}"`;
    
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