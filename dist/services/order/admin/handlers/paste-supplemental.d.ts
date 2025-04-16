import { SupplementalDocResult } from '../types';
/**
 * Handle pasted supplemental documents
 * @param orderId Order ID
 * @param pastedText Pasted supplemental text
 * @param userId User ID
 * @returns Promise with result
 */
export declare function handlePasteSupplemental(orderId: number, pastedText: string, userId: number): Promise<SupplementalDocResult>;
export default handlePasteSupplemental;
