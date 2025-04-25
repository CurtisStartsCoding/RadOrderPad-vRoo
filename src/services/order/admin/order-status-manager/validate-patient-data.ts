/**
 * Patient data interface with fields to validate
 */
interface PatientData {
  address_line1?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone_number?: string;
  [key: string]: unknown;
}

/**
 * Validate patient data for required fields
 * @param patient Patient data
 * @returns Array of missing field names
 */
export function validatePatientData(patient: PatientData): string[] {
  const missingPatientFields = [];
  
  if (!patient.address_line1) missingPatientFields.push('address');
  if (!patient.city) missingPatientFields.push('city');
  if (!patient.state) missingPatientFields.push('state');
  if (!patient.zip_code) missingPatientFields.push('zip code');
  if (!patient.phone_number) missingPatientFields.push('phone number');
  
  return missingPatientFields;
}