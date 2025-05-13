/**
 * Redis Population Utility
 * 
 * This module provides functions to populate Redis with data from PostgreSQL.
 * It's designed to be called during server startup to ensure Redis is populated
 * with the necessary data before the server starts handling requests.
 */

import { queryMainDb } from '../../config/db';
import { getRedisClient } from '../../config/redis';
import enhancedLogger from '../enhanced-logger';

/**
 * Populates Redis with data from PostgreSQL
 * This should be called during application startup
 */
export async function populateRedisFromPostgres(): Promise<void> {
  try {
    enhancedLogger.info('Checking if Redis needs population...');
    
    const client = getRedisClient();
    
    // Check if Redis already has data
    const cptKeys = await client.keys('cpt:code:*');
    const icd10Keys = await client.keys('icd10:code:*');
    
    if (cptKeys.length > 0 && icd10Keys.length > 0) {
      enhancedLogger.info(`Redis already populated with ${cptKeys.length} CPT codes and ${icd10Keys.length} ICD-10 codes`);
      return;
    }
    
    enhancedLogger.info('Redis cache is empty or incomplete. Populating from PostgreSQL...');
    const startTime = Date.now();
    
    // Populate CPT codes
    enhancedLogger.info('Populating CPT codes...');
    const cptResult = await queryMainDb('SELECT * FROM medical_cpt_codes');
    await cacheBatch(cptResult.rows, row => `cpt:code:${row.cpt_code || row.code}`);
    
    // Populate ICD-10 codes
    enhancedLogger.info('Populating ICD-10 codes...');
    const icd10Result = await queryMainDb('SELECT * FROM medical_icd10_codes');
    await cacheBatch(icd10Result.rows, row => `icd10:code:${row.icd10_code || row.code}`);
    
    // Populate mappings
    enhancedLogger.info('Populating mappings...');
    const mappingResult = await queryMainDb('SELECT * FROM medical_cpt_icd10_mappings');
    await cacheBatch(mappingResult.rows, row => `mapping:icd10-to-cpt:${row.icd10_code || row.icd_code}`);
    
    // Populate markdown docs if available
    try {
      enhancedLogger.info('Populating markdown docs...');
      const markdownResult = await queryMainDb('SELECT * FROM medical_icd10_markdown_docs');
      await cacheBatch(markdownResult.rows, row => `markdown:${row.icd10_code || row.icd_code}`);
    } catch {
      // Ignore error if markdown docs table doesn't exist
      enhancedLogger.warn('Markdown docs table not found or empty, skipping');
    }
    
    const endTime = Date.now();
    enhancedLogger.info(`Redis population completed in ${(endTime - startTime) / 1000} seconds`);
  } catch (error) {
    enhancedLogger.error({
      message: 'Error populating Redis from PostgreSQL',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    // Don't throw the error, just log it and continue
  }
}

/**
 * Cache data in Redis using batch operations
 * @param items - Array of items to cache
 * @param keyFn - Function to generate key for each item
 */
async function cacheBatch(items: Record<string, unknown>[], keyFn: (item: Record<string, unknown>) => string): Promise<void> {
  const BATCH_SIZE = 1000; // Process 1000 items at a time
  const client = getRedisClient();
  
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const pipeline = client.pipeline();
    
    for (const item of batch) {
      const key = keyFn(item);
      
      // Determine storage method based on key prefix
      if (key.startsWith('cpt:') || key.startsWith('icd10:') || key.startsWith('markdown:')) {
        // Store as JSON document for CPT, ICD-10, and Markdown data
        pipeline.call('JSON.SET', key, '.', JSON.stringify(item));
      } else {
        // Store as a hash for other data types (e.g., mappings)
        for (const [field, value] of Object.entries(item)) {
          if (value !== null && value !== undefined) {
            pipeline.hset(key, field, typeof value === 'object' ? JSON.stringify(value) : String(value));
          }
        }
      }
      
      // No TTL - data stays indefinitely
      // This is intentional to ensure data persists until explicitly invalidated
    }
    
    await pipeline.exec();
    enhancedLogger.debug(`Processed batch ${i / BATCH_SIZE + 1}/${Math.ceil(items.length / BATCH_SIZE)}, ${i + batch.length}/${items.length} items`);
  }
}