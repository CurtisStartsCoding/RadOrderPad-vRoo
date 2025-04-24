/**
 * Database configuration and utility functions
 * This file re-exports everything from db-config.ts and db-utils.ts for backward compatibility
 */
export { mainDbConfig, phiDbConfig, mainDbPool, phiDbPool } from './db-config';
export { getDbClient, queryDb, testDbConnection, getMainDbClient, getPhiDbClient, queryMainDb, queryPhiDb, testDatabaseConnections, closeDatabaseConnections } from './db-utils';
declare const _default: {
    getMainDbClient: () => Promise<import("pg").PoolClient>;
    getPhiDbClient: () => Promise<import("pg").PoolClient>;
    queryMainDb: (text: string, params?: unknown[]) => Promise<import("pg").QueryResult>;
    queryPhiDb: (text: string, params?: unknown[]) => Promise<import("pg").QueryResult>;
    testDatabaseConnections: () => Promise<boolean>;
    closeDatabaseConnections: () => Promise<void>;
};
export default _default;
