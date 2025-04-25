/**
 * Stripe webhook handler for 'customer.subscription.deleted' events
 * 
 * This handler processes subscription deletions, updating organization tier to NULL,
 * setting status to 'purgatory', logging events, updating relationships, and
 * triggering notifications.
 */

import { Stripe } from 'stripe';
import { getMainDbClient, queryMainDb } from '../../../../config/db';
import logger from '../../../../utils/logger';

/**
 * Handles the 'customer.subscription.deleted' Stripe webhook event
 * 
 * @param event - The Stripe event object
 * @returns Object with success status and message
 */
export async function handleSubscriptionDeleted(event: Stripe.Event): Promise<{ success: boolean; message: string }> {
  // Cast the event data to the appropriate type
  const subscription = event.data.object as Stripe.Subscription & { customer?: string }; // Using extended type for Stripe inconsistencies
  
  // Basic idempotency check - if we've already processed this event, skip it
  const existingEvent = await queryMainDb(
    'SELECT id FROM billing_events WHERE stripe_event_id = $1',
    [event.id]
  );
  
  if (existingEvent.rowCount && existingEvent.rowCount > 0) {
    return { 
      success: true, 
      message: `Subscription deletion event ${event.id} already processed` 
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
    'SELECT id, name, status, subscription_tier FROM organizations WHERE billing_id = $1',
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
  
  // Start a transaction for database operations
  const client = await getMainDbClient();
  try {
    await client.query('BEGIN');
    
    // 1. Set subscription tier to NULL
    // 2. Set status to 'purgatory'
    await client.query(
      `UPDATE organizations 
       SET subscription_tier = NULL,
           status = 'purgatory',
           updated_at = NOW() 
       WHERE id = $1`,
      [organizationId]
    );
    
    // 3. Log a billing event
    await client.query(
      `INSERT INTO billing_events 
       (organization_id, event_type, stripe_event_id, description, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [
        organizationId,
        'subscription_deleted',
        event.id,
        `Subscription deleted, organization moved to purgatory`
      ]
    );
    
    // 4. Log a purgatory event
    await client.query(
      `INSERT INTO purgatory_events 
       (organization_id, reason, triggered_by, status, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [
        organizationId,
        'subscription_deleted',
        'stripe_webhook',
        'active'
      ]
    );
    
    // 5. Update organization relationships to purgatory
    await client.query(
      `UPDATE organization_relationships 
       SET status = 'purgatory', updated_at = NOW() 
       WHERE (organization_id = $1 OR related_organization_id = $1) 
       AND status = 'active'`,
      [organizationId]
    );
    
    // 6. Get admin users for notification
    const adminUsersResult = await client.query(
      `SELECT id, email, first_name, last_name
       FROM users
       WHERE organization_id = $1
       AND role IN ('admin_referring', 'admin_radiology')`,
      [organizationId]
    );
    
    // Store admin users before committing transaction
    const adminUsers = adminUsersResult.rows || [];
    const adminCount = adminUsersResult.rowCount || 0;
    
    // Commit the transaction
    await client.query('COMMIT');
    
    // 7. Trigger notification (outside transaction)
    // In a real implementation, this would call a notification service
    // For now, we'll just log the notification
    if (adminCount > 0) {
      logger.info(`Subscription deletion notification would be sent to admins`, {
        organizationId,
        organizationName: organization.name,
        adminCount: adminUsers.length
      });
      
      // Example of how notification might be triggered:
      // await notificationService.sendEmail({
      //   to: adminUsers.map(user => user.email),
      //   subject: 'Important: Your subscription has been canceled',
      //   template: 'subscription-canceled',
      //   data: {
      //     organizationName: organization.name,
      //     adminName: adminUsers[0].first_name
      //   }
      // });
    }
    
    return { 
      success: true, 
      message: `Successfully processed subscription deletion for organization ${organizationId}` 
    };
  } catch (error) {
    // Rollback the transaction on error
    await client.query('ROLLBACK');
    logger.error('Error handling customer.subscription.deleted event:', {
      error,
      customerId,
      subscriptionId: subscription.id
    });
    
    return {
      success: false,
      message: `Error processing subscription deletion: ${error instanceof Error ? error.message : String(error)}`
    };
  } finally {
    // Release the client back to the pool
    client.release();
  }
}