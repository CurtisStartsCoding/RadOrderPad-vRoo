import { OrderDetails } from '../types';
import * as Papa from 'papaparse';
import logger from '../../../../utils/logger';

/**
 * Utility function to safely convert a value to string
 * @param value Value to convert
 * @returns String representation or empty string if null/undefined
 */
function safeString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

/**
 * Utility function to format a date value
 * @param date Date to format
 * @returns Formatted date string or empty string if invalid
 */
function formatDate(date: unknown): string {
  if (!date) {
    return '';
  }
  try {
    if (date instanceof Date) {
      return date.toISOString();
    } else if (typeof date === 'string') {
      return new Date(date).toISOString();
    }
    return '';
  } catch {
    return '';
  }
}

/**
 * Utility function to join array values
 * @param arr Array to join
 * @param separator Separator to use (default: ', ')
 * @returns Joined string or empty string if not an array
 */
function joinArray(arr: unknown[], separator = ', '): string {
  if (!Array.isArray(arr)) {
    return '';
  }
  return arr.join(separator);
}

/**
 * Utility function to format boolean values
 * @param value Boolean value
 * @returns 'Yes', 'No', or empty string
 */
function formatBoolean(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  // Convert to boolean if it's a string like "true" or "false"
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' ? 'Yes' : 'No';
  }
  // Use standard boolean conversion for other types
  return value ? 'Yes' : 'No';
}

/**
 * Generate CSV export of order data
 * @param orderDetails Order details object
 * @returns CSV string
 */
