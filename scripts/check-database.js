/**
 * Script to check database tables
 */
import { queryMainDb } from '../dist/config/db.js';

async function checkDatabase() {
  try {
    console.log('Checking database tables...');
    
    // Check CPT codes
    const cptResult = await queryMainDb('SELECT COUNT(*) FROM medical_cpt_codes');
    console.log(`CPT codes count: ${cptResult.rows[0].count}`);
    
    // Check ICD-10 codes
    const icd10Result = await queryMainDb('SELECT COUNT(*) FROM medical_icd10_codes');
    console.log(`ICD-10 codes count: ${icd10Result.rows[0].count}`);
    
    // Check mappings
    const mappingResult = await queryMainDb('SELECT COUNT(*) FROM medical_cpt_icd10_mappings');
    console.log(`Mappings count: ${mappingResult.rows[0].count}`);
    
    // Check markdown docs
    const markdownResult = await queryMainDb('SELECT COUNT(*) FROM medical_icd10_markdown_docs');
    console.log(`Markdown docs count: ${markdownResult.rows[0].count}`);
    
    // Sample CPT codes
    const sampleCptResult = await queryMainDb('SELECT cpt_code, description, modality, body_part FROM medical_cpt_codes WHERE body_part ILIKE $1 OR description ILIKE $1 LIMIT 5', ['%shoulder%']);
    console.log('\nSample CPT codes for "shoulder":');
    sampleCptResult.rows.forEach(row => {
      console.log(`${row.cpt_code}: ${row.description} (${row.modality}, ${row.body_part})`);
    });
    
    // Sample ICD-10 codes
    const sampleIcd10Result = await queryMainDb('SELECT icd10_code, description FROM medical_icd10_codes WHERE description ILIKE $1 LIMIT 5', ['%shoulder%']);
    console.log('\nSample ICD-10 codes for "shoulder":');
    sampleIcd10Result.rows.forEach(row => {
      console.log(`${row.icd10_code}: ${row.description}`);
    });
    
  } catch (error) {
    console.error('Error checking database:', error);
  }
}

checkDatabase();