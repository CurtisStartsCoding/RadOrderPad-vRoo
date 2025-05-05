/**
 * ICD-10 Code Service
 * 
 * This module provides functions for retrieving ICD-10 codes with Redis caching.
 * It implements the Cache-Aside pattern to improve performance.
 */

import { queryMainDb } from '../../config/db';
import { getCachedData, setCachedData } from '../../utils/cache';
import enhancedLogger from '../../utils/enhanced-logger';

/**
 * ICD-10 code data structure
 */
export interface ICD10Row {
  icd10_code: string;
  description: string;
  clinical_notes?: string;
  imaging_modalities?: string;
  primary_imaging?: string;
  category?: string;
  // Add other fields as needed based on your schema
}

/**
 * Get an ICD-10 code by its code with Redis caching
 * @param code The ICD-10 code to retrieve
 * @returns The ICD-10 code data or null if not found
 */
export async function getICD10Code(code: string): Promise<ICD10Row | null> {
  try {
    // Generate cache key
    const cacheKey = `icd10:code:${code}`;
    
    // Try to get from Redis cache first
    const cachedData = await getCachedData<ICD10Row>(cacheKey);
    
    // Return cached data if found
    if (cachedData) {
      return cachedData;
    }
    
    // Cache miss - query database
    const result = await queryMainDb(
      'SELECT * FROM medical_icd10_codes WHERE icd10_code = $1',
      [code]
    );
    
    // Return null if not found
    if (result.rows.length === 0) {
      return null;
    }
    
    const icd10Data = result.rows[0] as ICD10Row;
    
    // Cache the result with 24-hour TTL (86400 seconds)
    await setCachedData(cacheKey, icd10Data, 86400);
    
    return icd10Data;
  } catch (error) {
    enhancedLogger.error({
      message: `Error retrieving ICD-10 code: ${code}`,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // On error, try direct database query as fallback
    try {
      const result = await queryMainDb(
        'SELECT * FROM medical_icd10_codes WHERE icd10_code = $1',
        [code]
      );
      
      return result.rows.length > 0 ? (result.rows[0] as ICD10Row) : null;
    } catch (fallbackError) {
      enhancedLogger.error({
        message: `Fallback error retrieving ICD-10 code: ${code}`,
        error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
        stack: fallbackError instanceof Error ? fallbackError.stack : undefined
      });
      return null;
    }
  }
}

/**
 * Get multiple ICD-10 codes by their codes with Redis caching
 * @param codes Array of ICD-10 codes to retrieve
 * @returns Array of ICD-10 code data
 */
export async function getICD10Codes(codes: string[]): Promise<ICD10Row[]> {
  if (!codes.length) return [];
  
  const results: ICD10Row[] = [];
  const uncachedCodes: string[] = [];
  
  // Try to get each code from cache first
  for (const code of codes) {
    const icd10Data = await getICD10Code(code);
    if (icd10Data) {
      results.push(icd10Data);
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
    const query = `SELECT * FROM medical_icd10_codes WHERE icd10_code IN (${placeholders})`;
    
    const result = await queryMainDb(query, uncachedCodes);
    
    // Cache each result and add to results array
    for (const row of result.rows) {
      const icd10Data = row as ICD10Row;
      results.push(icd10Data);
      
      // Cache with 24-hour TTL (86400 seconds)
      await setCachedData(`icd10:code:${icd10Data.icd10_code}`, icd10Data, 86400);
    }
    
    return results;
  } catch (error) {
    enhancedLogger.error({
      message: 'Error retrieving multiple ICD-10 codes',
      codes: uncachedCodes,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return results; // Return what we have from cache
  }
}