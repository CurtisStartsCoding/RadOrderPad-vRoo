/**
 * Medical Code Mapping Service
 * 
 * This module provides functions for retrieving mappings between ICD-10 and CPT codes
 * with Redis caching using the Cache-Aside pattern.
 */

import { queryMainDb } from '../../config/db';
import { getHashData, setHashData } from '../../utils/cache';
import enhancedLogger from '../../utils/enhanced-logger';

/**
 * Mapping data structure
 */
export interface MappingRow {
  id: number;
  icd10_code: string;
  cpt_code: string;
  appropriateness_score: number;
  evidence_strength: number;
  specialty_relevance: number;
  patient_factors: number;
  composite_score: number;
  // Add other fields as needed based on your schema
}

/**
 * Get CPT codes mapped to a specific ICD-10 code with Redis caching
 * @param icd10Code The ICD-10 code to get mappings for
 * @returns Array of mapping data
 */
export async function getCptCodesForIcd10(icd10Code: string): Promise<MappingRow[]> {
  try {
    // Generate cache key for the hash
    const cacheKey = `mapping:icd10-to-cpt:${icd10Code}`;
    
    // Try to get from Redis hash first
    const cachedMappings = await getHashData(cacheKey);
    
    // If we have cached mappings, convert them to MappingRow objects
    if (cachedMappings && Object.keys(cachedMappings).length > 0) {
      enhancedLogger.debug(`Found ${Object.keys(cachedMappings).length} cached mappings for ICD-10 ${icd10Code}`);
      
      // Convert from hash format to array of mapping objects
      return Object.entries(cachedMappings).map(([cptCode, data]) => {
        try {
          const parsedData = JSON.parse(data);
          return {
            id: parsedData.id || 0,
            icd10_code: icd10Code,
            cpt_code: cptCode,
            appropriateness_score: parsedData.appropriatenessScore || 0,
            evidence_strength: parsedData.evidenceStrength || 0,
            specialty_relevance: parsedData.specialtyRelevance || 0,
            patient_factors: parsedData.patientFactors || 0,
            composite_score: parsedData.compositeScore || 0
          };
        } catch (parseError) {
          enhancedLogger.error({
            message: `Error parsing cached mapping data for ${icd10Code}:${cptCode}`,
            error: parseError instanceof Error ? parseError.message : String(parseError)
          });
          return null;
        }
      }).filter((mapping): mapping is MappingRow => mapping !== null);
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
    
    // Store each mapping in a Redis hash with score-weighted structure
    const hashData: Record<string, string> = {};
    
    mappings.rows.forEach(mapping => {
      // Store full mapping data by CPT code in the hash
      hashData[mapping.cpt_code] = JSON.stringify({
        id: mapping.id,
        appropriatenessScore: mapping.appropriateness_score,
        evidenceStrength: mapping.evidence_strength,
        specialtyRelevance: mapping.specialty_relevance,
        patientFactors: mapping.patient_factors,
        compositeScore: mapping.composite_score
      });
    });
    
    // Cache the hash with 1-hour TTL (3600 seconds)
    await setHashData(cacheKey, hashData, 3600);
    
    enhancedLogger.debug(`Cached ${mappings.rows.length} mappings for ICD-10 ${icd10Code}`);
    
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
 * Get a specific mapping between an ICD-10 code and a CPT code
 * @param icd10Code The ICD-10 code
 * @param cptCode The CPT code
 * @returns The mapping data or null if not found
 */
export async function getSpecificMapping(icd10Code: string, cptCode: string): Promise<MappingRow | null> {
  try {
    // First try to get all mappings for this ICD-10 code from cache
    const mappings = await getCptCodesForIcd10(icd10Code);
    
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