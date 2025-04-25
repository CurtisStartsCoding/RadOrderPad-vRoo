/**
 * Script to create RedisSearch indexes on MemoryDB
 * 
 * This script creates the necessary RedisSearch indexes for CPT codes, ICD-10 codes,
 * and related data to enable fast context generation.
 * 
 * Usage:
 * ```
 * npm run create-redis-indexes
 * ```
 */
import { createRedisSearchIndexes } from '../utils/redis/redis-index-manager';
import { closeRedisConnection } from '../config/redis';
import logger from '../utils/logger';

async function main(): Promise<void> {
  try {
    logger.info('Starting Redis index creation...');
    
    // Create the RedisSearch indexes
    await createRedisSearchIndexes();
    
    logger.info('Redis indexes created successfully');
  } catch (error) {
    logger.error('Error creating Redis indexes:', { error });
    process.exit(1);
  } finally {
    // Close the Redis connection
    await closeRedisConnection();
  }
}

// Run the script
main();