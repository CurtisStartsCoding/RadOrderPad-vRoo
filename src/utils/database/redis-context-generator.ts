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
import { getRedisClient, testRedisConnection } from '../../config/redis';

/**
 * Generate database context based on extracted keywords using RedisSearch
 * Falls back to PostgreSQL if RedisSearch fails
 * @param keywords Keywords to search for
 * @returns Formatted database context string
 */
export async function generateDatabaseContextWithRedis(keywords: string[]): Promise<string> {
  if (keywords.length === 0) {
    return 'No specific medical context found in the input text.';
  }
  
  console.log('Generating database context with RedisSearch using keywords:', keywords);
  
  try {
    // Check if Redis is available
    try {
      const isConnected = await testRedisConnection();
      if (!isConnected) {
        console.log('Redis connection test failed, falling back to PostgreSQL...');
        return await fallbackToPostgres(keywords);
      }
      console.log('Redis connection successful, proceeding with RedisSearch');
    } catch (pingError) {
      console.error('Redis connection test error:', pingError);
      console.log('Falling back to PostgreSQL for context generation...');
      return await fallbackToPostgres(keywords);
    }
    
    // Categorize keywords for more targeted queries
    const categorizedKeywords = categorizeKeywords(keywords);
    console.log('Categorized keywords:', categorizedKeywords);
    
    // Search for ICD-10 codes using RedisSearch
    console.log('Searching for ICD-10 codes with RedisSearch...');
    const icd10Rows = await searchICD10Codes(keywords, categorizedKeywords);
    console.log(`Found ${icd10Rows.length} relevant ICD-10 codes with RedisSearch`);
    
    // Search for CPT codes using RedisSearch
    console.log('Searching for CPT codes with RedisSearch...');
    const cptRows = await searchCPTCodes(keywords, categorizedKeywords);
    console.log(`Found ${cptRows.length} relevant CPT codes with RedisSearch`);
    
    // Get mappings between ICD-10 and CPT codes
    console.log('Getting mappings from Redis...');
    const mappingRows = await getMappings(icd10Rows, cptRows);
    console.log(`Found ${mappingRows.length} relevant mappings from Redis`);
    
    // Get markdown docs for ICD-10 codes
    console.log('Getting markdown docs from Redis...');
    const markdownRows = await getMarkdownDocs(icd10Rows);
    console.log(`Found ${markdownRows.length} relevant markdown docs from Redis`);
    
    // Format the database context
    return formatDatabaseContext(
      icd10Rows,
      cptRows,
      mappingRows,
      markdownRows
    );
  } catch (error) {
    // If RedisSearch fails, fall back to PostgreSQL
    console.error('Error using RedisSearch for context generation:', error);
    
    // Provide more informative messages for common errors
    if (error instanceof Error &&
        (error.message.includes('ETIMEDOUT') ||
         error.message.includes('ECONNREFUSED') ||
         error.message.includes('MaxRetriesPerRequestError'))) {
      console.error('Connection to Redis Cloud failed. This is likely because:');
      console.error('1. The Redis Cloud instance may not be accessible from your current network');
      console.error('2. Your IP address may not be allowlisted in Redis Cloud');
      console.error('3. Check your Redis Cloud configuration in the .env file');
      console.error('See Docs/redis_integration.md for more details');
    }
    
    console.log('Falling back to PostgreSQL for context generation...');
    
    return await fallbackToPostgres(keywords);
  }
}

/**
 * Fallback to PostgreSQL for database context generation
 * @param keywords Keywords to search for
 * @returns Formatted database context string
 */
async function fallbackToPostgres(keywords: string[]): Promise<string> {
  try {
    // Categorize keywords for more targeted queries
    const categorizedKeywords = categorizeKeywords(keywords);
    console.log('Categorized keywords for PostgreSQL fallback:', categorizedKeywords);
    
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
    console.log('ICD-10 query params for PostgreSQL fallback:', icd10Params);
    const icd10Result = await queryMainDb(icd10Query, icd10Params);
    console.log(`Found ${icd10Result.rows.length} relevant ICD-10 codes with PostgreSQL fallback`);
    
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
    console.log('CPT query params for PostgreSQL fallback:', cptParams);
    const cptResult = await queryMainDb(cptQuery, cptParams);
    console.log(`Found ${cptResult.rows.length} relevant CPT codes with PostgreSQL fallback`);
    
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
    console.log('Mapping query params for PostgreSQL fallback:', mappingParams);
    const mappingResult = await queryMainDb(mappingQuery, mappingParams);
    console.log(`Found ${mappingResult.rows.length} relevant mappings with PostgreSQL fallback`);
    
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
    console.log('Markdown query params for PostgreSQL fallback:', markdownParams);
    const markdownResult = await queryMainDb(markdownQuery, markdownParams);
    console.log(`Found ${markdownResult.rows.length} relevant markdown docs with PostgreSQL fallback`);
    
    return formatDatabaseContext(
      icd10Result.rows as ICD10Row[], 
      cptResult.rows as CPTRow[], 
      mappingResult.rows as MappingRow[], 
      markdownResult.rows as MarkdownRow[]
    );
  } catch (error) {
    console.error('Error in PostgreSQL fallback for context generation:', error);
    return 'Error generating database context. Please try again later.';
  }
}