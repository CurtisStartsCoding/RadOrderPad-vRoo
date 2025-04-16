import { queryPhiDb } from '../../../../config/db';

/**
 * Update patient information from parsed EMR data
 * @param patientId Patient ID
 * @param parsedPatientInfo Parsed patient information
 * @returns Promise with result
 */
export async function updatePatientFromEmr(
  patientId: number,
  parsedPatientInfo: any
): Promise<void> {
  if (!parsedPatientInfo || Object.keys(parsedPatientInfo).length === 0) {
    return;
  }
  
  const patientUpdateFields = [];
  const patientUpdateValues = [];
  let valueIndex = 1;
  
  if (parsedPatientInfo.address) {
    patientUpdateFields.push(`address_line1 = $${valueIndex}`);
    patientUpdateValues.push(parsedPatientInfo.address);
    valueIndex++;
  }
  
  if (parsedPatientInfo.city) {
    patientUpdateFields.push(`city = $${valueIndex}`);
    patientUpdateValues.push(parsedPatientInfo.city);
    valueIndex++;
  }
  
  if (parsedPatientInfo.state) {
    patientUpdateFields.push(`state = $${valueIndex}`);
    patientUpdateValues.push(parsedPatientInfo.state);
    valueIndex++;
  }
  
  if (parsedPatientInfo.zipCode) {
    patientUpdateFields.push(`zip_code = $${valueIndex}`);
    patientUpdateValues.push(parsedPatientInfo.zipCode);
    valueIndex++;
  }
  
  if (parsedPatientInfo.phone) {
    patientUpdateFields.push(`phone_number = $${valueIndex}`);
    patientUpdateValues.push(parsedPatientInfo.phone);
    valueIndex++;
  }
  
  if (parsedPatientInfo.email) {
    patientUpdateFields.push(`email = $${valueIndex}`);
    patientUpdateValues.push(parsedPatientInfo.email);
    valueIndex++;
  }
  
  if (patientUpdateFields.length > 0) {
    const patientUpdateQuery = `
      UPDATE patients
      SET ${patientUpdateFields.join(', ')}, updated_at = NOW()
      WHERE id = $${valueIndex}
    `;
    
    await queryPhiDb(patientUpdateQuery, [...patientUpdateValues, patientId]);
  }
}

export default updatePatientFromEmr;