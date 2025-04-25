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
export declare function validatePatientData(patient: PatientData): string[];
export {};
