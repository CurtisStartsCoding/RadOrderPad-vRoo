/**
 * Weighted search for mappings between ICD-10 and CPT codes
 */
import { getRedisClient } from '../../../config/redis.js';
import {
  ICD10Row,
  CPTRow,
  MappingRow,
  handleRedisSearchError
} from './common.js';
import logger from '../../../utils/logger.js';

/**
 * Extended mapping row interface with score
 */
export interface MappingRowWithScore extends MappingRow {
  score: number;
}

/**
 * Search for mappings using RedisSearch with relevance scores
 * @param searchTerms Keywords to search for
 * @param limit Maximum number of results to return
 * @returns Array of mappings with relevance scores
 */
export async function searchMappingsWithScores(
  searchTerms: string[],
  limit = 20
): Promise<MappingRowWithScore[]> {
  const client = getRedisClient();
  
  try {
    // Process search terms
    const query = searchTerms.join(' | ');
    
    // Execute the search with scores
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (client as any).call(
      'FT.SEARCH',
      'mapping_index',
      query,
      'WITHSCORES',
      'LIMIT', '0', limit.toString(),
      'RETURN', '7', 
      '$.icd10_code', 
      '$.cpt_code', 
      '$.icd10_description', 
      '$.cpt_description', 
      '$.appropriateness', 
      '$.refined_justification', 
      '$.evidence_source'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any[];
    
    // Process the results
    const totalResults = result[0] as number;
    logger.debug(`Found ${totalResults} mappings with weighted search`);
    
    const mappingRows: MappingRowWithScore[] = [];
    
    // Results format with WITHSCORES: [total, key1, score1, fields1, key2, score2, fields2, ...]
    for (let i = 1; i < result.length; i += 3) {
      const key = result[i] as string;
      const score = parseFloat(result[i + 1] as string);
      const data = result[i + 2] as string[];
      
      // Extract the mapping ID from the key (format: mapping:ICD10:CPT)
      const keyParts = key.split(':');
      const icd10Code = keyParts[1] || '';
      const cptCode = keyParts[2] || '';
      
      // Create a MappingRow object with score
      const row: MappingRowWithScore = {
        id: 0, // ID will be set later if available
        icd10_code: icd10Code,
        cpt_code: cptCode,
        icd10_description: '',
        cpt_description: '',
        appropriateness: 0,
        evidence_source: '',
        refined_justification: '',
        score: score
      };
      
      // Process the returned fields
      for (let j = 0; j < data.length; j += 2) {
        const fieldName = data[j] as string;
        const fieldValue = data[j + 1] as string;
        
        // Map the field names to the MappingRow properties
        switch (fieldName) {
          case '$.icd10_code':
            row.icd10_code = fieldValue;
            break;
          case '$.cpt_code':
            row.cpt_code = fieldValue;
            break;
          case '$.icd10_description':
            row.icd10_description = fieldValue;
            break;
          case '$.cpt_description':
            row.cpt_description = fieldValue;
            break;
          case '$.appropriateness':
            row.appropriateness = parseInt(fieldValue, 10) || 0;
            break;
          case '$.refined_justification':
            row.refined_justification = fieldValue;
            break;
          case '$.evidence_source':
            row.evidence_source = fieldValue;
            break;
        }
      }
      
      mappingRows.push(row);
    }
    
    // Sort by score in descending order
    mappingRows.sort((a, b) => b.score - a.score);
    
    return mappingRows;
  } catch (error) {
    handleRedisSearchError('searchMappingsWithScores', error);
    return [];
  }
}

/**
 * Get mappings between ICD-10 and CPT codes with weighted search
 * @param icd10Codes Array of ICD-10 codes
 * @param cptCodes Array of CPT codes
 * @param searchTerms Additional search terms
 * @returns Array of mappings with scores
 */
export async function getMappingsWithScores(
  icd10Codes: ICD10Row[],
  cptCodes: CPTRow[],
  searchTerms: string[] = []
): Promise<MappingRowWithScore[]> {
  const client = getRedisClient();
  const mappings: MappingRowWithScore[] = [];
  
  try {
    // If we have search terms, use weighted search
    if (searchTerms.length > 0) {
      return await searchMappingsWithScores(searchTerms);
    }
    
    // Otherwise, get mappings for each ICD-10 and CPT code combination
    for (const icd10 of icd10Codes) {
      for (const cpt of cptCodes) {
        try {
          const key = `mapping:${icd10.icd10_code}:${cpt.cpt_code}`;
          // Use the Redis client's command method with proper type assertion
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = await (client as any).call('GET', key) as string;
          
          if (data) {
            const parsedData = JSON.parse(data);
            mappings.push({
              id: parsedData.id || 0,
              icd10_code: icd10.icd10_code,
              icd10_description: icd10.description,
              cpt_code: cpt.cpt_code,
              cpt_description: cpt.description,
              appropriateness: parsedData.appropriateness || 0,
              evidence_source: parsedData.evidence_source || '',
              refined_justification: parsedData.refined_justification || '',
              score: parsedData.appropriateness || 0 // Use appropriateness as score
            });
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_err) {
          // Skip mappings that don't exist
        }
      }
    }
    
    // Sort by score (appropriateness) in descending order
    mappings.sort((a, b) => b.score - a.score);
    
    return mappings;
  } catch (error) {
    handleRedisSearchError('getMappingsWithScores', error);
    return [];
  }
}