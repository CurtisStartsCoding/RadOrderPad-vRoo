import { ValidationRequestResponse, PatientInfo } from './types';
/**
 * Handle validation request for an order
 *
 * @param dictationText - The dictation text to validate
 * @param patientInfo - Information about the patient
 * @param userId - The ID of the user requesting validation
 * @param orgId - The ID of the organization
 * @param orderId - Optional ID of an existing order
 * @param isOverrideValidation - Whether this is an override validation
 * @param radiologyOrganizationId - Optional ID of the radiology organization
 * @returns Object containing success status, order ID, and validation result
 */
export declare function handleValidationRequest(dictationText: string, patientInfo: PatientInfo, userId: number, orgId: number, orderId?: number, isOverrideValidation?: boolean, radiologyOrganizationId?: number): Promise<ValidationRequestResponse>;
