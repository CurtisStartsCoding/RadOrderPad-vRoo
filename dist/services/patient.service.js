"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Service for handling patient-related operations
 */
class PatientService {
    /**
     * Create a temporary patient record
     * @param client Database client
     * @param organizationId Organization ID
     * @param patientInfo Patient information
     * @returns Patient ID
     */
    async createTemporaryPatient(client, organizationId, patientInfo) {
        const patientResult = await client.query(`INSERT INTO patients 
      (organization_id, pidn, first_name, last_name, date_of_birth, gender, mrn, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
      RETURNING id`, [
            organizationId,
            `P-${Date.now()}`, // Generate a temporary PIDN
            patientInfo.firstName,
            patientInfo.lastName,
            patientInfo.dateOfBirth,
            patientInfo.gender,
            patientInfo.mrn || null
        ]);
        return patientResult.rows[0].id;
    }
}
exports.default = new PatientService();
//# sourceMappingURL=patient.service.js.map