"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.phiDbPool = exports.mainDbPool = exports.phiDbConfig = exports.mainDbConfig = void 0;
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
const enhanced_logger_1 = __importDefault(require("../utils/enhanced-logger"));
// Load environment variables
dotenv.config();
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
enhanced_logger_1.default.info('Database connection strings:');
enhanced_logger_1.default.info('Environment:', process.env.NODE_ENV);
enhanced_logger_1.default.info('MAIN_DATABASE_URL:', process.env.NODE_ENV === 'production'
    ? process.env.MAIN_DATABASE_URL
    : process.env.DEV_MAIN_DATABASE_URL);
enhanced_logger_1.default.info('PHI_DATABASE_URL:', process.env.NODE_ENV === 'production'
    ? process.env.PHI_DATABASE_URL
    : process.env.DEV_PHI_DATABASE_URL);
// Create connection pools
exports.mainDbPool = new pg_1.Pool(exports.mainDbConfig);
exports.phiDbPool = new pg_1.Pool(exports.phiDbConfig);
// Event listeners for connection issues
exports.mainDbPool.on('error', (err) => {
    enhanced_logger_1.default.error('Unexpected error on main database idle client', err);
    // Don't exit the process, just log the error
});
exports.phiDbPool.on('error', (err) => {
    enhanced_logger_1.default.error('Unexpected error on PHI database idle client', err);
    // Don't exit the process, just log the error
});
//# sourceMappingURL=db-config.js.map