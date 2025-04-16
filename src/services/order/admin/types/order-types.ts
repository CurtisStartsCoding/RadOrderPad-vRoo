import { OrderStatus } from '../../../../models';

/**
 * Order data with patient ID and organization ID
 */
export interface OrderData {
  id: number;
  status: string;
  patient_id: number;
  referring_organization_id: number;
}

/**
 * Result of sending order to radiology
 */
export interface SendToRadiologyResult {
  success: boolean;
  orderId: number;
  message: string;
}