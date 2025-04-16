/**
 * Script to add test medical data to the database
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

// Test data
const testICD10Codes = [
  {
    icd10_code: 'M54.5',
    description: 'Low back pain',
    clinical_notes: 'Common condition affecting the lumbar region',
    imaging_modalities: 'X-ray, MRI, CT',
    primary_imaging: 'X-ray',
    keywords: 'back pain lumbar spine'
  },
  {
    icd10_code: 'R10.31',
    description: 'Right lower quadrant pain',
    clinical_notes: 'May indicate appendicitis or other abdominal conditions',
    imaging_modalities: 'CT, Ultrasound',
    primary_imaging: 'CT with contrast',
    keywords: 'abdominal pain appendicitis RLQ'
  },
  {
    icd10_code: 'R51',
    description: 'Headache',
    clinical_notes: 'Common symptom with various causes',
    imaging_modalities: 'MRI, CT',
    primary_imaging: 'MRI without contrast',
    keywords: 'head pain migraine'
  }
];

const testCPTCodes = [
  {
    cpt_code: '72110',
    description: 'X-ray of lower spine, minimum 4 views',
    modality: 'X-ray',
    body_part: 'Lumbar spine'
  },
  {
    cpt_code: '74177',
    description: 'CT of abdomen and pelvis with contrast',
    modality: 'CT',
    body_part: 'Abdomen and pelvis'
  },
  {
    cpt_code: '70551',
    description: 'MRI brain without contrast',
    modality: 'MRI',
    body_part: 'Brain'
  }
];

const testMappings = [
  {
    icd10_code: 'M54.5',
    cpt_code: '72110',
    appropriateness: 8,
    evidence_source: 'ACR Appropriateness Criteria',
    refined_justification: 'X-ray is appropriate for initial evaluation of low back pain'
  },
  {
    icd10_code: 'R10.31',
    cpt_code: '74177',
    appropriateness: 9,
    evidence_source: 'ACR Appropriateness Criteria',
    refined_justification: 'CT with contrast is the gold standard for suspected appendicitis'
  },
  {
    icd10_code: 'R51',
    cpt_code: '70551',
    appropriateness: 7,
    evidence_source: 'ACR Appropriateness Criteria',
    refined_justification: 'MRI without contrast is appropriate for chronic headache evaluation'
  }
];

const testMarkdownDocs = [
  {
    icd10_code: 'M54.5',
    content: '# Low Back Pain\n\nLow back pain is a common condition affecting the lumbar region. Initial imaging with X-ray is appropriate for cases with red flag symptoms.',
    file_path: '/docs/M54.5.md'
  },
  {
    icd10_code: 'R10.31',
    content: '# Right Lower Quadrant Pain\n\nRight lower quadrant pain may indicate appendicitis. CT with contrast is the preferred imaging modality.',
    file_path: '/docs/R10.31.md'
  },
  {
    icd10_code: 'R51',
    content: '# Headache\n\nHeadache is a common symptom with various causes. MRI without contrast is appropriate for chronic or severe cases.',
    file_path: '/docs/R51.md'
  }
];

async function addTestData() {
  let client;
  
  try {
    console.log('Connecting to database...');
    console.log(`Host: ${DB_HOST}, Port: ${DB_PORT}, Database: ${DB_NAME}`);
    
    client = await pool.connect();
    console.log('Database connection established successfully');
    
    // Start a transaction
    await client.query('BEGIN');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await client.query('DELETE FROM medical_icd10_markdown_docs');
    await client.query('DELETE FROM medical_cpt_icd10_mappings');
    await client.query('DELETE FROM medical_cpt_codes');
    await client.query('DELETE FROM medical_icd10_codes');
    
    // Insert ICD-10 codes
    console.log('Inserting ICD-10 codes...');
    for (const code of testICD10Codes) {
      await client.query(`
        INSERT INTO medical_icd10_codes (
          icd10_code, description, clinical_notes, imaging_modalities, 
          primary_imaging, keywords, imported_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, [
        code.icd10_code, code.description, code.clinical_notes,
        code.imaging_modalities, code.primary_imaging, code.keywords
      ]);
    }
    
    // Insert CPT codes
    console.log('Inserting CPT codes...');
    for (const code of testCPTCodes) {
      await client.query(`
        INSERT INTO medical_cpt_codes (
          cpt_code, description, modality, body_part, imported_at, updated_at
        ) VALUES ($1, $2, $3, $4, NOW(), NOW())
      `, [
        code.cpt_code, code.description, code.modality, code.body_part
      ]);
    }
    
    // Insert mappings
    console.log('Inserting mappings...');
    for (const mapping of testMappings) {
      await client.query(`
        INSERT INTO medical_cpt_icd10_mappings (
          icd10_code, cpt_code, appropriateness, evidence_source, 
          refined_justification, imported_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      `, [
        mapping.icd10_code, mapping.cpt_code, mapping.appropriateness,
        mapping.evidence_source, mapping.refined_justification
      ]);
    }
    
    // Insert markdown docs
    console.log('Inserting markdown docs...');
    for (const doc of testMarkdownDocs) {
      await client.query(`
        INSERT INTO medical_icd10_markdown_docs (
          icd10_code, content, file_path, import_date
        ) VALUES ($1, $2, $3, NOW())
      `, [
        doc.icd10_code, doc.content, doc.file_path
      ]);
    }
    
    // Commit the transaction
    await client.query('COMMIT');
    console.log('Test data added successfully');
    
    // Verify the data was inserted
    console.log('\nVerifying data insertion:');
    
    const icd10Count = await client.query('SELECT COUNT(*) FROM medical_icd10_codes');
    console.log(`ICD-10 codes: ${icd10Count.rows[0].count}`);
    
    const cptCount = await client.query('SELECT COUNT(*) FROM medical_cpt_codes');
    console.log(`CPT codes: ${cptCount.rows[0].count}`);
    
    const mappingCount = await client.query('SELECT COUNT(*) FROM medical_cpt_icd10_mappings');
    console.log(`Mappings: ${mappingCount.rows[0].count}`);
    
    const docCount = await client.query('SELECT COUNT(*) FROM medical_icd10_markdown_docs');
    console.log(`Markdown docs: ${docCount.rows[0].count}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    
    // Rollback the transaction on error
    if (client) {
      await client.query('ROLLBACK');
      console.log('Transaction rolled back due to error');
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

// Run the function
addTestData().catch(err => {
  console.error('Unhandled error:', err);
  pool.end();
});