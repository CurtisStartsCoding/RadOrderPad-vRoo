import { ValidationStatus } from '../../models';
/**
 * Patient information for temporary patients
 */
export interface PatientInfo {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    [key: string]: string | number | boolean | undefined;
}
/**
 * Payload for finalizing an order
 */
export interface FinalizeOrderPayload {
    finalValidationStatus: ValidationStatus;
    finalComplianceScore?: number;
    finalICD10Codes?: string[];
    finalICD10CodeDescriptions?: string[];
    finalCPTCode: string;
    finalCPTCodeDescription?: string;
    clinicalIndication: string;
    isTemporaryPatient?: boolean;
    patientInfo?: PatientInfo;
    overridden?: boolean;
    overrideJustification?: string;
    isUrgentOverride?: boolean;
    signatureData?: string;
}
/**
 * Response for finalize order operation
 */
export interface FinalizeOrderResponse {
    success: boolean;
    orderId: number;
    message: string;
}
/**
 * Error response structure
 */
export interface ErrorResponse {
    message: string;
}