export function generateCsvExport(orderDetails: OrderDetails): string {
  try {
    const { order, patient, insurance, clinicalRecords, documentUploads, validationAttempts } = orderDetails;
    
    // Flatten the order data for CSV export
    const flattenedData = {
      // Order Information
      order_id: order.id,
      order_number: safeString(order.order_number),
      status: safeString(order.status),
      priority: safeString(order.priority),
      modality: safeString(order.modality),
      body_part: safeString(order.body_part),
      laterality: safeString(order.laterality),
      
      // Clinical Information
      cpt_code: safeString(order.final_cpt_code),
      cpt_description: safeString(order.final_cpt_code_description),
      icd10_codes: Array.isArray(order.final_icd10_codes) 
        ? joinArray(order.final_icd10_codes) 
        : safeString(order.final_icd10_codes),
      icd10_descriptions: Array.isArray(order.final_icd10_code_descriptions) 
        ? joinArray(order.final_icd10_code_descriptions) 
        : safeString(order.final_icd10_code_descriptions),
      clinical_indication: safeString(order.clinical_indication),
      original_dictation: safeString(order.original_dictation),
      validation_status: safeString(order.validation_status),
      compliance_score: safeString(order.compliance_score),
      contrast_indicated: formatBoolean(order.is_contrast_indicated),
      auc_outcome: safeString(order.auc_outcome),
      guideline_source: safeString(order.guideline_source),
      
      // Patient Information
      patient_id: patient?.id || '',
      patient_mrn: safeString(patient?.mrn),
      patient_first_name: safeString(patient?.first_name),
      patient_last_name: safeString(patient?.last_name),
      patient_dob: formatDate(patient?.date_of_birth),
      patient_gender: safeString(patient?.gender),
      patient_phone: safeString(patient?.phone),
      patient_email: safeString(patient?.email),
      patient_address: safeString(patient?.address),
      patient_city: safeString(patient?.city),
      patient_state: safeString(patient?.state),
      patient_zip: safeString(patient?.zip),
      
      // Insurance Information
      primary_insurance: insurance && insurance.length > 0 ? safeString(insurance[0].insurance_name) : '',
      primary_insurance_id: insurance && insurance.length > 0 ? safeString(insurance[0].insurance_id) : '',
      primary_insurance_group: insurance && insurance.length > 0 ? safeString(insurance[0].group_number) : '',
      primary_insurance_subscriber: insurance && insurance.length > 0 ? safeString(insurance[0].subscriber_name) : '',
      
      // Referring Physician Information
      referring_physician: safeString(order.referring_physician_name),
      referring_physician_npi: safeString(order.referring_physician_npi),
      referring_physician_phone: safeString(order.referring_physician_phone),
      referring_physician_email: safeString(order.referring_physician_email),
      referring_physician_fax: safeString(order.referring_physician_fax),
      referring_physician_address: safeString(order.referring_physician_address),
      referring_physician_city: safeString(order.referring_physician_city),
      referring_physician_state: safeString(order.referring_physician_state),
      referring_physician_zip: safeString(order.referring_physician_zip),
      referring_physician_specialty: safeString(order.referring_physician_specialty),
      referring_physician_license: safeString(order.referring_physician_license),
      
      // Referring Organization Information
      referring_organization: safeString(order.referring_organization_name),
      referring_organization_address: safeString(order.referring_organization_address),
      referring_organization_city: safeString(order.referring_organization_city),
      referring_organization_state: safeString(order.referring_organization_state),
      referring_organization_zip: safeString(order.referring_organization_zip),
      referring_organization_phone: safeString(order.referring_organization_phone),
      referring_organization_fax: safeString(order.referring_organization_fax),
      referring_organization_email: safeString(order.referring_organization_email),
      referring_organization_tax_id: safeString(order.referring_organization_tax_id),
      referring_organization_npi: safeString(order.referring_organization_npi),
      
      // Radiology Organization Information
      radiology_organization: safeString(order.radiology_organization_name),
      radiology_organization_address: safeString(order.radiology_organization_address),
      radiology_organization_city: safeString(order.radiology_organization_city),
      radiology_organization_state: safeString(order.radiology_organization_state),
      radiology_organization_zip: safeString(order.radiology_organization_zip),
      radiology_organization_phone: safeString(order.radiology_organization_phone),
      radiology_organization_fax: safeString(order.radiology_organization_fax),
      radiology_organization_email: safeString(order.radiology_organization_email),
      radiology_organization_tax_id: safeString(order.radiology_organization_tax_id),
      radiology_organization_npi: safeString(order.radiology_organization_npi),
      
      // Consent and Authorization Information
      patient_consent_obtained: formatBoolean(order.patient_consent_obtained),
      patient_consent_date: formatDate(order.patient_consent_date),
      insurance_authorization_number: safeString(order.insurance_authorization_number),
      insurance_authorization_date: formatDate(order.insurance_authorization_date),
      insurance_authorization_contact: safeString(order.insurance_authorization_contact),
      medical_necessity_documentation: safeString(order.medical_necessity_documentation),
      
      // Clinical Records
      clinical_records_count: clinicalRecords ? clinicalRecords.length : 0,
      clinical_records_summary: clinicalRecords && clinicalRecords.length > 0 
        ? joinArray(clinicalRecords.map(record => record.content_summary || '')) 
        : '',
      
      // Document Uploads
      document_uploads_count: documentUploads ? documentUploads.length : 0,
      document_uploads_list: documentUploads && documentUploads.length > 0 
        ? joinArray(documentUploads.map(doc => doc.filename || '')) 
        : '',
      
      // Validation Information
      validation_attempts_count: validationAttempts ? validationAttempts.length : 0,
      override_justification: safeString(order.override_justification),
      
      // Timestamps
      order_created_at: formatDate(order.created_at),
      order_updated_at: formatDate(order.updated_at),
      order_signed_at: formatDate(order.signature_date),
      order_signed_by: order.signed_by_user_id ? `User ID: ${order.signed_by_user_id}` : ''
    };
    
    // Use PapaParse to generate CSV
    const csvString = Papa.unparse([flattenedData], {
      header: true,
      delimiter: ',',
      newline: '\n',
      skipEmptyLines: true,
      quotes: true
    });
    
    return csvString;
  } catch (error) {
    logger.error('Error generating CSV export:', error instanceof Error ? error.message : String(error));
    throw new Error('Failed to generate CSV export');
  }
}

export default generateCsvExport;