/**
 * Validate the requested export format
 * @param format Export format to validate
 * @throws Error if format is not supported
 */
declare function validateExportFormat(format: string): void;
/**
 * Export order data as JSON
 * @param orderDetails Order details object
 * @returns JSON object
 */
declare function exportAsJson(orderDetails: any): any;
/**
 * Export order data in specified format
 * @param orderId Order ID
 * @param format Export format (pdf, csv, json)
 * @param orgId Radiology organization ID
 * @returns Promise with exported data
 */
export declare function exportOrder(orderId: number, format: string, orgId: number): Promise<any>;
export { validateExportFormat, exportAsJson };
export default exportOrder;
