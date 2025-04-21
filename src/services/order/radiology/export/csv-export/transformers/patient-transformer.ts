import { PatientInfo } from '../interfaces';
import { safeString } from '../utils';

/**
 * Transform patient data for CSV export
 * @param patient Patient data from database
 * @returns Transformed patient info for CSV
 */
export function transformPatientData(patient: Record<string, unknown> | undefined): PatientInfo {
  if (!patient) {
    return {};
  }

  return {
    patient_id: patient.id as number | undefined,
    patient_mrn: safeString(patient.mrn),
    patient_first_name: safeString(patient.first_name),
    patient_last_name: safeString(patient.last_name),
    patient_dob: safeString(patient.date_of_birth),
    patient_gender: safeString(patient.gender),
    patient_address: safeString(patient.address_line1),
    patient_address2: safeString(patient.address_line2),
    patient_city: safeString(patient.city),
    patient_state: safeString(patient.state),
    patient_zip: safeString(patient.zip_code),
    patient_phone: safeString(patient.phone_number),
    patient_email: safeString(patient.email)
  };
}