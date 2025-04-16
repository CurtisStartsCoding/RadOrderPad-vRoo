import { queryPhiDb } from '../../../../config/db';
import { PatientUpdateData } from '../types';

/**
 * Update patient information
 * @param patientId Patient ID
 * @param patientData Patient data
 * @returns Promise with result
 */
export async function updatePatientInfo(
  patientId: number,
  patientData: PatientUpdateData
): Promise<number> {
  // Map patientData fields to database columns
  const fieldMap: { [key: string]: string } = {
    firstName: 'first_name',
    lastName: 'last_name',
    middleName: 'middle_name',
    dateOfBirth: 'date_of_birth',
    gender: 'gender',
    addressLine1: 'address_line1',
    addressLine2: 'address_line2',
    city: 'city',
    state: 'state',
    zipCode: 'zip_code',
    phoneNumber: 'phone_number',
    email: 'email',
    mrn: 'mrn'
  };
  
  // Build update query dynamically based on provided fields
  const updateFields = [];
  const updateValues = [];
  let valueIndex = 1;
  
  for (const [key, value] of Object.entries(patientData)) {
    if (fieldMap[key] && value !== undefined) {
      updateFields.push(`${fieldMap[key]} = $${valueIndex}`);
      updateValues.push(value);
      valueIndex++;
    }
  }
  
  if (updateFields.length === 0) {
    throw new Error('No valid patient fields provided for update');
  }
  
  // Add updated_at field
  updateFields.push(`updated_at = NOW()`);
  
  const updateQuery = `
    UPDATE patients
    SET ${updateFields.join(', ')}
    WHERE id = $${valueIndex}
    RETURNING id
  `;
  
  const result = await queryPhiDb(updateQuery, [...updateValues, patientId]);
  return result.rows[0].id;
}

export default updatePatientInfo;