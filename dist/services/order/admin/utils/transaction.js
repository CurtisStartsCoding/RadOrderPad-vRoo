import { getPhiDbClient } from '../../../../config/db';
/**
 * Execute a function within a database transaction
 * @param callback Function to execute within transaction
 * @returns Promise with result of callback
 */
export async function withTransaction(callback) {
    const client = await getPhiDbClient();
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
export default withTransaction;
//# sourceMappingURL=transaction.js.map