import { ValidationResult, Order } from '../models';
import { FinalizeOrderPayload } from './order/finalize/types';
import { PatientInfo } from './order/validation/types';
/**
 * Service for handling order-related operations
 */
export declare class OrderService {
    /**
     * Handle validation request for an order
     */
    static handleValidationRequest(dictationText: string, patientInfo: PatientInfo, userId: number, orgId: number, orderId?: number, isOverrideValidation?: boolean, radiologyOrganizationId?: number): Promise<{
        success: boolean;
        orderId: number;
        validationResult: ValidationResult;
    }>;
    /**
     * Handle finalization of an order
     */
    static handleFinalizeOrder(orderId: number, payload: FinalizeOrderPayload, userId: number): Promise<{
        success: boolean;
        orderId: number;
        message: string;
    }>;
    /**
     * Get order details by ID
     */
    static getOrderById(orderId: number, userId: number): Promise<Order>;
}
export default OrderService;
