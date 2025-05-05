import { getRedisClient } from '../../config/redis';
import enhancedLogger from '../enhanced-logger';

// Make sure we're using the Redis Cloud configuration
// This is just a comment to remind that the getRedisClient function
// should be configured to use REDIS_CLOUD_* environment variables

/**
 * Cache metrics for monitoring and performance analysis
 */
const cacheMetrics = {
  hits: 0,
  misses: 0,
  errors: 0,
  latency: [] as number[]
};

/**
 * Check if an error is potentially transient and retryable
 * @param error The error to check
 * @returns True if the error is retryable, false otherwise
 */
function isRetryableError(error: unknown): boolean {
  if (!error) return false;
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Common transient Redis errors
  const retryablePatterns = [
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ECONNRESET',
    'EPIPE',
    'connection lost',
    'network error',
    'Connection is closed',
    'Connection timeout',
    'connect timed out',
    'socket hang up'
  ];
  
  return retryablePatterns.some(pattern => errorMessage.includes(pattern));
}

/**
 * Execute an operation with retry logic for transient errors
 * @param operation The async operation to execute
 * @param retries Number of retries to attempt
 * @returns The result of the operation
 */
async function executeWithRetry<T>(operation: () => Promise<T>, retries = 2): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isRetryableError(error) && retries > 0) {
      enhancedLogger.warn({
        message: 'Retryable Redis error detected, retrying operation',
        error: error instanceof Error ? error.message : String(error),
        retriesRemaining: retries
      });
      
      // Wait briefly before retrying
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Retry the operation with one less retry attempt
      return executeWithRetry(operation, retries - 1);
    }
    
    // Not retryable or no retries left, rethrow
    throw error;
  }
}

/**
 * Interface for cache metrics
 */
interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: string;
  errors: number;
  avgLatencyMs: string;
  operationsTracked: number;
}

/**
 * Get cache performance metrics
 * @returns Object containing cache performance metrics
 */
export function getCacheMetrics(): CacheMetrics {
  const totalOperations = cacheMetrics.hits + cacheMetrics.misses;
  const hitRate = totalOperations > 0 ? (cacheMetrics.hits / totalOperations) * 100 : 0;
  
  // Calculate average latency, limiting the array to last 1000 entries to avoid memory issues
  if (cacheMetrics.latency.length > 1000) {
    cacheMetrics.latency = cacheMetrics.latency.slice(-1000);
  }
  
  const avgLatencyMs = cacheMetrics.latency.length > 0
    ? cacheMetrics.latency.reduce((sum, val) => sum + val, 0) / cacheMetrics.latency.length
    : 0;
  
  return {
    hits: cacheMetrics.hits,
    misses: cacheMetrics.misses,
    hitRate: hitRate.toFixed(2) + '%',
    errors: cacheMetrics.errors,
    avgLatencyMs: avgLatencyMs.toFixed(2),
    operationsTracked: cacheMetrics.latency.length
  };
}

/**
 * Get cached data from Redis
 * @param key Redis key
 * @returns Cached data or null if not found
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
  const startTime = Date.now();
  
  try {
    const client = getRedisClient();
    
    const data = await executeWithRetry(() => client.get(key));
    
    if (!data) {
      enhancedLogger.debug(`Cache miss for key: ${key}`);
      cacheMetrics.misses++;
      cacheMetrics.latency.push(Date.now() - startTime);
      return null;
    }
    
    try {
      const parsedData = JSON.parse(data) as T;
      enhancedLogger.debug(`Cache hit for key: ${key}`);
      cacheMetrics.hits++;
      cacheMetrics.latency.push(Date.now() - startTime);
      return parsedData;
    } catch (parseError) {
      enhancedLogger.error({
        message: 'Error parsing cached data',
        key,
        error: parseError instanceof Error ? parseError.message : String(parseError),
        stack: parseError instanceof Error ? parseError.stack : undefined
      });
      
      // Invalidate corrupted cache entry
      await invalidateCache(key);
      cacheMetrics.errors++;
      cacheMetrics.latency.push(Date.now() - startTime);
      return null;
    }
  } catch (error) {
    enhancedLogger.error({
      message: 'Error getting cached data',
      key,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    cacheMetrics.errors++;
    cacheMetrics.latency.push(Date.now() - startTime);
    return null;
  }
}

/**
 * Get multiple cached items in a single operation
 * @param keys Array of Redis keys to retrieve
 * @returns Array of results corresponding to the input keys (null for misses or errors)
 */
