/**
 * CPT Code Service
 * 
 * This module provides functions for retrieving CPT codes with Redis caching.
 * It implements the Cache-Aside pattern to improve performance.
 */

import { queryMainDb } from '../../config/db';
import { getCachedData, setCachedData } from '../../utils/cache';
import enhancedLogger from '../../utils/enhanced-logger';

/**
 * CPT code data structure
 */
export interface CPTRow {
  cpt_code: string;
  description: string;
  modality?: string;
  body_part?: string;
  category?: string;
  contrast_use?: string;
  imaging_protocol?: string;
  // Add other fields as needed based on your schema
}

/**
 * Get a CPT code by its code with Redis caching
 * @param code The CPT code to retrieve
 * @returns The CPT code data or null if not found
 */
export async function getCPTCode(code: string): Promise<CPTRow | null> {
  try {
    // Generate cache key
    const cacheKey = `cpt:code:${code}`;
    
    // Try to get from Redis cache first
    const cachedData = await getCachedData<CPTRow>(cacheKey);
    
    // Return cached data if found
    if (cachedData) {
      return cachedData;
    }
    
    // Cache miss - query database
    const result = await queryMainDb(
      'SELECT * FROM medical_cpt_codes WHERE cpt_code = $1',
      [code]
    );
    
    // Return null if not found
    if (result.rows.length === 0) {
      return null;
    }
    
    const cptData = result.rows[0] as CPTRow;
    
    // Cache the result with 24-hour TTL (86400 seconds)
    await setCachedData(cacheKey, cptData, 86400);
    
    return cptData;
  } catch (error) {
    enhancedLogger.error({
      message: `Error retrieving CPT code: ${code}`,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // On error, try direct database query as fallback
    try {
      const result = await queryMainDb(
        'SELECT * FROM medical_cpt_codes WHERE cpt_code = $1',
        [code]
      );
      
      return result.rows.length > 0 ? (result.rows[0] as CPTRow) : null;
    } catch (fallbackError) {
      enhancedLogger.error({
        message: `Fallback error retrieving CPT code: ${code}`,
        error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
        stack: fallbackError instanceof Error ? fallbackError.stack : undefined
      });
      return null;
    }
  }
}

/**
 * Get multiple CPT codes by their codes with Redis caching
 * @param codes Array of CPT codes to retrieve
 * @returns Array of CPT code data
 */
export async function getCPTCodes(codes: string[]): Promise<CPTRow[]> {
  if (!codes.length) return [];
  
  const results: CPTRow[] = [];
  const uncachedCodes: string[] = [];
  
  // Try to get each code from cache first
  for (const code of codes) {
    const cptData = await getCPTCode(code);
    if (cptData) {
      results.push(cptData);
    } else {
      uncachedCodes.push(code);
    }
  }
  
  // If all codes were in cache, return results
  if (uncachedCodes.length === 0) {
    return results;
  }
  
  // Query database for uncached codes
  try {
    const placeholders = uncachedCodes.map((_, i) => `$${i + 1}`).join(', ');
    const query = `SELECT * FROM medical_cpt_codes WHERE cpt_code IN (${placeholders})`;
    
    const result = await queryMainDb(query, uncachedCodes);
    
    // Cache each result and add to results array
    for (const row of result.rows) {
      const cptData = row as CPTRow;
      results.push(cptData);
      
      // Cache with 24-hour TTL (86400 seconds)
      await setCachedData(`cpt:code:${cptData.cpt_code}`, cptData, 86400);
    }
    
    return results;
  } catch (error) {
    enhancedLogger.error({
      message: 'Error retrieving multiple CPT codes',
      codes: uncachedCodes,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return results; // Return what we have from cache
  }
}