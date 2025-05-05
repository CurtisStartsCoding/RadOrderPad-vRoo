/**
 * Redis Vector Store
 * 
 * This module provides functions for storing and retrieving vector embeddings in Redis.
 * It implements the single responsibility principle by focusing only on vector storage operations.
 */

import { getRedisClient } from '../../../config/redis';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Store a medical code with vector embedding
 * @param prefix Key prefix
 * @param code Medical code
 * @param description Code description
 * @param embedding Vector embedding
 * @param ttlSeconds Time-to-live in seconds
 * @returns Promise<void>
 */
export async function storeVectorEmbedding(
  prefix: string,
  code: string,
  description: string,
  embedding: number[],
  ttlSeconds: number
): Promise<void> {
  try {
    const client = getRedisClient();
    const key = `${prefix}:${code}`;
    
    // Convert embedding to buffer
    const buffer = Buffer.from(new Float32Array(embedding).buffer);
    
    // Store hash with embedding
    await client.hset(key, {
      code,
      description,
      embedding: buffer
    });
    
    // Set expiration
    await client.expire(key, ttlSeconds);
    
    enhancedLogger.debug(`Stored vector embedding for ${code}`);
  } catch (error) {
    enhancedLogger.error({
      message: 'Error storing vector embedding',
      code,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error; // Rethrow to allow caller to handle
  }
}

/**
 * Store a rare disease with vector embedding
 * @param code Disease code
 * @param description Disease description
 * @param embedding Vector embedding
 * @param ttlSeconds Time-to-live in seconds (default: 7 days)
 * @returns Promise<void>
 */
export async function storeRareDiseaseEmbedding(
  code: string,
  description: string,
  embedding: number[],
  ttlSeconds: number = 86400 * 7 // 7 days
): Promise<void> {
  return storeVectorEmbedding('rare-disease', code, description, embedding, ttlSeconds);
}

/**
 * Store an ICD-10 code with vector embedding
 * @param code ICD-10 code
 * @param description Code description
 * @param embedding Vector embedding
 * @param ttlSeconds Time-to-live in seconds (default: 1 day)
 * @returns Promise<void>
 */
export async function storeICD10Embedding(
  code: string,
  description: string,
  embedding: number[],
  ttlSeconds: number = 86400 // 1 day
): Promise<void> {
  return storeVectorEmbedding('icd10-vector', code, description, embedding, ttlSeconds);
}

/**
 * Store a CPT code with vector embedding
 * @param code CPT code
 * @param description Code description
 * @param embedding Vector embedding
 * @param ttlSeconds Time-to-live in seconds (default: 1 day)
 * @returns Promise<void>
 */
export async function storeCPTEmbedding(
  code: string,
  description: string,
  embedding: number[],
  ttlSeconds: number = 86400 // 1 day
): Promise<void> {
  return storeVectorEmbedding('cpt-vector', code, description, embedding, ttlSeconds);
}

/**
 * Store a clinical note with vector embedding
 * @param id Note ID
 * @param content Note content
 * @param embedding Vector embedding
 * @param ttlSeconds Time-to-live in seconds (default: 1 hour)
 * @returns Promise<void>
 */
export async function storeClinicalNoteEmbedding(
  id: string,
  content: string,
  embedding: number[],
  ttlSeconds: number = 3600 // 1 hour
): Promise<void> {
  return storeVectorEmbedding('clinical-note', id, content, embedding, ttlSeconds);
}