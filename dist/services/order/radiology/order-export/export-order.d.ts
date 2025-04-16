/**
 * Export order data in specified format
 * @param orderId Order ID
 * @param format Export format (pdf, csv, json)
 * @param orgId Radiology organization ID
 * @returns Promise with exported data
 */
export declare function exportOrder(orderId: number, format: string, orgId: number): Promise<any>;
