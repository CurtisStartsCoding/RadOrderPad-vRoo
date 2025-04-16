/**
 * Save EMR summary text as a clinical record
 * @param orderId Order ID
 * @param patientId Patient ID
 * @param text EMR summary text
 * @param userId User ID
 * @returns Promise with result
 */
export declare function saveEmrSummary(orderId: number, patientId: number, text: string, userId: number): Promise<void>;
