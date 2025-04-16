"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.phiDbPool = exports.mainDbPool = exports.phiDbConfig = exports.mainDbConfig = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
/**
 * Database configuration
 */
// Main database configuration
exports.mainDbConfig = {
    connectionString: process.env.NODE_ENV === 'production'
        ? process.env.MAIN_DATABASE_URL
        : process.env.DEV_MAIN_DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};
// PHI database configuration
exports.phiDbConfig = {
    connectionString: process.env.NODE_ENV === 'production'
        ? process.env.PHI_DATABASE_URL
        : process.env.DEV_PHI_DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};
// Log database connection strings
console.log('Database connection strings:');
console.log('Environment:', process.env.NODE_ENV);
console.log('MAIN_DATABASE_URL:', process.env.NODE_ENV === 'production'
    ? process.env.MAIN_DATABASE_URL
    : process.env.DEV_MAIN_DATABASE_URL);
console.log('PHI_DATABASE_URL:', process.env.NODE_ENV === 'production'
    ? process.env.PHI_DATABASE_URL
    : process.env.DEV_PHI_DATABASE_URL);
// Create connection pools
exports.mainDbPool = new pg_1.Pool(exports.mainDbConfig);
exports.phiDbPool = new pg_1.Pool(exports.phiDbConfig);
// Event listeners for connection issues
exports.mainDbPool.on('error', (err) => {
    console.error('Unexpected error on main database idle client', err);
    // Don't exit the process, just log the error
});
exports.phiDbPool.on('error', (err) => {
    console.error('Unexpected error on PHI database idle client', err);
    // Don't exit the process, just log the error
});
//# sourceMappingURL=db-config.js.map