/**
 * Script to populate Redis with ICD-10 markdown docs from PostgreSQL using batch operations
 * This script processes markdown docs in batches of 50 for better performance
 */
import { queryMainDb } from '../dist/config/db.js';
import { getRedisClient, closeRedisConnection } from '../dist/config/redis.js';

// Batch size for processing
const BATCH_SIZE = 50;

async function populateRedisMarkdownBatch() {
  try {
    console.log('Populating Redis with ICD-10 markdown docs from PostgreSQL using batch operations...');
    const client = getRedisClient();
    
    // Check if Redis is connected
    const pingResult = await client.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Get markdown docs from PostgreSQL
    console.log('Getting ALL ICD-10 markdown docs from PostgreSQL...');
    const markdownResult = await queryMainDb(`
      SELECT md.id, md.icd10_code, i.description as icd10_description, 
             md.content
      FROM medical_icd10_markdown_docs md
      JOIN medical_icd10_codes i ON md.icd10_code = i.icd10_code
    `);
    console.log(`Found ${markdownResult.rows.length} ICD-10 markdown docs`);
    
    // Process markdown docs in batches
    console.log(`Processing markdown docs in batches of ${BATCH_SIZE}...`);
    const totalBatches = Math.ceil(markdownResult.rows.length / BATCH_SIZE);
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIndex = batchIndex * BATCH_SIZE;
      const endIndex = Math.min(startIndex + BATCH_SIZE, markdownResult.rows.length);
      const batchRows = markdownResult.rows.slice(startIndex, endIndex);
      
      console.log(`Processing batch ${batchIndex + 1}/${totalBatches} (rows ${startIndex + 1}-${endIndex})...`);
      
      // Create a multi command for batch processing
      const pipeline = client.pipeline();
      
      // Add each markdown doc to the pipeline
      for (const row of batchRows) {
        const key = `markdown:${row.icd10_code}`;
        
        // Generate a content preview (first 100 characters)
        const contentPreview = row.content ? row.content.substring(0, 100) + '...' : 'No content available';
        
        // Add the content preview to the row
        const rowWithPreview = {
          ...row,
          content_preview: contentPreview
        };
        
        pipeline.call('JSON.SET', key, '.', JSON.stringify(rowWithPreview));
      }
      
      // Execute the pipeline
      await pipeline.exec();
      console.log(`Batch ${batchIndex + 1}/${totalBatches} completed successfully`);
    }
    
    // Check if the data was stored
    const markdownKeys = await client.keys('markdown:*');
    console.log(`Total markdown keys in Redis: ${markdownKeys.length}`);
    
    // Sample a few keys to verify
    if (markdownKeys.length > 0) {
      console.log('\nSample markdown keys:');
      const sampleSize = Math.min(5, markdownKeys.length);
      for (let i = 0; i < sampleSize; i++) {
        const randomIndex = Math.floor(Math.random() * markdownKeys.length);
        const key = markdownKeys[randomIndex];
        const value = await client.call('JSON.GET', key);
        // Only show a preview of the content since markdown can be large
        const parsedValue = JSON.parse(value);
        console.log(`${key}: ${parsedValue.icd10_code} - ${parsedValue.icd10_description} (content preview: ${parsedValue.content_preview?.substring(0, 50) || 'N/A'}...)`);
      }
    }
    
    console.log('\nICD-10 markdown doc population complete!');
  } catch (error) {
    console.error('Error populating Redis with ICD-10 markdown docs:', error);
  } finally {
    await closeRedisConnection();
  }
}

populateRedisMarkdownBatch();