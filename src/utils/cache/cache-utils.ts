import { getRedisClient } from '../../config/memorydb';
import { queryMainDb } from '../../config/db';

/**
 * Type definitions for database rows
 */
export interface PromptTemplate {
  id: number;
  type: string;
  name: string;
  content: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CPTRow {
  id: number;
  cpt_code: string;
  description: string;
  category: string;
  subcategory?: string;
  modality?: string;
  body_part?: string;
  additional_info?: string;
}

export interface ICD10Row {
  id: number;
  icd10_code: string;
  description: string;
  category: string;
  subcategory?: string;
  additional_info?: string;
}

export interface MappingRow {
  id: number;
  icd10_code: string;
  icd10_description: string;
  cpt_code: string;
  cpt_description: string;
  appropriateness: string;
  evidence_source?: string;
  refined_justification?: string;
}

export interface MarkdownRow {
  id: number;
  icd10_code: string;
  icd10_description: string;
  content_preview: string;
}

/**
 * Cache-Aside pattern implementation for medical reference data
 * 
 * This file provides utility functions for implementing the Cache-Aside pattern
 * with AWS MemoryDB for Redis. Each function first checks the cache for data,
 * and if not found, retrieves it from the database and caches it.
 */

/**
 * Get active default prompt template with caching
 * @returns Promise<PromptTemplate> The active default prompt template
 */
export async function getActiveDefaultPromptTemplate(): Promise<PromptTemplate> {
  const redisClient = getRedisClient();
  const cacheKey = 'prompt:default:active';
  
  try {
    // Try to get from cache first
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log('Cache hit for active default prompt template');
      return JSON.parse(cachedData) as PromptTemplate;
    }
    
    console.log('Cache miss for active default prompt template, querying database');
    
    // Cache miss - query database
    const result = await queryMainDb(
      `SELECT * FROM prompt_templates
       WHERE type = 'default' AND active = true
       ORDER BY created_at DESC
       LIMIT 1`
    );
    
    if (result.rows.length === 0) {
      throw new Error('No active default prompt template found');
    }
    
    const promptTemplate = result.rows[0] as PromptTemplate;
    
    // Cache the result with 1-hour TTL (3600 seconds)
    await redisClient.set(cacheKey, JSON.stringify(promptTemplate), 'EX', 3600);
    
    return promptTemplate;
  } catch (error) {
    console.error('Error in getActiveDefaultPromptTemplate:', error);
    
    // If cache operation fails, fall back to direct database query
    const result = await queryMainDb(
      `SELECT * FROM prompt_templates
       WHERE type = 'default' AND active = true
       ORDER BY created_at DESC
       LIMIT 1`
    );
    
    if (result.rows.length === 0) {
      throw new Error('No active default prompt template found');
    }
    
    return result.rows[0] as PromptTemplate;
  }
}

/**
 * Get CPT code by code with caching
 * @param cptCode The CPT code to retrieve
 * @returns Promise<CPTRow | null> The CPT code data or null if not found
 */
export async function getCptCodeByCode(cptCode: string): Promise<CPTRow | null> {
  const redisClient = getRedisClient();
  const cacheKey = `cpt:${cptCode}`;
  
  try {
    // Try to get from cache first
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log(`Cache hit for CPT code ${cptCode}`);
      return JSON.parse(cachedData) as CPTRow;
    }
    
    console.log(`Cache miss for CPT code ${cptCode}, querying database`);
    
    // Cache miss - query database
    const result = await queryMainDb(
      'SELECT * FROM medical_cpt_codes WHERE cpt_code = $1',
      [cptCode]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const cptData = result.rows[0] as CPTRow;
    
    // Cache the result with 24-hour TTL (86400 seconds)
    await redisClient.set(cacheKey, JSON.stringify(cptData), 'EX', 86400);
    
    return cptData;
  } catch (error) {
    console.error(`Error in getCptCodeByCode for ${cptCode}:`, error);
    
    // If cache operation fails, fall back to direct database query
    const result = await queryMainDb(
      'SELECT * FROM medical_cpt_codes WHERE cpt_code = $1',
      [cptCode]
    );
    
    return result.rows.length > 0 ? result.rows[0] as CPTRow : null;
  }
}

/**
 * Get ICD-10 code by code with caching
 * @param icd10Code The ICD-10 code to retrieve
 * @returns Promise<ICD10Row | null> The ICD-10 code data or null if not found
 */
export async function getIcd10CodeByCode(icd10Code: string): Promise<ICD10Row | null> {
  const redisClient = getRedisClient();
  const cacheKey = `icd10:${icd10Code}`;
  
  try {
    // Try to get from cache first
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log(`Cache hit for ICD-10 code ${icd10Code}`);
      return JSON.parse(cachedData) as ICD10Row;
    }
    
    console.log(`Cache miss for ICD-10 code ${icd10Code}, querying database`);
    
    // Cache miss - query database
    const result = await queryMainDb(
      'SELECT * FROM medical_icd10_codes WHERE icd10_code = $1',
      [icd10Code]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const icd10Data = result.rows[0] as ICD10Row;
    
    // Cache the result with 24-hour TTL (86400 seconds)
    await redisClient.set(cacheKey, JSON.stringify(icd10Data), 'EX', 86400);
    
    return icd10Data;
  } catch (error) {
    console.error(`Error in getIcd10CodeByCode for ${icd10Code}:`, error);
    
    // If cache operation fails, fall back to direct database query
    const result = await queryMainDb(
      'SELECT * FROM medical_icd10_codes WHERE icd10_code = $1',
      [icd10Code]
    );
    
    return result.rows.length > 0 ? result.rows[0] as ICD10Row : null;
  }
}

