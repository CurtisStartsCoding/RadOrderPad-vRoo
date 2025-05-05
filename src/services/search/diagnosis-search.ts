/**
 * Diagnosis Search Service
 * 
 * This module provides functions for searching ICD-10 diagnosis codes
 * with PostgreSQL weighted search and Redis caching.
 */

import { queryMainDb } from '../../config/db';
import { getCachedData, setCachedData } from '../../utils/cache';
import enhancedLogger from '../../utils/enhanced-logger';
import { ICD10Row } from '../medical-codes';

/**
 * Search result with score
 */
export interface ICD10SearchResult extends ICD10Row {
  score: number;
}

/**
 * Search options
 */
export interface SearchOptions {
  limit?: number;
  offset?: number;
  specialty?: string | null;
  includeDescriptions?: boolean;
}

/**
 * Search for ICD-10 diagnosis codes with PostgreSQL weighted search and Redis caching
 * @param query The search query
 * @param options Search options
 * @returns Array of ICD-10 codes with relevance scores
 */
export async function searchDiagnosisCodes(
  query: string,
  options: SearchOptions = {}
): Promise<ICD10SearchResult[]> {
  try {
    const {
      limit = 100,
      offset = 0,
      specialty = null,
      includeDescriptions = true
    } = options;
    
    // Generate a cache key based on all search parameters
    const cacheKey = `search:icd10:${query}:${specialty}:${limit}:${offset}:${includeDescriptions}`;
    
    // Try to get from Redis cache first
    const cachedResults = await getCachedData<ICD10SearchResult[]>(cacheKey);
    
    // Return cached results if found
    if (cachedResults) {
      enhancedLogger.debug(`Using cached search results for "${query}"`);
      return cachedResults;
    }
    
    // Cache miss - perform weighted search with PostgreSQL
    enhancedLogger.debug(`Cache miss for search query "${query}", performing PostgreSQL weighted search`);
    
    // Normalize query for better matching
    const normalizedQuery = query.toLowerCase().trim();
    const searchTerms = normalizedQuery.split(/\s+/);
    
    // Build the weighted search query
    const pgQuery = `
      SELECT 
        c.*, 
        ts_rank_cd(
          setweight(to_tsvector('english', COALESCE(c.icd10_code, '')), 'A') ||
          setweight(to_tsvector('english', COALESCE(c.description, '')), 'B') ||
          setweight(to_tsvector('english', COALESCE(c.clinical_notes, '')), 'C'),
          to_tsquery('english', $1)
        ) AS rank,
        similarity(c.icd10_code, $2) * 0.4 + 
        similarity(c.description, $2) * 0.6 AS text_similarity
      FROM 
        medical_icd10_codes c
      WHERE 
        (c.icd10_code ILIKE $3 OR 
         c.description ILIKE $3 OR
         c.clinical_notes ILIKE $3)
        ${specialty ? 'AND LOWER(c.specialty) = LOWER($4)' : ''}
      ORDER BY 
        rank DESC, 
        text_similarity DESC
      LIMIT $${specialty ? 5 : 4}
      OFFSET $${specialty ? 6 : 5}
    `;
    
    // Prepare the tsquery for full-text search
    const tsQuery = searchTerms.map(term => `${term}:*`).join(' & ');
    const likePattern = `%${normalizedQuery}%`;
    
    // Prepare query parameters
    const queryParams = [
      tsQuery,                  // Full text search query
      normalizedQuery,          // For similarity comparison 
      likePattern               // For LIKE pattern matching
    ];
    
    if (specialty) {
      queryParams.push(specialty.toLowerCase());
    }
    
    queryParams.push(limit.toString(), offset.toString());
    
    // Execute the weighted search query
    const results = await queryMainDb(pgQuery, queryParams);
    
    // Post-process results to boost exact matches
    const processedResults = results.rows.map(row => {
      // Give additional boost to exact code matches
      if (row.icd10_code && row.icd10_code.toLowerCase() === normalizedQuery) {
        row.rank += 2.0; // Significant boost for exact code match
      }
      // Boost for partial code matches
      else if (row.icd10_code && row.icd10_code.toLowerCase().includes(normalizedQuery)) {
        row.rank += 0.5; // Smaller boost for partial code match
      }
      
      return {
        ...row,
        score: parseFloat(row.rank) + parseFloat(row.text_similarity)
      };
    }).sort((a, b) => b.score - a.score);
    
    // Cache the weighted, sorted results with a 5-minute TTL (300 seconds)
    await setCachedData(cacheKey, processedResults, 300);
    
    enhancedLogger.debug(`Cached ${processedResults.length} search results for "${query}" with 5-minute TTL`);
    
    return processedResults;
  } catch (error) {
    enhancedLogger.error({
      message: `Error searching diagnosis codes for "${query}"`,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // On error, try a simpler direct database query as fallback
    try {
      const likePattern = `%${query.toLowerCase().trim()}%`;
      const result = await queryMainDb(
        `SELECT * FROM medical_icd10_codes 
         WHERE icd10_code ILIKE $1 OR description ILIKE $1
         ORDER BY icd10_code
         LIMIT 50`,
        [likePattern]
      );
      
      // Add a basic score for sorting
      return result.rows.map((row, index) => ({
        ...row,
        score: 1.0 - (index * 0.01) // Simple descending score
      }));
    } catch (fallbackError) {
      enhancedLogger.error({
        message: `Fallback error searching diagnosis codes for "${query}"`,
        error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
        stack: fallbackError instanceof Error ? fallbackError.stack : undefined
      });
      return [];
    }
  }
}