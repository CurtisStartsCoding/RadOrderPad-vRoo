import { PoolClient } from 'pg';
/**
 * Execute a function within a database transaction
 * @param callback Function to execute within transaction
 * @returns Promise with result of callback
 */
export declare function withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T>;
export default withTransaction;
