/**
 * Script to populate Redis with CPT codes from PostgreSQL using batch operations
 * This script processes CPT codes in batches of 50 for better performance
 */
import { queryMainDb } from '../dist/config/db.js';
import { getRedisClient, closeRedisConnection } from '../dist/config/redis.js';

// Batch size for processing
const BATCH_SIZE = 50;

async function populateRedisCptBatch() {
  try {
    console.log('Populating Redis with CPT codes from PostgreSQL using batch operations...');
    const client = getRedisClient();
    
    // Check if Redis is connected
    const pingResult = await client.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Get CPT codes from PostgreSQL
    console.log('Getting ALL CPT codes from PostgreSQL...');
    const cptResult = await queryMainDb('SELECT * FROM medical_cpt_codes');
    console.log(`Found ${cptResult.rows.length} CPT codes`);
    
    // Process CPT codes in batches
    console.log(`Processing CPT codes in batches of ${BATCH_SIZE}...`);
    const totalBatches = Math.ceil(cptResult.rows.length / BATCH_SIZE);
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIndex = batchIndex * BATCH_SIZE;
      const endIndex = Math.min(startIndex + BATCH_SIZE, cptResult.rows.length);
      const batchRows = cptResult.rows.slice(startIndex, endIndex);
      
      console.log(`Processing batch ${batchIndex + 1}/${totalBatches} (rows ${startIndex + 1}-${endIndex})...`);
      
      // Create a multi command for batch processing
      const pipeline = client.pipeline();
      
      // Add each CPT code to the pipeline
      for (const row of batchRows) {
        const key = `cpt:${row.cpt_code}`;
        pipeline.call('JSON.SET', key, '.', JSON.stringify(row));
      }
      
      // Execute the pipeline
      await pipeline.exec();
      console.log(`Batch ${batchIndex + 1}/${totalBatches} completed successfully`);
    }
    
    // Check if the data was stored
    const cptKeys = await client.keys('cpt:*');
    console.log(`Total CPT keys in Redis: ${cptKeys.length}`);
    
    // Sample a few keys to verify
    if (cptKeys.length > 0) {
      console.log('\nSample CPT keys:');
      const sampleSize = Math.min(5, cptKeys.length);
      for (let i = 0; i < sampleSize; i++) {
        const randomIndex = Math.floor(Math.random() * cptKeys.length);
        const key = cptKeys[randomIndex];
        const value = await client.call('JSON.GET', key);
        console.log(`${key}: ${value.substring(0, 100)}...`);
      }
    }
    
    console.log('\nCPT code population complete!');
  } catch (error) {
    console.error('Error populating Redis with CPT codes:', error);
  } finally {
    await closeRedisConnection();
  }
}

populateRedisCptBatch();