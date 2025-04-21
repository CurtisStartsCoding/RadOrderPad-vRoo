/**
 * Interface for patient information in CSV export
 */
export interface PatientInfo {
  patient_id?: number;
  patient_mrn?: string;
  patient_first_name?: string;
  patient_last_name?: string;
  patient_dob?: string;
  patient_gender?: string;
  patient_address?: string;
  patient_address2?: string;
  patient_city?: string;
  patient_state?: string;
  patient_zip?: string;
  patient_phone?: string;
  patient_email?: string;
}