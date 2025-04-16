import { queryMainDb } from '../../../config/db';
import stripeService from './stripe.service';
import config from '../../../config/config';
import { createCreditCheckoutSession } from './create-credit-checkout-session';

/**
 * Facade function for creating a credit checkout session
 * This function is used by the BillingService class
 * 
 * @param orgId Organization ID
 * @param priceId Optional Stripe price ID
 * @returns Promise<string> Checkout session ID
 */
export async function createCreditCheckoutSessionFacade(
  orgId: number,
  priceId?: string
): Promise<string> {
  // Delegate to the standalone function
  return createCreditCheckoutSession(orgId, priceId);
}