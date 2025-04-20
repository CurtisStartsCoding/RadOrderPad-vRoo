import Redis, { Redis as RedisClient } from 'ioredis';
import * as dotenv from 'dotenv';
import logger from '../utils/logger.js';

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
// Enable TLS only when connecting directly to AWS MemoryDB (not through SSM tunnel)
const isLocalhost = memoryDbHost === 'localhost' || memoryDbHost === '127.0.0.1';
const memoryDbTls = isLocalhost ? false : {};

// Connection options for MemoryDB
const memoryDbOptions = {
  host: memoryDbHost,
  port: memoryDbPort,
  username: memoryDbUser,
  password: memoryDbPassword,
  // Enable TLS only when connecting directly to AWS MemoryDB (not through SSM tunnel)
  tls: memoryDbTls,
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
  connectionName: 'radorderpad-memorydb-client'
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
      logger.info('Initializing MemoryDB client connection...');
      redisClient = new Redis(memoryDbOptions);
      
      // Set up event handlers
      redisClient.on('connect', () => {
        logger.info('MemoryDB client connected successfully');
      });
      
      redisClient.on('error', (err: Error) => {
        logger.error({
          message: 'MemoryDB client error',
          error: err.message,
          stack: err.stack
        });
        
        // Provide more informative messages for common errors
        if (err.message.includes('ETIMEDOUT') || err.message.includes('ECONNREFUSED')) {
          logger.error({
            message: 'Connection to AWS MemoryDB timed out',
            details: [
              'The MemoryDB cluster is in a VPC and not accessible from outside the VPC',
              'The application needs to be deployed in the same VPC as the MemoryDB cluster',
              'Or you need to set up VPN, Direct Connect, or VPC peering to access the VPC'
            ],
            documentation: 'See Docs/implementation/redis-search-integration.md for more details',
            error: err.message,
            stack: err.stack
          });
        }
        
        // Don't crash the application on Redis errors
      });
      
      redisClient.on('reconnecting', (delay: number) => {
        logger.info(`MemoryDB client reconnecting in ${delay}ms...`);
      });
      
      redisClient.on('end', () => {
        logger.info('MemoryDB client connection ended');
      });
    } catch (error) {
      logger.error({
        message: 'Failed to initialize MemoryDB client',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
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
    logger.info('Testing MemoryDB connection...');
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
    
    logger.info(`MemoryDB connection test result: ${result}`);
    return result === 'PONG';
  } catch (error) {
    logger.error({
      message: 'MemoryDB connection test failed',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Provide more informative messages for common errors
    if (error instanceof Error) {
      if (error.message.includes('ETIMEDOUT') || error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
        logger.error({
          message: 'Connection timed out or was refused',
          details: [
            'The MemoryDB cluster is in a VPC and not accessible from your current network',
            'Your AWS user does not have the necessary permissions to access MemoryDB',
            'The security group for the MemoryDB cluster does not allow connections from your IP'
          ],
          documentation: 'See Docs/implementation/redis-search-integration.md for more details',
          error: error.message,
          stack: error.stack
        });
      }
    }
    
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
    logger.info('MemoryDB connection closed');
  }
}

// Default export for backward compatibility
export default {
  getRedisClient,
  testMemoryDbConnection,
  closeMemoryDbConnection
};