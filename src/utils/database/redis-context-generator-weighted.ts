/**
 * Redis-based Database Context Generator with Weighted Search
 *
 * This module provides a function to generate database context for validation
 * using RedisSearch with weighted relevance scores in MemoryDB.
 */
import { formatDatabaseContext } from './context-formatter';
import { categorizeKeywords } from './keyword-categorizer';
import { ICD10Row, CPTRow, MappingRow, MarkdownRow } from './types';
import { queryMainDb } from '../../config/db';
import {
  searchICD10CodesWithScores,
  searchCPTCodesWithScores,
  getMappingsWithScores,
  getMarkdownDocsWithScores
} from '../redis/search';
import { generateDatabaseContextWithPostgresWeighted } from './postgres-weighted-search';
import { testRedisConnection } from '../../config/redis';
import logger from '../../utils/logger.js';

/**
 * Generate database context based on extracted keywords using RedisSearch with weighted relevance
 * Falls back to PostgreSQL if RedisSearch fails or returns insufficient results
 * @param keywords Keywords to search for
 * @returns Formatted database context string
 */
export async function generateDatabaseContextWithRedis(keywords: string[]): Promise<string> {
  if (keywords.length === 0) {
    return 'No specific medical context found in the input text.';
  }
  
  const startTime = Date.now();
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
      logger.info('CONTEXT_PATH: Using RedisSearch weighted search as primary path');
      // Add more detailed logging for monitoring and testing
      logger.debug({
        message: 'Using RedisSearch weighted search for database context generation',
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
    
    // Search for ICD-10 codes using RedisSearch with weighted relevance
    logger.info('Searching for ICD-10 codes with weighted RedisSearch...');
    const icd10SearchStartTime = Date.now();
    const icd10RowsWithScores = await searchICD10CodesWithScores(keywords, categorizedKeywords);
    const icd10SearchDuration = Date.now() - icd10SearchStartTime;
    logger.info(`Found ${icd10RowsWithScores.length} relevant ICD-10 codes with weighted RedisSearch (took ${icd10SearchDuration}ms)`);
    
    // Log the top ICD-10 results with scores for debugging
    if (icd10RowsWithScores.length > 0) {
      logger.debug('Top ICD-10 results with scores:');
      icd10RowsWithScores.slice(0, 3).forEach(row => {
        logger.debug(`${row.icd10_code}: ${row.description} (Score: ${row.score})`);
      });
    }
    
    // Search for CPT codes using RedisSearch with weighted relevance
    logger.info('Searching for CPT codes with weighted RedisSearch...');
    const cptSearchStartTime = Date.now();
    const cptRowsWithScores = await searchCPTCodesWithScores(keywords, categorizedKeywords);
    const cptSearchDuration = Date.now() - cptSearchStartTime;
    logger.info(`Found ${cptRowsWithScores.length} relevant CPT codes with weighted RedisSearch (took ${cptSearchDuration}ms)`);
    
    // Log the top CPT results with scores for debugging
    if (cptRowsWithScores.length > 0) {
      logger.debug('Top CPT results with scores:');
      cptRowsWithScores.slice(0, 3).forEach(row => {
        logger.debug(`${row.cpt_code}: ${row.description} (Score: ${row.score})`);
      });
    }
    
    // Get mappings between ICD-10 and CPT codes with weighted relevance
    logger.info('Getting mappings with weighted search from Redis...');
    const mappingsSearchStartTime = Date.now();
    const mappingRowsWithScores = await getMappingsWithScores(
      icd10RowsWithScores,
      cptRowsWithScores,
      keywords
    );
    const mappingsSearchDuration = Date.now() - mappingsSearchStartTime;
    logger.info(`Found ${mappingRowsWithScores.length} relevant mappings with weighted search from Redis (took ${mappingsSearchDuration}ms)`);
    
    // Log the top mapping results with scores for debugging
    if (mappingRowsWithScores.length > 0) {
      logger.debug('Top mapping results with scores:');
      mappingRowsWithScores.slice(0, 3).forEach(row => {
        logger.debug(`${row.icd10_code} -> ${row.cpt_code} (Score: ${row.score})`);
      });
    }
    
    // Get markdown docs for ICD-10 codes with weighted relevance
    logger.info('Getting markdown docs with weighted search from Redis...');
    const markdownSearchStartTime = Date.now();
    const markdownRowsWithScores = await getMarkdownDocsWithScores(
      icd10RowsWithScores,
      keywords
    );
    const markdownSearchDuration = Date.now() - markdownSearchStartTime;
    logger.info(`Found ${markdownRowsWithScores.length} relevant markdown docs with weighted search from Redis (took ${markdownSearchDuration}ms)`);
    
    // Log the top markdown results with scores for debugging
    if (markdownRowsWithScores.length > 0) {
      logger.debug('Top markdown results with scores:');
      markdownRowsWithScores.slice(0, 3).forEach(row => {
        logger.debug(`${row.icd10_code}: ${row.icd10_description} (Score: ${row.score})`);
      });
    }
    
    // Check if we have sufficient results from RedisSearch
    // If we don't have any ICD-10 or CPT codes, fall back to PostgreSQL
    if (icd10RowsWithScores.length === 0 && cptRowsWithScores.length === 0) {
      logger.info('Insufficient results from RedisSearch, falling back to PostgreSQL...');
      logger.info('CONTEXT_PATH: Using PostgreSQL fallback (insufficient RedisSearch results)');
      return await fallbackToPostgres(keywords);
    }
    
    // Convert the scored results to the expected format for formatDatabaseContext
    const icd10Rows: ICD10Row[] = icd10RowsWithScores;
    const cptRows: CPTRow[] = cptRowsWithScores;
    const mappingRows: MappingRow[] = mappingRowsWithScores;
    const markdownRows: MarkdownRow[] = markdownRowsWithScores;
    
    // Format the database context
    const formatStartTime = Date.now();
    const result = formatDatabaseContext(
      icd10Rows,
      cptRows,
      mappingRows,
      markdownRows
    );
    const formatDuration = Date.now() - formatStartTime;
    
    // Log total duration
    const totalDuration = Date.now() - startTime;
    logger.info(`Total Redis context generation took ${totalDuration}ms`, {
      totalDuration,
      icd10SearchDuration,
      cptSearchDuration,
      mappingsSearchDuration,
      markdownSearchDuration,
      formatDuration,
      keywordCount: keywords.length,
      resultSize: result.length
    });
    
    return result;
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
  const fallbackStartTime = Date.now();
  logger.info('CONTEXT_PATH: Executing PostgreSQL weighted search fallback path');
  
  // Add more detailed logging for monitoring and testing
  logger.debug({
    message: 'Using PostgreSQL weighted search fallback for database context generation',
    keywords,
    timestamp: new Date().toISOString(),
    reason: 'Redis unavailable or error'
  });
  
  try {
    // Use the new PostgreSQL weighted search implementation
    const result = await generateDatabaseContextWithPostgresWeighted(keywords);
    
    logger.info(`Found ${result.icd10Rows.length} ICD-10 codes, ${result.cptRows.length} CPT codes, ${result.mappingRows.length} mappings, and ${result.markdownRows.length} markdown docs with PostgreSQL weighted search`);
    
    // Log the top results with scores for debugging
    if (result.icd10Rows.length > 0) {
      logger.debug('Top ICD-10 results with scores from PostgreSQL weighted search:');
      result.icd10Rows.slice(0, 3).forEach(row => {
        logger.debug(`${row.icd10_code}: ${row.description} (Score: ${row.score})`);
      });
    }
    
    if (result.cptRows.length > 0) {
      logger.debug('Top CPT results with scores from PostgreSQL weighted search:');
      result.cptRows.slice(0, 3).forEach(row => {
        logger.debug(`${row.cpt_code}: ${row.description} (Score: ${row.score})`);
      });
    }
    
    // Format the database context
    const formatStartTime = Date.now();
    const formattedResult = formatDatabaseContext(
      result.icd10Rows,
      result.cptRows,
      result.mappingRows,
      result.markdownRows
    );
    const formatDuration = Date.now() - formatStartTime;
    
    // Log total duration for the fallback path
    const totalFallbackDuration = Date.now() - fallbackStartTime;
    logger.info(`Total PostgreSQL fallback context generation took ${totalFallbackDuration}ms`, {
      totalDuration: totalFallbackDuration,
      formatDuration,
      keywordCount: keywords.length,
      resultSize: formattedResult.length
    });
    
    return formattedResult;
  } catch (error) {
    logger.error('Error in PostgreSQL weighted search fallback for context generation:', error);
    
    // If the weighted search fails, fall back to the original PostgreSQL search
    logger.info('Falling back to original PostgreSQL search...');
    
    try {
      // Categorize keywords for more targeted queries
      const categorizedKeywords = categorizeKeywords(keywords);
      logger.debug('Categorized keywords for original PostgreSQL fallback:', categorizedKeywords);
      
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
      const icd10Result = await queryMainDb(icd10Query, icd10Params);
      logger.info(`Found ${icd10Result.rows.length} relevant ICD-10 codes with original PostgreSQL fallback`);
      
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
      const cptResult = await queryMainDb(cptQuery, cptParams);
      logger.info(`Found ${cptResult.rows.length} relevant CPT codes with original PostgreSQL fallback`);
      
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
      const mappingResult = await queryMainDb(mappingQuery, mappingParams);
      logger.info(`Found ${mappingResult.rows.length} relevant mappings with original PostgreSQL fallback`);
      
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
      const markdownResult = await queryMainDb(markdownQuery, markdownParams);
      logger.info(`Found ${markdownResult.rows.length} relevant markdown docs with original PostgreSQL fallback`);
      
      return formatDatabaseContext(
        icd10Result.rows as ICD10Row[],
        cptResult.rows as CPTRow[],
        mappingResult.rows as MappingRow[],
        markdownResult.rows as MarkdownRow[]
      );
    } catch (innerError) {
      logger.error('Error in original PostgreSQL fallback for context generation:', innerError);
      return 'Error generating database context. Please try again later.';
    }
  }
}