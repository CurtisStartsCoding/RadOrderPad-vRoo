/**
 * Script to populate Redis with ALL data from PostgreSQL
 */
import { queryMainDb } from '../../dist/config/db.js';
import { getRedisClient, closeRedisConnection, cacheDataWithRedisJson } from '../../dist/config/redis.js';

async function populateRedisFull() {
  try {
    console.log('Populating Redis with ALL data from PostgreSQL...');
    const client = getRedisClient();
    
    // Check if Redis is connected
    const pingResult = await client.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Get CPT codes from PostgreSQL (no limit)
    console.log('Getting ALL CPT codes from PostgreSQL...');
    const cptResult = await queryMainDb('SELECT * FROM medical_cpt_codes');
    console.log(`Found ${cptResult.rows.length} CPT codes`);
    
    // Store CPT codes in Redis
    console.log('Storing CPT codes in Redis...');
    let cptCount = 0;
    for (const row of cptResult.rows) {
      const key = `cpt:${row.cpt_code}`;
      await cacheDataWithRedisJson(key, row, 0);
      cptCount++;
      if (cptCount % 100 === 0) {
        console.log(`Stored ${cptCount} CPT codes so far...`);
      }
    }
    console.log(`Completed storing ${cptCount} CPT codes in Redis`);
    
    // Get ICD-10 codes from PostgreSQL (no limit)
    console.log('Getting ALL ICD-10 codes from PostgreSQL...');
    const icd10Result = await queryMainDb('SELECT * FROM medical_icd10_codes');
    console.log(`Found ${icd10Result.rows.length} ICD-10 codes`);
    
    // Store ICD-10 codes in Redis
    console.log('Storing ICD-10 codes in Redis...');
    let icd10Count = 0;
    for (const row of icd10Result.rows) {
      const key = `icd10:${row.icd10_code}`;
      await cacheDataWithRedisJson(key, row, 0);
      icd10Count++;
      if (icd10Count % 100 === 0) {
        console.log(`Stored ${icd10Count} ICD-10 codes so far...`);
      }
    }
    console.log(`Completed storing ${icd10Count} ICD-10 codes in Redis`);
    
    // Get mappings from PostgreSQL (no limit)
    console.log('Getting ALL mappings from PostgreSQL...');
    const mappingResult = await queryMainDb(`
      SELECT m.id, m.icd10_code, i.description as icd10_description, 
             m.cpt_code, c.description as cpt_description, 
             m.appropriateness, m.evidence_source, m.refined_justification
      FROM medical_cpt_icd10_mappings m
      JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
      JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
    `);
    console.log(`Found ${mappingResult.rows.length} mappings`);
    
    // Store mappings in Redis
    console.log('Storing mappings in Redis...');
    let mappingCount = 0;
    for (const row of mappingResult.rows) {
      const key = `mapping:${row.icd10_code}:${row.cpt_code}`;
      await cacheDataWithRedisJson(key, row, 0);
      mappingCount++;
      if (mappingCount % 100 === 0) {
        console.log(`Stored ${mappingCount} mappings so far...`);
      }
    }
    console.log(`Completed storing ${mappingCount} mappings in Redis`);
    
    // Get markdown docs from PostgreSQL (no limit)
    console.log('Getting ALL markdown docs from PostgreSQL...');
    const markdownResult = await queryMainDb(`
      SELECT md.id, md.icd10_code, i.description as icd10_description, 
             md.content, md.content_preview
      FROM medical_icd10_markdown_docs md
      JOIN medical_icd10_codes i ON md.icd10_code = i.icd10_code
    `);
    console.log(`Found ${markdownResult.rows.length} markdown docs`);
    
    // Store markdown docs in Redis
    console.log('Storing markdown docs in Redis...');
    let markdownCount = 0;
    for (const row of markdownResult.rows) {
      const key = `markdown:${row.icd10_code}`;
      await cacheDataWithRedisJson(key, row, 0);
      markdownCount++;
      if (markdownCount % 100 === 0) {
        console.log(`Stored ${markdownCount} markdown docs so far...`);
      }
    }
    console.log(`Completed storing ${markdownCount} markdown docs in Redis`);
    
    // Check if the data was stored
    const keys = await client.keys('*');
    console.log(`Total Redis keys after population: ${keys.length}`);
    
    // Count keys by type
    const cptKeys = await client.keys('cpt:*');
    const icd10Keys = await client.keys('icd10:*');
    const mappingKeys = await client.keys('mapping:*');
    const markdownKeys = await client.keys('markdown:*');
    
    console.log(`CPT keys: ${cptKeys.length}`);
    console.log(`ICD-10 keys: ${icd10Keys.length}`);
    console.log(`Mapping keys: ${mappingKeys.length}`);
    console.log(`Markdown keys: ${markdownKeys.length}`);
    
    console.log('Redis full population complete!');
  } catch (error) {
    console.error('Error populating Redis:', error);
  } finally {
    await closeRedisConnection();
  }
}

populateRedisFull();