/**
 * Get CPT-ICD10 mapping with caching
 * @param icd10Code The ICD-10 code
 * @param cptCode The CPT code
 * @returns Promise<MappingRow | null> The mapping data or null if not found
 */
export async function getCptIcd10Mapping(icd10Code: string, cptCode: string): Promise<MappingRow | null> {
  const redisClient = getRedisClient();
  const cacheKey = `mapping:${icd10Code}:${cptCode}`;
  
  try {
    // Try to get from cache first
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log(`Cache hit for mapping ${icd10Code}:${cptCode}`);
      return JSON.parse(cachedData) as MappingRow;
    }
    
    console.log(`Cache miss for mapping ${icd10Code}:${cptCode}, querying database`);
    
    // Cache miss - query database
    const result = await queryMainDb(
      `SELECT m.id, m.icd10_code, i.description as icd10_description, 
              m.cpt_code, c.description as cpt_description, 
              m.appropriateness, m.evidence_source, m.refined_justification
       FROM medical_cpt_icd10_mappings m
       JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
       JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
       WHERE m.icd10_code = $1 AND m.cpt_code = $2`,
      [icd10Code, cptCode]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const mappingData = result.rows[0] as MappingRow;
    
    // Cache the result with 6-hour TTL (21600 seconds)
    await redisClient.set(cacheKey, JSON.stringify(mappingData), 'EX', 21600);
    
    return mappingData;
  } catch (error) {
    console.error(`Error in getCptIcd10Mapping for ${icd10Code}:${cptCode}:`, error);
    
    // If cache operation fails, fall back to direct database query
    const result = await queryMainDb(
      `SELECT m.id, m.icd10_code, i.description as icd10_description, 
              m.cpt_code, c.description as cpt_description, 
              m.appropriateness, m.evidence_source, m.refined_justification
       FROM medical_cpt_icd10_mappings m
       JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
       JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
       WHERE m.icd10_code = $1 AND m.cpt_code = $2`,
      [icd10Code, cptCode]
    );
    
    return result.rows.length > 0 ? result.rows[0] as MappingRow : null;
  }
}

/**
 * Get ICD-10 markdown document with caching
 * @param icd10Code The ICD-10 code
 * @returns Promise<MarkdownRow | null> The markdown document or null if not found
 */
export async function getIcd10MarkdownDoc(icd10Code: string): Promise<MarkdownRow | null> {
  const redisClient = getRedisClient();
  const cacheKey = `markdown:${icd10Code}`;
  
  try {
    // Try to get from cache first
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log(`Cache hit for markdown doc ${icd10Code}`);
      return JSON.parse(cachedData) as MarkdownRow;
    }
    
    console.log(`Cache miss for markdown doc ${icd10Code}, querying database`);
    
    // Cache miss - query database
    const result = await queryMainDb(
      `SELECT md.id, md.icd10_code, i.description as icd10_description, md.content as content_preview
       FROM medical_icd10_markdown_docs md
       JOIN medical_icd10_codes i ON md.icd10_code = i.icd10_code
       WHERE md.icd10_code = $1`,
      [icd10Code]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const markdownData = result.rows[0] as MarkdownRow;
    
    // Cache the result with 6-hour TTL (21600 seconds)
    await redisClient.set(cacheKey, JSON.stringify(markdownData), 'EX', 21600);
    
    return markdownData;
  } catch (error) {
    console.error(`Error in getIcd10MarkdownDoc for ${icd10Code}:`, error);
    
    // If cache operation fails, fall back to direct database query
    const result = await queryMainDb(
      `SELECT md.id, md.icd10_code, i.description as icd10_description, md.content as content_preview
       FROM medical_icd10_markdown_docs md
       JOIN medical_icd10_codes i ON md.icd10_code = i.icd10_code
       WHERE md.icd10_code = $1`,
      [icd10Code]
    );
    
    return result.rows.length > 0 ? result.rows[0] as MarkdownRow : null;
  }
}

/**
 * Invalidate a cache entry
 * @param key The cache key to invalidate
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    const redisClient = getRedisClient();
    await redisClient.del(key);
    console.log(`Cache key ${key} invalidated`);
  } catch (error) {
    console.error(`Error invalidating cache key ${key}:`, error);
    // Don't throw, just log the error
  }
}

/**
 * Clear all cache entries with a specific prefix
 * @param prefix The prefix of keys to clear
 */
export async function clearCacheByPrefix(prefix: string): Promise<void> {
  try {
    const redisClient = getRedisClient();
    const keys = await redisClient.keys(`${prefix}*`);
    
    if (keys.length > 0) {
      await redisClient.del(...keys);
      console.log(`Cleared ${keys.length} cache entries with prefix ${prefix}`);
    } else {
      console.log(`No cache entries found with prefix ${prefix}`);
    }
  } catch (error) {
    console.error(`Error clearing cache with prefix ${prefix}:`, error);
    // Don't throw, just log the error
  }
}

/**
 * Clear all cache entries
 */
export async function clearAllCache(): Promise<void> {
  try {
    const redisClient = getRedisClient();
    await redisClient.flushdb();
    console.log('All cache entries cleared');
  } catch (error) {
    console.error('Error clearing all cache entries:', error);
    // Don't throw, just log the error
  }
}

/**
 * RedisSearch Preparation:
 * 
 * The data being cached (especially CPT/ICD-10 JSON) is intended to be indexed
 * by RedisSearch later for advanced context generation, as outlined in redis_integration.md.
 * 
 * Future enhancements will include:
 * 1. Creating RedisSearch indexes for CPT codes, ICD-10 codes, and mappings
 * 2. Implementing search functions that leverage RedisSearch capabilities
 * 3. Using vector similarity search for context generation
 */