/**
 * Save supplemental document text as a clinical record
 * @param orderId Order ID
 * @param patientId Patient ID
 * @param text Supplemental document text
 * @param userId User ID
 * @returns Promise with result
 */
export declare function saveSupplementalDocument(orderId: number, patientId: number, text: string, userId: number): Promise<void>;
