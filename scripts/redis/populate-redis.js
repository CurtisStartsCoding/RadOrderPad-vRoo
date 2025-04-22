/**
 * Script to populate Redis with data from PostgreSQL
 */
import { queryMainDb } from '../dist/config/db.js';
import { getRedisClient, closeRedisConnection } from '../dist/config/redis.js';

async function populateRedis() {
  try {
    console.log('Populating Redis with data from PostgreSQL...');
    const client = getRedisClient();
    
    // Check if Redis is connected
    const pingResult = await client.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Get CPT codes from PostgreSQL
    console.log('Getting CPT codes from PostgreSQL...');
    const cptResult = await queryMainDb('SELECT cpt_code, description, modality, body_part FROM medical_cpt_codes LIMIT 100');
    console.log(`Found ${cptResult.rows.length} CPT codes`);
    
    // Store CPT codes in Redis
    console.log('Storing CPT codes in Redis...');
    for (const row of cptResult.rows) {
      const key = `cpt:${row.cpt_code}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client).call('JSON.SET', key, '.', JSON.stringify(row));
      console.log(`Stored ${key}`);
    }
    
    // Get ICD-10 codes from PostgreSQL
    console.log('Getting ICD-10 codes from PostgreSQL...');
    const icd10Result = await queryMainDb('SELECT icd10_code, description, clinical_notes, imaging_modalities, primary_imaging FROM medical_icd10_codes LIMIT 100');
    console.log(`Found ${icd10Result.rows.length} ICD-10 codes`);
    
    // Store ICD-10 codes in Redis
    console.log('Storing ICD-10 codes in Redis...');
    for (const row of icd10Result.rows) {
      const key = `icd10:${row.icd10_code}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client).call('JSON.SET', key, '.', JSON.stringify(row));
      console.log(`Stored ${key}`);
    }
    
    // Get mappings from PostgreSQL
    console.log('Getting mappings from PostgreSQL...');
    const mappingResult = await queryMainDb(`
      SELECT m.id, m.icd10_code, i.description as icd10_description, 
             m.cpt_code, c.description as cpt_description, 
             m.appropriateness, m.evidence_source, m.refined_justification
      FROM medical_cpt_icd10_mappings m
      JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
      JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
      LIMIT 100
    `);
    console.log(`Found ${mappingResult.rows.length} mappings`);
    
    // Store mappings in Redis
    console.log('Storing mappings in Redis...');
    for (const row of mappingResult.rows) {
      const key = `mapping:${row.icd10_code}:${row.cpt_code}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client).call('JSON.SET', key, '.', JSON.stringify(row));
      console.log(`Stored ${key}`);
    }
    
    // Get markdown docs from PostgreSQL
    console.log('Getting markdown docs from PostgreSQL...');
    const markdownResult = await queryMainDb(`
      SELECT md.id, md.icd10_code, i.description as icd10_description, 
             md.content
      FROM medical_icd10_markdown_docs md
      JOIN medical_icd10_codes i ON md.icd10_code = i.icd10_code
      LIMIT 100
    `);
    console.log(`Found ${markdownResult.rows.length} markdown docs`);
    
    // Store markdown docs in Redis
    console.log('Storing markdown docs in Redis...');
    for (const row of markdownResult.rows) {
      const key = `markdown:${row.icd10_code}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client).call('JSON.SET', key, '.', JSON.stringify(row));
      console.log(`Stored ${key}`);
    }
    
    // Check if the data was stored
    const keys = await client.keys('*');
    console.log(`Total Redis keys after population: ${keys.length}`);
    
    console.log('Redis population complete!');
  } catch (error) {
    console.error('Error populating Redis:', error);
  } finally {
    await closeRedisConnection();
  }
}

populateRedis();