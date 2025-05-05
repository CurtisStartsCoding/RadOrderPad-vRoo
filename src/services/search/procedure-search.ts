/**
 * Procedure Search Service
 * 
 * This module provides functions for searching CPT procedure codes
 * with PostgreSQL weighted search and Redis caching.
 */

import { queryMainDb } from '../../config/db';
import { getCachedData, setCachedData } from '../../utils/cache';
import enhancedLogger from '../../utils/enhanced-logger';
import { CPTRow } from '../medical-codes';

/**
 * Search result with score
 */
export interface CPTSearchResult extends CPTRow {
  score: number;
}

/**
 * Search options
 */
export interface SearchOptions {
  limit?: number;
  offset?: number;
  modality?: string | null;
  bodyPart?: string | null;
}

/**
 * Search for CPT procedure codes with PostgreSQL weighted search and Redis caching
 * @param query The search query
 * @param options Search options
 * @returns Array of CPT codes with relevance scores
 */
export async function searchProcedureCodes(
  query: string,
  options: SearchOptions = {}
): Promise<CPTSearchResult[]> {
  try {
    const {
      limit = 100,
      offset = 0,
      modality = null,
      bodyPart = null
    } = options;
    
    // Generate a cache key based on all search parameters
    const cacheKey = `search:cpt:${query}:${modality}:${bodyPart}:${limit}:${offset}`;
    
    // Try to get from Redis cache first
    const cachedResults = await getCachedData<CPTSearchResult[]>(cacheKey);
    
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
    let pgQuery = `
      SELECT 
        c.*, 
        ts_rank_cd(
          setweight(to_tsvector('english', COALESCE(c.cpt_code, '')), 'A') ||
          setweight(to_tsvector('english', COALESCE(c.description, '')), 'B') ||
          setweight(to_tsvector('english', COALESCE(c.body_part, '')), 'C') ||
          setweight(to_tsvector('english', COALESCE(c.modality, '')), 'C'),
          to_tsquery('english', $1)
        ) AS rank,
        similarity(c.cpt_code, $2) * 0.3 + 
        similarity(c.description, $2) * 0.5 +
        similarity(COALESCE(c.body_part, ''), $2) * 0.1 +
        similarity(COALESCE(c.modality, ''), $2) * 0.1 AS text_similarity
      FROM 
        medical_cpt_codes c
      WHERE 
        (c.cpt_code ILIKE $3 OR 
         c.description ILIKE $3 OR
         c.body_part ILIKE $3 OR
         c.modality ILIKE $3)
    `;
    
    // Add filters for modality and body part if provided
    const queryParams = [
      searchTerms.map(term => `${term}:*`).join(' & '), // Full text search query
      normalizedQuery,                                  // For similarity comparison 
      `%${normalizedQuery}%`                            // For LIKE pattern matching
    ];
    
    let paramIndex = 4;
    
    if (modality) {
      pgQuery += ` AND LOWER(c.modality) = LOWER($${paramIndex})`;
      queryParams.push(modality.toLowerCase());
      paramIndex++;
    }
    
    if (bodyPart) {
      pgQuery += ` AND LOWER(c.body_part) = LOWER($${paramIndex})`;
      queryParams.push(bodyPart.toLowerCase());
      paramIndex++;
    }
    
    // Add ordering and limits
    pgQuery += `
      ORDER BY 
        rank DESC, 
        text_similarity DESC
      LIMIT $${paramIndex}
      OFFSET $${paramIndex + 1}
    `;
    
    // Add limit and offset parameters
    queryParams.push(limit.toString(), offset.toString());
    
    // Execute the weighted search query
    const results = await queryMainDb(pgQuery, queryParams);
    
    // Post-process results to boost exact matches
    const processedResults = results.rows.map(row => {
      // Give additional boost to exact code matches
      if (row.cpt_code && row.cpt_code.toLowerCase() === normalizedQuery) {
        row.rank += 2.0; // Significant boost for exact code match
      }
      // Boost for partial code matches
      else if (row.cpt_code && row.cpt_code.toLowerCase().includes(normalizedQuery)) {
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
      message: `Error searching procedure codes for "${query}"`,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // On error, try a simpler direct database query as fallback
    try {
      const likePattern = `%${query.toLowerCase().trim()}%`;
      const result = await queryMainDb(
        `SELECT * FROM medical_cpt_codes 
         WHERE cpt_code ILIKE $1 OR description ILIKE $1
         ORDER BY cpt_code
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
        message: `Fallback error searching procedure codes for "${query}"`,
        error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
        stack: fallbackError instanceof Error ? fallbackError.stack : undefined
      });
      return [];
    }
  }
}