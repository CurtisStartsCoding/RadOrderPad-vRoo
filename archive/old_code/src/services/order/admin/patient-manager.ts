import { queryPhiDb } from '../../../config/db';
import { PatientUpdateData, PatientUpdateResult } from './types';
import { buildUpdateQuery, buildUpdateQueryFromPairs } from './utils';

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
  
  // Build the update query using the utility function
  const { query, values } = buildUpdateQuery(
    'patients',
    patientData,
    'id',
    patientId,
    fieldMap,
    true,
    ['id']
  );
  
  const result = await queryPhiDb(query, values);
  return result.rows[0].id;
}

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
  
  // Map EMR fields to database columns
  const fieldMap: { [key: string]: string } = {
    address: 'address_line1',
    city: 'city',
    state: 'state',
    zipCode: 'zip_code',
    phone: 'phone_number',
    email: 'email'
  };
  
  // Build the update query using the utility function
  const { query, values } = buildUpdateQuery(
    'patients',
    parsedPatientInfo,
    'id',
    patientId,
    fieldMap,
    true,
    []
  );
  
  // Only execute the query if there are fields to update
  if (values.length > 1) { // values includes patientId, so length > 1 means we have fields to update
    await queryPhiDb(query, values);
  }
}

export default {
  updatePatientInfo,
  updatePatientFromEmr
};