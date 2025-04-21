"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportOrder = exportOrder;
const csv_export_1 = require("../export/csv-export");
const pdf_export_1 = require("../export/pdf-export");
const order_details_service_1 = require("../order-details.service");
const validate_export_format_1 = require("./validate-export-format");
const export_as_json_1 = require("./export-as-json");
const logger_1 = __importDefault(require("../../../../utils/logger"));
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
        // Get the complete order details with all related data
        const orderDetails = await (0, order_details_service_1.getOrderDetails)(orderId, orgId);
        // Export based on format
        switch (format.toLowerCase()) {
            case 'json':
                return (0, export_as_json_1.exportAsJson)(orderDetails);
            case 'csv':
                return (0, csv_export_1.generateCsvExport)(orderDetails);
            case 'pdf':
                return (0, pdf_export_1.generatePdfExport)(orderDetails);
            default:
                // This should never happen due to validation, but TypeScript requires it
                throw new Error(`Unsupported export format: ${format}`);
        }
    }
    catch (error) {
        logger_1.default.error('Error in exportOrder:', error instanceof Error ? error.message : String(error));
        throw error;
    }
}
exports.default = exportOrder;
//# sourceMappingURL=export-order.js.map