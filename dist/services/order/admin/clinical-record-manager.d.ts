import { OrderData } from './types';
/**
 * Save EMR summary text as a clinical record
 * @param orderId Order ID
 * @param patientId Patient ID
 * @param text EMR summary text
 * @param userId User ID
 * @returns Promise with result
 */
export declare function saveEmrSummary(orderId: number, patientId: number, text: string, userId: number): Promise<void>;
/**
 * Save supplemental document text as a clinical record
 * @param orderId Order ID
 * @param patientId Patient ID
 * @param text Supplemental document text
 * @param userId User ID
 * @returns Promise with result
 */
export declare function saveSupplementalDocument(orderId: number, patientId: number, text: string, userId: number): Promise<void>;
/**
 * Verify order exists and has status 'pending_admin'
 * @param orderId Order ID
 * @returns Promise with order data
 * @throws Error if order not found or not in pending_admin status
 */
export declare function verifyOrderStatus(orderId: number): Promise<OrderData>;
declare const _default: {
    saveEmrSummary: typeof saveEmrSummary;
    saveSupplementalDocument: typeof saveSupplementalDocument;
    verifyOrderStatus: typeof verifyOrderStatus;
};
export default _default;
