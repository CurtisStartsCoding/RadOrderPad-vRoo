import { Order, ValidationStatus } from '../../../models';
import { PoolClient } from 'pg';
/**
 * Patient information for temporary patients
 */
export interface PatientInfo {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    [key: string]: any;
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
    referringOrganizationId?: number;
    radiologyOrganizationId?: number;
    patientConsentObtained?: boolean;
    patientConsentDate?: Date;
    insuranceAuthorizationNumber?: string;
    insuranceAuthorizationDate?: Date;
    insuranceAuthorizationContact?: string;
    medicalNecessityDocumentation?: string;
}
/**
 * Response for finalize order operation
 */
export interface FinalizeOrderResponse {
    success: boolean;
    orderId: number;
    message: string;
    signatureUploadNote?: string;
}
/**
 * Transaction context for order finalization
 */
export interface TransactionContext {
    client: PoolClient;
    orderId: number;
    order: Order;
    userId: number;
    payload: FinalizeOrderPayload;
    patientId?: number;
}
