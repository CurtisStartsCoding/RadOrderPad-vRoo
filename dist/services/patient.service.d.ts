import { PoolClient } from 'pg';
/**
 * Service for handling patient-related operations
 */
declare class PatientService {
    /**
     * Create a temporary patient record
     * @param client Database client
     * @param organizationId Organization ID
     * @param patientInfo Patient information
     * @returns Patient ID
     */
    createTemporaryPatient(client: PoolClient, organizationId: number, patientInfo: any): Promise<number>;
}
declare const _default: PatientService;
export default _default;
