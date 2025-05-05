/**
 * Redis Vector Search
 * 
 * This module provides functions for searching vector embeddings in Redis.
 * It implements the single responsibility principle by focusing only on vector search operations.
 */

import { getRedisClient } from '../../../config/redis';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Search for similar medical codes using vector similarity
 * @param indexName Index name
 * @param embedding Vector embedding
 * @param limit Maximum number of results
 * @returns Promise<CodeSearchResult[]> Array of similar codes
 */

// Define a type for the code search result
export interface CodeSearchResult {
  code: string;
  description: string;
  [key: string]: string;
}

export async function searchSimilarCodes(
  indexName: string,
  embedding: number[],
  limit: number = 10
): Promise<CodeSearchResult[]> {
  try {
    const client = getRedisClient();
    
    // Convert embedding to string for query
    const embeddingStr = `[${embedding.join(',')}]`;
    
    // Execute KNN search
    const result = await client.call(
      'FT.SEARCH', `idx:${indexName}`, '*=>[KNN $K @embedding $BLOB]',
      'PARAMS', '4', 'K', limit.toString(), 'BLOB', embeddingStr,
      'RETURN', '2', 'code', 'description',
      'LIMIT', '0', limit.toString()
    ) as unknown[];
    
    // Parse results
    const totalResults = result[0] as number;
    const parsedResults: CodeSearchResult[] = [];
    
    for (let i = 1; i < result.length; i += 2) {
      // Key is the Redis key for the hash, we don't need it for the result
      // const key = result[i] as string;
      const values = result[i + 1] as string[];
      const parsedResult: Record<string, string> = {};
      
      for (let j = 0; j < values.length; j += 2) {
        parsedResult[values[j]] = values[j + 1];
      }
      
      parsedResults.push(parsedResult as CodeSearchResult);
    }
    
    enhancedLogger.debug(`Vector search found ${totalResults} similar codes in index ${indexName}`);
    return parsedResults;
  } catch (error) {
    enhancedLogger.error({
      message: 'Error searching similar codes with vector search',
      indexName,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return [];
  }
}

/**
 * Search for similar rare diseases using vector similarity
 * @param embedding Vector embedding
 * @param limit Maximum number of results
 * @returns Promise<CodeSearchResult[]> Array of similar rare diseases
 */
export async function searchSimilarRareDiseases(
  embedding: number[],
  limit: number = 10
): Promise<CodeSearchResult[]> {
  return searchSimilarCodes('rare-diseases', embedding, limit);
}

/**
 * Search for similar ICD-10 codes using vector similarity
 * @param embedding Vector embedding
 * @param limit Maximum number of results
 * @returns Promise<CodeSearchResult[]> Array of similar ICD-10 codes
 */
export async function searchSimilarICD10Codes(
  embedding: number[],
  limit: number = 10
): Promise<CodeSearchResult[]> {
  return searchSimilarCodes('icd10-vectors', embedding, limit);
}

/**
 * Search for similar CPT codes using vector similarity
 * @param embedding Vector embedding
 * @param limit Maximum number of results
 * @returns Promise<CodeSearchResult[]> Array of similar CPT codes
 */
export async function searchSimilarCPTCodes(
  embedding: number[],
  limit: number = 10
): Promise<CodeSearchResult[]> {
  return searchSimilarCodes('cpt-vectors', embedding, limit);
}

/**
 * Hybrid search combining vector similarity and text search
 * @param indexName Index name
 * @param embedding Vector embedding
 * @param textQuery Text query
 * @param limit Maximum number of results
 * @returns Promise<CodeSearchResult[]> Array of search results
 */
export async function hybridSearch(
  indexName: string,
  embedding: number[],
  textQuery: string,
  limit: number = 10
): Promise<CodeSearchResult[]> {
  try {
    const client = getRedisClient();
    
    // Convert embedding to string for query
    const embeddingStr = `[${embedding.join(',')}]`;
    
    // Execute hybrid search
    const result = await client.call(
      'FT.SEARCH', `idx:${indexName}`, `(${textQuery})=>[KNN $K @embedding $BLOB]`,
      'PARAMS', '4', 'K', limit.toString(), 'BLOB', embeddingStr,
      'RETURN', '2', 'code', 'description',
      'LIMIT', '0', limit.toString()
    ) as unknown[];
    
    // Parse results
    const totalResults = result[0] as number;
    const parsedResults: CodeSearchResult[] = [];
    
    for (let i = 1; i < result.length; i += 2) {
      // Key is the Redis key for the hash, we don't need it for the result
      // const key = result[i] as string;
      const values = result[i + 1] as string[];
      const parsedResult: Record<string, string> = {};
      
      for (let j = 0; j < values.length; j += 2) {
        parsedResult[values[j]] = values[j + 1];
      }
      
      parsedResults.push(parsedResult as CodeSearchResult);
    }
    
    enhancedLogger.debug(`Hybrid search found ${totalResults} results in index ${indexName}`);
    return parsedResults;
  } catch (error) {
    enhancedLogger.error({
      message: 'Error performing hybrid search',
      indexName,
      textQuery,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return [];
  }
}