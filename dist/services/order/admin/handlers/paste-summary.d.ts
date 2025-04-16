import { EmrSummaryResult } from '../types';
/**
 * Handle pasted EMR summary
 * @param orderId Order ID
 * @param pastedText Pasted EMR summary text
 * @param userId User ID
 * @returns Promise with result
 */
export declare function handlePasteSummary(orderId: number, pastedText: string, userId: number): Promise<EmrSummaryResult>;
export default handlePasteSummary;
