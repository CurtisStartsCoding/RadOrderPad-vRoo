import { queryPhiDb } from '../../../../../config/db';
/**
 * Get patient data for validation
 * @param patientId Patient ID
 * @returns Promise with patient data
 */
export async function getPatientForValidation(patientId) {
    const patientResult = await queryPhiDb(`SELECT p.id, p.first_name, p.last_name, p.date_of_birth, p.gender, 
            p.address_line1, p.city, p.state, p.zip_code, p.phone_number
     FROM patients p
     WHERE p.id = $1`, [patientId]);
    if (patientResult.rows.length === 0) {
        throw new Error(`Patient not found with ID ${patientId}`);
    }
    return patientResult.rows[0];
}
//# sourceMappingURL=get-patient-for-validation.js.map