/**
 * Script to efficiently import ICD-10 codes in batches
 * This uses batched transactions for better performance
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

// Source file and batch configuration
const sourceFile = 'Data/medical_tables_export_2025-04-11T23-40-51-963Z.sql';
const batchSize = 1000; // Number of records per batch
const tablePattern = /^INSERT INTO medical_icd10_codes/;

// Create a connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

async function importICD10Codes() {
  let client;
  
  try {
    console.log('Connecting to database...');
    console.log(`Host: ${DB_HOST}, Port: ${DB_PORT}, Database: ${DB_NAME}`);
    
    client = await pool.connect();
    console.log('Database connection established successfully');
    
    // Extract and process ICD-10 code inserts
    console.log(`\nProcessing source file: ${sourceFile}`);
    console.log(`Using batch size: ${batchSize} records per transaction`);
    
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
      // Check if this is an ICD-10 insert
      if (tablePattern.test(line)) {
        batchRecords.push(line);
        recordCount++;
        totalRecords++;
        
        // If we've reached the batch size, process the batch
        if (recordCount >= batchSize) {
          await processBatch(client, batchNumber, batchRecords);
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
      await processBatch(client, batchNumber, batchRecords);
      batchNumber++;
    }
    
    // Log final stats
    const totalElapsed = (Date.now() - startTime) / 1000;
    const avgRecordsPerSecond = totalRecords / totalElapsed;
    console.log(`\nImport completed successfully!`);
    console.log(`Total records: ${totalRecords.toLocaleString()}`);
    console.log(`Total batches: ${batchNumber}`);
    console.log(`Total time: ${totalElapsed.toFixed(2)}s`);
    console.log(`Average speed: ${avgRecordsPerSecond.toFixed(2)} records/s`);
    
    // Verify the import
    console.log('\nVerifying import...');
    const countQuery = `SELECT COUNT(*) FROM medical_icd10_codes;`;
    const countResult = await client.query(countQuery);
    console.log(`medical_icd10_codes: ${countResult.rows[0].count.toLocaleString()} rows`);
    
    // Check for specific codes
    console.log('\nChecking for specific codes...');
    const specificCodes = ['J18.9', 'M54.5', 'R51'];
    for (const code of specificCodes) {
      const codeQuery = `SELECT icd10_code, description FROM medical_icd10_codes WHERE icd10_code = $1;`;
      const codeResult = await client.query(codeQuery, [code]);
      
      if (codeResult.rows.length > 0) {
        console.log(`${code}: FOUND - ${codeResult.rows[0].description}`);
      } else {
        console.log(`${code}: NOT FOUND`);
      }
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

// Process a batch of records
async function processBatch(client, batchNumber, records) {
  console.log(`Processing batch ${batchNumber} (${records.length} records)...`);
  
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
importICD10Codes().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});