export async function bulkGetCachedData<T>(keys: string[]): Promise<(T | null)[]> {
  if (!keys.length) return [];
  
  const startTime = Date.now();
  
  try {
    const client = getRedisClient();
    
    // Use pipeline for better performance
    const pipeline = client.pipeline();
    keys.forEach(key => pipeline.get(key));
    
    const results = await executeWithRetry(() => pipeline.exec());
    
    // Process results
    const processedResults = results ? results.map((result, index) => {
      const [error, data] = result;
      const key = keys[index];
      
      if (error) {
        enhancedLogger.error({
          message: 'Error getting cached data in bulk operation',
          key,
          error: String(error)
        });
        cacheMetrics.errors++;
        return null;
      }
      
      if (!data) {
        enhancedLogger.debug(`Cache miss for key: ${key} in bulk operation`);
        cacheMetrics.misses++;
        return null;
      }
      
      try {
        // Ensure data is a string before parsing
        const dataStr = typeof data === 'string' ? data : String(data);
        const parsedData = JSON.parse(dataStr) as T;
        enhancedLogger.debug(`Cache hit for key: ${key} in bulk operation`);
        cacheMetrics.hits++;
        return parsedData;
      } catch (parseError) {
        enhancedLogger.error({
          message: 'Error parsing cached data in bulk operation',
          key,
          error: parseError instanceof Error ? parseError.message : String(parseError)
        });
        cacheMetrics.errors++;
        
        // Invalidate corrupted cache entry (don't await to avoid blocking)
        invalidateCache(key).catch(e => {
          enhancedLogger.error({
            message: 'Error invalidating corrupted cache entry in bulk operation',
            key,
            error: e instanceof Error ? e.message : String(e)
          });
        });
        
        return null;
      }
    }) : keys.map(() => {
      cacheMetrics.errors++;
      return null;
    });
    
    cacheMetrics.latency.push(Date.now() - startTime);
    return processedResults;
  } catch (error) {
    enhancedLogger.error({
      message: 'Error in bulk get operation',
      keys: keys.join(', '),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    cacheMetrics.errors++;
    cacheMetrics.latency.push(Date.now() - startTime);
    
    // Return array of nulls with same length as keys
    return keys.map(() => null);
  }
}

/**
 * Set cached data in Redis
 * @param key Redis key
 * @param data Data to cache
 * @param ttlSeconds Time-to-live in seconds
 */
export async function setCachedData<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
  const startTime = Date.now();
  
  try {
    const client = getRedisClient();
    const serializedData = JSON.stringify(data);
    
    // Set with expiration
    await executeWithRetry(() => client.set(key, serializedData, 'EX', ttlSeconds));
    
    enhancedLogger.debug(`Data cached at key: ${key} with TTL: ${ttlSeconds}s`);
    cacheMetrics.latency.push(Date.now() - startTime);
  } catch (error) {
    enhancedLogger.error({
      message: 'Error setting cached data',
      key,
      ttlSeconds,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    cacheMetrics.errors++;
    cacheMetrics.latency.push(Date.now() - startTime);
    // Don't throw, just log the error
  }
}

/**
 * Get hash data from Redis
 * @param key Redis key
 * @returns Hash data as Record<string, string> or null if not found
 */
export async function getHashData(key: string): Promise<Record<string, string> | null> {
  const startTime = Date.now();
  
  try {
    const client = getRedisClient();
    
    const data = await executeWithRetry(() => client.hgetall(key));
    
    // Redis returns an empty object if the hash doesn't exist
    if (!data || Object.keys(data).length === 0) {
      enhancedLogger.debug(`Cache miss for hash key: ${key}`);
      cacheMetrics.misses++;
      cacheMetrics.latency.push(Date.now() - startTime);
      return null;
    }
    
    enhancedLogger.debug(`Cache hit for hash key: ${key} with ${Object.keys(data).length} fields`);
    cacheMetrics.hits++;
    cacheMetrics.latency.push(Date.now() - startTime);
    return data;
  } catch (error) {
    enhancedLogger.error({
      message: 'Error getting hash data',
      key,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    cacheMetrics.errors++;
    cacheMetrics.latency.push(Date.now() - startTime);
    return null;
  }
}

/**
 * Set hash data in Redis
 * @param key Redis key
 * @param data Hash data as Record<string, string>
 * @param ttlSeconds Time-to-live in seconds
 */
export async function setHashData(key: string, data: Record<string, string>, ttlSeconds: number): Promise<void> {
  const startTime = Date.now();
  
  try {
    const client = getRedisClient();
    
    // Use pipeline for better performance
    const pipeline = client.pipeline();
    
    // Add all hash fields
    Object.entries(data).forEach(([field, value]) => {
      pipeline.hset(key, field, value);
    });
    
    // Set expiration
    pipeline.expire(key, ttlSeconds);
    
    // Execute pipeline
    await executeWithRetry(() => pipeline.exec());
    
    enhancedLogger.debug(`Hash data cached at key: ${key} with ${Object.keys(data).length} fields and TTL: ${ttlSeconds}s`);
    cacheMetrics.latency.push(Date.now() - startTime);
  } catch (error) {
    enhancedLogger.error({
      message: 'Error setting hash data',
      key,
      fieldCount: Object.keys(data).length,
      ttlSeconds,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    cacheMetrics.errors++;
    cacheMetrics.latency.push(Date.now() - startTime);
    // Don't throw, just log the error
  }
}

/**
 * Invalidate a cache entry
 * @param key The cache key to invalidate
 */
export async function invalidateCache(key: string): Promise<void> {
  const startTime = Date.now();
  
  try {
    const client = getRedisClient();
    
    await executeWithRetry(() => client.del(key));
    
    enhancedLogger.debug(`Cache key invalidated: ${key}`);
    cacheMetrics.latency.push(Date.now() - startTime);
  } catch (error) {
    enhancedLogger.error({
      message: 'Error invalidating cache key',
      key,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    cacheMetrics.errors++;
    cacheMetrics.latency.push(Date.now() - startTime);
    // Don't throw, just log the error
  }
}

/**
 * Invalidate multiple cache entries matching a pattern
 * @param pattern The pattern to match keys against (e.g., "user:*")
 * @returns Number of keys invalidated
 */
export async function invalidateCachePattern(pattern: string): Promise<number> {
  const startTime = Date.now();
  
  try {
    const client = getRedisClient();
    
    // Find all keys matching the pattern
    const keys = await executeWithRetry(() => client.keys(pattern));
    
    if (keys.length === 0) {
      enhancedLogger.debug(`No keys found matching pattern: ${pattern}`);
      cacheMetrics.latency.push(Date.now() - startTime);
      return 0;
    }
    
    // Use pipeline to delete all keys efficiently
    const pipeline = client.pipeline();
    keys.forEach(key => pipeline.del(key));
    
    await executeWithRetry(() => pipeline.exec());
    
    enhancedLogger.info(`Invalidated ${keys.length} keys matching pattern: ${pattern}`);
    cacheMetrics.latency.push(Date.now() - startTime);
    return keys.length;
  } catch (error) {
    enhancedLogger.error({
      message: 'Error invalidating cache keys by pattern',
      pattern,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    cacheMetrics.errors++;
    cacheMetrics.latency.push(Date.now() - startTime);
    return 0;
  }
}