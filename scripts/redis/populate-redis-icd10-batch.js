/**
 * Script to populate Redis with ICD-10 codes from PostgreSQL using batch operations
 * This script processes ICD-10 codes in batches of 50 for better performance
 */
import { queryMainDb } from '../dist/config/db.js';
import { getRedisClient, closeRedisConnection } from '../dist/config/redis.js';

// Batch size for processing
const BATCH_SIZE = 50;

async function populateRedisIcd10Batch() {
  try {
    console.log('Populating Redis with ICD-10 codes from PostgreSQL using batch operations...');
    const client = getRedisClient();
    
    // Check if Redis is connected
    const pingResult = await client.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Get ICD-10 codes from PostgreSQL
    console.log('Getting ALL ICD-10 codes from PostgreSQL...');
    const icd10Result = await queryMainDb('SELECT * FROM medical_icd10_codes');
    console.log(`Found ${icd10Result.rows.length} ICD-10 codes`);
    
    // Process ICD-10 codes in batches
    console.log(`Processing ICD-10 codes in batches of ${BATCH_SIZE}...`);
    const totalBatches = Math.ceil(icd10Result.rows.length / BATCH_SIZE);
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIndex = batchIndex * BATCH_SIZE;
      const endIndex = Math.min(startIndex + BATCH_SIZE, icd10Result.rows.length);
      const batchRows = icd10Result.rows.slice(startIndex, endIndex);
      
      console.log(`Processing batch ${batchIndex + 1}/${totalBatches} (rows ${startIndex + 1}-${endIndex})...`);
      
      // Create a multi command for batch processing
      const pipeline = client.pipeline();
      
      // Add each ICD-10 code to the pipeline
      for (const row of batchRows) {
        const key = `icd10:${row.icd10_code}`;
        pipeline.call('JSON.SET', key, '.', JSON.stringify(row));
      }
      
      // Execute the pipeline
      await pipeline.exec();
      console.log(`Batch ${batchIndex + 1}/${totalBatches} completed successfully`);
    }
    
    // Check if the data was stored
    const icd10Keys = await client.keys('icd10:*');
    console.log(`Total ICD-10 keys in Redis: ${icd10Keys.length}`);
    
    // Sample a few keys to verify
    if (icd10Keys.length > 0) {
      console.log('\nSample ICD-10 keys:');
      const sampleSize = Math.min(5, icd10Keys.length);
      for (let i = 0; i < sampleSize; i++) {
        const randomIndex = Math.floor(Math.random() * icd10Keys.length);
        const key = icd10Keys[randomIndex];
        const value = await client.call('JSON.GET', key);
        console.log(`${key}: ${value.substring(0, 100)}...`);
      }
    }
    
    console.log('\nICD-10 code population complete!');
  } catch (error) {
    console.error('Error populating Redis with ICD-10 codes:', error);
  } finally {
    await closeRedisConnection();
  }
}

populateRedisIcd10Batch();