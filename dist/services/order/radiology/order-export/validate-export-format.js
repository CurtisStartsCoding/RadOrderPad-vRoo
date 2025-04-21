"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXPORT_FORMAT = void 0;
exports.validateExportFormat = validateExportFormat;
/**
 * Export format constants
 */
exports.EXPORT_FORMAT = {
    JSON: 'json',
    CSV: 'csv',
    PDF: 'pdf'
};
/**
 * Validate export format
 * @param format Format to validate
 * @throws Error if format is invalid
 */
function validateExportFormat(format) {
    const validFormats = Object.values(exports.EXPORT_FORMAT);
    if (!format || typeof format !== 'string') {
        throw new Error('Export format must be provided');
    }
    const normalizedFormat = format.toLowerCase();
    if (!validFormats.includes(normalizedFormat)) {
        throw new Error(`Invalid export format: ${format}. Supported formats: ${validFormats.join(', ')}`);
    }
}
exports.default = validateExportFormat;
//# sourceMappingURL=validate-export-format.js.map