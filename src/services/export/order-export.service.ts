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
 * Export orders to CSV format
 * @param options Export options
 * @returns CSV string
 */
export async function exportOrdersToCSV(options: ExportOptions): Promise<string> {
  try {
    // Determine which organization field to use based on role
    const orgField = options.role === 'admin_referring' 
      ? 'referring_organization_id' 
      : 'radiology_organization_id';

    // Build query
    let query = `
      SELECT 
        o.order_number,
        o.status,
        o.patient_name,
        o.patient_dob,
        o.patient_gender,
        o.referring_physician_name,
        o.referring_physician_npi,
        o.modality,
        o.body_part,
        o.laterality,
        o.clinical_indication,
        o.final_cpt_code,
        o.final_cpt_code_description,
        array_to_string(o.final_icd10_codes, ', ') as icd10_codes,
        array_to_string(o.final_icd10_code_descriptions, ', ') as icd10_descriptions,
        o.created_at,
        o.updated_at
      FROM orders o
      WHERE o.${orgField} = $1
    `;

    const queryParams: (string | number)[] = [options.orgId];
    let paramIndex = 2;

    // Add optional filters
    if (options.status && options.status !== 'all') {
      query += ` AND o.status = $${paramIndex}`;
      queryParams.push(options.status);
      paramIndex++;
    }

    if (options.dateFrom) {
      query += ` AND o.created_at >= $${paramIndex}`;
      queryParams.push(options.dateFrom);
      paramIndex++;
    }

    if (options.dateTo) {
      query += ` AND o.created_at <= $${paramIndex}`;
      queryParams.push(options.dateTo);
      paramIndex++;
    }

    // Add ordering and limit
    query += ' ORDER BY o.created_at DESC';
    
    if (options.limit) {
      query += ` LIMIT $${paramIndex}`;
      queryParams.push(options.limit);
    }

    // Execute query
    const result = await queryPhiDb(query, queryParams);

    // If no orders found, return empty CSV with headers
    if (result.rows.length === 0) {
      const headers = [
        'order_number',
        'status',
        'patient_name',
        'patient_dob',
        'patient_gender',
        'referring_physician_name',
        'referring_physician_npi',
        'modality',
        'body_part',
        'laterality',
        'clinical_indication',
        'final_cpt_code',
        'final_cpt_code_description',
        'icd10_codes',
        'icd10_descriptions',
        'created_at',
        'updated_at'
      ];
      return headers.join(',');
    }

    // Convert to CSV manually
    const headers = Object.keys(result.rows[0]);
    const csvRows = [
      headers.join(','), // Header row
      ...result.rows.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma or quotes
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ];
    const csv = csvRows.join('\n');

    logger.info('Orders exported successfully', {
      orgId: options.orgId,
      role: options.role,
      orderCount: result.rows.length
    });

    return csv;
  } catch (error) {
    logger.error('Error exporting orders:', {
      error,
      options
    });
    throw error;
  }
}