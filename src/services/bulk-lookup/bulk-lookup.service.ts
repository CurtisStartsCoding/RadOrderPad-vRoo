import { getRedisClient } from '../../config/redis';
import { bulkLookupWithPrefixScriptSha, areScriptsLoaded, reloadScripts } from './script-loader';
import enhancedLogger from '../../utils/enhanced-logger';

/**
 * Error thrown when Lua scripts are not loaded
 */
export class ScriptsNotLoadedError extends Error {
  constructor() {
    super('Lua scripts are not loaded. Call loadAndCacheScripts() first.');
    this.name = 'ScriptsNotLoadedError';
  }
}

/**
 * Lookup multiple codes in Redis cache using Lua script for efficiency
 * @param codes Array of codes to look up
 * @param codeTypePrefix Prefix to use for the cache keys (e.g., 'cpt:code:' or 'icd10:code:')
 * @returns Array of parsed results (null for cache misses)
 * @throws ScriptsNotLoadedError if Lua scripts are not loaded
 */
export async function bulkLookupCodes<T>(
  codes: string[],
  codeTypePrefix: string
): Promise<(T | null)[]> {
  if (!areScriptsLoaded()) {
    throw new ScriptsNotLoadedError();
  }

  if (!codes.length) {
    return [];
  }

  try {
    const client = getRedisClient();
    
    // Execute the Lua script with prefix support
    const [results, hits, misses] = await client.evalsha(
      bulkLookupWithPrefixScriptSha as string,
      0, // No KEYS, all in ARGV
      codeTypePrefix, // First ARGV is the prefix
      ...codes // Rest of ARGV are the codes
    ) as [string[], number, number];
    
    enhancedLogger.debug(`Bulk lookup: ${hits} cache hits, ${misses} cache misses`);
    
    // Process the results
    const processedResults: (T | null)[] = [];
    
    for (let i = 0; i < codes.length; i++) {
      const result = results[i];
      
      if (result && result !== '') {
        try {
          processedResults[i] = JSON.parse(result) as T;
        } catch (error) {
          enhancedLogger.error({
            message: 'Error parsing cached data in bulk lookup',
            code: codes[i],
            error: error instanceof Error ? error.message : String(error)
          });
          processedResults[i] = null;
        }
      } else {
        processedResults[i] = null;
      }
    }
    
    return processedResults;
  } catch (error) {
    // Check if it's a NOSCRIPT error (script not found)
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('NOSCRIPT')) {
      enhancedLogger.warn('Lua script not found in Redis, attempting to reload scripts');
      
      try {
        // Reload the scripts
        await reloadScripts();
        
        // Retry the operation
        return bulkLookupCodes(codes, codeTypePrefix);
      } catch (reloadError) {
        enhancedLogger.error({
          message: 'Failed to reload Lua scripts',
          error: reloadError instanceof Error ? reloadError.message : String(reloadError)
        });
        throw reloadError;
      }
    }
    
    // For other errors, log and rethrow
    enhancedLogger.error({
      message: 'Error in bulk lookup operation',
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    throw error;
  }
}

/**
 * Lookup multiple CPT codes in Redis cache
 * @param codes Array of CPT codes to look up
 * @returns Array of parsed results (null for cache misses)
 */
export async function bulkLookupCptCodes<T>(codes: string[]): Promise<(T | null)[]> {
  return bulkLookupCodes<T>(codes, 'cpt:code');
}

/**
 * Lookup multiple ICD-10 codes in Redis cache
 * @param codes Array of ICD-10 codes to look up
 * @returns Array of parsed results (null for cache misses)
 */
export async function bulkLookupIcd10Codes<T>(codes: string[]): Promise<(T | null)[]> {
  return bulkLookupCodes<T>(codes, 'icd10:code');
}