/**
 * Interface for clinical records and documents information in CSV export
 */
export interface ClinicalRecordsInfo {
  // Clinical records
  clinical_records_count: number;
  clinical_records_summary: string;
  
  // Document uploads
  document_uploads_count: number;
  document_uploads_summary: string;
  
  // Medical necessity
  medical_necessity_documentation?: string;
  
  // Consent information
  patient_consent_obtained?: string;
  patient_consent_date?: string;
}