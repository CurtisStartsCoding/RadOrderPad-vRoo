import { queryPhiDb } from '../../../../config/db';
import { buildUpdateQuery } from '../utils';

/**
 * Interface for parsed patient information from EMR
 */
interface ParsedPatientInfo {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  [key: string]: string | undefined;
}

/**
 * Update patient information from parsed EMR data
 * @param patientId Patient ID
 * @param parsedPatientInfo Parsed patient information
 * @returns Promise with result
 */
export async function updatePatientFromEmr(
  patientId: number,
  parsedPatientInfo: ParsedPatientInfo
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