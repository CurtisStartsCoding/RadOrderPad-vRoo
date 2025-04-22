/**
 * Script to populate Redis with CPT-ICD10 mappings from PostgreSQL using batch operations
 * This script processes mappings in batches of 50 for better performance
 */
import { queryMainDb } from '../dist/config/db.js';
import { getRedisClient, closeRedisConnection } from '../dist/config/redis.js';

// Batch size for processing
const BATCH_SIZE = 50;

async function populateRedisMappingsBatch() {
  try {
    console.log('Populating Redis with CPT-ICD10 mappings from PostgreSQL using batch operations...');
    const client = getRedisClient();
    
    // Check if Redis is connected
    const pingResult = await client.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Get mappings from PostgreSQL
    console.log('Getting ALL CPT-ICD10 mappings from PostgreSQL...');
    const mappingResult = await queryMainDb(`
      SELECT m.id, m.icd10_code, i.description as icd10_description, 
             m.cpt_code, c.description as cpt_description, 
             m.appropriateness, m.evidence_source, m.refined_justification
      FROM medical_cpt_icd10_mappings m
      JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
      JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
    `);
    console.log(`Found ${mappingResult.rows.length} CPT-ICD10 mappings`);
    
    // Process mappings in batches
    console.log(`Processing mappings in batches of ${BATCH_SIZE}...`);
    const totalBatches = Math.ceil(mappingResult.rows.length / BATCH_SIZE);
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIndex = batchIndex * BATCH_SIZE;
      const endIndex = Math.min(startIndex + BATCH_SIZE, mappingResult.rows.length);
      const batchRows = mappingResult.rows.slice(startIndex, endIndex);
      
      console.log(`Processing batch ${batchIndex + 1}/${totalBatches} (rows ${startIndex + 1}-${endIndex})...`);
      
      // Create a multi command for batch processing
      const pipeline = client.pipeline();
      
      // Add each mapping to the pipeline
      for (const row of batchRows) {
        const key = `mapping:${row.icd10_code}:${row.cpt_code}`;
        pipeline.call('JSON.SET', key, '.', JSON.stringify(row));
      }
      
      // Execute the pipeline
      await pipeline.exec();
      console.log(`Batch ${batchIndex + 1}/${totalBatches} completed successfully`);
    }
    
    // Check if the data was stored
    const mappingKeys = await client.keys('mapping:*');
    console.log(`Total mapping keys in Redis: ${mappingKeys.length}`);
    
    // Sample a few keys to verify
    if (mappingKeys.length > 0) {
      console.log('\nSample mapping keys:');
      const sampleSize = Math.min(5, mappingKeys.length);
      for (let i = 0; i < sampleSize; i++) {
        const randomIndex = Math.floor(Math.random() * mappingKeys.length);
        const key = mappingKeys[randomIndex];
        const value = await client.call('JSON.GET', key);
        console.log(`${key}: ${value.substring(0, 100)}...`);
      }
    }
    
    console.log('\nCPT-ICD10 mapping population complete!');
  } catch (error) {
    console.error('Error populating Redis with CPT-ICD10 mappings:', error);
  } finally {
    await closeRedisConnection();
  }
}

populateRedisMappingsBatch();