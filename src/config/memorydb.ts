import IORedis from 'ioredis';
import dotenv from 'dotenv';

/**
 * MemoryDB (Redis) client configuration
 *
 * This file configures and exports the MemoryDB client instance for AWS MemoryDB for Redis.
 * MemoryDB is used for caching frequently accessed medical reference data and will later
 * be used for RedisSearch capabilities to enable fast context generation.
 */

// Load environment variables
dotenv.config();

// Get MemoryDB configuration from environment variables
const memoryDbHost = process.env.MEMORYDB_HOST || 'localhost';
const memoryDbPort = parseInt(process.env.MEMORYDB_PORT || '6379');
const memoryDbUser = process.env.MEMORYDB_USER;
const memoryDbPassword = process.env.MEMORYDB_PASSWORD;
const memoryDbTls = process.env.NODE_ENV === 'production' ? {} : undefined;

// Connection options for MemoryDB
const memoryDbOptions = {
  host: memoryDbHost,
  port: memoryDbPort,
  username: memoryDbUser,
  password: memoryDbPassword,
  // Enable TLS for production environments (MemoryDB requires TLS)
  tls: memoryDbTls,
  // Reconnect strategy
  retryStrategy: (times: number) => {
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
  connectionName: 'radorderpad-memorydb-client'
};

// Create Redis client instance
let redisClient: IORedis | null = null;

/**
 * Get the Redis client instance
 * Creates a new client if one doesn't exist
 */
export function getRedisClient(): IORedis {
  if (!redisClient) {
    try {
      console.log('Initializing MemoryDB client connection...');
      redisClient = new IORedis(memoryDbOptions);
      
      // Set up event handlers
      redisClient.on('connect', () => {
        console.log('MemoryDB client connected successfully');
      });
      
      redisClient.on('error', (err: Error) => {
        console.error('MemoryDB client error:', err);
        // Don't crash the application on Redis errors
      });
      
      redisClient.on('reconnecting', (delay: number) => {
        console.log(`MemoryDB client reconnecting in ${delay}ms...`);
      });
    } catch (error) {
      console.error('Failed to initialize MemoryDB client:', error);
      throw error;
    }
  }
  
  return redisClient;
}

/**
 * Test the MemoryDB connection
 * @returns Promise<boolean> - True if connection is successful
 */
export async function testMemoryDbConnection(): Promise<boolean> {
  try {
    console.log('Testing MemoryDB connection...');
    const client = getRedisClient();
    const result = await client.ping();
    console.log('MemoryDB connection test result:', result);
    return result === 'PONG';
  } catch (error) {
    console.error('MemoryDB connection test failed:', error);
    return false;
  }
}

/**
 * Close the MemoryDB connection
 */
export async function closeMemoryDbConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('MemoryDB connection closed');
  }
}

// Default export for backward compatibility
export default {
  getRedisClient,
  testMemoryDbConnection,
  closeMemoryDbConnection
};