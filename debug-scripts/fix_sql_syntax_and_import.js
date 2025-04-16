/**
 * Script to fix SQL syntax issues and import the data
 * This specifically targets the unbalanced quotes issue
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

// Source file and output file
const sourceFile = 'Data/medical_tables_export_2025-04-11T23-40-51-963Z.sql';
const outputFile = 'Data/fixed_medical_tables.sql';

// Create a connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

async function fixSqlAndImport() {
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
    
    // Fix the SQL file
    console.log('\n=== FIXING SQL FILE ===');
    await fixSqlFile();
    
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
    
    // Import the fixed SQL
    console.log('\n=== IMPORTING FIXED SQL ===');
    
    // Create a temporary SQL file with just the mappings
    const mappingsFile = 'Data/mappings_only.sql';
    const writeStream = fs.createWriteStream(mappingsFile);
    
    // Read the fixed SQL file and extract only the mappings
    const fileStream = fs.createReadStream(outputFile);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    
    let mappingCount = 0;
    
    for await (const line of rl) {
      if (line.startsWith('INSERT INTO medical_cpt_icd10_mappings')) {
        writeStream.write(line + '\n');
        mappingCount++;
      }
    }
    
    writeStream.end();
    console.log(`Extracted ${mappingCount} mapping statements to ${mappingsFile}`);
    
    // Import the mappings using psql
    console.log('Importing mappings using psql...');
    
    const { exec } = require('child_process');
    const command = `set PGPASSWORD=${DB_PASSWORD} && psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f ${mappingsFile}`;
    
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

// Fix the SQL file
async function fixSqlFile() {
  console.log(`Reading source file: ${sourceFile}`);
  console.log(`Writing fixed file: ${outputFile}`);
  
  const outputStream = fs.createWriteStream(outputFile);
  
  // Read the file line by line
  const fileStream = fs.createReadStream(sourceFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let lineNumber = 0;
  let fixedLines = 0;
  
  for await (const line of rl) {
    lineNumber++;
    
    let fixedLine = line;
    
    // Check if this is a mapping insert
    if (line.startsWith('INSERT INTO medical_cpt_icd10_mappings')) {
      // Count the quotes
      const singleQuotes = (line.match(/'/g) || []).length;
      
      // If there's an odd number of quotes, we need to fix it
      if (singleQuotes % 2 === 1) {
        // Find the last quote position
        let lastQuotePos = -1;
        for (let i = 0; i < line.length; i++) {
          if (line[i] === "'") {
            lastQuotePos = i;
          }
        }
        
        // If we found the last quote, add a closing quote at the end
        if (lastQuotePos !== -1) {
          // Check if the line ends with a semicolon
          if (fixedLine.endsWith(';')) {
            // Add the closing quote before the semicolon
            fixedLine = fixedLine.substring(0, fixedLine.length - 1) + "';";
          } else {
            // Add the closing quote and a semicolon
            fixedLine = fixedLine + "';";
          }
          
          fixedLines++;
        }
      }
      
      // Check if the line is missing a closing parenthesis
      if (!fixedLine.includes(');')) {
        // Add a closing parenthesis before the semicolon
        if (fixedLine.endsWith(';')) {
          fixedLine = fixedLine.substring(0, fixedLine.length - 1) + ');';
        } else {
          // Add both closing parenthesis and semicolon
          fixedLine = fixedLine + ');';
        }
        
        fixedLines++;
      }
    }
    
    // Write the fixed line to the output file
    outputStream.write(fixedLine + '\n');
  }
  
  outputStream.end();
  console.log(`Fixed ${fixedLines} lines`);
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
               (SELECT COUNT(*) FROM medical_cpt_icd10_mappings m WHERE m.icd10_code = i.icd10_code) as mapping_count
        FROM medical_icd10_codes i
        WHERE i.icd10_code = $1;
      `;
      
      const codeResult = await client.query(codeQuery, [code]);
      
      if (codeResult.rows.length > 0) {
        console.log(`${code}: FOUND - ${codeResult.rows[0].description}`);
        console.log(`  Mappings: ${codeResult.rows[0].mapping_count}`);
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
fixSqlAndImport().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});