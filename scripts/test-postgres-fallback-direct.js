/**
 * Script to directly test the PostgreSQL fallback functionality
 */
import { queryMainDb } from '../dist/config/db.js';
import { formatDatabaseContext } from '../dist/utils/database/context-formatter.js';
import { categorizeKeywords } from '../dist/utils/database/keyword-categorizer.js';

// Sample keywords for testing
const sampleKeywords = [
  'shoulder',
  'pain',
  'MRI',
  'rotator cuff',
  'tear',
  'osteoarthritis'
];

/**
 * Test the PostgreSQL fallback functionality directly
 */
async function testPostgresFallback() {
  try {
    console.log('Testing PostgreSQL fallback functionality directly...');
    console.log('Sample keywords:', sampleKeywords);
    
    // Categorize keywords for more targeted queries
    const categorizedKeywords = categorizeKeywords(sampleKeywords);
    console.log('Categorized keywords for PostgreSQL fallback:', categorizedKeywords);
    
    // Simple query to find relevant ICD-10 codes
    const icd10Query = `
      SELECT icd10_code, description, clinical_notes, imaging_modalities, primary_imaging
      FROM medical_icd10_codes
      WHERE ${sampleKeywords.map((_, index) => 
        `description ILIKE $${index + 1} OR 
         clinical_notes ILIKE $${index + 1} OR 
         keywords ILIKE $${index + 1}`
      ).join(' OR ')}
      LIMIT 10
    `;
    
    const icd10Params = sampleKeywords.map(keyword => `%${keyword}%`);
    console.log('ICD-10 query params for PostgreSQL fallback:', icd10Params);
    const icd10Result = await queryMainDb(icd10Query, icd10Params);
    console.log(`Found ${icd10Result.rows.length} relevant ICD-10 codes with PostgreSQL fallback`);
    
    if (icd10Result.rows.length > 0) {
      console.log('Sample ICD-10 codes:');
      icd10Result.rows.slice(0, 5).forEach(row => {
        console.log(`${row.icd10_code}: ${row.description}`);
      });
    }
    
    // Simple query to find relevant CPT codes
    const cptQuery = `
      SELECT cpt_code, description, modality, body_part
      FROM medical_cpt_codes
      WHERE ${sampleKeywords.map((_, index) => 
        `description ILIKE $${index + 1} OR 
         body_part ILIKE $${index + 1} OR 
         modality ILIKE $${index + 1}`
      ).join(' OR ')}
      LIMIT 10
    `;
    
    const cptParams = sampleKeywords.map(keyword => `%${keyword}%`);
    console.log('CPT query params for PostgreSQL fallback:', cptParams);
    const cptResult = await queryMainDb(cptQuery, cptParams);
    console.log(`Found ${cptResult.rows.length} relevant CPT codes with PostgreSQL fallback`);
    
    if (cptResult.rows.length > 0) {
      console.log('Sample CPT codes:');
      cptResult.rows.slice(0, 5).forEach(row => {
        console.log(`${row.cpt_code}: ${row.description} (${row.modality}, ${row.body_part})`);
      });
    }
    
    // Simple query to find relevant mappings
    const mappingQuery = `
      SELECT m.id, m.icd10_code, i.description as icd10_description, 
             m.cpt_code, c.description as cpt_description, 
             m.appropriateness, m.evidence_source, m.refined_justification
      FROM medical_cpt_icd10_mappings m
      JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
      JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
      WHERE ${sampleKeywords.map((_, index) => 
        `i.description ILIKE $${index + 1} OR 
         c.description ILIKE $${index + 1} OR 
         c.body_part ILIKE $${index + 1} OR 
         c.modality ILIKE $${index + 1}`
      ).join(' OR ')}
      LIMIT 10
    `;
    
    const mappingParams = sampleKeywords.map(keyword => `%${keyword}%`);
    console.log('Mapping query params for PostgreSQL fallback:', mappingParams);
    const mappingResult = await queryMainDb(mappingQuery, mappingParams);
    console.log(`Found ${mappingResult.rows.length} relevant mappings with PostgreSQL fallback`);
    
    if (mappingResult.rows.length > 0) {
      console.log('Sample mappings:');
      mappingResult.rows.slice(0, 5).forEach(row => {
        console.log(`${row.icd10_code} (${row.icd10_description}) -> ${row.cpt_code} (${row.cpt_description})`);
      });
    }
    
    // Simple query to find relevant markdown docs
    const markdownQuery = `
      SELECT md.id, md.icd10_code, i.description as icd10_description, 
             LEFT(md.content, 1000) as content_preview
      FROM medical_icd10_markdown_docs md
      JOIN medical_icd10_codes i ON md.icd10_code = i.icd10_code
      WHERE ${sampleKeywords.map((_, index) => 
        `i.description ILIKE $${index + 1} OR 
         md.content ILIKE $${index + 1}`
      ).join(' OR ')}
      LIMIT 5
    `;
    
    const markdownParams = sampleKeywords.map(keyword => `%${keyword}%`);
    console.log('Markdown query params for PostgreSQL fallback:', markdownParams);
    const markdownResult = await queryMainDb(markdownQuery, markdownParams);
    console.log(`Found ${markdownResult.rows.length} relevant markdown docs with PostgreSQL fallback`);
    
    if (markdownResult.rows.length > 0) {
      console.log('Sample markdown docs:');
      markdownResult.rows.slice(0, 5).forEach(row => {
        console.log(`${row.icd10_code} (${row.icd10_description}): ${row.content_preview.substring(0, 100)}...`);
      });
    }
    
    // Format the database context
    const formattedContext = formatDatabaseContext(
      icd10Result.rows,
      cptResult.rows,
      mappingResult.rows,
      markdownResult.rows
    );
    
    console.log('\nFormatted database context:');
    console.log(formattedContext);
    
    console.log('\nTest complete!');
  } catch (error) {
    console.error('Error testing PostgreSQL fallback:', error);
  }
}

// Run the test
testPostgresFallback();