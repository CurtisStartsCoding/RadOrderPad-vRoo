import { FinalizeOrderPayload, FinalizeOrderResponse } from './types';
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
export declare function handleFinalizeOrder(orderId: number, payload: FinalizeOrderPayload, userId: number): Promise<FinalizeOrderResponse>;
