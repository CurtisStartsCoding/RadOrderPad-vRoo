/**
 * Redis JSON Helpers
 * 
 * This module provides functions for working with JSON documents in Redis.
 * It implements the single responsibility principle by focusing only on JSON operations.
 */

import { getRedisClient } from '../../../config/redis';
import enhancedLogger from '../../../utils/enhanced-logger';

/**
 * Store a JSON document in Redis
 * @param key Redis key
 * @param data Data to store
 * @param ttlSeconds Time-to-live in seconds
 * @returns Promise<void>
 */
export async function storeJSONDocument<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
  try {
    const client = getRedisClient();
    
    // Store JSON document
    await client.call('JSON.SET', key, '.', JSON.stringify(data));
    
    // Set expiration
    await client.expire(key, ttlSeconds);
    
    enhancedLogger.debug(`Stored JSON document at key: ${key} with TTL: ${ttlSeconds}s`);
  } catch (error) {
    enhancedLogger.error({
      message: 'Error storing JSON document',
      key,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error; // Rethrow to allow caller to handle
  }
}

/**
 * Get a JSON document from Redis
 * @param key Redis key
 * @param path JSON path (default: '.')
 * @returns Promise<T | null>
 */
export async function getJSONDocument<T>(key: string, path: string = '.'): Promise<T | null> {
  try {
    const client = getRedisClient();
    
    // Get JSON document at specified path
    const result = await client.call('JSON.GET', key, path);
    
    if (!result) {
      enhancedLogger.debug(`JSON document not found at key: ${key}`);
      return null;
    }
    
    enhancedLogger.debug(`Retrieved JSON document from key: ${key}`);
    return JSON.parse(result as string) as T;
  } catch (error) {
    enhancedLogger.error({
      message: 'Error getting JSON document',
      key,
      path,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return null;
  }
}

/**
 * Delete a JSON document from Redis
 * @param key Redis key
 * @returns Promise<boolean> True if document was deleted, false otherwise
 */
export async function deleteJSONDocument(key: string): Promise<boolean> {
  try {
    const client = getRedisClient();
    
    // Delete JSON document
    const result = await client.call('JSON.DEL', key, '.');
    
    enhancedLogger.debug(`Deleted JSON document at key: ${key}`);
    return result === 1;
  } catch (error) {
    enhancedLogger.error({
      message: 'Error deleting JSON document',
      key,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return false;
  }
}

/**
 * Update a specific field in a JSON document
 * @param key Redis key
 * @param path JSON path to the field
 * @param value New value
 * @returns Promise<boolean> True if update was successful, false otherwise
 */
export async function updateJSONField<T>(key: string, path: string, value: T): Promise<boolean> {
  try {
    const client = getRedisClient();
    
    // Update field at specified path
    await client.call('JSON.SET', key, path, JSON.stringify(value));
    
    enhancedLogger.debug(`Updated JSON field at key: ${key}, path: ${path}`);
    return true;
  } catch (error) {
    enhancedLogger.error({
      message: 'Error updating JSON field',
      key,
      path,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return false;
  }
}