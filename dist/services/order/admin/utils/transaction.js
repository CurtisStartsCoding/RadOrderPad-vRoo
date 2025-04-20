"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTransaction = withTransaction;
const db_1 = require("../../../../config/db");
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
        console.error('Transaction error:', error);
        throw error;
    }
    finally {
        // Release client back to pool
        client.release();
    }
}
exports.default = withTransaction;
//# sourceMappingURL=transaction.js.map