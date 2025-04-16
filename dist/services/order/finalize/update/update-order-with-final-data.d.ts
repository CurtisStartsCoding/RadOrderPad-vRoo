import { PoolClient } from 'pg';
import { FinalizeOrderPayload } from '../types';
/**
 * Update the order with final data
 *
 * @param client Database client for transaction
 * @param orderId The ID of the order to update
 * @param patientId The ID of the patient
 * @param payload The finalize order payload
 * @param userId The ID of the user performing the update
 */
export declare function updateOrderWithFinalData(client: PoolClient, orderId: number, patientId: number, payload: FinalizeOrderPayload, userId: number): Promise<void>;
