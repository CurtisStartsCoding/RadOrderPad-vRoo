/**
 * Script to fix SQL syntax issues in mappings data and import all mappings
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
const fixedMappingsFile = 'Data/fixed_mappings.sql';
const fixedDocsFile = 'Data/fixed_markdown_docs.sql';

// Create a connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

async function fixAndImportMappings() {
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
    
    // Fix and import mappings
    console.log('\n=== FIXING AND IMPORTING MAPPINGS ===');
    await fixAndImportTable(client, 'medical_cpt_icd10_mappings');
    
    // Fix and import markdown docs
    console.log('\n=== FIXING AND IMPORTING MARKDOWN DOCS ===');
    await fixAndImportTable(client, 'medical_icd10_markdown_docs');
    
    // Verify the import
    console.log('\n=== VERIFYING IMPORT ===');
    for (const table of tables) {
      const countQuery = `SELECT COUNT(*) FROM ${table};`;
      const countResult = await client.query(countQuery);
      console.log(`${table}: ${countResult.rows[0].count.toLocaleString()} rows`);
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

// Fix and import a specific table
async function fixAndImportTable(client, tableName) {
  console.log(`Processing table: ${tableName}`);
  
  // Define the pattern for this table
  const tablePattern = new RegExp(`^INSERT INTO ${tableName}`);
  
  // Initialize variables
  const fileStream = fs.createReadStream(sourceFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  const outputFile = tableName === 'medical_cpt_icd10_mappings' ? fixedMappingsFile : fixedDocsFile;
  const outputStream = fs.createWriteStream(outputFile);
  
  // Write the transaction start
  outputStream.write('BEGIN;\n\n');
  
  let recordCount = 0;
  let fixedCount = 0;
  
  // Process the file line by line
  for await (const line of rl) {
    // Check if this is a relevant insert
    if (tablePattern.test(line)) {
      recordCount++;
      
      // Fix the line
      let fixedLine = line;
      
      // Fix unterminated quoted strings
      fixedLine = fixedLine.replace(/'\s+n:/g, "' n:");
      fixedLine = fixedLine.replace(/'\s+when/g, "' when");
      
      // Fix other common SQL syntax issues
      fixedLine = fixedLine.replace(/'''/g, "''");
      fixedLine = fixedLine.replace(/\\'/g, "''");
      
      // Ensure the line ends with a semicolon
      if (!fixedLine.endsWith(';')) {
        fixedLine += ';';
      }
      
      // Write the fixed line to the output file
      outputStream.write(fixedLine + '\n');
      
      if (fixedLine !== line) {
        fixedCount++;
      }
    }
  }
  
  // Write the transaction end
  outputStream.write('\nCOMMIT;\n');
  outputStream.end();
  
  console.log(`Fixed ${fixedCount} of ${recordCount} records`);
  console.log(`Saved fixed SQL to ${outputFile}`);
  
  // Import the fixed data
  console.log(`Importing fixed data from ${outputFile}...`);
  
  try {
    // Read the fixed file
    const fixedSql = fs.readFileSync(outputFile, 'utf8');
    
    // Execute the SQL
    await client.query(fixedSql);
    
    console.log(`Import successful!`);
  } catch (error) {
    console.error(`Error importing fixed data:`, error.message);
    throw error;
  }
}

// Run the function
fixAndImportMappings().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});