import Stripe from 'stripe';
import config from '../../../config/config';
import logger from '../../../utils/logger';

/**
 * Create a checkout session for purchasing credit bundles
 * This is an internal function used by the StripeService facade
 * 
 * @param stripe Stripe instance
 * @param customerId Stripe customer ID
 * @param priceId Stripe price ID
 * @param metadata Additional metadata to store with the session
 * @param successUrl URL to redirect to on successful payment
 * @param cancelUrl URL to redirect to on canceled payment
 * @returns Promise<Stripe.Checkout.Session> The created checkout session
 */
export async function createCheckoutSessionInternal(
  stripe: Stripe,
  customerId: string,
  priceId: string,
  metadata: Record<string, string>,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata
    });

    return session;
  } catch (error) {
    logger.error('Error creating checkout session:', {
      error,
      customerId,
      priceId,
      metadata
    });
    throw new Error(`Failed to create checkout session: ${error instanceof Error ? error.message : String(error)}`);
  }
}