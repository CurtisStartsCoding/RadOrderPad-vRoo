"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportOrder = exportOrder;
exports.validateExportFormat = validateExportFormat;
exports.exportAsJson = exportAsJson;
const export_1 = require("./export");
const order_details_service_1 = require("./order-details.service");
/**
 * Validate the requested export format
 * @param format Export format to validate
 * @throws Error if format is not supported
 */
function validateExportFormat(format) {
    const supportedFormats = ['json', 'csv', 'pdf'];
    if (!supportedFormats.includes(format)) {
        throw new Error(`Unsupported export format: ${format}. Supported formats are: ${supportedFormats.join(', ')}`);
    }
}
/**
 * Export order data as JSON
 * @param orderDetails Order details object
 * @returns JSON object
 */
function exportAsJson(orderDetails) {
    return orderDetails;
}
/**
 * Export order data in specified format
 * @param orderId Order ID
 * @param format Export format (pdf, csv, json)
 * @param orgId Radiology organization ID
 * @returns Promise with exported data
 */
async function exportOrder(orderId, format, orgId) {
    try {
        // Validate the requested format
        validateExportFormat(format);
        // Get the order details
        const orderDetails = await (0, order_details_service_1.getOrderDetails)(orderId, orgId);
        // Export based on format
        switch (format) {
            case 'json':
                return exportAsJson(orderDetails);
            case 'csv':
                return (0, export_1.generateCsvExport)(orderDetails);
            case 'pdf':
                return (0, export_1.generatePdfExport)(orderDetails);
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
exports.default = exportOrder;
//# sourceMappingURL=order-export.service.js.map