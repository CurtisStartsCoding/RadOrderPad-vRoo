import { Order } from '../models';
// ValidationResult is imported through ValidationRequestResponse
import { FinalizeOrderPayload } from './order/finalize/types';
import { PatientInfo, ValidationRequestResponse } from './order/validation/types';
import { handleValidationRequest } from './order/validation';
import { handleFinalizeOrder } from './order/finalize';
import { getOrderById } from './order/get-order';

/**
 * Service for handling order-related operations
 */
export class OrderService {
  /**
   * Handle validation request for an order
   */
  static async handleValidationRequest(
    dictationText: string,
    patientInfo: PatientInfo | undefined,
    userId: number,
    orgId: number,
    orderId?: number,
    isOverrideValidation: boolean = false,
    radiologyOrganizationId?: number
  ): Promise<ValidationRequestResponse> {
    return handleValidationRequest(
      dictationText,
      patientInfo,
      userId,
      orgId,
      orderId,
      isOverrideValidation,
      radiologyOrganizationId
    );
  }
  
  /**
   * Handle finalization of an order
   */
  static async handleFinalizeOrder(
    orderId: number,
    payload: FinalizeOrderPayload,
    userId: number
  ): Promise<{ success: boolean; orderId: number; message: string }> {
    return handleFinalizeOrder(orderId, payload, userId);
  }
  
  /**
   * Get order details by ID
   */
  static async getOrderById(orderId: number, userId: number): Promise<Order> {
    return getOrderById(orderId, userId);
  }
}

export default OrderService;