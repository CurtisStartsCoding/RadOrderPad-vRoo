import { generateCsvExport } from '../export/csv-export';
import { generatePdfExport } from '../export/pdf-export';
import { getOrderDetails } from '../order-details.service';
import { validateExportFormat } from './validate-export-format';
import { exportAsJson } from './export-as-json';
import { OrderDetails } from '../types';
import logger from '../../../../utils/logger';

/**
 * Export order data in specified format
 * @param orderId Order ID
 * @param format Export format (pdf, csv, json)
 * @param orgId Radiology organization ID
 * @returns Promise with exported data
 */
export async function exportOrder(
  orderId: number, 
  format: string, 
  orgId: number
): Promise<OrderDetails | string | Buffer> {
  try {
    // Validate the requested format
    validateExportFormat(format);
    
    // Get the complete order details with all related data
    const orderDetails = await getOrderDetails(orderId, orgId);
    
    // Export based on format
    switch (format.toLowerCase()) {
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
    logger.error('Error in exportOrder:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export default exportOrder;