/**
 * Execute a function within a database transaction
 * @param callback Function to execute within transaction
 * @returns Promise with result of callback
 */
export declare function withTransaction<T>(callback: (client: any) => Promise<T>): Promise<T>;
export default withTransaction;
