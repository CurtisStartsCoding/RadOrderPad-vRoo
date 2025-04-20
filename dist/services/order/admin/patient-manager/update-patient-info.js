import { queryPhiDb } from '../../../../config/db';
import { buildUpdateQuery } from '../utils';
/**
 * Update patient information
 * @param patientId Patient ID
 * @param patientData Patient data
 * @returns Promise with result
 */
export async function updatePatientInfo(patientId, patientData) {
    // Map patientData fields to database columns
    const fieldMap = {
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
    const { query, values } = buildUpdateQuery('patients', patientData, 'id', patientId, fieldMap, true, ['id']);
    const result = await queryPhiDb(query, values);
    return result.rows[0].id;
}
//# sourceMappingURL=update-patient-info.js.map