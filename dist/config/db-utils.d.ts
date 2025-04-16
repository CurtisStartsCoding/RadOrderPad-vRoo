import { Pool, PoolClient } from 'pg';
/**
 * Generic database utility functions
 */
/**
 * Get a client from a database pool
 * @param pool Database pool
 * @param dbName Name of the database (for error logging)
 * @returns Promise with a database client
 */
export declare const getDbClient: (pool: Pool, dbName: string) => Promise<PoolClient>;
/**
 * Query a database
 * @param pool Database pool
 * @param text SQL query text
 * @param params Query parameters
 * @param dbName Name of the database (for error logging)
 * @returns Promise with query result
 */
export declare const queryDb: (pool: Pool, text: string, params: any[] | undefined, dbName: string) => Promise<any>;
/**
 * Test a database connection
 * @param pool Database pool
 * @param dbName Name of the database (for logging)
 * @returns Promise with boolean indicating success
 */
export declare const testDbConnection: (pool: Pool, dbName: string) => Promise<boolean>;
/**
 * Convenience functions for main database
 */
export declare const getMainDbClient: () => Promise<PoolClient>;
export declare const queryMainDb: (text: string, params?: any[]) => Promise<any>;
/**
 * Convenience functions for PHI database
 */
export declare const getPhiDbClient: () => Promise<PoolClient>;
export declare const queryPhiDb: (text: string, params?: any[]) => Promise<any>;
/**
 * Test both database connections
 * @returns Promise with boolean indicating success of both connections
 */
export declare const testDatabaseConnections: () => Promise<boolean>;
/**
 * Close all database connections
 */
export declare const closeDatabaseConnections: () => Promise<void>;
