/**
 * Redis Cache Utilities
 *
 * This module provides utilities for caching data in Redis using the Cache-Aside pattern.
 * It includes functions for working with both key-value pairs and hash structures,
 * as well as advanced features like pattern-based invalidation, connection resilience,
 * performance metrics, and bulk operations.
 */

export {
  getCachedData,
  setCachedData,
  getHashData,
  setHashData,
  invalidateCache,
  invalidateCachePattern,
  getCacheMetrics,
  bulkGetCachedData
} from './redis-cache-helpers';