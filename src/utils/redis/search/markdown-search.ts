/**
 * Markdown document search functions using Redis
 */
import { getRedisClient, getCachedDataWithRedisJson, cacheDataWithRedisJson } from '../../../config/redis.js';
import {
  ICD10Row,
  MarkdownRow,
  handleRedisSearchError
} from './common.js';

/**
 * Get markdown docs for ICD-10 codes
 * @param icd10Codes Array of ICD-10 codes
 * @returns Array of markdown docs
 */
export async function getMarkdownDocs(icd10Codes: ICD10Row[]): Promise<MarkdownRow[]> {
  const client = getRedisClient();
  const markdownDocs: MarkdownRow[] = [];
  
  try {
    // Get markdown docs for each ICD-10 code
    for (const icd10 of icd10Codes) {
      try {
        const key = `markdown:${icd10.icd10_code}`;
        // Use the Redis client's command method with proper type assertion
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await (client as any).call('GET', key) as string;
        
        if (data) {
          markdownDocs.push({
            id: 0, // ID is not important for display
            icd10_code: icd10.icd10_code,
            icd10_description: icd10.description,
            content_preview: data.substring(0, 1000) // Limit to 1000 characters
          });
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err) {
        // Skip markdown docs that don't exist
      }
    }
    
    return markdownDocs;
  } catch (error) {
    handleRedisSearchError('getMarkdownDocs', error);
    return [];
  }
}