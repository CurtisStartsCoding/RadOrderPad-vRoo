"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExportFormat = validateExportFormat;
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
//# sourceMappingURL=validate-export-format.js.map