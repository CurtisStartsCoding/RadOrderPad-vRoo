import { FinalizeOrderPayload, FinalizeOrderResponse } from '../types';
/**
 * Execute the order finalization transaction
 *
 * @param orderId The ID of the order to finalize
 * @param payload The finalize order payload
 * @param userId The ID of the user finalizing the order
 * @returns Promise that resolves with the finalization result
 */
export declare function executeTransaction(orderId: number, payload: FinalizeOrderPayload, userId: number): Promise<FinalizeOrderResponse>;
