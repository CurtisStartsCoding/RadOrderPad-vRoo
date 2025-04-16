/**
 * Script to check if J18.9 (Pneumonia) is in the database
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

async function checkJ189InDatabase() {
  let client;
  
  try {
    console.log('Connecting to database...');
    console.log(`Host: ${DB_HOST}, Port: ${DB_PORT}, Database: ${DB_NAME}`);
    
    client = await pool.connect();
    console.log('Database connection established successfully');
    
    // Check if J18.9 is in medical_icd10_codes
    console.log('\n=== CHECKING FOR J18.9 IN MEDICAL_ICD10_CODES ===');
    const icd10Query = `
      SELECT * FROM medical_icd10_codes WHERE icd10_code = 'J18.9';
    `;
    
    const icd10Result = await client.query(icd10Query);
    
    if (icd10Result.rows.length > 0) {
      console.log('FOUND J18.9 in medical_icd10_codes!');
      console.log('Complete record:');
      console.log(JSON.stringify(icd10Result.rows[0], null, 2));
    } else {
      console.log('J18.9 NOT FOUND in medical_icd10_codes');
    }
    
    // Check if J18.9 is in medical_icd10_markdown_docs
    console.log('\n=== CHECKING FOR J18.9 IN MEDICAL_ICD10_MARKDOWN_DOCS ===');
    const markdownQuery = `
      SELECT * FROM medical_icd10_markdown_docs WHERE icd10_code = 'J18.9';
    `;
    
    const markdownResult = await client.query(markdownQuery);
    
    if (markdownResult.rows.length > 0) {
      console.log('FOUND J18.9 in medical_icd10_markdown_docs!');
      console.log('Complete record:');
      console.log(JSON.stringify(markdownResult.rows[0], null, 2));
    } else {
      console.log('J18.9 NOT FOUND in medical_icd10_markdown_docs');
    }
    
    // Check if J18.9 is in any mappings
    console.log('\n=== CHECKING FOR J18.9 IN MEDICAL_CPT_ICD10_MAPPINGS ===');
    const mappingQuery = `
      SELECT m.*, c.description as cpt_description
      FROM medical_cpt_icd10_mappings m
      JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
      WHERE m.icd10_code = 'J18.9';
    `;
    
    const mappingResult = await client.query(mappingQuery);
    
    if (mappingResult.rows.length > 0) {
      console.log(`FOUND ${mappingResult.rows.length} mappings for J18.9!`);
      console.log('Mappings:');
      mappingResult.rows.forEach((row, index) => {
        console.log(`\nMapping ${index + 1}:`);
        console.log(`  ICD-10: J18.9`);
        console.log(`  CPT: ${row.cpt_code} (${row.cpt_description})`);
        console.log(`  Appropriateness: ${row.appropriateness}/9`);
        console.log(`  Evidence Source: ${row.evidence_source || 'N/A'}`);
      });
    } else {
      console.log('No mappings found for J18.9');
    }
    
    // Check total counts in each table
    console.log('\n=== DATABASE TABLE COUNTS ===');
    
    const tables = [
      'medical_icd10_codes',
      'medical_cpt_codes',
      'medical_cpt_icd10_mappings',
      'medical_icd10_markdown_docs'
    ];
    
    for (const table of tables) {
      const countQuery = `SELECT COUNT(*) FROM ${table};`;
      const countResult = await client.query(countQuery);
      console.log(`${table}: ${countResult.rows[0].count.toLocaleString()} rows`);
    }
    
    // Check for other pneumonia codes
    console.log('\n=== CHECKING FOR OTHER PNEUMONIA CODES ===');
    const pneumoniaQuery = `
      SELECT icd10_code, description 
      FROM medical_icd10_codes 
      WHERE description ILIKE '%pneumonia%'
      LIMIT 20;
    `;
    
    const pneumoniaResult = await client.query(pneumoniaQuery);
    
    if (pneumoniaResult.rows.length > 0) {
      console.log(`Found ${pneumoniaResult.rows.length} pneumonia-related codes:`);
      pneumoniaResult.rows.forEach(row => {
        console.log(`  ${row.icd10_code} - ${row.description}`);
      });
    } else {
      console.log('No pneumonia-related codes found');
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

// Run the function
checkJ189InDatabase().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});