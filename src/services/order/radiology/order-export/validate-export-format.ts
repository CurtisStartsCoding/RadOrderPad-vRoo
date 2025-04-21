/**
 * Export format constants
 */
export const EXPORT_FORMAT = {
  JSON: 'json',
  CSV: 'csv',
  PDF: 'pdf'
} as const;

export type ExportFormat = typeof EXPORT_FORMAT[keyof typeof EXPORT_FORMAT];

/**
 * Validate export format
 * @param format Format to validate
 * @throws Error if format is invalid
 */
export function validateExportFormat(format: string): void {
  const validFormats = Object.values(EXPORT_FORMAT);
  
  if (!format || typeof format !== 'string') {
    throw new Error('Export format must be provided');
  }
  
  const normalizedFormat = format.toLowerCase();
  
  if (!validFormats.includes(normalizedFormat as ExportFormat)) {
    throw new Error(`Invalid export format: ${format}. Supported formats: ${validFormats.join(', ')}`);
  }
}

export default validateExportFormat;