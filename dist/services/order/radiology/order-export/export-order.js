import { generateCsvExport, generatePdfExport } from '../export';
import { getOrderDetails } from '../order-details.service';
import { validateExportFormat } from './validate-export-format';
import { exportAsJson } from './export-as-json';
/**
 * Export order data in specified format
 * @param orderId Order ID
 * @param format Export format (pdf, csv, json)
 * @param orgId Radiology organization ID
 * @returns Promise with exported data
 */
export async function exportOrder(orderId, format, orgId) {
    try {
        // Validate the requested format
        validateExportFormat(format);
        // Get the order details
        const orderDetails = await getOrderDetails(orderId, orgId);
        // Export based on format
        switch (format) {
            case 'json':
                return exportAsJson(orderDetails);
            case 'csv':
                return generateCsvExport(orderDetails);
            case 'pdf':
                return generatePdfExport(orderDetails);
            default:
                // This should never happen due to validation, but TypeScript requires it
                throw new Error(`Unsupported export format: ${format}`);
        }
    }
    catch (error) {
        console.error('Error in exportOrder:', error);
        throw error;
    }
}
//# sourceMappingURL=export-order.js.map