/**
 * Stripe webhook handler for 'invoice.payment_succeeded' events
 * 
 * This handler processes successful invoice payments, updating organization status,
 * replenishing credits based on subscription tier, and logging the billing event.
 */

import { Stripe } from 'stripe';
import { getMainDbClient, queryMainDb } from '../../../../config/db';
import { replenishCreditsForTier } from '../../../../utils/billing/replenishCreditsForTier';
import { mapPriceIdToTier } from '../../../../utils/billing/map-price-id-to-tier';

/**
 * Handles the 'invoice.payment_succeeded' Stripe webhook event
 * 
 * @param event - The Stripe event object
 * @returns Object with success status and message
 */
export async function handleInvoicePaymentSucceeded(event: Stripe.Event): Promise<{ success: boolean; message: string }> {
  // Cast the event data to the appropriate type
  const invoice = event.data.object as Stripe.Invoice;
  
  // Basic idempotency check - if we've already processed this event, skip it
  const existingEvent = await queryMainDb(
    'SELECT id FROM billing_events WHERE stripe_event_id = $1',
    [event.id]
  );
  
  if (existingEvent.rowCount && existingEvent.rowCount > 0) {
    return { 
      success: true, 
      message: `Invoice payment event ${event.id} already processed` 
    };
  }
  
  // Get the customer ID from the invoice
  const customerId = invoice.customer as string;
  if (!customerId) {
    return { 
      success: false, 
      message: 'Invoice does not have a customer ID' 
    };
  }
  
  // Look up the organization by Stripe customer ID
  const orgResult = await queryMainDb(
    'SELECT id, status, subscription_tier FROM organizations WHERE billing_id = $1',
    [customerId]
  );
  
  if (orgResult.rowCount === 0) {
    return { 
      success: false, 
      message: `No organization found with billing ID ${customerId}` 
    };
  }
  
  const organization = orgResult.rows[0];
  const organizationId = organization.id;
  
  // Get the subscription ID from the invoice
  // Access subscription ID from the invoice using type assertion
  // This is necessary because the Stripe types might not match the actual API response
  const invoiceAny = invoice as any;
  const subscriptionId = invoiceAny.subscription;
  
  // Start a transaction for database operations
  const client = await getMainDbClient();
  try {
    await client.query('BEGIN');
    
    // Update organization status to 'active' if it was in 'purgatory'
    if (organization.status === 'purgatory') {
      await client.query(
        `UPDATE organizations 
         SET status = 'active', updated_at = NOW() 
         WHERE id = $1`,
        [organizationId]
      );
      
      // Update any purgatory events to 'resolved'
      await client.query(
        `UPDATE purgatory_events 
         SET status = 'resolved', resolved_at = NOW() 
         WHERE organization_id = $1 AND status = 'active'`,
        [organizationId]
      );
      
      // Reactivate organization relationships
      await client.query(
        `UPDATE organization_relationships 
         SET status = 'active', updated_at = NOW() 
         WHERE (organization_id = $1 OR related_organization_id = $1) 
         AND status = 'purgatory'`,
        [organizationId]
      );
    }
    
    // If this is a subscription invoice, replenish credits based on tier
    if (subscriptionId && organization.subscription_tier) {
      // Replenish credits based on the organization's subscription tier
      const newCreditBalance = await replenishCreditsForTier(
        organizationId,
        organization.subscription_tier,
        client
      );
      
      console.log(`Replenished credits for organization ${organizationId} to ${newCreditBalance}`);
    }
    
    // Log the billing event
    await client.query(
      `INSERT INTO billing_events 
       (organization_id, event_type, amount_cents, currency, 
        payment_method_type, stripe_event_id, stripe_invoice_id, description, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [
        organizationId,
        'subscription_payment',
        invoice.amount_paid,
        invoice.currency,
        (invoice as any).payment_method_types?.[0] || 'unknown', // Use first payment method type if available
        event.id,
        invoice.id,
        `Successful payment for invoice ${invoice.number || invoice.id}`,
      ]
    );
    
    // Commit the transaction
    await client.query('COMMIT');
    
    return { 
      success: true, 
      message: `Successfully processed invoice payment for organization ${organizationId}` 
    };
  } catch (error) {
    // Rollback the transaction on error
    await client.query('ROLLBACK');
    console.error('Error handling invoice.payment_succeeded event:', error);
    
    return { 
      success: false, 
      message: `Error processing invoice payment: ${error instanceof Error ? error.message : String(error)}`
    };
  } finally {
    // Release the client back to the pool
    client.release();
  }
}