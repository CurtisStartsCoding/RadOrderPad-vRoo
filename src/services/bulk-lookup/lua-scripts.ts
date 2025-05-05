/**
 * Lua Scripts for Redis Operations
 * 
 * This module contains Lua scripts that are executed directly on the Redis server
 * for improved performance and atomicity.
 */

/**
 * Bulk lookup script for efficiently retrieving multiple cached items in a single operation.
 * 
 * The script:
 * 1. Takes a list of codes as arguments (ARGV)
 * 2. Constructs the cache key for each code
 * 3. Retrieves the cached data for each code
 * 4. Tracks cache hits and misses
 * 5. Returns an array containing:
 *    - The results array (with empty strings for cache misses)
 *    - The number of cache hits
 *    - The number of cache misses
 */
export const BULK_LOOKUP_SCRIPT = `
  local results = {}
  local cacheHits = 0
  local cacheMisses = 0
  
  for i, code in ipairs(ARGV) do
    local cacheKey = "code:" .. code
    local cached = redis.call("GET", cacheKey)
    
    if cached then
      results[i] = cached
      cacheHits = cacheHits + 1
    else
      results[i] = ""
      cacheMisses = cacheMisses + 1
    end
  end
  
  return {results, cacheHits, cacheMisses}
`;

/**
 * Bulk lookup script with prefix support.
 * Similar to BULK_LOOKUP_SCRIPT but allows specifying a key prefix as the first argument.
 */
export const BULK_LOOKUP_WITH_PREFIX_SCRIPT = `
  local prefix = ARGV[1]
  local results = {}
  local cacheHits = 0
  local cacheMisses = 0
  
  for i = 2, #ARGV do
    local code = ARGV[i]
    local cacheKey = prefix .. ":" .. code
    local cached = redis.call("GET", cacheKey)
    
    if cached then
      results[i-1] = cached
      cacheHits = cacheHits + 1
    else
      results[i-1] = ""
      cacheMisses = cacheMisses + 1
    end
  end
  
  return {results, cacheHits, cacheMisses}
`;