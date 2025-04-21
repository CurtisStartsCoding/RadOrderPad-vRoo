import { ClinicalRecordsInfo } from '../interfaces';
import { formatBoolean, formatDate, joinArray, safeString } from '../utils';

/**
 * Transform clinical records and documents data for CSV export
 * @param clinicalRecords Clinical records array from database
 * @param documentUploads Document uploads array from database
 * @param order Order data for consent and medical necessity information
 * @returns Transformed clinical records info for CSV
 */
export function transformClinicalRecordsData(
  clinicalRecords: Record<string, unknown>[] | undefined,
  documentUploads: Record<string, unknown>[] | undefined,
  order: Record<string, unknown>
): ClinicalRecordsInfo {
  if (!clinicalRecords) {
    clinicalRecords = [];
  }
  
  if (!documentUploads) {
    documentUploads = [];
  }

  return {
    // Clinical records
    clinical_records_count: clinicalRecords.length,
    clinical_records_summary: clinicalRecords.length 
      ? joinArray(clinicalRecords.map(record => record.record_type as string))
      : 'None',
    
    // Document uploads
    document_uploads_count: documentUploads.length,
    document_uploads_summary: documentUploads.length
      ? joinArray(documentUploads.map(doc => doc.document_type as string))
      : 'None',
    
    // Medical necessity
    medical_necessity_documentation: safeString(order?.medical_necessity_documentation),
    
    // Consent information
    patient_consent_obtained: formatBoolean(order?.patient_consent_obtained as boolean),
    patient_consent_date: formatDate(order?.patient_consent_date as string | Date)
  };
}