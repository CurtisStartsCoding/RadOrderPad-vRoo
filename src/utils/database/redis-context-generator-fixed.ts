/**
 * Redis-based Database Context Generator
 *
 * This module provides a function to generate database context for validation
 * using RedisSearch in MemoryDB.
 */
import { formatDatabaseContext } from './context-formatter';
import { categorizeKeywords } from './keyword-categorizer';
import { ICD10Row, CPTRow, MappingRow, MarkdownRow } from './types';
import { queryMainDb } from '../../config/db';
import {
  searchICD10Codes,
  searchCPTCodes,
  getMappings,
  getMarkdownDocs
} from '../redis/search';
import { testRedisConnection } from '../../config/redis';
import logger from '../../utils/logger.js';

/**
 * Generate database context based on extracted keywords using RedisSearch
 * Falls back to PostgreSQL if RedisSearch fails or returns insufficient results
 * @param keywords Keywords to search for
 * @returns Formatted database context string
 */
export async function generateDatabaseContextWithRedis(keywords: string[]): Promise<string> {
  if (keywords.length === 0) {
    return 'No specific medical context found in the input text.';
  }
  
  logger.info('Generating database context with RedisSearch using keywords:', keywords);
  
  try {
    // Check if Redis is available
    try {
      const isConnected = await testRedisConnection();
      if (!isConnected) {
        logger.info('Redis connection test failed, falling back to PostgreSQL...');
        logger.info('CONTEXT_PATH: Using PostgreSQL fallback (Redis connection failed)');
        return await fallbackToPostgres(keywords);
      }
      logger.info('Redis connection successful, proceeding with RedisSearch');
      logger.info('CONTEXT_PATH: Using RedisSearch as primary path');
      // Add more detailed logging for monitoring and testing
      logger.debug({
        message: 'Using RedisSearch for database context generation',
        keywords,
        timestamp: new Date().toISOString()
      });
    } catch (pingError) {
      logger.error('Redis connection test error:', pingError);
      logger.info('Falling back to PostgreSQL for context generation...');
      logger.info('CONTEXT_PATH: Using PostgreSQL fallback (Redis connection error)');
      return await fallbackToPostgres(keywords);
    }
    
    // Categorize keywords for more targeted queries
    const categorizedKeywords = categorizeKeywords(keywords);
    logger.debug('Categorized keywords:', categorizedKeywords);
    
    // Search for ICD-10 codes using RedisSearch
    logger.info('Searching for ICD-10 codes with RedisSearch...');
    const icd10Rows = await searchICD10Codes(keywords, categorizedKeywords);
    logger.info(`Found ${icd10Rows.length} relevant ICD-10 codes with RedisSearch`);
    
    // Search for CPT codes using RedisSearch
    logger.info('Searching for CPT codes with RedisSearch...');
    const cptRows = await searchCPTCodes(keywords, categorizedKeywords);
    logger.info(`Found ${cptRows.length} relevant CPT codes with RedisSearch`);
    
    // Get mappings between ICD-10 and CPT codes
    logger.info('Getting mappings from Redis...');
    const mappingRows = await getMappings(icd10Rows, cptRows);
    logger.info(`Found ${mappingRows.length} relevant mappings from Redis`);
    
    // Get markdown docs for ICD-10 codes
    logger.info('Getting markdown docs from Redis...');
    const markdownRows = await getMarkdownDocs(icd10Rows);
    logger.info(`Found ${markdownRows.length} relevant markdown docs from Redis`);
    
    // Check if we have sufficient results from RedisSearch
    // If we don't have any ICD-10 or CPT codes, fall back to PostgreSQL
    if (icd10Rows.length === 0 && cptRows.length === 0) {
      logger.info('Insufficient results from RedisSearch, falling back to PostgreSQL...');
      logger.info('CONTEXT_PATH: Using PostgreSQL fallback (insufficient RedisSearch results)');
      return await fallbackToPostgres(keywords);
    }
    
    // Format the database context
    return formatDatabaseContext(
      icd10Rows,
      cptRows,
      mappingRows,
      markdownRows
    );
  } catch (error) {
    // If RedisSearch fails, fall back to PostgreSQL
    logger.error('Error using RedisSearch for context generation:', error);
    
    // Provide more informative messages for common errors
    if (error instanceof Error &&
        (error.message.includes('ETIMEDOUT') ||
         error.message.includes('ECONNREFUSED') ||
         error.message.includes('MaxRetriesPerRequestError'))) {
      logger.error('Connection to Redis Cloud failed', {
        details: [
          'The Redis Cloud instance may not be accessible from your current network',
          'Your IP address may not be allowlisted in Redis Cloud',
          'Check your Redis Cloud configuration in the .env file'
        ],
        documentation: 'See Docs/redis_integration.md for more details'
      });
    }
    
    logger.info('Falling back to PostgreSQL for context generation...');
    logger.info('CONTEXT_PATH: Using PostgreSQL fallback (RedisSearch error)');
    
    return await fallbackToPostgres(keywords);
  }
}

