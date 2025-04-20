"use strict";
/**
 * Database configuration and utility functions
 * This file re-exports everything from db-config.ts and db-utils.ts for backward compatibility
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabaseConnections = exports.testDatabaseConnections = exports.queryPhiDb = exports.queryMainDb = exports.getPhiDbClient = exports.getMainDbClient = exports.testDbConnection = exports.queryDb = exports.getDbClient = exports.phiDbPool = exports.mainDbPool = exports.phiDbConfig = exports.mainDbConfig = void 0;
// Re-export everything from db-config.ts
var db_config_1 = require("./db-config");
Object.defineProperty(exports, "mainDbConfig", { enumerable: true, get: function () { return db_config_1.mainDbConfig; } });
Object.defineProperty(exports, "phiDbConfig", { enumerable: true, get: function () { return db_config_1.phiDbConfig; } });
Object.defineProperty(exports, "mainDbPool", { enumerable: true, get: function () { return db_config_1.mainDbPool; } });
Object.defineProperty(exports, "phiDbPool", { enumerable: true, get: function () { return db_config_1.phiDbPool; } });
// Re-export everything from db-utils.ts
var db_utils_1 = require("./db-utils");
Object.defineProperty(exports, "getDbClient", { enumerable: true, get: function () { return db_utils_1.getDbClient; } });
Object.defineProperty(exports, "queryDb", { enumerable: true, get: function () { return db_utils_1.queryDb; } });
Object.defineProperty(exports, "testDbConnection", { enumerable: true, get: function () { return db_utils_1.testDbConnection; } });
Object.defineProperty(exports, "getMainDbClient", { enumerable: true, get: function () { return db_utils_1.getMainDbClient; } });
Object.defineProperty(exports, "getPhiDbClient", { enumerable: true, get: function () { return db_utils_1.getPhiDbClient; } });
Object.defineProperty(exports, "queryMainDb", { enumerable: true, get: function () { return db_utils_1.queryMainDb; } });
Object.defineProperty(exports, "queryPhiDb", { enumerable: true, get: function () { return db_utils_1.queryPhiDb; } });
Object.defineProperty(exports, "testDatabaseConnections", { enumerable: true, get: function () { return db_utils_1.testDatabaseConnections; } });
Object.defineProperty(exports, "closeDatabaseConnections", { enumerable: true, get: function () { return db_utils_1.closeDatabaseConnections; } });
// Default export for backward compatibility
const db_utils_2 = require("./db-utils");
exports.default = {
    getMainDbClient: db_utils_2.getMainDbClient,
    getPhiDbClient: db_utils_2.getPhiDbClient,
    queryMainDb: db_utils_2.queryMainDb,
    queryPhiDb: db_utils_2.queryPhiDb,
    testDatabaseConnections: db_utils_2.testDatabaseConnections,
    closeDatabaseConnections: db_utils_2.closeDatabaseConnections
};
//# sourceMappingURL=db.js.map