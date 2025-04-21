import { OrderDetails } from '../../types';
import { FlattenedOrderData } from './interfaces';
import * as Papa from 'papaparse';
import logger from '../../../../../utils/logger';
import { getHistoryTimestamp } from './utils';
import {
  transformOrderData,
  transformPatientData,
  transformInsuranceData,
  transformReferringData,
  transformRadiologyData,
  transformClinicalRecordsData,
  transformValidationData
} from './transformers';

/**
 * Configuration options for CSV export
 */
interface CsvExportOptions {
  includeHeaders?: boolean;
  delimiter?: string;
  quoteFields?: boolean;
}

/**
 * Generate CSV export of order data
 * @param orderDetails Order details object
 * @param options CSV export options
 * @returns CSV string
 */
export function generateCsvExport(
  orderDetails: OrderDetails, 
  options: CsvExportOptions = {}
): string {
  try {
    // Extract data from order details
    const { order, patient, insurance, clinicalRecords, documentUploads, validationAttempts, orderHistory } = orderDetails;
    
    // Apply default options
    const exportOptions = {
      includeHeaders: options.includeHeaders ?? true,
      delimiter: options.delimiter ?? ',',
      quoteFields: options.quoteFields ?? true
    };
    
    // Transform data using specialized transformers
    const orderInfo = transformOrderData(order);
    const patientInfo = transformPatientData(patient);
    const insuranceInfo = transformInsuranceData(insurance, order);
    const referringInfo = transformReferringData(order);
    const radiologyInfo = transformRadiologyData(order);
    const clinicalRecordsInfo = transformClinicalRecordsData(clinicalRecords, documentUploads, order);
    const validationInfo = transformValidationData(validationAttempts, order);
    
    // Add history timestamps
    const historyInfo = {
      sent_to_radiology_at: getHistoryTimestamp(orderHistory, 'sent_to_radiology'),
      scheduled_at: getHistoryTimestamp(orderHistory, 'scheduled'),
      completed_at: getHistoryTimestamp(orderHistory, 'completed')
    };
    
    // Combine all data into a single flattened object
    const flatData: FlattenedOrderData = {
      ...orderInfo,
      ...patientInfo,
      ...insuranceInfo,
      ...referringInfo,
      ...radiologyInfo,
      ...clinicalRecordsInfo,
      ...validationInfo,
      ...historyInfo
    };
    
    // Use PapaParse to generate CSV
    const csvString = Papa.unparse([flatData], {
      header: exportOptions.includeHeaders,
      delimiter: exportOptions.delimiter,
      newline: '\n',
      skipEmptyLines: true,
      quotes: exportOptions.quoteFields
    });
    
    return csvString;
  } catch (error) {
    logger.error('Error generating CSV export:', error instanceof Error ? error.message : String(error));
    throw new Error('Failed to generate CSV export');
  }
}

export default generateCsvExport;