/**
 * ICD-10 code search functions using RedisSearch
 */
import { getRedisClient, getCachedDataWithRedisJson, cacheDataWithRedisJson } from '../../../config/redis.js';
import {
  ICD10Row,
  CategorizedKeywords,
  processSearchTerms,
  processRedisSearchResults,
  extractKeyFromRedisKey,
  logMissingRedisKey,
  handleRedisSearchError
} from './common.js';

/**
 * Search for ICD-10 codes using RedisSearch
 * @param keywords Keywords to search for
 * @param categorizedKeywords Categorized keywords for more targeted search
 * @returns Array of matching ICD-10 codes
 */
export async function searchICD10Codes(
  keywords: string[],
  categorizedKeywords: CategorizedKeywords
): Promise<ICD10Row[]> {
  const client = getRedisClient();
  
  try {
    // Build the search query
    const searchTerms = processSearchTerms(keywords);
    
    // Build a more targeted query if we have categorized keywords
    let query = `@description|keywords:(${searchTerms})`;
    
    // Add category filter if we have symptoms
    if (categorizedKeywords.symptoms.length > 0) {
      const symptoms = processSearchTerms(categorizedKeywords.symptoms);
      query = `@description|keywords:(${symptoms})`;
    }
    
    // Add code filter if we have specific codes
    if (categorizedKeywords.codes.length > 0) {
      const codes = categorizedKeywords.codes.filter(c => c.match(/^[A-Z]\d{2}(\.\d{1,2})?$/));
      if (codes.length > 0) {
        // If we have specific ICD-10 codes, search for those directly
        return await getICD10CodesByIds(codes);
      }
    }
    
    // Execute the search
    // Use the command method directly with type assertion to bypass TypeScript checks
    // Use the Redis client's command method with proper type assertion
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = await (client as any).call(
      'FT.SEARCH',
      'icd10_index',
      query,
      'LIMIT', '0', '10',
      'RETURN', '5', '$.icd10_code', '$.description', '$.clinical_notes', '$.imaging_modalities', '$.primary_imaging'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any[];
    
    // Process the results
    return processRedisSearchResults<ICD10Row>(results, (key, data) => {
      // Extract the ICD-10 code from the key (format: icd10:CODE)
      const icd10Code = extractKeyFromRedisKey(key);
      
      // Create an ICD10Row object
      const row: ICD10Row = {
        icd10_code: icd10Code,
        description: '',
        clinical_notes: '',
        imaging_modalities: '',
        primary_imaging: ''
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
      
      return row;
    });
  } catch (error) {
    handleRedisSearchError('searchICD10Codes', error);
    return [];
  }
}

/**
 * Get ICD-10 codes by their IDs
 * @param codes Array of ICD-10 codes
 * @returns Array of matching ICD-10 codes
 */
export async function getICD10CodesByIds(codes: string[]): Promise<ICD10Row[]> {
  const results: ICD10Row[] = [];
  
  try {
    // Get each code individually
    for (const code of codes) {
      try {
        // Use the new Redis JSON helper function
        const data = await getCachedDataWithRedisJson<any>(`icd10:${code}`);
        if (data) {
          results.push({
            icd10_code: code,
            description: data.description || '',
            clinical_notes: data.clinical_notes || '',
            imaging_modalities: data.imaging_modalities || '',
            primary_imaging: data.primary_imaging || ''
          });
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err) {
        // Skip codes that don't exist
        logMissingRedisKey('ICD-10', code);
      }
    }
    
    return results;
  } catch (error) {
    handleRedisSearchError('getICD10CodesByIds', error);
    return [];
  }
}