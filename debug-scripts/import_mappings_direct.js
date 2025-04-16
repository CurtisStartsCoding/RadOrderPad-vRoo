/**
 * Script to import mappings directly using a prepared statement approach
 * This avoids SQL syntax issues by using parameterized queries
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

// Create a connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

async function importMappingsDirect() {
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
    
    // Create a direct mapping for J18.9 (Pneumonia) to demonstrate functionality
    console.log('\n=== CREATING DIRECT MAPPINGS ===');
    
    // Define the mappings
    const mappings = [
      {
        icd10_code: 'J18.9',
        cpt_code: '71045', // Chest X-ray, single view
        appropriateness: 9,
        evidence_source: 'ACR Appropriateness Criteria',
        refined_justification: 'Chest X-ray is the initial imaging test of choice for suspected pneumonia. It can identify consolidation, infiltrates, and other findings consistent with pneumonia.'
      },
      {
        icd10_code: 'J18.9',
        cpt_code: '71046', // Chest X-ray, 2 views
        appropriateness: 9,
        evidence_source: 'ACR Appropriateness Criteria',
        refined_justification: 'Two-view chest X-ray is highly appropriate for suspected pneumonia, providing better visualization of the lungs compared to a single view.'
      },
      {
        icd10_code: 'J18.9',
        cpt_code: '71250', // Chest CT without contrast
        appropriateness: 7,
        evidence_source: 'ACR Appropriateness Criteria',
        refined_justification: 'Chest CT is appropriate when chest X-ray findings are inconclusive or when complications of pneumonia are suspected. It provides more detailed imaging of the lung parenchyma.'
      }
    ];
    
    // Insert each mapping
    for (const mapping of mappings) {
      const insertQuery = `
        INSERT INTO medical_cpt_icd10_mappings 
        (icd10_code, cpt_code, appropriateness, evidence_source, refined_justification, imported_at, updated_at)
        VALUES 
        ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
      `;
      
      await client.query(insertQuery, [
        mapping.icd10_code,
        mapping.cpt_code,
        mapping.appropriateness,
        mapping.evidence_source,
        mapping.refined_justification
      ]);
      
      console.log(`  Inserted mapping: J18.9 -> ${mapping.cpt_code} (Appropriateness: ${mapping.appropriateness}/9)`);
    }
    
    // Create a direct markdown doc for J18.9
    console.log('\n=== CREATING DIRECT MARKDOWN DOC ===');
    
    const markdownContent = `# Medical Imaging Recommendation for ICD-10 Code J18.9

## Pneumonia, unspecified organism

### Clinical Overview
Pneumonia is an infection that inflames the air sacs in one or both lungs. The air sacs may fill with fluid or pus, causing cough with phlegm or pus, fever, chills, and difficulty breathing.

### Recommended Imaging
- **Primary Imaging**: Chest X-ray (PA and lateral)
- **Secondary Imaging**: Chest CT (if X-ray is inconclusive or complications are suspected)

### Imaging Notes
- Chest X-ray is the initial imaging modality of choice for suspected pneumonia
- Findings may include consolidation, interstitial patterns, or pleural effusion
- CT may be considered in cases of suspected complications or when the diagnosis remains uncertain after chest X-ray

### Clinical Decision Support
- Consider patient's age, comorbidities, and severity of symptoms
- Follow-up imaging may be necessary to ensure resolution, particularly in high-risk patients
- No imaging may be necessary for healthy young adults with mild symptoms and clear diagnosis`;

    const markdownQuery = `
      INSERT INTO medical_icd10_markdown_docs 
      (icd10_code, content, file_path, import_date)
      VALUES 
      ($1, $2, '/docs/J18.9.md', CURRENT_TIMESTAMP);
    `;
    
    await client.query(markdownQuery, ['J18.9', markdownContent]);
    console.log('Markdown doc for J18.9 inserted successfully');
    
    // Verify the insertion
    console.log('\n=== VERIFYING INSERTION ===');
    
    // Check mappings
    const mappingQuery = `
      SELECT m.icd10_code, i.description as icd10_description, 
             m.cpt_code, c.description as cpt_description,
             m.appropriateness
      FROM medical_cpt_icd10_mappings m
      JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
      JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
      WHERE m.icd10_code = 'J18.9'
      ORDER BY m.appropriateness DESC;
    `;
    
    const mappingResult = await client.query(mappingQuery);
    
    if (mappingResult.rows.length > 0) {
      console.log(`Found ${mappingResult.rows.length} mappings for J18.9:`);
      mappingResult.rows.forEach(row => {
        console.log(`  J18.9 (${row.icd10_description}) -> ${row.cpt_code} (${row.cpt_description}): ${row.appropriateness}/9`);
      });
    } else {
      console.log('No mappings found for J18.9');
    }
    
    // Check markdown doc
    const docQuery = `
      SELECT d.icd10_code, i.description, LENGTH(d.content) as content_length
      FROM medical_icd10_markdown_docs d
      JOIN medical_icd10_codes i ON d.icd10_code = i.icd10_code
      WHERE d.icd10_code = 'J18.9';
    `;
    
    const docResult = await client.query(docQuery);
    
    if (docResult.rows.length > 0) {
      console.log(`\nFound markdown doc for J18.9:`);
      console.log(`  J18.9 (${docResult.rows[0].description}): ${docResult.rows[0].content_length} characters`);
    } else {
      console.log('\nNo markdown doc found for J18.9');
    }
    
    // Final table counts
    console.log('\n=== FINAL TABLE COUNTS ===');
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

// Run the function
importMappingsDirect().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});