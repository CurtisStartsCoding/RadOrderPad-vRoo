/**
 * Script to check for shoulder-related codes in PostgreSQL
 */
import { queryMainDb } from '../dist/config/db.js';

async function checkShoulderCodes() {
  try {
    console.log('Checking for shoulder-related codes in PostgreSQL...');
    
    // Check for shoulder-related CPT codes
    const cptResult = await queryMainDb("SELECT cpt_code, description, modality, body_part FROM medical_cpt_codes WHERE description ILIKE '%shoulder%' OR body_part ILIKE '%shoulder%'");
    console.log(`Found ${cptResult.rows.length} shoulder-related CPT codes`);
    
    if (cptResult.rows.length > 0) {
      console.log('\nSample shoulder-related CPT codes:');
      cptResult.rows.slice(0, 10).forEach(row => {
        console.log(`${row.cpt_code}: ${row.description} (${row.modality}, ${row.body_part})`);
      });
    }
    
    // Check for shoulder-related ICD-10 codes
    const icd10Result = await queryMainDb("SELECT icd10_code, description FROM medical_icd10_codes WHERE description ILIKE '%shoulder%'");
    console.log(`\nFound ${icd10Result.rows.length} shoulder-related ICD-10 codes`);
    
    if (icd10Result.rows.length > 0) {
      console.log('\nSample shoulder-related ICD-10 codes:');
      icd10Result.rows.slice(0, 10).forEach(row => {
        console.log(`${row.icd10_code}: ${row.description}`);
      });
    }
    
    // Check for MRI-related CPT codes
    const mriResult = await queryMainDb("SELECT cpt_code, description, modality, body_part FROM medical_cpt_codes WHERE description ILIKE '%MRI%' OR modality ILIKE '%MRI%'");
    console.log(`\nFound ${mriResult.rows.length} MRI-related CPT codes`);
    
    if (mriResult.rows.length > 0) {
      console.log('\nSample MRI-related CPT codes:');
      mriResult.rows.slice(0, 10).forEach(row => {
        console.log(`${row.cpt_code}: ${row.description} (${row.modality}, ${row.body_part})`);
      });
    }
    
    // Check for rotator cuff-related codes
    const rotatorCuffResult = await queryMainDb("SELECT cpt_code, description, modality, body_part FROM medical_cpt_codes WHERE description ILIKE '%rotator cuff%'");
    console.log(`\nFound ${rotatorCuffResult.rows.length} rotator cuff-related CPT codes`);
    
    if (rotatorCuffResult.rows.length > 0) {
      console.log('\nSample rotator cuff-related CPT codes:');
      rotatorCuffResult.rows.slice(0, 10).forEach(row => {
        console.log(`${row.cpt_code}: ${row.description} (${row.modality}, ${row.body_part})`);
      });
    }
    
  } catch (error) {
    console.error('Error checking for shoulder-related codes:', error);
  }
}

checkShoulderCodes();