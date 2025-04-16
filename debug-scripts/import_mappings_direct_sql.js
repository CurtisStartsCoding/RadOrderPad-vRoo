/**
 * Script to import mappings and markdown docs using direct SQL execution
 * This uses the same approach that worked for ICD-10 codes
 */
require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
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
    
    // Import mappings and markdown docs
    console.log('\n=== IMPORTING MAPPINGS AND MARKDOWN DOCS ===');
    await importTables(client);
    
    // Verify the import
    console.log('\n=== VERIFYING IMPORT ===');
    for (const table of tables) {
      const countQuery = `SELECT COUNT(*) FROM ${table};`;
      const countResult = await client.query(countQuery);
      console.log(`${table}: ${countResult.rows[0].count.toLocaleString()} rows`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (client) {
      await client.query('ROLLBACK');
      console.error('Transaction rolled back');
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

// Import mappings and markdown docs
async function importTables(client) {
  console.log('Reading SQL file and executing statements directly...');
  
  // Read the file line by line
  const fileStream = fs.createReadStream(sourceFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let mappingCount = 0;
  let docCount = 0;
  let batchSize = 100;
  let mappingBatch = [];
  let docBatch = [];
  
  for await (const line of rl) {
    // Check if this is a mapping or markdown doc insert
    if (line.startsWith('INSERT INTO medical_cpt_icd10_mappings')) {
      mappingBatch.push(line);
      mappingCount++;
      
      // Process in batches
      if (mappingBatch.length >= batchSize) {
        await processBatch(client, mappingBatch);
        console.log(`Processed ${mappingCount} mappings`);
        mappingBatch = [];
      }
    } else if (line.startsWith('INSERT INTO medical_icd10_markdown_docs')) {
      docBatch.push(line);
      docCount++;
      
      // Process in batches
      if (docBatch.length >= batchSize) {
        await processBatch(client, docBatch);
        console.log(`Processed ${docCount} markdown docs`);
        docBatch = [];
      }
    }
  }
  
  // Process any remaining mappings
  if (mappingBatch.length > 0) {
    await processBatch(client, mappingBatch);
    console.log(`Processed ${mappingCount} mappings`);
  }
  
  // Process any remaining docs
  if (docBatch.length > 0) {
    await processBatch(client, docBatch);
    console.log(`Processed ${docCount} markdown docs`);
  }
  
  console.log(`Total mappings imported: ${mappingCount}`);
  console.log(`Total markdown docs imported: ${docCount}`);
}

// Process a batch of SQL statements
async function processBatch(client, batch) {
  // Start a transaction
  await client.query('BEGIN');
  
  try {
    // Execute each SQL statement
    for (const sql of batch) {
      await client.query(sql);
    }
    
    // Commit the transaction
    await client.query('COMMIT');
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    console.error(`Error in batch: ${error.message}`);
    console.error(`Problematic SQL: ${error.sql ? error.sql.substring(0, 100) + '...' : 'Unknown'}`);
    throw error;
  }
}

// Run the function
importMappingsAndDocs().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});