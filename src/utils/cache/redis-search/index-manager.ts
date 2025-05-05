/**
 * Redis Search Index Manager
 * 
 * This module provides functions for creating and managing RediSearch indices.
 * It implements the single responsibility principle by focusing only on index management.
 */

import { getRedisClient } from '../../../config/redis';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Create a search index for ICD-10 codes if it doesn't exist
 * @returns Promise<void>
 */
export async function createICD10SearchIndex(): Promise<void> {
  try {
    const client = getRedisClient();
    
    // Check if index exists
    const indices = await client.call('FT._LIST') as string[];
    if (indices.includes('idx:icd10')) {
      enhancedLogger.debug('ICD-10 search index already exists');
      return;
    }
    
    // Create index with fields for full-text search and filtering
    await client.call(
      'FT.CREATE', 'idx:icd10', 'ON', 'HASH', 'PREFIX', '1', 'icd10:code:',
      'SCHEMA',
      'icd10_code', 'TAG', 'SORTABLE',
      'description', 'TEXT', 'WEIGHT', '5.0',
      'clinical_notes', 'TEXT', 'WEIGHT', '1.0',
      'category', 'TAG',
      'specialty', 'TAG'
    );
    
    enhancedLogger.info('Created ICD-10 search index');
  } catch (error) {
    enhancedLogger.error({
      message: 'Error creating ICD-10 search index',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

/**
 * Create a search index for CPT codes if it doesn't exist
 * @returns Promise<void>
 */
export async function createCPTSearchIndex(): Promise<void> {
  try {
    const client = getRedisClient();
    
    // Check if index exists
    const indices = await client.call('FT._LIST') as string[];
    if (indices.includes('idx:cpt')) {
      enhancedLogger.debug('CPT search index already exists');
      return;
    }
    
    // Create index with fields for full-text search and filtering
    await client.call(
      'FT.CREATE', 'idx:cpt', 'ON', 'HASH', 'PREFIX', '1', 'cpt:code:',
      'SCHEMA',
      'cpt_code', 'TAG', 'SORTABLE',
      'description', 'TEXT', 'WEIGHT', '5.0',
      'body_part', 'TEXT', 'WEIGHT', '3.0',
      'modality', 'TAG',
      'category', 'TAG'
    );
    
    enhancedLogger.info('Created CPT search index');
  } catch (error) {
    enhancedLogger.error({
      message: 'Error creating CPT search index',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

/**
 * Create a search index for ICD-10 to CPT mappings if it doesn't exist
 * @returns Promise<void>
 */
export async function createMappingSearchIndex(): Promise<void> {
  try {
    const client = getRedisClient();
    
    // Check if index exists
    const indices = await client.call('FT._LIST') as string[];
    if (indices.includes('idx:mapping')) {
      enhancedLogger.debug('Mapping search index already exists');
      return;
    }
    
    // Create index with fields for full-text search and filtering
    await client.call(
      'FT.CREATE', 'idx:mapping', 'ON', 'HASH', 'PREFIX', '1', 'mapping:icd10-to-cpt:',
      'SCHEMA',
      'icd10_code', 'TAG', 'SORTABLE',
      'cpt_code', 'TAG', 'SORTABLE',
      'appropriateness_score', 'NUMERIC', 'SORTABLE',
      'evidence_strength', 'NUMERIC', 'SORTABLE',
      'composite_score', 'NUMERIC', 'SORTABLE'
    );
    
    enhancedLogger.info('Created mapping search index');
  } catch (error) {
    enhancedLogger.error({
      message: 'Error creating mapping search index',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}