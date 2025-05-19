/**
 * Weighted search for markdown documents
 */
import { getRedisClient } from '../../../config/redis';
import {
  ICD10Row,
  MarkdownRow,
  handleRedisSearchError
} from './common';
import logger from '../../../utils/logger';

/**
 * Extended markdown row interface with score and content
 */
export interface MarkdownRowWithScore extends MarkdownRow {
  score: number;
  content?: string; // Add content property
}

/**
 * Search for markdown documents using RedisSearch with relevance scores
 * @param searchTerms Keywords to search for
 * @param limit Maximum number of results to return
 * @returns Array of markdown documents with relevance scores
 */
export async function searchMarkdownDocsWithScores(
  searchTerms: string[],
  limit = 20,
  context: 'diagnosis' | 'procedure' | 'general' = 'general'
): Promise<MarkdownRowWithScore[]> {
  const client = getRedisClient();
  
  try {
    // Process search terms
    const searchTermsStr = searchTerms.join(' | ');
    
    // Construct a query that uses field aliases with weights
    // Note: We use the field aliases defined in the schema, not the JSONPath field specifiers
    // Use a simpler syntax that relies on the weights defined in the schema
    // Format: @field1:(term) | @field2:(term)
    
    // Adjust query based on context
    let query = '';
    
    if (context === 'diagnosis') {
      // For diagnosis searches, prioritize content and description
      query = `@content:(${searchTermsStr}) | @icd10_description:(${searchTermsStr}) | @content_preview:(${searchTermsStr})`;
    } else if (context === 'procedure') {
      // For procedure searches, prioritize content
      query = `@content:(${searchTermsStr}) | @content_preview:(${searchTermsStr}) | @icd10_description:(${searchTermsStr})`;
    } else {
      // Default query using all fields
      query = `@content:(${searchTermsStr}) | @icd10_description:(${searchTermsStr}) | @content_preview:(${searchTermsStr})`;
    }
    
    // Execute the search with scores
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (client as any).call(
      'FT.SEARCH',
      'idx:markdown',
      query,
      'WITHSCORES',
      'LIMIT', '0', limit.toString(),
      'RETURN', '4',
      '$.icd10_code',
      '$.icd10_description',
      '$.content',
      '$.content_preview'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any[];
    
    // Process the results
    const totalResults = result[0] as number;
    logger.debug(`Found ${totalResults} markdown documents with weighted search`);
    
    const markdownRows: MarkdownRowWithScore[] = [];
    
    // Results format with WITHSCORES: [total, key1, score1, fields1, key2, score2, fields2, ...]
    for (let i = 1; i < result.length; i += 3) {
      const key = result[i] as string;
      const score = parseFloat(result[i + 1] as string);
      const data = result[i + 2] as string[];
      
      // Extract the ICD-10 code from the key (format: markdown:ICD10)
      const keyParts = key.split(':');
      const icd10Code = keyParts[1] || '';
      
      // Create a MarkdownRow object with score
      const row: MarkdownRowWithScore = {
        id: 0, // ID will be set later if available
        icd10_code: icd10Code,
        icd10_description: '',
        content: '',
        content_preview: '',
        score: score
      };
      
      // Process the returned fields
      for (let j = 0; j < data.length; j += 2) {
        const fieldName = data[j] as string;
        const fieldValue = data[j + 1] as string;
        
        // Map the field names to the MarkdownRow properties
        switch (fieldName) {
          case '$.icd10_code':
            row.icd10_code = fieldValue;
            break;
          case '$.icd10_description':
            row.icd10_description = fieldValue;
            break;
          case '$.content':
            row.content = fieldValue;
            break;
          case '$.content_preview':
            row.content_preview = fieldValue;
            break;
        }
      }
      
      // If content_preview is empty but content is available, create a preview
      if (!row.content_preview && row.content) {
        row.content_preview = row.content.substring(0, 1000);
      }
      
      markdownRows.push(row);
    }
    
    // Sort by score in descending order
    markdownRows.sort((a, b) => b.score - a.score);
    
    return markdownRows;
  } catch (error) {
    handleRedisSearchError('searchMarkdownDocsWithScores', error);
    return [];
  }
}

/**
 * Get markdown docs for ICD-10 codes with weighted search
 * @param icd10Codes Array of ICD-10 codes
 * @param searchTerms Additional search terms
 * @returns Array of markdown docs with scores
 */
export async function getMarkdownDocsWithScores(
  icd10Codes: ICD10Row[],
  searchTerms: string[] = [],
  context: 'diagnosis' | 'procedure' | 'general' = 'general'
): Promise<MarkdownRowWithScore[]> {
  const client = getRedisClient();
  const markdownDocs: MarkdownRowWithScore[] = [];
  
  try {
    // If we have search terms, use weighted search
    if (searchTerms.length > 0) {
      return await searchMarkdownDocsWithScores(searchTerms, 20, context);
    }
    
    // Otherwise, get markdown docs for each ICD-10 code
    for (const icd10 of icd10Codes) {
      try {
        const key = `markdown:${icd10.icd10_code}`;
        // Use the Redis client's command method with proper type assertion
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await (client as any).call('JSON.GET', key) as string;
        
        if (data) {
          const parsedData = JSON.parse(data);
          markdownDocs.push({
            id: parsedData.id || 0,
            icd10_code: icd10.icd10_code,
            icd10_description: icd10.description,
            content: parsedData.content || '',
            content_preview: parsedData.content_preview || parsedData.content?.substring(0, 1000) || '',
            score: 1.0 // Default score for direct lookups
          });
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err) {
        // Skip markdown docs that don't exist
      }
    }
    
    return markdownDocs;
  } catch (error) {
    handleRedisSearchError('getMarkdownDocsWithScores', error);
    return [];
  }
}