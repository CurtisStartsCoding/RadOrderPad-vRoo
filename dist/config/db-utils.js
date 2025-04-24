"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabaseConnections = exports.testDatabaseConnections = exports.queryPhiDb = exports.getPhiDbClient = exports.queryMainDb = exports.getMainDbClient = exports.testDbConnection = exports.queryDb = exports.getDbClient = void 0;
const db_config_1 = require("./db-config");
const enhanced_logger_1 = __importDefault(require("../utils/enhanced-logger"));
/**
 * Generic database utility functions
 */
/**
 * Get a client from a database pool
 * @param pool Database pool
 * @param dbName Name of the database (for error logging)
 * @returns Promise with a database client
 */
const getDbClient = async (pool, dbName) => {
    try {
        const client = await pool.connect();
        return client;
    }
    catch (error) {
        enhanced_logger_1.default.error(`Error connecting to ${dbName} database:`, error);
        throw error;
    }
};
exports.getDbClient = getDbClient;
/**
 * Query a database
 * @param pool Database pool
 * @param text SQL query text
 * @param params Query parameters
 * @param dbName Name of the database (for error logging)
 * @returns Promise with query result
 */
const queryDb = async (pool, text, params = [], dbName) => {
    const client = await (0, exports.getDbClient)(pool, dbName);
    try {
        const result = await client.query(text, params);
        return result;
    }
    finally {
        client.release();
    }
};
exports.queryDb = queryDb;
/**
 * Test a database connection
 * @param pool Database pool
 * @param dbName Name of the database (for logging)
 * @returns Promise with boolean indicating success
 */
const testDbConnection = async (pool, dbName) => {
    try {
        enhanced_logger_1.default.info(`Testing ${dbName} database connection...`);
        const client = await (0, exports.getDbClient)(pool, dbName);
        const result = await client.query('SELECT NOW()');
        client.release();
        enhanced_logger_1.default.info(`${dbName} database connection successful:`, result.rows[0].now);
        return true;
    }
    catch (error) {
        enhanced_logger_1.default.error(`${dbName} database connection test failed:`, error);
        return false;
    }
};
exports.testDbConnection = testDbConnection;
/**
 * Convenience functions for main database
 */
const getMainDbClient = async () => {
    return (0, exports.getDbClient)(db_config_1.mainDbPool, 'main');
};
exports.getMainDbClient = getMainDbClient;
const queryMainDb = async (text, params = []) => {
    return (0, exports.queryDb)(db_config_1.mainDbPool, text, params, 'main');
};
exports.queryMainDb = queryMainDb;
/**
 * Convenience functions for PHI database
 */
const getPhiDbClient = async () => {
    return (0, exports.getDbClient)(db_config_1.phiDbPool, 'PHI');
};
exports.getPhiDbClient = getPhiDbClient;
const queryPhiDb = async (text, params = []) => {
    return (0, exports.queryDb)(db_config_1.phiDbPool, text, params, 'PHI');
};
exports.queryPhiDb = queryPhiDb;
/**
 * Test both database connections
 * @returns Promise with boolean indicating success of both connections
 */
const testDatabaseConnections = async () => {
    const mainSuccess = await (0, exports.testDbConnection)(db_config_1.mainDbPool, 'main');
    const phiSuccess = await (0, exports.testDbConnection)(db_config_1.phiDbPool, 'PHI');
    // Return true only if both connections are successful
    return mainSuccess && phiSuccess;
};
exports.testDatabaseConnections = testDatabaseConnections;
/**
 * Close all database connections
 */
const closeDatabaseConnections = async () => {
    await db_config_1.mainDbPool.end();
    await db_config_1.phiDbPool.end();
    enhanced_logger_1.default.info('Database connections closed');
};
exports.closeDatabaseConnections = closeDatabaseConnections;
//# sourceMappingURL=db-utils.js.map