/**
 * Weighted Search Implementation for Redis
 * 
 * This module provides functions for searching medical codes using RedisSearch
 * with weighted results based on relevance scores.
 */

import { getRedisClient } from '../../../config/redis';
import { CPTRow, ICD10Row } from '../../database/types';
import { CategorizedKeywords } from '../../database/types';
import { processSearchTerms, extractKeyFromRedisKey } from './common';
import logger from '../../../utils/logger';

/**
 * Extended CPT Row interface with score
 */
export interface CPTRowWithScore extends CPTRow {
  score: number;
}

/**
 * Extended ICD-10 Row interface with score
 */
export interface ICD10RowWithScore extends ICD10Row {
  score: number;
}

/**
 * Search for CPT codes using RedisSearch with relevance scores
 * @param keywords Keywords to search for
 * @param categorizedKeywords Optional pre-categorized keywords
 * @param limit Maximum number of results to return
 * @returns Array of CPT codes with relevance scores
 */
export async function searchCPTCodesWithScores(
  keywords: string[], 
  categorizedKeywords?: CategorizedKeywords, 
  limit = 20
): Promise<CPTRowWithScore[]> {
  try {
    const client = getRedisClient();
    
    // Process search terms
    const searchTerms = processSearchTerms(keywords);
    
    // Execute the search with scores
    // Construct a query that uses JSONPath field specifiers with weights
    const query = `(@\\$.description:(${searchTerms}) WEIGHT 5.0) | (@\\$.body_part:(${searchTerms}) WEIGHT 3.0) | (@\\$.clinical_justification:(${searchTerms}) WEIGHT 3.0) | (@\\$.key_findings:(${searchTerms}) WEIGHT 2.0)`;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (client as any).call(
      'FT.SEARCH',
      'idx:cpt',
      query,
      'WITHSCORES',
      'LIMIT', '0', limit.toString(),
      'RETURN', '6', '$.cpt_code', '$.description', '$.modality', '$.body_part', '$.clinical_justification', '$.key_findings'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any[];
    
    // Process the results
    const totalResults = result[0] as number;
    logger.debug(`Found ${totalResults} CPT codes with weighted search`);
    
    const cptRows: CPTRowWithScore[] = [];
    
    // Results format with WITHSCORES: [total, key1, score1, fields1, key2, score2, fields2, ...]
    for (let i = 1; i < result.length; i += 3) {
      const key = result[i] as string;
      const score = parseFloat(result[i + 1] as string);
      const data = result[i + 2] as string[];
      
      // Extract the CPT code from the key (format: cpt:CODE)
      const cptCode = extractKeyFromRedisKey(key);
      
      // Create a CPTRow object with score
      const row: CPTRowWithScore = {
        cpt_code: cptCode,
        description: '',
        modality: '',
        body_part: '',
        score: score
      };
      
      // Process the returned fields
      for (let j = 0; j < data.length; j += 2) {
        const fieldName = data[j] as string;
        const fieldValue = data[j + 1] as string;
        
        // Map the field names to the CPTRow properties
        switch (fieldName) {
          case '$.description':
            row.description = fieldValue;
            break;
          case '$.modality':
            row.modality = fieldValue;
            break;
          case '$.body_part':
            row.body_part = fieldValue;
            break;
        }
      }
      
      cptRows.push(row);
    }
    
    // Sort by score in descending order
    cptRows.sort((a, b) => b.score - a.score);
    
    return cptRows;
  } catch (error) {
    logger.error({
      message: 'Error searching CPT codes with weighted search',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return [];
  }
}

/**
 * Search for ICD-10 codes using RedisSearch with relevance scores
 * @param keywords Keywords to search for
 * @param categorizedKeywords Optional pre-categorized keywords
 * @param limit Maximum number of results to return
 * @returns Array of ICD-10 codes with relevance scores
 */
export async function searchICD10CodesWithScores(
  keywords: string[], 
  categorizedKeywords?: CategorizedKeywords, 
  limit = 20
): Promise<ICD10RowWithScore[]> {
  try {
    const client = getRedisClient();
    
    // Process search terms
    const searchTerms = processSearchTerms(keywords);
    
    // Execute the search with scores
    // Construct a query that uses JSONPath field specifiers with weights
    const query = `(@\\$.description:(${searchTerms}) WEIGHT 5.0) | (@\\$.clinical_notes:(${searchTerms}) WEIGHT 1.0) | (@\\$.keywords:(${searchTerms}) WEIGHT 3.0) | (@\\$.primary_imaging_rationale:(${searchTerms}) WEIGHT 2.0)`;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (client as any).call(
      'FT.SEARCH',
      'idx:icd10',
      query,
      'WITHSCORES',
      'LIMIT', '0', limit.toString(),
      'RETURN', '7', '$.icd10_code', '$.description', '$.clinical_notes', '$.imaging_modalities', '$.primary_imaging', '$.keywords', '$.primary_imaging_rationale'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any[];
    
    // Process the results
    const totalResults = result[0] as number;
    logger.debug(`Found ${totalResults} ICD-10 codes with weighted search`);
    
    const icd10Rows: ICD10RowWithScore[] = [];
    
    // Results format with WITHSCORES: [total, key1, score1, fields1, key2, score2, fields2, ...]
    for (let i = 1; i < result.length; i += 3) {
      const key = result[i] as string;
      const score = parseFloat(result[i + 1] as string);
      const data = result[i + 2] as string[];
      
      // Extract the ICD-10 code from the key (format: icd10:CODE)
      const icd10Code = extractKeyFromRedisKey(key);
      
      // Create an ICD10Row object with score
      const row: ICD10RowWithScore = {
        icd10_code: icd10Code,
        description: '',
        clinical_notes: '',
        imaging_modalities: '',
        primary_imaging: '',
        score: score
      };
      
      // Process the returned fields
      for (let j = 0; j < data.length; j += 2) {
        const fieldName = data[j] as string;
        const fieldValue = data[j + 1] as string;
        
        // Map the field names to the ICD10Row properties
        switch (fieldName) {
          case '$.description':
            row.description = fieldValue;
            break;
          case '$.clinical_notes':
            row.clinical_notes = fieldValue;
            break;
          case '$.imaging_modalities':
            row.imaging_modalities = fieldValue;
            break;
          case '$.primary_imaging':
            row.primary_imaging = fieldValue;
            break;
        }
      }
      
      icd10Rows.push(row);
    }
    
    // Sort by score in descending order
    icd10Rows.sort((a, b) => b.score - a.score);
    
    return icd10Rows;
  } catch (error) {
    logger.error({
      message: 'Error searching ICD-10 codes with weighted search',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return [];
  }
}