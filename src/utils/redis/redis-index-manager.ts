/**
 * Redis Index Manager
 *
 * This utility is responsible for creating and managing RedisSearch indexes
 * on Redis Cloud for medical codes and related data.
 *
 * For detailed documentation, see:
 * - Docs/redis_integration.md - High-level Redis integration strategy
 * - Docs/implementation/redis-integration.md - Detailed implementation documentation
 */
import { getRedisClient } from '../../config/redis.js';
import { Redis } from 'ioredis';
import logger from '../../utils/logger.js';

/**
 * Create RedisSearch indexes for medical data
 * This function creates the necessary indexes for CPT codes, ICD-10 codes,
 * and related data to enable fast context generation.
 */
export async function createRedisSearchIndexes(): Promise<void> {
  const client = getRedisClient();
  
  try {
    logger.info('Creating RedisSearch indexes...');
    
    // Create CPT code index
    await createCptIndex(client);
    
    // Create ICD-10 code index
    await createIcd10Index(client);
    
    logger.info('RedisSearch indexes created successfully');
  } catch (error) {
    logger.error({
      message: 'Error creating RedisSearch indexes',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

/**
 * Create the CPT code index
 * @param client Redis client
 */
async function createCptIndex(client: Redis): Promise<void> {
  try {
    // Check if index already exists
    const indexExists = await checkIndexExists(client, 'cpt_index');
    
    if (indexExists) {
      logger.info('CPT index already exists, skipping creation');
      return;
    }
    
    // Create the CPT index
    // FT.CREATE cpt_index ON JSON PREFIX 1 cpt: SCHEMA
    //   $.description AS description TEXT WEIGHT 5.0
    //   $.modality AS modality TAG
    //   $.body_part AS body_part TAG
    //   $.description AS description_nostem TEXT NOSTEM
    
    // Using the raw command interface for Redis commands
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - The Redis client can actually accept this format at runtime
    await (client as RedisClient).call(
      'FT.CREATE',
      'cpt_index',
      'ON', 'JSON',
      'PREFIX', '1', 'cpt:',
      'SCHEMA',
      '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0',
      '$.modality', 'AS', 'modality', 'TAG',
      '$.body_part', 'AS', 'body_part', 'TAG',
      '$.description', 'AS', 'description_nostem', 'TEXT', 'NOSTEM'
    );
    
    logger.info('CPT index created successfully');
  } catch (error) {
    // If the error is that the index already exists, we can ignore it
    if (error instanceof Error && error.message.includes('Index already exists')) {
      logger.info('CPT index already exists');
      return;
    }
    
    logger.error({
      message: 'Error creating CPT index',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

/**
 * Create the ICD-10 code index
 * @param client Redis client
 */
async function createIcd10Index(client: Redis): Promise<void> {
  try {
    // Check if index already exists
    const indexExists = await checkIndexExists(client, 'icd10_index');
    
    if (indexExists) {
      logger.info('ICD-10 index already exists, skipping creation');
      return;
    }
    
    // Create the ICD-10 index
    // FT.CREATE icd10_index ON JSON PREFIX 1 icd10: SCHEMA
    //   $.description AS description TEXT WEIGHT 5.0
    //   $.keywords AS keywords TEXT WEIGHT 2.0
    //   $.category AS category TAG
    //   $.is_billable AS is_billable TAG
    //   $.description AS description_nostem TEXT NOSTEM
    
    // Using the raw command interface for Redis commands
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - The Redis client can actually accept this format at runtime
    await (client as RedisClient).call(
      'FT.CREATE',
      'icd10_index',
      'ON', 'JSON',
      'PREFIX', '1', 'icd10:',
      'SCHEMA',
      '$.description', 'AS', 'description', 'TEXT', 'WEIGHT', '5.0',
      '$.keywords', 'AS', 'keywords', 'TEXT', 'WEIGHT', '2.0',
      '$.category', 'AS', 'category', 'TAG',
      '$.is_billable', 'AS', 'is_billable', 'TAG',
      '$.description', 'AS', 'description_nostem', 'TEXT', 'NOSTEM'
    );
    
    logger.info('ICD-10 index created successfully');
  } catch (error) {
    // If the error is that the index already exists, we can ignore it
    if (error instanceof Error && error.message.includes('Index already exists')) {
      logger.info('ICD-10 index already exists');
      return;
    }
    
    logger.error({
      message: 'Error creating ICD-10 index',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

/**
 * Check if a RedisSearch index exists
 * @param client Redis client
 * @param indexName Name of the index to check
 * @returns True if the index exists, false otherwise
 */
async function checkIndexExists(client: Redis, indexName: string): Promise<boolean> {
  try {
    // Use FT.INFO to check if the index exists
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - The Redis client can actually accept this format at runtime
    await (client as RedisClient).call('FT.INFO', indexName);
    return true;
  } catch (error) {
    // If the error is that the index doesn't exist, return false
    if (error instanceof Error && error.message.includes('Unknown index name')) {
      return false;
    }
    
    // For other errors, rethrow
    throw error;
  }
}

/**
 * Drop a RedisSearch index if it exists
 * @param client Redis client
 * @param indexName Name of the index to drop
 */
export async function dropIndex(client: Redis, indexName: string): Promise<void> {
  try {
    // Check if the index exists
    const indexExists = await checkIndexExists(client, indexName);
    
    if (!indexExists) {
      logger.info(`Index ${indexName} does not exist, skipping drop`);
      return;
    }
    
    // Drop the index
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - The Redis client can actually accept this format at runtime
    await (client as RedisClient).call('FT.DROPINDEX', indexName);
    logger.info(`Index ${indexName} dropped successfully`);
  } catch (error) {
    logger.error({
      message: `Error dropping index ${indexName}`,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

/**
 * Get information about a RedisSearch index
 * @param indexName Name of the index to get information about
 * @returns Information about the index
 */
export async function getIndexInfo(indexName: string): Promise<Record<string, unknown>> {
  const client = getRedisClient();
  
  try {
    // Use FT.INFO to get information about the index
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - The Redis client can actually accept this format at runtime
    const info = await (client as RedisClient).call('FT.INFO', indexName) as string[];
    
    // Convert the array response to an object
    const infoObj: Record<string, unknown> = {};
    for (let i = 0; i < info.length; i += 2) {
      infoObj[info[i]] = info[i + 1];
    }
    
    return infoObj;
  } catch (error) {
    logger.error({
      message: `Error getting info for index ${indexName}`,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}