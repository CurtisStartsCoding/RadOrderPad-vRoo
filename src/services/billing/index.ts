import { burnCredit, hasCredits } from './credit';
import { getCreditBalance } from './get-credit-balance.service';
import { getCreditUsageHistory } from './get-credit-usage-history.service';
import { getBillingOverview } from './get-billing-overview.service';
import { createSubscription } from './stripe';
import { InsufficientCreditsError } from './errors';
import { BurnCreditParams, CreateStripeCustomerParams, CreditActionType, BillingOverviewResponse } from './types';
import Stripe from 'stripe';
import enhancedLogger from '../../utils/enhanced-logger';
import {
  verifyWebhookSignature,
  handleCheckoutSessionCompleted,
  handleInvoicePaymentSucceeded,
  handleInvoicePaymentFailed,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted
} from './stripe/webhooks';
// Post-paid billing has been removed - using dual credit system instead

/**
 * BillingService provides methods for managing billing-related operations
 */
class BillingService {
  /**
   * Record credit usage for a validation action
   * Decrements the organization's credit balance and logs the usage
   * 
   * @param params Parameters for burning a credit
   * @returns Promise<boolean> True if successful
   * @throws InsufficientCreditsError if the organization has insufficient credits
   */
  static async burnCredit(params: BurnCreditParams): Promise<boolean> {
    const { organizationId, userId, orderId, actionType } = params;
    return burnCredit(organizationId, userId, orderId, actionType);
  }

  /**
   * Check if an organization has sufficient credits
   * 
   * @param organizationId Organization ID
   * @returns Promise<boolean> True if the organization has credits, false otherwise
   * @throws Error if the organization is not found or there's a database error
   */
  static async hasCredits(organizationId: number): Promise<boolean> {
    return hasCredits(organizationId);
  }

  /**
   * Get the credit balance for an organization
   *
   * @param orgId Organization ID
   * @returns Promise with the credit balance or null if organization not found
   */
  static async getCreditBalance(orgId: number): Promise<{ creditBalance: number } | null> {
    return getCreditBalance(orgId);
  }

  /**
   * Get billing overview for an organization
   *
   * @param orgId Organization ID
   * @returns Promise with billing overview or null if organization not found
   */
  static async getBillingOverview(orgId: number): Promise<BillingOverviewResponse | null> {
    return getBillingOverview(orgId);
  }

  /**
   * Get credit usage history for an organization
   *
   * @param orgId Organization ID
   * @param options Pagination, sorting, and filtering options
   * @returns Promise with credit usage logs and pagination info
   */
  static async getCreditUsageHistory(
    orgId: number,
    options: {
      page: number;
      limit: number;
      sortBy?: string;
      sortOrder?: string;
      actionType?: string;
      dateStart?: string;
      dateEnd?: string;
    }
  ): Promise<{
    usageLogs: Array<{
      id: number;
      userId: number;
      userName: string;
      orderId: number;
      tokensBurned: number;
      actionType: string;
      createdAt: string;
    }>;
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  }> {
    return getCreditUsageHistory(orgId, options);
  }

  /**
   * Create a subscription for an organization
   *
   * @param orgId Organization ID
   * @param priceId Stripe price ID for the subscription tier
   * @returns Promise with subscription details including client secret for payment confirmation
   * @throws Error if the organization doesn't have a billing_id or if there's an issue creating the subscription
   */
  static async createSubscription(
    orgId: number,
    priceId: string
  ): Promise<{
    subscriptionId: string;
    clientSecret: string | null;
    status: string;
  }> {
    return createSubscription(orgId, priceId);
  }

  /**
   * Verify the Stripe webhook signature
   * @param payload The raw request payload
   * @param signature The Stripe signature from the request headers
   * @returns The verified Stripe event
   */
  static verifyWebhookSignature(payload: Record<string, unknown>, signature: string): Stripe.Event {
    return verifyWebhookSignature(payload, signature);
  }

  /**
   * Handle checkout.session.completed webhook event
   * @param event The Stripe event
   */
  static async handleCheckoutSessionCompleted(event: Stripe.Event): Promise<{ success: boolean; message: string }> {
    return handleCheckoutSessionCompleted(event);
  }

  /**
   * Handle invoice.payment_succeeded webhook event
   * @param event The Stripe event
   */
  static async handleInvoicePaymentSucceeded(event: Stripe.Event): Promise<{ success: boolean; message: string }> {
    return handleInvoicePaymentSucceeded(event);
  }

  /**
   * Handle invoice.payment_failed webhook event
   * @param event The Stripe event
   */
  static async handleInvoicePaymentFailed(event: Stripe.Event): Promise<{ success: boolean; message: string }> {
    return handleInvoicePaymentFailed(event);
  }

  /**
   * Handle customer.subscription.updated webhook event
   * @param event The Stripe event
   */
  static async handleSubscriptionUpdated(event: Stripe.Event): Promise<{ success: boolean; message: string }> {
    return handleSubscriptionUpdated(event);
  }

  /**
   * Handle customer.subscription.deleted webhook event
   * @param event The Stripe event
   */
  static async handleSubscriptionDeleted(event: Stripe.Event): Promise<{ success: boolean; message: string }> {
    return handleSubscriptionDeleted(event);
  }

  /**
   * Create a Stripe customer for an organization
   * @param params Parameters for creating a Stripe customer
   * @returns The Stripe customer ID
   */
  static async createStripeCustomerForOrg(_params: CreateStripeCustomerParams): Promise<string> {
    // This is a placeholder implementation
    enhancedLogger.warn('Using placeholder implementation of createStripeCustomerForOrg');
    return `cus_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Create a checkout session for purchasing credit bundles
   *
   * @param orgId Organization ID
   * @param priceId Optional Stripe price ID (uses default from config if not provided)
   * @returns Promise<string> Checkout session ID
   * @throws Error if the organization doesn't have a billing_id or if there's an issue creating the checkout session
   */
  static async createCreditCheckoutSession(
    _orgId: number,
    _priceId?: string
  ): Promise<string> {
    // Temporary implementation until the actual implementation is restored
    enhancedLogger.warn('Using temporary implementation of createCreditCheckoutSession', {
      orgId: _orgId,
      priceId: _priceId
    });
    
    // Create a mock session ID
    const sessionId = `mock_cs_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    return sessionId;
  }

  // Post-paid billing method removed - now using dual credit system
}

// Export the BillingService class as the default export
export default BillingService;

// Export types and errors for external use
export {
  InsufficientCreditsError,
  BurnCreditParams,
  CreateStripeCustomerParams,
  CreditActionType,
  Stripe
};