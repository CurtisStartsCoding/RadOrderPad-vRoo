/**
 * Export format constants
 */
export declare const EXPORT_FORMAT: {
    readonly JSON: "json";
    readonly CSV: "csv";
    readonly PDF: "pdf";
};
export type ExportFormat = typeof EXPORT_FORMAT[keyof typeof EXPORT_FORMAT];
/**
 * Validate export format
 * @param format Format to validate
 * @throws Error if format is invalid
 */
export declare function validateExportFormat(format: string): void;
export default validateExportFormat;
