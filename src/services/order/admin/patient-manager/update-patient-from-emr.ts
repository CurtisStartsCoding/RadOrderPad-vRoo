import { queryPhiDb } from '../../../../config/db';
import { buildUpdateQuery } from '../utils';

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