import { queryPhiDb } from '../../config/db';
import logger from '../../utils/logger';

export interface ExportOptions {
  orgId: number;
  role: 'admin_referring' | 'admin_radiology';
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

/**
 * Simple CSV export without external dependencies
 */
export async function exportOrdersToCSV(options: ExportOptions): Promise<string> {
  try {
    const orgField = options.role === 'admin_referring' 
      ? 'referring_organization_id' 
      : 'radiology_organization_id';

    // Simple query with just essential fields
    const query = `
      SELECT 
        o.order_number,
        o.status,
        o.patient_name,
        o.modality,
        o.created_at
      FROM orders o
      WHERE o.${orgField} = $1
      ORDER BY o.created_at DESC
      LIMIT $2
    `;

    const queryParams = [options.orgId, options.limit || 100];

    const result = await queryPhiDb(query, queryParams);

    // Simple CSV generation
    if (result.rows.length === 0) {
      return 'order_number,status,patient_name,modality,created_at';
    }

    // Header
    let csv = 'order_number,status,patient_name,modality,created_at\n';
    
    // Rows
    for (const row of result.rows) {
      csv += `${row.order_number},${row.status},"${row.patient_name}",${row.modality},${row.created_at}\n`;
    }

    return csv;
  } catch (error) {
    logger.error('Error in simple export:', error);
    throw error;
  }
}