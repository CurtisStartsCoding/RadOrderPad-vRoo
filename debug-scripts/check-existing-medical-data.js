/**
 * Script to check existing medical data in the database
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

async function checkExistingData() {
  let client;
  
  try {
    console.log('Connecting to database...');
    console.log(`Host: ${DB_HOST}, Port: ${DB_PORT}, Database: ${DB_NAME}`);
    
    client = await pool.connect();
    console.log('Database connection established successfully');
    
    // Count rows in each table
    console.log('\n=== COUNTING ROWS IN MEDICAL TABLES ===');
    
    const tables = [
      'medical_icd10_codes',
      'medical_cpt_codes',
      'medical_cpt_icd10_mappings',
      'medical_icd10_markdown_docs'
    ];
    
    for (const table of tables) {
      try {
        const countQuery = `SELECT COUNT(*) FROM ${table};`;
        const countResult = await client.query(countQuery);
        console.log(`${table}: ${countResult.rows[0].count.toLocaleString()} rows`);
      } catch (error) {
        console.log(`${table}: Error - ${error.message}`);
      }
    }
    
    // Check for specific CPT codes
    console.log('\n=== CHECKING FOR SPECIFIC CPT CODES ===');
    const cptCodes = ['74177', '70551', '72110'];
    
    for (const code of cptCodes) {
      try {
        const cptQuery = `
          SELECT cpt_code, description, modality, body_part 
          FROM medical_cpt_codes 
          WHERE cpt_code = $1;
        `;
        const cptResult = await client.query(cptQuery, [code]);
        
        if (cptResult.rows.length > 0) {
          console.log(`CPT ${code}: FOUND`);
          console.log(`  Description: ${cptResult.rows[0].description}`);
          console.log(`  Modality: ${cptResult.rows[0].modality}`);
          console.log(`  Body Part: ${cptResult.rows[0].body_part}`);
        } else {
          console.log(`CPT ${code}: NOT FOUND`);
        }
      } catch (error) {
        console.log(`CPT ${code}: Error - ${error.message}`);
      }
    }
    
    // Check for specific ICD-10 codes
    console.log('\n=== CHECKING FOR SPECIFIC ICD-10 CODES ===');
    const icd10Codes = ['J18.9', 'M54.5', 'R51'];
    
    for (const code of icd10Codes) {
      try {
        const icd10Query = `
          SELECT icd10_code, description, is_billable, clinical_notes 
          FROM medical_icd10_codes 
          WHERE icd10_code = $1;
        `;
        const icd10Result = await client.query(icd10Query, [code]);
        
        if (icd10Result.rows.length > 0) {
          console.log(`ICD-10 ${code}: FOUND`);
          console.log(`  Description: ${icd10Result.rows[0].description}`);
          console.log(`  Billable: ${icd10Result.rows[0].is_billable}`);
          if (icd10Result.rows[0].clinical_notes) {
            console.log(`  Clinical Notes: ${icd10Result.rows[0].clinical_notes.substring(0, 100)}...`);
          }
        } else {
          console.log(`ICD-10 ${code}: NOT FOUND`);
        }
      } catch (error) {
        console.log(`ICD-10 ${code}: Error - ${error.message}`);
      }
    }
    
    // Check for mappings
    console.log('\n=== CHECKING FOR MAPPINGS ===');
    try {
      const mappingQuery = `
        SELECT m.icd10_code, i.description as icd10_description, 
               m.cpt_code, c.description as cpt_description,
               m.appropriateness
        FROM medical_cpt_icd10_mappings m
        LEFT JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
        LEFT JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
        LIMIT 5;
      `;
      const mappingResult = await client.query(mappingQuery);
      
      if (mappingResult.rows.length > 0) {
        console.log(`Found ${mappingResult.rows.length} mappings:`);
        mappingResult.rows.forEach((row, index) => {
          console.log(`\nMapping ${index + 1}:`);
          console.log(`  ICD-10: ${row.icd10_code} (${row.icd10_description || 'Unknown'})`);
          console.log(`  CPT: ${row.cpt_code} (${row.cpt_description || 'Unknown'})`);
          console.log(`  Appropriateness: ${row.appropriateness}/9`);
        });
      } else {
        console.log('No mappings found');
      }
    } catch (error) {
      console.log(`Mappings: Error - ${error.message}`);
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
checkExistingData().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});