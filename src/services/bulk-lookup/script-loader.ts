import { getRedisClient } from '../../config/redis';
import { BULK_LOOKUP_SCRIPT, BULK_LOOKUP_WITH_PREFIX_SCRIPT } from './lua-scripts';
import enhancedLogger from '../../utils/enhanced-logger';

/**
 * SHA hashes for the loaded Lua scripts
 * These are set when the scripts are loaded and used for executing the scripts
 */
export let bulkLookupScriptSha: string | null = null;
export let bulkLookupWithPrefixScriptSha: string | null = null;

/**
 * Loads and caches all Lua scripts in Redis
 * This should be called during application startup
 * @returns Promise that resolves when all scripts are loaded
 */
export async function loadAndCacheScripts(): Promise<void> {
  try {
    const client = getRedisClient();
    
    // Load the bulk lookup script
    bulkLookupScriptSha = await client.script('LOAD', BULK_LOOKUP_SCRIPT) as string;
    enhancedLogger.info(`Loaded bulk lookup script with SHA: ${bulkLookupScriptSha}`);
    
    // Load the bulk lookup with prefix script
    bulkLookupWithPrefixScriptSha = await client.script('LOAD', BULK_LOOKUP_WITH_PREFIX_SCRIPT) as string;
    enhancedLogger.info(`Loaded bulk lookup with prefix script with SHA: ${bulkLookupWithPrefixScriptSha}`);
    
  } catch (error) {
    enhancedLogger.error({
      message: 'Failed to load Lua scripts',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Re-throw the error to allow the caller to handle it
    throw error;
  }
}

/**
 * Checks if all required Lua scripts are loaded
 * @returns True if all scripts are loaded, false otherwise
 */
export function areScriptsLoaded(): boolean {
  return bulkLookupScriptSha !== null && bulkLookupWithPrefixScriptSha !== null;
}

/**
 * Reloads all Lua scripts in Redis
 * This can be used if script execution fails with NOSCRIPT error
 * @returns Promise that resolves when all scripts are reloaded
 */
export async function reloadScripts(): Promise<void> {
  // Reset the SHA hashes
  bulkLookupScriptSha = null;
  bulkLookupWithPrefixScriptSha = null;
  
  // Load the scripts again
  await loadAndCacheScripts();
  enhancedLogger.info('Lua scripts reloaded successfully');
}