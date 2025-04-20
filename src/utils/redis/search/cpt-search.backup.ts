/**
 * CPT code search functions using RedisSearch
 */
import { getRedisClient, getCachedDataWithRedisJson, cacheDataWithRedisJson } from '../../../config/redis.js';
import {
  CPTRow,
  CategorizedKeywords,
  processSearchTerms,
  processRedisSearchResults,
  extractKeyFromRedisKey,
  logMissingRedisKey,
  handleRedisSearchError
} from './common.js';

/**
 * Search for CPT codes using RedisSearch
 * @param keywords Keywords to search for
 * @param categorizedKeywords Categorized keywords for more targeted search
 * @returns Array of matching CPT codes
 */
export async function searchCPTCodes(
  keywords: string[],
  categorizedKeywords: CategorizedKeywords
): Promise<CPTRow[]> {
  const client = getRedisClient();
  
  try {
    // Build the search query
    const searchTerms = processSearchTerms(keywords);
    
    // Start with a basic query
    let query = `@description:(${searchTerms})`;
    
    // Add modality filter if we have modalities
    if (categorizedKeywords.modalities.length > 0) {
      const modalities = categorizedKeywords.modalities.join('|');
      query += ` @modality:{${modalities}}`;
    }
    
    // Add body part filter if we have anatomy terms
    if (categorizedKeywords.anatomyTerms.length > 0) {
      const bodyParts = categorizedKeywords.anatomyTerms.join('|');
      query += ` @body_part:{${bodyParts}}`;
    }
    
    // Add code filter if we have specific codes
    if (categorizedKeywords.codes.length > 0) {
      const codes = categorizedKeywords.codes.filter(c => c.match(/^\d{5}$/));
      if (codes.length > 0) {
        // If we have specific CPT codes, search for those directly
        return await getCPTCodesByIds(codes);
      }
    }
    
    // Execute the search
    // Use the Redis client's command method with proper type assertion
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = await (client as any).call(
      'FT.SEARCH',
      'cpt_index',
      query,
      'LIMIT', '0', '10',
      'RETURN', '4', '$.cpt_code', '$.description', '$.modality', '$.body_part'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any[];
    
    // Process the results
    return processRedisSearchResults<CPTRow>(results, (key, data) => {
      // Extract the CPT code from the key (format: cpt:CODE)
      const cptCode = extractKeyFromRedisKey(key);
      
      // Create a CPTRow object
      const row: CPTRow = {
        cpt_code: cptCode,
        description: '',
        modality: '',
        body_part: ''
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
      
      return row;
    });
  } catch (error) {
    handleRedisSearchError('searchCPTCodes', error);
    return [];
  }
}

/**
 * Get CPT codes by their IDs
 * @param codes Array of CPT codes
 * @returns Array of matching CPT codes
 */
export async function getCPTCodesByIds(codes: string[]): Promise<CPTRow[]> {
  const results: CPTRow[] = [];
  
  try {
    // Get each code individually
    for (const code of codes) {
      try {
        // Use the new Redis JSON helper function
        const data = await getCachedDataWithRedisJson<any>(`cpt:${code}`);
        if (data) {
          results.push({
            cpt_code: code,
            description: data.description || '',
            modality: data.modality || '',
            body_part: data.body_part || ''
          });
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err) {
        // Skip codes that don't exist
        logMissingRedisKey('CPT', code);
      }
    }
    
    return results;
  } catch (error) {
    handleRedisSearchError('getCPTCodesByIds', error);
    return [];
  }
}