/**
 * Script to verify the medical data import
 * This checks all tables and performs various validation checks
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

async function verifyMedicalDataImport() {
  let client;
  
  try {
    console.log('Connecting to database...');
    console.log(`Host: ${DB_HOST}, Port: ${DB_PORT}, Database: ${DB_NAME}`);
    
    client = await pool.connect();
    console.log('Database connection established successfully');
    
    // Check table counts
    console.log('\n=== TABLE COUNTS ===');
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
    
    // Check for a variety of CPT codes
    console.log('\n=== CHECKING FOR VARIOUS CPT CODES ===');
    const sampleCptCodes = ['70450', '71045', '72110', '73721', '74177', '76700', '78452', '93306'];
    
    for (const code of sampleCptCodes) {
      const codeQuery = `
        SELECT c.cpt_code, c.description, c.modality,
               (SELECT COUNT(*) FROM medical_cpt_icd10_mappings m WHERE m.cpt_code = c.cpt_code) as mapping_count
        FROM medical_cpt_codes c
        WHERE c.cpt_code = $1;
      `;
      
      const codeResult = await client.query(codeQuery, [code]);
      
      if (codeResult.rows.length > 0) {
        console.log(`${code}: FOUND - ${codeResult.rows[0].description}`);
        console.log(`  Modality: ${codeResult.rows[0].modality}`);
        console.log(`  Mappings: ${codeResult.rows[0].mapping_count}`);
      } else {
        console.log(`${code}: NOT FOUND`);
      }
    }
    
    // Check for mappings with high appropriateness
    console.log('\n=== CHECKING FOR HIGH APPROPRIATENESS MAPPINGS ===');
    const highAppQuery = `
      SELECT m.icd10_code, i.description as icd10_description, 
             m.cpt_code, c.description as cpt_description, c.modality,
             m.appropriateness
      FROM medical_cpt_icd10_mappings m
      JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
      JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
      WHERE m.appropriateness >= 8
      ORDER BY m.appropriateness DESC, m.icd10_code
      LIMIT 10;
    `;
    
    const highAppResult = await client.query(highAppQuery);
    
    if (highAppResult.rows.length > 0) {
      console.log(`Found ${highAppResult.rows.length} high appropriateness mappings:`);
      highAppResult.rows.forEach(row => {
        console.log(`  ${row.icd10_code} (${row.icd10_description}) -> ${row.cpt_code} (${row.modality}): ${row.appropriateness}/9`);
      });
    } else {
      console.log('No high appropriateness mappings found');
    }
    
    // Check for markdown docs with substantial content
    console.log('\n=== CHECKING FOR SUBSTANTIAL MARKDOWN DOCS ===');
    const docsQuery = `
      SELECT d.icd10_code, i.description, LENGTH(d.content) as content_length
      FROM medical_icd10_markdown_docs d
      JOIN medical_icd10_codes i ON d.icd10_code = i.icd10_code
      ORDER BY LENGTH(d.content) DESC
      LIMIT 10;
    `;
    
    const docsResult = await client.query(docsQuery);
    
    if (docsResult.rows.length > 0) {
      console.log(`Found ${docsResult.rows.length} substantial markdown docs:`);
      docsResult.rows.forEach(row => {
        console.log(`  ${row.icd10_code} (${row.description}): ${row.content_length.toLocaleString()} characters`);
      });
    } else {
      console.log('No markdown docs found');
    }
    
    // Check for referential integrity
    console.log('\n=== CHECKING REFERENTIAL INTEGRITY ===');
    
    // Check for mappings with invalid ICD-10 codes
    const invalidIcdQuery = `
      SELECT COUNT(*) FROM medical_cpt_icd10_mappings m
      LEFT JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
      WHERE i.icd10_code IS NULL;
    `;
    
    const invalidIcdResult = await client.query(invalidIcdQuery);
    console.log(`Mappings with invalid ICD-10 codes: ${invalidIcdResult.rows[0].count}`);
    
    // Check for mappings with invalid CPT codes
    const invalidCptQuery = `
      SELECT COUNT(*) FROM medical_cpt_icd10_mappings m
      LEFT JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
      WHERE c.cpt_code IS NULL;
    `;
    
    const invalidCptResult = await client.query(invalidCptQuery);
    console.log(`Mappings with invalid CPT codes: ${invalidCptResult.rows[0].count}`);
    
    // Check for markdown docs with invalid ICD-10 codes
    const invalidDocQuery = `
      SELECT COUNT(*) FROM medical_icd10_markdown_docs d
      LEFT JOIN medical_icd10_codes i ON d.icd10_code = i.icd10_code
      WHERE i.icd10_code IS NULL;
    `;
    
    const invalidDocResult = await client.query(invalidDocQuery);
    console.log(`Markdown docs with invalid ICD-10 codes: ${invalidDocResult.rows[0].count}`);
    
    console.log('\n=== VERIFICATION COMPLETE ===');
    
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
verifyMedicalDataImport().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});