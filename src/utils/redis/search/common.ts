/**
 * Common utilities and types for Redis search operations
 */
import { ICD10Row, CPTRow, MappingRow, MarkdownRow, CategorizedKeywords } from '../../database/types.js';
import logger from '../../logger.js';

/**
 * Process search terms for Redis search
 * @param keywords Array of keywords
 * @returns Sanitized search terms
 */
export function processSearchTerms(keywords: string[]): string {
  // Filter out very short terms (less than 3 chars) to avoid noise
  const filteredKeywords = keywords.filter(kw => kw.length >= 3);
  
  // Sanitize and join with OR operator
  return filteredKeywords
    .map(kw => kw.replace(/[^a-zA-Z0-9]/g, ' '))
    .join('|');
}

/**
 * Extract key from Redis key pattern
 * @param key Redis key (e.g., "cpt:12345")
 * @returns Extracted key (e.g., "12345")
 */
export function extractKeyFromRedisKey(key: string): string {
  return key.split(':')[1];
}

/**
 * Process Redis search results
 * @param results Raw Redis search results
 * @param processor Function to process each result
 * @returns Processed results
 */
export function processRedisSearchResults<T>(
  results: unknown[],
  processor: (key: string, data: unknown[]) => T
): T[] {
  const processedResults: T[] = [];
  
  // Skip the first element (count) and process the rest
  if (results && results.length > 1) {
    for (let i = 1; i < results.length; i += 2) {
      const key = results[i] as string;
      const data = results[i + 1] as unknown[];
      
      processedResults.push(processor(key, data));
    }
  }
  
  return processedResults;
}

/**
 * Log warning for missing Redis key
 * @param codeType Type of code (e.g., "ICD-10", "CPT")
 * @param code Code value
 */
export function logMissingRedisKey(codeType: string, code: string): void {
  logger.warn(`${codeType} code ${code} not found in Redis`);
}

/**
 * Handle Redis search error
 * @param operation Operation name
 * @param error Error object
 */
export function handleRedisSearchError(operation: string, error: unknown): void {
  logger.error({
    message: `Error in Redis search operation '${operation}'`,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    operation
  });
}

// Export types for convenience
export type {
  ICD10Row,
  CPTRow,
  MappingRow,
  MarkdownRow,
  CategorizedKeywords
};