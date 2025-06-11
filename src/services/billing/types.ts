/**
 * Billing service types
 */

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
 * Credit action types
 */
export enum CreditActionType {
  ORDER_SUBMITTED = 'order_submitted',
  ORDER_RECEIVED = 'order_received',  // For radiology orgs when they receive an order
  MANUAL_ADJUSTMENT = 'manual_adjustment',
  SUBSCRIPTION_RENEWAL = 'subscription_renewal',
  CREDIT_PURCHASE = 'credit_purchase'
}

/**
 * Parameters for creating a Stripe customer
 */
export interface CreateStripeCustomerParams {
  organizationId: number;
  name: string;
  email: string;
}

/**
 * Response for billing overview
 */
export interface BillingOverviewResponse {
  organizationStatus: string;
  subscriptionTier: string | null;
  currentCreditBalance: number;
  stripeSubscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  billingInterval: 'month' | 'year' | null;
  cancelAtPeriodEnd: boolean | null;
  stripeCustomerPortalUrl?: string;
}