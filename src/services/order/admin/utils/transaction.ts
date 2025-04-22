import { PoolClient } from 'pg';
import { getPhiDbClient } from '../../../../config/db';
import logger from '../../../../utils/logger';

/**
 * Execute a function within a database transaction
 * @param callback Function to execute within transaction
 * @returns Promise with result of callback
 */
export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPhiDbClient();
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    // Execute callback
    const result = await callback(client);
    
    // Commit transaction
    await client.query('COMMIT');
    
    return result;
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    logger.error('Transaction error:', error instanceof Error ? error.message : String(error));
    throw error;
  } finally {
    // Release client back to pool
    client.release();
  }
}

export default withTransaction;