/**
 * Redis Vector Index Manager
 * 
 * This module provides functions for creating and managing Redis Vector Search indices.
 * It implements the single responsibility principle by focusing only on vector index management.
 */

import { getRedisClient } from '../../../config/redis';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Create a vector index for medical embeddings if it doesn't exist
 * @param indexName Name of the index to create
 * @param prefix Key prefix to index
 * @param dimension Vector dimension
 * @returns Promise<void>
 */
export async function createVectorIndex(
  indexName: string, 
  prefix: string, 
  dimension: number
): Promise<void> {
  try {
    const client = getRedisClient();
    
    // Check if index exists
    const indices = await client.call('FT._LIST') as string[];
    if (indices.includes(`idx:${indexName}`)) {
      enhancedLogger.debug(`Vector index ${indexName} already exists`);
      return;
    }
    
    // Create vector index with HNSW algorithm
    await client.call(
      'FT.CREATE', `idx:${indexName}`, 'ON', 'HASH', 'PREFIX', '1', prefix,
      'SCHEMA',
      'code', 'TAG', 'SORTABLE',
      'description', 'TEXT',
      'embedding', 'VECTOR', 'HNSW', '6', 'TYPE', 'FLOAT32', 'DIM', dimension.toString(), 'DISTANCE_METRIC', 'COSINE'
    );
    
    enhancedLogger.info(`Created vector index ${indexName}`);
  } catch (error) {
    enhancedLogger.error({
      message: `Error creating vector index ${indexName}`,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

/**
 * Create a vector index for rare diseases if it doesn't exist
 * @param dimension Vector dimension
 * @returns Promise<void>
 */
export async function createRareDiseaseVectorIndex(dimension: number): Promise<void> {
  return createVectorIndex('rare-diseases', 'rare-disease:', dimension);
}

/**
 * Create a vector index for ICD-10 codes if it doesn't exist
 * @param dimension Vector dimension
 * @returns Promise<void>
 */
export async function createICD10VectorIndex(dimension: number): Promise<void> {
  return createVectorIndex('icd10-vectors', 'icd10-vector:', dimension);
}

/**
 * Create a vector index for CPT codes if it doesn't exist
 * @param dimension Vector dimension
 * @returns Promise<void>
 */
export async function createCPTVectorIndex(dimension: number): Promise<void> {
  return createVectorIndex('cpt-vectors', 'cpt-vector:', dimension);
}