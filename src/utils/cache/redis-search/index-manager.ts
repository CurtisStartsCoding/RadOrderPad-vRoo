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
    
    // Create index with fields for full-text search and filtering using JSON
    await client.call(
      'FT.CREATE', 'idx:icd10', 'ON', 'JSON', 'PREFIX', '1', 'icd10:code:',
      'SCHEMA',
      '$.icd10_code', 'AS', 'icd10_code', 'TAG', 'SORTABLE',
      '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0',
      '$.clinical_notes', 'AS', 'clinical_notes', 'TEXT', 'WEIGHT', '1.0',
      '$.category', 'AS', 'category', 'TAG',
      '$.specialty', 'AS', 'specialty', 'TAG',
      '$.keywords', 'AS', 'keywords', 'TEXT', 'WEIGHT', '3.0',
      '$.primary_imaging_rationale', 'AS', 'primary_imaging_rationale', 'TEXT', 'WEIGHT', '2.0'
    );
    
    enhancedLogger.info('Created ICD-10 search index on JSON');
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
    
    // Create index with fields for full-text search and filtering using JSON
    await client.call(
      'FT.CREATE', 'idx:cpt', 'ON', 'JSON', 'PREFIX', '1', 'cpt:code:',
      'SCHEMA',
      '$.cpt_code', 'AS', 'cpt_code', 'TAG', 'SORTABLE',
      '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0',
      '$.body_part', 'AS', 'body_part', 'TEXT', 'WEIGHT', '3.0',
      '$.modality', 'AS', 'modality', 'TAG',
      '$.category', 'AS', 'category', 'TAG',
      '$.clinical_justification', 'AS', 'clinical_justification', 'TEXT', 'WEIGHT', '3.0',
      '$.key_findings', 'AS', 'key_findings', 'TEXT', 'WEIGHT', '2.0'
    );
    
    enhancedLogger.info('Created CPT search index on JSON');
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

/**
 * Create a search index for Markdown documents if it doesn't exist
 * @returns Promise<void>
 */
export async function createMarkdownSearchIndex(): Promise<void> {
  try {
    const client = getRedisClient();
    
    // Check if index exists
    const indices = await client.call('FT._LIST') as string[];
    if (indices.includes('idx:markdown')) {
      enhancedLogger.debug('Markdown search index already exists');
      return;
    }
    
    // Create index with fields for full-text search and filtering using JSON
    await client.call(
      'FT.CREATE', 'idx:markdown', 'ON', 'JSON', 'PREFIX', '1', 'markdown:',
      'SCHEMA',
      '$.icd10_code', 'AS', 'icd10_code', 'TAG', 'SORTABLE',
      '$.icd10_description', 'AS', 'icd10_description', 'TEXT', 'WEIGHT', '2.0',
      '$.content', 'AS', 'content', 'TEXT', 'WEIGHT', '5.0',
      '$.content_preview', 'AS', 'content_preview', 'TEXT', 'WEIGHT', '1.0'
    );
    
    enhancedLogger.info('Created Markdown search index on JSON');
  } catch (error) {
    enhancedLogger.error({
      message: 'Error creating Markdown search index',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

/**
 * Create all Redis search indexes
 * @returns Promise<void>
 */
export async function createRedisSearchIndexes(): Promise<void> {
  try {
    await createICD10SearchIndex();
    await createCPTSearchIndex();
    await createMappingSearchIndex();
    await createMarkdownSearchIndex();
    enhancedLogger.info('All Redis search indexes created successfully');
  } catch (error) {
    enhancedLogger.error({
      message: 'Error creating Redis search indexes',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}