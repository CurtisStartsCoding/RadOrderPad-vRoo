/**
 * Stripe webhook handler for 'customer.subscription.updated' events
 * 
 * This handler processes subscription updates, updating organization tier,
 * status, and logging the billing event.
 */

import { Stripe } from 'stripe';
import { getMainDbClient, queryMainDb } from '../../../../config/db';
import { mapPriceIdToTier } from '../../../../utils/billing/map-price-id-to-tier';
import logger from '../../../../utils/logger';

/**
 * Handles the 'customer.subscription.updated' Stripe webhook event
 * 
 * @param event - The Stripe event object
 * @returns Object with success status and message
 */
export async function handleSubscriptionUpdated(event: Stripe.Event): Promise<{ success: boolean; message: string }> {
  // Cast the event data to the appropriate type
  const subscription = event.data.object as any; // Using any due to type inconsistencies
  
  // Basic idempotency check - if we've already processed this event, skip it
  const existingEvent = await queryMainDb(
    'SELECT id FROM billing_events WHERE stripe_event_id = $1',
    [event.id]
  );
  
  if (existingEvent.rowCount && existingEvent.rowCount > 0) {
    return { 
      success: true, 
      message: `Subscription update event ${event.id} already processed` 
    };
  }
  
  // Get the customer ID from the subscription
  const customerId = subscription.customer as string;
  if (!customerId) {
    return { 
      success: false, 
      message: 'Subscription does not have a customer ID' 
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
  
  // Get the subscription status and current price ID
  const subscriptionStatus = subscription.status;
  const priceId = subscription.items?.data?.[0]?.price?.id;
  
  // Map the price ID to a subscription tier
  const newTier = priceId ? mapPriceIdToTier(priceId) : null;
  
  // Start a transaction for database operations
  const client = await getMainDbClient();
  try {
    await client.query('BEGIN');
    
    // Update organization status based on subscription status
    let newStatus = organization.status;
    let statusChanged = false;
    
    if (subscriptionStatus === 'active' && organization.status === 'purgatory') {
      // If subscription is active but org is in purgatory, reactivate
      newStatus = 'active';
      statusChanged = true;
    } else if (subscriptionStatus === 'past_due' && organization.status === 'active') {
      // If subscription is past due but org is active, put in purgatory
      newStatus = 'purgatory';
      statusChanged = true;
    } else if (subscriptionStatus === 'canceled' && organization.status !== 'terminated') {
      // If subscription is canceled, put in purgatory (deletion handled by separate handler)
      newStatus = 'purgatory';
      statusChanged = true;
    }
    
    // Update organization tier and status if needed
    if (newTier !== null || statusChanged) {
      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;
      
      if (newTier !== null) {
        updateFields.push(`subscription_tier = $${paramIndex}`);
        updateValues.push(newTier);
        paramIndex++;
      }
      
      if (statusChanged) {
        updateFields.push(`status = $${paramIndex}`);
        updateValues.push(newStatus);
        paramIndex++;
      }
      
      updateFields.push(`updated_at = NOW()`);
      
      // Add the organization ID as the last parameter
      updateValues.push(organizationId);
      
      const updateQuery = `
        UPDATE organizations 
        SET ${updateFields.join(', ')} 
        WHERE id = $${paramIndex}
      `;
      
      await client.query(updateQuery, updateValues);
      
      // If status changed to purgatory, log a purgatory event
      if (newStatus === 'purgatory' && statusChanged) {
        await client.query(
          `INSERT INTO purgatory_events 
           (organization_id, reason, triggered_by, status, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [
            organizationId,
            'subscription_past_due',
            'stripe_webhook',
            'active'
          ]
        );
        
        // Update organization relationships to purgatory
        await client.query(
          `UPDATE organization_relationships 
           SET status = 'purgatory', updated_at = NOW() 
           WHERE (organization_id = $1 OR related_organization_id = $1) 
           AND status = 'active'`,
          [organizationId]
        );
      }
      
      // If status changed to active from purgatory, resolve purgatory events
      if (newStatus === 'active' && organization.status === 'purgatory') {
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
    }
    
    // Log the billing event
    await client.query(
      `INSERT INTO billing_events 
       (organization_id, event_type, stripe_event_id, description, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [
        organizationId,
        'subscription_updated',
        event.id,
        `Subscription updated to ${newTier || organization.subscription_tier} (${subscriptionStatus})`
      ]
    );
    
    // Commit the transaction
    await client.query('COMMIT');
    
    return { 
      success: true, 
      message: `Successfully processed subscription update for organization ${organizationId}` 
    };
  } catch (error) {
    // Rollback the transaction on error
    await client.query('ROLLBACK');
    logger.error('Error handling customer.subscription.updated event:', {
      error,
      customerId,
      subscriptionId: subscription.id,
      subscriptionStatus
    });
    
    return {
      success: false,
      message: `Error processing subscription update: ${error instanceof Error ? error.message : String(error)}`
    };
  } finally {
    // Release the client back to the pool
    client.release();
  }
}