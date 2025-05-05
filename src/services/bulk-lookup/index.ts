/**
 * Bulk Lookup Service
 * 
 * This module provides efficient bulk lookup operations for medical codes
 * using Redis Lua scripts for improved performance.
 */

export { 
  bulkLookupCodes,
  bulkLookupCptCodes,
  bulkLookupIcd10Codes,
  ScriptsNotLoadedError
} from './bulk-lookup.service';

export {
  loadAndCacheScripts,
  areScriptsLoaded,
  reloadScripts
} from './script-loader';