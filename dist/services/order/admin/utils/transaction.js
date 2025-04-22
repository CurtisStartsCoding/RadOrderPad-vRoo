"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTransaction = withTransaction;
const db_1 = require("../../../../config/db");
const logger_1 = __importDefault(require("../../../../utils/logger"));
/**
 * Execute a function within a database transaction
 * @param callback Function to execute within transaction
 * @returns Promise with result of callback
 */
async function withTransaction(callback) {
    const client = await (0, db_1.getPhiDbClient)();
    try {
        // Start transaction
        await client.query('BEGIN');
        // Execute callback
        const result = await callback(client);
        // Commit transaction
        await client.query('COMMIT');
        return result;
    }
    catch (error) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        logger_1.default.error('Transaction error:', error instanceof Error ? error.message : String(error));
        throw error;
    }
    finally {
        // Release client back to pool
        client.release();
    }
}
exports.default = withTransaction;
//# sourceMappingURL=transaction.js.map