/**
 * Redis Search Functions
 * 
 * This module provides functions for searching data using RediSearch.
 * It implements the single responsibility principle by focusing only on search operations.
 */

import { getRedisClient } from '../../../config/redis';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Search for ICD-10 codes using RediSearch with fuzzy matching
 * @param query The search query
 * @param options Search options
 * @returns Array of search results
 */
// Define a type for the search result
export interface ICD10SearchResult {
  icd10_code: string;
  description: string;
  category: string;
  specialty?: string;
  [key: string]: string | undefined;
}

export async function searchICD10WithRediSearch(
  query: string,
  options: { specialty?: string | null; limit?: number; offset?: number } = {}
): Promise<ICD10SearchResult[]> {
  try {
    const { specialty = null, limit = 20, offset = 0 } = options;
    const client = getRedisClient();
    
    // Prepare search query with fuzzy matching
    // %term% allows for 1 character edit distance
    const terms = query.toLowerCase().split(/\s+/).map(term => `%${term}%`);
    let searchQuery = terms.join(' ');
    
    // Add specialty filter if provided
    if (specialty) {
      searchQuery = `(${searchQuery}) @specialty:{${specialty}}`;
    }
    
    // Execute search
    const result = await client.call(
      'FT.SEARCH', 'idx:icd10', searchQuery,
      'LIMIT', offset.toString(), limit.toString(),
      'RETURN', '4', 'icd10_code', 'description', 'category', 'specialty',
      'SORTBY', 'icd10_code'
    ) as unknown[];
    
    // Parse results
    const totalResults = result[0] as number;
    const parsedResults: ICD10SearchResult[] = [];
    
    for (let i = 1; i < result.length; i += 2) {
      // Key is the Redis key for the hash, we don't need it for the result
      // const key = result[i] as string;
      const values = result[i + 1] as string[];
      const parsedResult: Record<string, string> = {};
      
      for (let j = 0; j < values.length; j += 2) {
        parsedResult[values[j]] = values[j + 1];
      }
      
      // Ensure the result has the required properties for ICD10SearchResult
      parsedResults.push(parsedResult as unknown as ICD10SearchResult);
    }
    
    enhancedLogger.debug(`RediSearch found ${totalResults} ICD-10 codes for query "${query}"`);
    return parsedResults;
  } catch (error) {
    enhancedLogger.error({
      message: 'Error searching ICD-10 codes with RediSearch',
      query,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return [];
  }
}

/**
 * Search for CPT codes using RediSearch with fuzzy matching
 * @param query The search query
 * @param options Search options
 * @returns Array of search results
 */
// Define a type for the CPT search result
export interface CPTSearchResult {
  cpt_code: string;
  description: string;
  modality?: string;
  body_part?: string;
  [key: string]: string | undefined;
}

export async function searchCPTWithRediSearch(
  query: string,
  options: { modality?: string | null; bodyPart?: string | null; limit?: number; offset?: number } = {}
): Promise<CPTSearchResult[]> {
  try {
    const { modality = null, bodyPart = null, limit = 20, offset = 0 } = options;
    const client = getRedisClient();
    
    // Prepare search query with fuzzy matching
    const terms = query.toLowerCase().split(/\s+/).map(term => `%${term}%`);
    let searchQuery = terms.join(' ');
    
    // Add filters if provided
    const filters = [];
    if (modality) {
      filters.push(`@modality:{${modality}}`);
    }
    if (bodyPart) {
      filters.push(`@body_part:(${bodyPart})`);
    }
    
    if (filters.length > 0) {
      searchQuery = `(${searchQuery}) ${filters.join(' ')}`;
    }
    
    // Execute search
    const result = await client.call(
      'FT.SEARCH', 'idx:cpt', searchQuery,
      'LIMIT', offset.toString(), limit.toString(),
      'RETURN', '4', 'cpt_code', 'description', 'modality', 'body_part',
      'SORTBY', 'cpt_code'
    ) as unknown[];
    
    // Parse results
    const totalResults = result[0] as number;
    const parsedResults: CPTSearchResult[] = [];
    
    for (let i = 1; i < result.length; i += 2) {
      // Key is the Redis key for the hash, we don't need it for the result
      // const key = result[i] as string;
      const values = result[i + 1] as string[];
      const parsedResult: Record<string, string> = {};
      
      for (let j = 0; j < values.length; j += 2) {
        parsedResult[values[j]] = values[j + 1];
      }
      
      // Ensure the result has the required properties for CPTSearchResult
      parsedResults.push(parsedResult as unknown as CPTSearchResult);
    }
    
    enhancedLogger.debug(`RediSearch found ${totalResults} CPT codes for query "${query}"`);
    return parsedResults;
  } catch (error) {
    enhancedLogger.error({
      message: 'Error searching CPT codes with RediSearch',
      query,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return [];
  }
}

/**
 * Search for ICD-10 to CPT mappings using RediSearch
 * @param icd10Code The ICD-10 code to search mappings for
 * @param options Search options
 * @returns Array of search results
 */
// Define a type for the mapping search result
export interface MappingSearchResult {
  icd10_code: string;
  cpt_code: string;
  appropriateness_score: string;
  evidence_strength: string;
  composite_score: string;
  [key: string]: string;
}

export async function searchMappingsWithRediSearch(
  icd10Code: string,
  options: { limit?: number; offset?: number } = {}
): Promise<MappingSearchResult[]> {
  try {
    const { limit = 20, offset = 0 } = options;
    const client = getRedisClient();
    
    // Execute search
    const result = await client.call(
      'FT.SEARCH', 'idx:mapping', `@icd10_code:{${icd10Code}}`,
      'LIMIT', offset.toString(), limit.toString(),
      'RETURN', '5', 'icd10_code', 'cpt_code', 'appropriateness_score', 'evidence_strength', 'composite_score',
      'SORTBY', 'composite_score', 'DESC'
    ) as unknown[];
    
    // Parse results
    const totalResults = result[0] as number;
    const parsedResults: MappingSearchResult[] = [];
    
    for (let i = 1; i < result.length; i += 2) {
      // Key is the Redis key for the hash, we don't need it for the result
      // const key = result[i] as string;
      const values = result[i + 1] as string[];
      const parsedResult: Record<string, string> = {};
      
      for (let j = 0; j < values.length; j += 2) {
        parsedResult[values[j]] = values[j + 1];
      }
      
      // Ensure the result has the required properties for MappingSearchResult
      parsedResults.push(parsedResult as unknown as MappingSearchResult);
    }
    
    enhancedLogger.debug(`RediSearch found ${totalResults} mappings for ICD-10 code "${icd10Code}"`);
    return parsedResults;
  } catch (error) {
    enhancedLogger.error({
      message: 'Error searching mappings with RediSearch',
      icd10Code,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return [];
  }
}