import { RadiologyOrder, ExportOptions } from '../types/radiology-order-types';

/**
 * Generate a filename for the exported data
 * 
 * @param format - Export format (json or csv)
 * @returns Filename with timestamp
 */
export const generateExportFilename = (format: 'json' | 'csv'): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `radiology-orders-${timestamp}.${format}`;
};

/**
 * Trigger a file download for the exported data
 * 
 * @param data - Data to be downloaded
 * @param filename - Name of the file to be downloaded
 * @param format - Format of the file (json or csv)
 */
export const triggerDownload = (data: string, filename: string, format: 'json' | 'csv'): void => {
  // Create a blob with the data
  const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  
  // Trigger the download
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Export orders to JSON format
 * 
 * @param orders - Array of radiology orders
 * @param options - Export options
 */
export const exportToJson = (orders: RadiologyOrder[], options: ExportOptions): void => {
  // Filter out sensitive information if needed
  const processedOrders = orders.map(order => {
    // Create a new object with only the fields we want to include
    const processedOrder: Partial<RadiologyOrder> = {
      id: order.id,
      status: order.status,
      modality: order.modality,
      bodyPart: order.bodyPart,
      contrast: order.contrast,
      contrastType: order.contrastType,
      instructions: order.instructions,
      clinicalIndications: order.clinicalIndications,
      icd10Codes: order.icd10Codes,
      cptCodes: order.cptCodes,
      documents: order.documents,
      overrideInfo: order.overrideInfo,
      scheduledDate: order.scheduledDate,
      scheduledBy: order.scheduledBy,
      completedDate: order.completedDate,
      completedBy: order.completedBy,
      createdAt: order.createdAt,
      createdBy: order.createdBy,
      updatedAt: order.updatedAt,
      updatedBy: order.updatedBy
    };
    
    // Add patient info if requested
    if (options.includePatientInfo) {
      processedOrder.patient = order.patient;
    }
    
    // Add insurance info if requested
    if (options.includeInsuranceInfo) {
      processedOrder.insurance = order.insurance;
    }
    
    return processedOrder;
  });
  
  // Convert to JSON string
  const jsonData = JSON.stringify(processedOrders, null, 2);
  
  // Generate filename and trigger download
  const filename = generateExportFilename('json');
  triggerDownload(jsonData, filename, 'json');
};

/**
 * Export orders to CSV format
 * 
 * @param orders - Array of radiology orders
 * @param options - Export options
 */
export const exportToCsv = (orders: RadiologyOrder[], options: ExportOptions): void => {
  // Define CSV headers based on options
  let headers = ['Order ID', 'Status', 'Modality', 'Body Part', 'Created At', 'Updated At'];
  
  if (options.includePatientInfo) {
    headers = [...headers, 'Patient Name', 'Patient DOB', 'Patient MRN', 'Patient ID'];
  }
  
  if (options.includeInsuranceInfo) {
    headers = [...headers, 'Insurance Provider', 'Member ID', 'Group Number', 'Verified'];
  }
  
  // Convert orders to CSV rows
  const rows = orders.map(order => {
    // Start with required fields
    const row: string[] = [
      order.id,
      order.status,
      order.modality,
      order.bodyPart,
      order.createdAt,
      order.updatedAt
    ];
    
    // Add patient info if requested
    if (options.includePatientInfo) {
      row.push(
        order.patient?.name || 'N/A',
        order.patient?.dob || 'N/A',
        order.patient?.mrn || 'N/A',
        order.patient?.pidn || 'N/A'
      );
    }
    
    // Add insurance info if requested
    if (options.includeInsuranceInfo) {
      row.push(
        order.insurance?.provider || 'N/A',
        order.insurance?.memberId || 'N/A',
        order.insurance?.groupNumber || 'N/A',
        order.insurance?.verified ? 'Yes' : 'No'
      );
    }
    
    return row;
  });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Generate filename and trigger download
  const filename = generateExportFilename('csv');
  triggerDownload(csvContent, filename, 'csv');
};

/**
 * Export orders based on the specified format
 * 
 * @param orders - Array of radiology orders
 * @param options - Export options
 */
export const exportOrders = (orders: RadiologyOrder[], options: ExportOptions): void => {
  if (options.format === 'json') {
    exportToJson(orders, options);
  } else {
    exportToCsv(orders, options);
  }
};