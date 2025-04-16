/**
 * Database configuration and utility functions
 * This file re-exports everything from db-config.ts and db-utils.ts for backward compatibility
 */

// Re-export everything from db-config.ts
export {
  mainDbConfig,
  phiDbConfig,
  mainDbPool,
  phiDbPool
} from './db-config';

// Re-export everything from db-utils.ts
export {
  getDbClient,
  queryDb,
  testDbConnection,
  getMainDbClient,
  getPhiDbClient,
  queryMainDb,
  queryPhiDb,
  testDatabaseConnections,
  closeDatabaseConnections
} from './db-utils';

// Default export for backward compatibility
import { 
  getMainDbClient, 
  getPhiDbClient, 
  queryMainDb, 
  queryPhiDb, 
  testDatabaseConnections, 
  closeDatabaseConnections 
} from './db-utils';

export default {
  getMainDbClient,
  getPhiDbClient,
  queryMainDb,
  queryPhiDb,
  testDatabaseConnections,
  closeDatabaseConnections
};