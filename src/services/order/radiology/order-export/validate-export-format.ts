/**
 * Validate the requested export format
 * @param format Export format to validate
 * @throws Error if format is not supported
 */
export function validateExportFormat(format: string): void {
  const supportedFormats = ['json', 'csv', 'pdf'];
  if (!supportedFormats.includes(format)) {
    throw new Error(`Unsupported export format: ${format}. Supported formats are: ${supportedFormats.join(', ')}`);
  }
}