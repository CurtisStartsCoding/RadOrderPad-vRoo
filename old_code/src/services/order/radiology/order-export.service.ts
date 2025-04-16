import { generateCsvExport, generatePdfExport } from './export';
import { getOrderDetails } from './order-details.service';

/**
 * Validate the requested export format
 * @param format Export format to validate
 * @throws Error if format is not supported
 */
function validateExportFormat(format: string): void {
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
function exportAsJson(orderDetails: any): any {
  return orderDetails;
}

/**
 * Export order data in specified format
 * @param orderId Order ID
 * @param format Export format (pdf, csv, json)
 * @param orgId Radiology organization ID
 * @returns Promise with exported data
 */
export async function exportOrder(orderId: number, format: string, orgId: number): Promise<any> {
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
  } catch (error) {
    console.error('Error in exportOrder:', error);
    throw error;
  }
}

// Export individual functions for testing and reuse
export {
  validateExportFormat,
  exportAsJson
};

export default exportOrder;