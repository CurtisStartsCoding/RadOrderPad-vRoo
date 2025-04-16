/**
 * Script to import mappings and markdown docs using a more robust approach
 * This handles SQL syntax issues by using parameterized queries
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

// Create a connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

// Regular expressions for extracting data
const mappingRegex = /INSERT INTO medical_cpt_icd10_mappings VALUES \(([^,]*),\s*'([^']*)',\s*'([^']*)',\s*([^,]*),\s*([^,]*),\s*([^,]*),\s*([^,]*),\s*([^,]*),\s*([^,]*),\s*([^,]*),\s*([^,]*),\s*([^,]*),\s*([^,]*)\);/;
const markdownRegex = /INSERT INTO medical_icd10_markdown_docs VALUES \(([^,]*),\s*'([^']*)',\s*'([^']*)'/;

async function importMappingsRobust() {
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
    
    // Import mappings
    console.log('\n=== IMPORTING MAPPINGS ===');
    await importMappings(client);
    
    // Import markdown docs
    console.log('\n=== IMPORTING MARKDOWN DOCS ===');
    await importMarkdownDocs(client);
    
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

// Import mappings
async function importMappings(client) {
  console.log('Importing mappings...');
  
  // Create a prepared statement
  const insertQuery = `
    INSERT INTO medical_cpt_icd10_mappings 
    (id, icd10_code, cpt_code, appropriateness, evidence_level, evidence_source, 
     evidence_id, enhanced_notes, refined_justification, guideline_version, 
     last_updated, imported_at, updated_at)
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  `;
  
  // Read the file line by line
  const fileStream = fs.createReadStream(sourceFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let mappingCount = 0;
  let batchSize = 100;
  let batch = [];
  
  for await (const line of rl) {
    // Check if this is a mapping insert
    if (line.startsWith('INSERT INTO medical_cpt_icd10_mappings')) {
      try {
        // Extract the values using a more robust approach
        const values = extractMappingValues(line);
        
        if (values) {
          batch.push(values);
          mappingCount++;
          
          // Process in batches
          if (batch.length >= batchSize) {
            await processMappingBatch(client, insertQuery, batch);
            console.log(`Processed ${mappingCount} mappings`);
            batch = [];
          }
        }
      } catch (error) {
        console.error(`Error processing mapping line: ${error.message}`);
        console.error(`Problematic line: ${line.substring(0, 100)}...`);
      }
    }
  }
  
  // Process any remaining mappings
  if (batch.length > 0) {
    await processMappingBatch(client, insertQuery, batch);
    console.log(`Processed ${mappingCount} mappings`);
  }
  
  console.log(`Total mappings imported: ${mappingCount}`);
}

// Extract mapping values from a line
function extractMappingValues(line) {
  // This is a simplified approach - in a real scenario, you'd need a more robust parser
  // that can handle nested quotes, special characters, etc.
  
  // Extract values between parentheses
  const valuesMatch = line.match(/VALUES \((.*)\);/);
  if (!valuesMatch || !valuesMatch[1]) {
    return null;
  }
  
  // Split the values
  const valueString = valuesMatch[1];
  const values = [];
  let currentValue = '';
  let inQuotes = false;
  let escapeNext = false;
  
  for (let i = 0; i < valueString.length; i++) {
    const char = valueString[i];
    
    if (escapeNext) {
      currentValue += char;
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    if (char === "'" && !inQuotes) {
      inQuotes = true;
      continue;
    }
    
    if (char === "'" && inQuotes) {
      // Check if it's an escaped quote
      if (i + 1 < valueString.length && valueString[i + 1] === "'") {
        currentValue += "'";
        i++; // Skip the next quote
        continue;
      }
      
      inQuotes = false;
      continue;
    }
    
    if (char === ',' && !inQuotes) {
      values.push(currentValue);
      currentValue = '';
      continue;
    }
    
    currentValue += char;
  }
  
  // Add the last value
  values.push(currentValue);
  
  // Clean up the values
  for (let i = 0; i < values.length; i++) {
    values[i] = values[i].trim();
    
    // Convert NULL to null
    if (values[i].toUpperCase() === 'NULL') {
      values[i] = null;
    }
  }
  
  return values;
}

// Process a batch of mappings
async function processMappingBatch(client, insertQuery, batch) {
  // Start a transaction
  await client.query('BEGIN');
  
  try {
    // Insert each mapping
    for (const values of batch) {
      await client.query(insertQuery, values);
    }
    
    // Commit the transaction
    await client.query('COMMIT');
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    console.error(`Error in batch: ${error.message}`);
    throw error;
  }
}

// Import markdown docs
async function importMarkdownDocs(client) {
  console.log('Importing markdown docs...');
  
  // Create a prepared statement
  const insertQuery = `
    INSERT INTO medical_icd10_markdown_docs 
    (id, icd10_code, content, file_path, import_date)
    VALUES 
    ($1, $2, $3, $4, CURRENT_TIMESTAMP);
  `;
  
  // Read the file line by line
  const fileStream = fs.createReadStream(sourceFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let docCount = 0;
  let batchSize = 100;
  let batch = [];
  let currentDoc = null;
  let inDoc = false;
  
  for await (const line of rl) {
    // Check if this is a markdown doc insert
    if (line.startsWith('INSERT INTO medical_icd10_markdown_docs')) {
      try {
        // Start a new doc
        const match = line.match(/VALUES \(([^,]*),\s*'([^']*)'/);
        if (match) {
          const id = match[1].trim();
          const icd10_code = match[2].trim();
          
          // Extract the content
          const contentMatch = line.match(/'([^']*)'/g);
          if (contentMatch && contentMatch.length >= 3) {
            // Remove the quotes
            let content = contentMatch[2].substring(1, contentMatch[2].length - 1);
            
            // Fix escaped quotes
            content = content.replace(/''/g, "'");
            
            // Extract the file path
            let filePath = '/docs/' + icd10_code + '.md';
            if (contentMatch.length >= 4) {
              filePath = contentMatch[3].substring(1, contentMatch[3].length - 1);
            }
            
            batch.push([id, icd10_code, content, filePath]);
            docCount++;
            
            // Process in batches
            if (batch.length >= batchSize) {
              await processDocBatch(client, insertQuery, batch);
              console.log(`Processed ${docCount} markdown docs`);
              batch = [];
            }
          }
        }
      } catch (error) {
        console.error(`Error processing markdown doc line: ${error.message}`);
        console.error(`Problematic line: ${line.substring(0, 100)}...`);
      }
    }
  }
  
  // Process any remaining docs
  if (batch.length > 0) {
    await processDocBatch(client, insertQuery, batch);
    console.log(`Processed ${docCount} markdown docs`);
  }
  
  console.log(`Total markdown docs imported: ${docCount}`);
}

// Process a batch of markdown docs
async function processDocBatch(client, insertQuery, batch) {
  // Start a transaction
  await client.query('BEGIN');
  
  try {
    // Insert each doc
    for (const values of batch) {
      await client.query(insertQuery, values);
    }
    
    // Commit the transaction
    await client.query('COMMIT');
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    console.error(`Error in batch: ${error.message}`);
    throw error;
  }
}

// Run the function
importMappingsRobust().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});