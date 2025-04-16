import { PatientData, InsuranceData } from './types';
/**
 * Get patient data for validation
 * @param patientId Patient ID
 * @returns Promise with patient data
 */
export declare function getPatientForValidation(patientId: number): Promise<PatientData>;
/**
 * Get primary insurance data for validation
 * @param patientId Patient ID
 * @returns Promise with insurance data or null if not found
 */
export declare function getPrimaryInsurance(patientId: number): Promise<InsuranceData | null>;
/**
 * Validate patient has required information for sending to radiology
 * @param patient Patient data
 * @returns Array of missing field names
 */
export declare function validatePatientFields(patient: PatientData): string[];
/**
 * Validate insurance has required information for sending to radiology
 * @param insurance Insurance data
 * @returns Array of missing field names
 */
export declare function validateInsuranceFields(insurance: InsuranceData | null): string[];
declare const _default: {
    getPatientForValidation: typeof getPatientForValidation;
    getPrimaryInsurance: typeof getPrimaryInsurance;
    validatePatientFields: typeof validatePatientFields;
    validateInsuranceFields: typeof validateInsuranceFields;
};
export default _default;
