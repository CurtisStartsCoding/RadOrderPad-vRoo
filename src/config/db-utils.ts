import { Pool, PoolClient } from 'pg';
import { mainDbPool, phiDbPool } from './db-config';

/**
 * Generic database utility functions
 */

/**
 * Get a client from a database pool
 * @param pool Database pool
 * @param dbName Name of the database (for error logging)
 * @returns Promise with a database client
 */
export const getDbClient = async (pool: Pool, dbName: string): Promise<PoolClient> => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error(`Error connecting to ${dbName} database:`, error);
    throw error;
  }
};

/**
 * Query a database
 * @param pool Database pool
 * @param text SQL query text
 * @param params Query parameters
 * @param dbName Name of the database (for error logging)
 * @returns Promise with query result
 */
export const queryDb = async (
  pool: Pool, 
  text: string, 
  params: any[] = [],
  dbName: string
): Promise<any> => {
  const client = await getDbClient(pool, dbName);
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

/**
 * Test a database connection
 * @param pool Database pool
 * @param dbName Name of the database (for logging)
 * @returns Promise with boolean indicating success
 */
export const testDbConnection = async (pool: Pool, dbName: string): Promise<boolean> => {
  try {
    console.log(`Testing ${dbName} database connection...`);
    const client = await getDbClient(pool, dbName);
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log(`${dbName} database connection successful:`, result.rows[0].now);
    return true;
  } catch (error) {
    console.error(`${dbName} database connection test failed:`, error);
    return false;
  }
};

/**
 * Convenience functions for main database
 */
export const getMainDbClient = async (): Promise<PoolClient> => {
  return getDbClient(mainDbPool, 'main');
};

export const queryMainDb = async (text: string, params: any[] = []): Promise<any> => {
  return queryDb(mainDbPool, text, params, 'main');
};

/**
 * Convenience functions for PHI database
 */
export const getPhiDbClient = async (): Promise<PoolClient> => {
  return getDbClient(phiDbPool, 'PHI');
};

export const queryPhiDb = async (text: string, params: any[] = []): Promise<any> => {
  return queryDb(phiDbPool, text, params, 'PHI');
};

/**
 * Test both database connections
 * @returns Promise with boolean indicating success of both connections
 */
export const testDatabaseConnections = async (): Promise<boolean> => {
  const mainSuccess = await testDbConnection(mainDbPool, 'main');
  const phiSuccess = await testDbConnection(phiDbPool, 'PHI');
  
  // Return true only if both connections are successful
  return mainSuccess && phiSuccess;
};

/**
 * Close all database connections
 */
export const closeDatabaseConnections = async (): Promise<void> => {
  await mainDbPool.end();
  await phiDbPool.end();
  console.log('Database connections closed');
};