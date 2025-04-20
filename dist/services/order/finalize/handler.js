import { executeTransaction } from './transaction';
/**
 * Handle finalization of an order
 *
 * This is the main entry point for the order finalization process.
 * It delegates to the transaction module to execute the finalization
 * within a database transaction.
 *
 * @param orderId The ID of the order to finalize
 * @param payload The finalize order payload
 * @param userId The ID of the user finalizing the order
 * @returns Promise that resolves with the finalization result
 */
export async function handleFinalizeOrder(orderId, payload, userId) {
    return executeTransaction(orderId, payload, userId);
}
//# sourceMappingURL=handler.js.map