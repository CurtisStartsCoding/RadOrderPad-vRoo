/**
 * Enhanced Mapping Service
 * 
 * This module provides enhanced functions for retrieving mappings between ICD-10 and CPT codes
 * using RedisJSON for improved performance and data structure handling.
 */

import { queryMainDb } from '../../config/db';
import { getJSONDocument, storeJSONDocument } from '../../utils/cache/redis-json';
import enhancedLogger from '../../utils/enhanced-logger';
import { MappingRow } from './mapping-service';

/**
 * Get CPT codes mapped to a specific ICD-10 code with RedisJSON
 * @param icd10Code The ICD-10 code to get mappings for
 * @returns Promise<MappingRow[]> Array of mapping data
 */
export async function getCptCodesForIcd10Enhanced(icd10Code: string): Promise<MappingRow[]> {
  try {
    // Generate cache key
    const cacheKey = `json:mapping:icd10-to-cpt:${icd10Code}`;
    
    // Try to get from RedisJSON first
    const cachedMappings = await getJSONDocument<MappingRow[]>(cacheKey);
    
    if (cachedMappings) {
      enhancedLogger.debug(`Found ${cachedMappings.length} cached mappings for ICD-10 ${icd10Code} using RedisJSON`);
      return cachedMappings;
    }
    
    // Cache miss - query database with weighted query
    enhancedLogger.debug(`Cache miss for mappings of ICD-10 ${icd10Code}, querying database`);
    
    const mappings = await queryMainDb(
      `SELECT 
        m.id, 
        m.icd10_code, 
        m.cpt_code,
        m.appropriateness as appropriateness_score,
        m.evidence_level as evidence_strength,
        COALESCE(m.specialty_relevance, 0) as specialty_relevance,
        COALESCE(m.patient_factors, 0) as patient_factors,
        (COALESCE(m.appropriateness, 0) * 0.4 + 
         COALESCE(m.evidence_level, 0) * 0.3 + 
         COALESCE(m.specialty_relevance, 0) * 0.2 + 
         COALESCE(m.patient_factors, 0) * 0.1) as composite_score
       FROM 
        medical_cpt_icd10_mappings m
       WHERE 
        m.icd10_code = $1
       ORDER BY 
        composite_score DESC`,
      [icd10Code]
    );
    
    // If no mappings found, return empty array
    if (mappings.rows.length === 0) {
      return [];
    }
    
    // Store the mappings in RedisJSON with 1-hour TTL (3600 seconds)
    await storeJSONDocument(cacheKey, mappings.rows, 3600);
    
    enhancedLogger.debug(`Cached ${mappings.rows.length} mappings for ICD-10 ${icd10Code} using RedisJSON`);
    
    return mappings.rows as MappingRow[];
  } catch (error) {
    enhancedLogger.error({
      message: `Error retrieving CPT codes for ICD-10 code: ${icd10Code}`,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // On error, try direct database query as fallback
    try {
      const result = await queryMainDb(
        `SELECT 
          m.id, 
          m.icd10_code, 
          m.cpt_code,
          m.appropriateness as appropriateness_score,
          m.evidence_level as evidence_strength,
          COALESCE(m.specialty_relevance, 0) as specialty_relevance,
          COALESCE(m.patient_factors, 0) as patient_factors,
          (COALESCE(m.appropriateness, 0) * 0.4 + 
           COALESCE(m.evidence_level, 0) * 0.3 + 
           COALESCE(m.specialty_relevance, 0) * 0.2 + 
           COALESCE(m.patient_factors, 0) * 0.1) as composite_score
         FROM 
          medical_cpt_icd10_mappings m
         WHERE 
          m.icd10_code = $1
         ORDER BY 
          composite_score DESC`,
        [icd10Code]
      );
      
      return result.rows as MappingRow[];
    } catch (fallbackError) {
      enhancedLogger.error({
        message: `Fallback error retrieving CPT codes for ICD-10 code: ${icd10Code}`,
        error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
        stack: fallbackError instanceof Error ? fallbackError.stack : undefined
      });
      return [];
    }
  }
}

/**
 * Get a specific mapping between an ICD-10 code and a CPT code with RedisJSON
 * @param icd10Code The ICD-10 code
 * @param cptCode The CPT code
 * @returns Promise<MappingRow | null> The mapping data or null if not found
 */
export async function getSpecificMappingEnhanced(
  icd10Code: string, 
  cptCode: string
): Promise<MappingRow | null> {
  try {
    // First try to get all mappings for this ICD-10 code
    const mappings = await getCptCodesForIcd10Enhanced(icd10Code);
    
    // Find the specific mapping
    const mapping = mappings.find(m => m.cpt_code === cptCode);
    
    if (mapping) {
      return mapping;
    }
    
    // If not found in the cached mappings, query directly
    const result = await queryMainDb(
      `SELECT 
        m.id, 
        m.icd10_code, 
        m.cpt_code,
        m.appropriateness as appropriateness_score,
        m.evidence_level as evidence_strength,
        COALESCE(m.specialty_relevance, 0) as specialty_relevance,
        COALESCE(m.patient_factors, 0) as patient_factors,
        (COALESCE(m.appropriateness, 0) * 0.4 + 
         COALESCE(m.evidence_level, 0) * 0.3 + 
         COALESCE(m.specialty_relevance, 0) * 0.2 + 
         COALESCE(m.patient_factors, 0) * 0.1) as composite_score
       FROM 
        medical_cpt_icd10_mappings m
       WHERE 
        m.icd10_code = $1 AND m.cpt_code = $2`,
      [icd10Code, cptCode]
    );
    
    return result.rows.length > 0 ? (result.rows[0] as MappingRow) : null;
  } catch (error) {
    enhancedLogger.error({
      message: `Error retrieving specific mapping for ${icd10Code}:${cptCode}`,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return null;
  }
}