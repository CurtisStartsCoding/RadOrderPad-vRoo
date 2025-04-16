/**
 * Script to import CPT-ICD10 mappings and markdown docs
 * This should be run after importing ICD-10 codes and CPT codes
 */
require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
const { Pool } = require('pg');
const path = require('path');

// Database connection
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = process.env.DB_NAME || 'radorder_main';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres123';

// Source file
const sourceFile = 'Data/medical_tables_export_2025-04-11T23-40-51-963Z.sql';
const batchSize = 1000; // Number of records per batch

// Create a connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

async function importMappingsAndDocs() {
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
    
    // Import mappings
    console.log('\n=== IMPORTING MAPPINGS ===');
    await importTable(client, 'medical_cpt_icd10_mappings');
    
    // Import markdown docs
    console.log('\n=== IMPORTING MARKDOWN DOCS ===');
    await importTable(client, 'medical_icd10_markdown_docs');
    
    // Verify the import
    console.log('\n=== VERIFYING IMPORT ===');
    for (const table of tables) {
      const countQuery = `SELECT COUNT(*) FROM ${table};`;
      const countResult = await client.query(countQuery);
      console.log(`${table}: ${countResult.rows[0].count.toLocaleString()} rows`);
    }
    
    // Check for specific mappings
    console.log('\n=== CHECKING FOR SPECIFIC MAPPINGS ===');
    const mappingQuery = `
      SELECT m.icd10_code, i.description as icd10_description, 
             m.cpt_code, c.description as cpt_description,
             m.appropriateness
      FROM medical_cpt_icd10_mappings m
      JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
      JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
      WHERE m.icd10_code IN ('J18.9', 'M54.5', 'R51')
      ORDER BY m.icd10_code, m.appropriateness DESC;
    `;
    
    const mappingResult = await client.query(mappingQuery);
    
    if (mappingResult.rows.length > 0) {
      console.log(`Found ${mappingResult.rows.length} mappings for specific codes:`);
      mappingResult.rows.forEach(row => {
        console.log(`  ${row.icd10_code} (${row.icd10_description}) -> ${row.cpt_code} (${row.cpt_description}): ${row.appropriateness}/9`);
      });
    } else {
      console.log('No mappings found for specific codes');
    }
    
    // Check for specific markdown docs
    console.log('\n=== CHECKING FOR SPECIFIC MARKDOWN DOCS ===');
    const docsQuery = `
      SELECT d.icd10_code, i.description, LENGTH(d.content) as content_length
      FROM medical_icd10_markdown_docs d
      JOIN medical_icd10_codes i ON d.icd10_code = i.icd10_code
      WHERE d.icd10_code IN ('J18.9', 'M54.5', 'R51')
      ORDER BY d.icd10_code;
    `;
    
    const docsResult = await client.query(docsQuery);
    
    if (docsResult.rows.length > 0) {
      console.log(`Found ${docsResult.rows.length} markdown docs for specific codes:`);
      docsResult.rows.forEach(row => {
        console.log(`  ${row.icd10_code} (${row.description}): ${row.content_length} characters`);
      });
    } else {
      console.log('No markdown docs found for specific codes');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
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

// Import a specific table
async function importTable(client, tableName) {
  console.log(`Processing table: ${tableName}`);
  
  // Define the pattern for this table
  const tablePattern = new RegExp(`^INSERT INTO ${tableName}`);
  
  // Initialize variables
  const fileStream = fs.createReadStream(sourceFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let batchNumber = 0;
  let recordCount = 0;
  let totalRecords = 0;
  let batchRecords = [];
  let startTime = Date.now();
  
  // Process the file line by line
  for await (const line of rl) {
    // Check if this is a relevant insert
    if (tablePattern.test(line)) {
      batchRecords.push(line);
      recordCount++;
      totalRecords++;
      
      // If we've reached the batch size, process the batch
      if (recordCount >= batchSize) {
        await processBatch(client, tableName, batchNumber, batchRecords);
        batchRecords = [];
        recordCount = 0;
        batchNumber++;
        
        // Log progress
        const elapsed = (Date.now() - startTime) / 1000;
        const recordsPerSecond = totalRecords / elapsed;
        console.log(`Processed ${totalRecords.toLocaleString()} records in ${elapsed.toFixed(2)}s (${recordsPerSecond.toFixed(2)} records/s)`);
      }
    }
  }
  
  // Process any remaining records
  if (batchRecords.length > 0) {
    await processBatch(client, tableName, batchNumber, batchRecords);
    batchNumber++;
  }
  
  // Log final stats
  const totalElapsed = (Date.now() - startTime) / 1000;
  const avgRecordsPerSecond = totalRecords > 0 ? totalRecords / totalElapsed : 0;
  console.log(`\nImport of ${tableName} completed successfully!`);
  console.log(`Total records: ${totalRecords.toLocaleString()}`);
  console.log(`Total batches: ${batchNumber}`);
  console.log(`Total time: ${totalElapsed.toFixed(2)}s`);
  if (totalRecords > 0) {
    console.log(`Average speed: ${avgRecordsPerSecond.toFixed(2)} records/s`);
  }
}

// Process a batch of records
async function processBatch(client, tableName, batchNumber, records) {
  console.log(`Processing ${tableName} batch ${batchNumber} (${records.length} records)...`);
  
  // Start a transaction
  await client.query('BEGIN');
  
  try {
    // Execute each insert statement
    for (const record of records) {
      await client.query(record);
    }
    
    // Commit the transaction
    await client.query('COMMIT');
    console.log(`Batch ${batchNumber} committed successfully`);
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    console.error(`Error in batch ${batchNumber}:`, error.message);
    console.error('Transaction rolled back');
    throw error;
  }
}

// Run the import
importMappingsAndDocs().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});