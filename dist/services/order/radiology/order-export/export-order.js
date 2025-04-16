"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportOrder = exportOrder;
const export_1 = require("../export");
const order_details_service_1 = require("../order-details.service");
const validate_export_format_1 = require("./validate-export-format");
const export_as_json_1 = require("./export-as-json");
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
        (0, validate_export_format_1.validateExportFormat)(format);
        // Get the order details
        const orderDetails = await (0, order_details_service_1.getOrderDetails)(orderId, orgId);
        // Export based on format
        switch (format) {
            case 'json':
                return (0, export_as_json_1.exportAsJson)(orderDetails);
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
//# sourceMappingURL=export-order.js.map