import Redis, { Redis as RedisClient } from 'ioredis';
import * as dotenv from 'dotenv';
import logger from '../utils/logger.js';

/**
 * Redis Cloud client configuration
 *
 * This file configures and exports the Redis client instance for Redis Cloud.
 * Redis Cloud is used for caching frequently accessed medical reference data and
 * for RedisSearch and RedisJSON capabilities to enable fast context generation.
 *
 * For detailed documentation, see:
 * - Docs/redis_integration.md - High-level Redis integration strategy
 * - Docs/implementation/redis-integration.md - Detailed implementation documentation
 */

// Load environment variables
dotenv.config();

// Get Redis Cloud configuration from environment variables
const redisHost = process.env.REDIS_CLOUD_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_CLOUD_PORT || '6379');
const redisPassword = process.env.REDIS_CLOUD_PASSWORD;

// Redis Cloud connection options
const redisOptions = {
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  // Only enable TLS for Redis Cloud, not for localhost
  tls: redisHost !== 'localhost' ? {} : undefined,
  // Reconnect strategy
  retryStrategy: (times: number): number => {
    // Maximum retry time is 3 minutes
    const maxRetryTimeMs = 3 * 60 * 1000;
    // Exponential backoff with a maximum
    const delay = Math.min(
      Math.pow(2, times) * 100,
      maxRetryTimeMs
    );
    return delay;
  },
  // Connection name for easier identification in monitoring
  connectionName: 'radorderpad-redis-client'
};

// Create Redis client instance
let redisClient: RedisClient | null = null;

/**
 * Get the Redis client instance
 * Creates a new client if one doesn't exist
 */
export function getRedisClient(): RedisClient {
  if (!redisClient) {
    try {
      logger.info('Initializing Redis Cloud client connection...');
      redisClient = new Redis(redisOptions);
      
      // Set up event handlers
      redisClient.on('connect', () => {
        logger.info('Redis Cloud client connected successfully');
      });
      
      redisClient.on('error', (err: Error) => {
        logger.error({
          message: 'Redis Cloud client error',
          error: err.message,
          stack: err.stack
        });
        
        // Provide more informative messages for common errors
        if (err.message.includes('ETIMEDOUT') || err.message.includes('ECONNREFUSED')) {
          logger.error({
            message: 'Connection to Redis Cloud timed out',
            details: [
              'The Redis Cloud instance may not be accessible from your current network',
              'Your IP address may not be allowlisted in Redis Cloud',
              'Check your Redis Cloud configuration in the .env file'
            ],
            documentation: 'See Docs/redis_integration.md for more details',
            error: err.message,
            stack: err.stack
          });
        }
        
        // Don't crash the application on Redis errors
      });
      
      redisClient.on('reconnecting', (delay: number) => {
        logger.info(`Redis Cloud client reconnecting in ${delay}ms...`);
      });
      
      redisClient.on('end', () => {
        logger.info('Redis Cloud client connection ended');
      });
    } catch (error) {
      logger.error({
        message: 'Failed to initialize Redis Cloud client',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
  
  return redisClient;
}

/**
 * Test the Redis Cloud connection
 * @returns Promise<boolean> - True if connection is successful
 */
export async function testRedisConnection(): Promise<boolean> {
  try {
    logger.info('Testing Redis Cloud connection...');
    const client = getRedisClient();
    
    // Set a timeout for the ping operation
    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 5 seconds')), 5000);
    });
    
    // Race the ping operation against the timeout
    const result = await Promise.race([
      client.ping(),
      timeoutPromise
    ]);
    
    logger.info(`Redis Cloud connection test result: ${result}`);
    return result === 'PONG';
  } catch (error) {
    logger.error({
      message: 'Redis Cloud connection test failed',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Provide more informative messages for common errors
    if (error instanceof Error) {
      if (error.message.includes('ETIMEDOUT') || error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
        logger.error({
          message: 'Connection timed out or was refused',
          details: [
            'The Redis Cloud instance may not be accessible from your current network',
            'Your IP address (69.138.136.57) may not be allowlisted in Redis Cloud (currently only 3.135.76.53 is allowed)',
            'Check your Redis Cloud configuration in the .env file'
          ],
          documentation: 'See Docs/implementation/redis-cloud-integration.md for more details',
          error: error.message,
          stack: error.stack
        });
      }
    }
    
    return false;
  }
}

/**
 * Close the Redis Cloud connection
 */
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis Cloud connection closed');
  }
}

/**
 * Cache data using RedisJSON
 * @param key Redis key
 * @param data Data to cache
 * @param ttl Time-to-live in seconds
 */
export async function cacheDataWithRedisJson<T>(key: string, data: T, ttl: number): Promise<void> {
  try {
    const client = getRedisClient();
    
    // Use JSON.SET to store the data as JSON
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (client as any).call('JSON.SET', key, '.', JSON.stringify(data));
    
    // Set TTL if provided
    if (ttl > 0) {
      await client.expire(key, ttl);
    }
    
    logger.debug(`Data cached with RedisJSON at key: ${key}`);
  } catch (error) {
    logger.error({
      message: 'Error caching data with RedisJSON',
      key,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

/**
 * Get cached data using RedisJSON
 * @param key Redis key
 * @returns Cached data or null if not found
 */
export async function getCachedDataWithRedisJson<T>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient();
    
    // Use JSON.GET to retrieve the data as JSON
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await (client as any).call('JSON.GET', key, '.') as string | null;
    
    if (!data) {
      return null;
    }
    
    return JSON.parse(data) as T;
  } catch (error) {
    logger.error({
      message: 'Error getting cached data with RedisJSON',
      key,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return null;
  }
}

// Default export for backward compatibility
export default {
  getRedisClient,
  testRedisConnection,
  closeRedisConnection,
  cacheDataWithRedisJson,
  getCachedDataWithRedisJson
};