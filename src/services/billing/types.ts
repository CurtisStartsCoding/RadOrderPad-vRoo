/**
 * Types for the billing service
 */

/**
 * Action types for credit usage
 */
export type CreditActionType = 'order_submitted';

/**
 * Parameters for burning a credit
 */
export interface BurnCreditParams {
  organizationId: number;
  userId: number;
  orderId: number;
  actionType: CreditActionType;
}

/**
 * Parameters for creating a Stripe customer
 */
export interface CreateStripeCustomerParams {
  orgId: number;
  orgName: string;
  orgEmail: string;
}