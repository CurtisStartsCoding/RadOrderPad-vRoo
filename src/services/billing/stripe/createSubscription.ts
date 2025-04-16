import Stripe from 'stripe';
import config from '../../../config/config';
import { getMainDbClient } from '../../../config/db';

// Initialize Stripe client
const stripe = new Stripe(config.stripe.secretKey as string, {
  apiVersion: config.stripe.apiVersion as Stripe.LatestApiVersion,
});

/**
 * Create a Stripe subscription for an organization
 * 
 * @param orgId Organization ID
 * @param priceId Stripe price ID for the subscription tier
 * @returns Promise with subscription details including client secret for payment confirmation
 * @throws Error if the organization doesn't have a billing_id or if there's an issue creating the subscription
 */
export async function createSubscription(
  orgId: number,
  priceId: string
): Promise<{
  subscriptionId: string;
  clientSecret: string | null;
  status: string;
}> {
  // Get a database client
  const client = await getMainDbClient();
  
  try {
    // Get the organization's Stripe customer ID (billing_id)
    const orgResult = await client.query(
      'SELECT billing_id, name FROM organizations WHERE id = $1',
      [orgId]
    );
    
    if (orgResult.rows.length === 0) {
      throw new Error(`Organization with ID ${orgId} not found`);
    }
    
    const { billing_id: customerId, name: orgName } = orgResult.rows[0];
    
    if (!customerId) {
      throw new Error(`Organization ${orgId} (${orgName}) does not have a billing ID. Please set up payment method first.`);
    }
    
    // Create the subscription with payment_behavior set to 'default_incomplete'
    // This allows for payment confirmation if required (e.g., 3D Secure)
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        organization_id: orgId.toString(),
        organization_name: orgName
      }
    });
    
    // Get the client secret from the payment intent if available
    // Get the client secret from the payment intent if available
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    let clientSecret = null;
    
    // Check if the invoice has a payment intent
    if (invoice && typeof invoice === 'object' && 'payment_intent' in invoice) {
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
      clientSecret = paymentIntent?.client_secret || null;
    }
    
    // Log the subscription creation in billing_events
    await client.query(
      `INSERT INTO billing_events 
       (organization_id, event_type, stripe_event_id, description) 
       VALUES ($1, $2, $3, $4)`,
      [
        orgId,
        'subscription_created',
        subscription.id,
        `Created subscription for tier ${priceId}`
      ]
    );
    
    // Return the subscription details
    return {
      subscriptionId: subscription.id,
      clientSecret,
      status: subscription.status
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    
    // Re-throw with a more user-friendly message
    if (error instanceof Error) {
      throw new Error(`Failed to create subscription: ${error.message}`);
    } else {
      throw new Error('Failed to create subscription due to an unknown error');
    }
  } finally {
    // Release the client back to the pool
    client.release();
  }
}