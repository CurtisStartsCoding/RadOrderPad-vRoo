/**
 * Enhanced ICD-10 Service
 * 
 * This module provides enhanced functions for retrieving ICD-10 codes using RediSearch.
 * It implements the Cache-Aside pattern with fuzzy matching capabilities.
 */

// queryMainDb is not directly used as we're using searchDiagnosisCodes for database access
import { getCachedData, setCachedData } from '../../utils/cache';
import { searchICD10WithRediSearch } from '../../utils/cache/redis-search';
import enhancedLogger from '../../utils/enhanced-logger';
import { ICD10Row } from './icd10-service';
import { searchDiagnosisCodes } from '../search/diagnosis-search';

/**
 * Search for ICD-10 codes with fuzzy matching using RediSearch
 * @param query The search query
 * @param options Search options
 * @returns Promise<ICD10Row[]> Array of ICD-10 codes
 */
export async function searchICD10CodesFuzzy(
  query: string,
  options: { specialty?: string | null; limit?: number; offset?: number } = {}
): Promise<ICD10Row[]> {
  try {
    const { specialty = null, limit = 20, offset = 0 } = options;
    
    // Generate cache key
    const cacheKey = `search:icd10:fuzzy:${query}:${specialty}:${limit}:${offset}`;
    
    // Try to get from Redis cache first
    const cachedResults = await getCachedData<ICD10Row[]>(cacheKey);
    
    if (cachedResults) {
      enhancedLogger.debug(`Using cached fuzzy search results for "${query}"`);
      return cachedResults;
    }
    
    // Cache miss - perform fuzzy search with RediSearch
    enhancedLogger.debug(`Cache miss for fuzzy search query "${query}", using RediSearch`);
    
    // Use RediSearch for fuzzy matching
    const searchResults = await searchICD10WithRediSearch(query, {
      specialty,
      limit,
      offset
    });
    
    // If RediSearch returns results, format and cache them
    if (searchResults.length > 0) {
      const formattedResults = searchResults.map(result => ({
        icd10_code: result.icd10_code,
        description: result.description,
        category: result.category,
        specialty: result.specialty || null,
        // Add other fields as needed
      })) as ICD10Row[];
      
      // Cache the results with a 5-minute TTL (300 seconds)
      await setCachedData(cacheKey, formattedResults, 300);
      
      enhancedLogger.debug(`Cached ${formattedResults.length} fuzzy search results for "${query}"`);
      return formattedResults;
    }
    
    // If RediSearch fails or returns no results, fall back to PostgreSQL
    enhancedLogger.debug(`RediSearch returned no results, falling back to PostgreSQL weighted search`);
    
    // Use the existing PostgreSQL weighted search
    const postgresResults = await searchDiagnosisCodes(query, {
      specialty,
      limit,
      offset
    });
    
    // Cache the PostgreSQL results
    if (postgresResults.length > 0) {
      await setCachedData(cacheKey, postgresResults, 300);
      enhancedLogger.debug(`Cached ${postgresResults.length} PostgreSQL search results for "${query}"`);
    }
    
    return postgresResults;
  } catch (error) {
    enhancedLogger.error({
      message: `Error searching ICD-10 codes with fuzzy matching: ${query}`,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // On error, try direct PostgreSQL search as fallback
    try {
      return await searchDiagnosisCodes(query, options);
    } catch (fallbackError) {
      enhancedLogger.error({
        message: `Fallback error searching ICD-10 codes for "${query}"`,
        error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
        stack: fallbackError instanceof Error ? fallbackError.stack : undefined
      });
      return [];
    }
  }
}

/**
 * Get ICD-10 codes by keyword with fuzzy matching
 * @param keyword The keyword to search for
 * @param limit Maximum number of results
 * @returns Promise<ICD10Row[]> Array of ICD-10 codes
 */
export async function getICD10CodesByKeywordFuzzy(
  keyword: string,
  limit: number = 10
): Promise<ICD10Row[]> {
  return searchICD10CodesFuzzy(keyword, { limit });
}

/**
 * Get ICD-10 codes by specialty with fuzzy matching
 * @param keyword The keyword to search for
 * @param specialty The specialty to filter by
 * @param limit Maximum number of results
 * @returns Promise<ICD10Row[]> Array of ICD-10 codes
 */
export async function getICD10CodesBySpecialtyFuzzy(
  keyword: string,
  specialty: string,
  limit: number = 10
): Promise<ICD10Row[]> {
  return searchICD10CodesFuzzy(keyword, { specialty, limit });
}