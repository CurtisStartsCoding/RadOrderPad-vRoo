import { ValidationResult } from '../../models';
/**
 * Handle validation request for an order
 */
export declare function handleValidationRequest(dictationText: string, patientInfo: any, userId: number, orgId: number, orderId?: number, isOverrideValidation?: boolean, radiologyOrganizationId?: number): Promise<{
    success: boolean;
    orderId: number;
    validationResult: ValidationResult;
}>;