/**
 * Fallback to PostgreSQL for database context generation
 * @param keywords Keywords to search for
 * @returns Formatted database context string
 */
async function fallbackToPostgres(keywords: string[]): Promise<string> {
  logger.info('CONTEXT_PATH: Executing PostgreSQL fallback path');
  
  // Add more detailed logging for monitoring and testing
  logger.debug({
    message: 'Using PostgreSQL fallback for database context generation',
    keywords,
    timestamp: new Date().toISOString(),
    reason: 'Redis unavailable or error'
  });
  
  try {
    // Categorize keywords for more targeted queries
    const categorizedKeywords = categorizeKeywords(keywords);
    logger.debug('Categorized keywords for PostgreSQL fallback:', categorizedKeywords);
    
    // Simple query to find relevant ICD-10 codes
    const icd10Query = `
      SELECT icd10_code, description, clinical_notes, imaging_modalities, primary_imaging
      FROM medical_icd10_codes
      WHERE ${keywords.map((_, index) => 
        `description ILIKE $${index + 1} OR 
         clinical_notes ILIKE $${index + 1} OR 
         keywords ILIKE $${index + 1}`
      ).join(' OR ')}
      LIMIT 10
    `;
    
    const icd10Params = keywords.map(keyword => `%${keyword}%`);
    logger.debug('ICD-10 query params for PostgreSQL fallback:', icd10Params);
    const icd10Result = await queryMainDb(icd10Query, icd10Params);
    logger.info(`Found ${icd10Result.rows.length} relevant ICD-10 codes with PostgreSQL fallback`);
    
    // Simple query to find relevant CPT codes
    const cptQuery = `
      SELECT cpt_code, description, modality, body_part
      FROM medical_cpt_codes
      WHERE ${keywords.map((_, index) => 
        `description ILIKE $${index + 1} OR 
         body_part ILIKE $${index + 1} OR 
         modality ILIKE $${index + 1}`
      ).join(' OR ')}
      LIMIT 10
    `;
    
    const cptParams = keywords.map(keyword => `%${keyword}%`);
    logger.debug('CPT query params for PostgreSQL fallback:', cptParams);
    const cptResult = await queryMainDb(cptQuery, cptParams);
    logger.info(`Found ${cptResult.rows.length} relevant CPT codes with PostgreSQL fallback`);
    
    // Simple query to find relevant mappings
    const mappingQuery = `
      SELECT m.id, m.icd10_code, i.description as icd10_description, 
             m.cpt_code, c.description as cpt_description, 
             m.appropriateness, m.evidence_source, m.refined_justification
      FROM medical_cpt_icd10_mappings m
      JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
      JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
      WHERE ${keywords.map((_, index) => 
        `i.description ILIKE $${index + 1} OR 
         c.description ILIKE $${index + 1} OR 
         c.body_part ILIKE $${index + 1} OR 
         c.modality ILIKE $${index + 1}`
      ).join(' OR ')}
      LIMIT 10
    `;
    
    const mappingParams = keywords.map(keyword => `%${keyword}%`);
    logger.debug('Mapping query params for PostgreSQL fallback:', mappingParams);
    const mappingResult = await queryMainDb(mappingQuery, mappingParams);
    logger.info(`Found ${mappingResult.rows.length} relevant mappings with PostgreSQL fallback`);
    
    // Simple query to find relevant markdown docs
    const markdownQuery = `
      SELECT md.id, md.icd10_code, i.description as icd10_description, 
             LEFT(md.content, 1000) as content_preview
      FROM medical_icd10_markdown_docs md
      JOIN medical_icd10_codes i ON md.icd10_code = i.icd10_code
      WHERE ${keywords.map((_, index) => 
        `i.description ILIKE $${index + 1} OR 
         md.content ILIKE $${index + 1}`
      ).join(' OR ')}
      LIMIT 5
    `;
    
    const markdownParams = keywords.map(keyword => `%${keyword}%`);
    logger.debug('Markdown query params for PostgreSQL fallback:', markdownParams);
    const markdownResult = await queryMainDb(markdownQuery, markdownParams);
    logger.info(`Found ${markdownResult.rows.length} relevant markdown docs with PostgreSQL fallback`);
    
    return formatDatabaseContext(
      icd10Result.rows as ICD10Row[], 
      cptResult.rows as CPTRow[], 
      mappingResult.rows as MappingRow[], 
      markdownResult.rows as MarkdownRow[]
    );
  } catch (error) {
    logger.error('Error in PostgreSQL fallback for context generation:', error);
    return 'Error generating database context. Please try again later.';
  }
}