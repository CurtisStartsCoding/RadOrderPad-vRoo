import Stripe from 'stripe';
import { getMainDbClient } from '../../../../config/db';
import { generalNotifications } from '../../../../services/notification/services';

/**
 * Handle customer.subscription.deleted event
 * This is triggered when a subscription is canceled
 */
export async function handleSubscriptionDeleted(event: Stripe.Event): Promise<void> {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;
  
  if (!customerId) {
    throw new Error('Missing customer ID in subscription');
  }
  
  // Get the organization by Stripe customer ID
  const client = await getMainDbClient();
  
  try {
    await client.query('BEGIN');
    
    // Find the organization by Stripe customer ID
    const orgResult = await client.query(
      `SELECT id, name, type, status 
       FROM organizations 
       WHERE billing_id = $1`,
      [customerId]
    );
    
    if (orgResult.rowCount === 0) {
      throw new Error(`Organization with Stripe customer ID ${customerId} not found`);
    }
    
    const organization = orgResult.rows[0];
    const orgId = organization.id;
    const orgName = organization.name;
    const currentStatus = organization.status;
    
    // Log the billing event
    await client.query(
      `INSERT INTO billing_events 
       (organization_id, event_type, stripe_event_id, description) 
       VALUES ($1, $2, $3, $4)`,
      [
        orgId,
        'subscription_deleted',
        event.id,
        `Subscription canceled: ${subscription.id}`
      ]
    );
    
    // If the organization is not already in purgatory, put it in purgatory
    if (currentStatus !== 'purgatory') {
      // 1. Update organization status
      await client.query(
        `UPDATE organizations 
         SET status = 'purgatory' 
         WHERE id = $1`,
        [orgId]
      );
      
      // 2. Create purgatory event
      await client.query(
        `INSERT INTO purgatory_events 
         (organization_id, reason, triggered_by) 
         VALUES ($1, $2, $3)`,
        [
          orgId,
          'subscription_canceled',
          'stripe_webhook'
        ]
      );
      
      // 3. Update organization relationships
      await client.query(
        `UPDATE organization_relationships 
         SET status = 'purgatory' 
         WHERE (organization_id = $1 OR related_organization_id = $1) 
         AND status = 'active'`,
        [orgId]
      );
      
      // 4. Get admin users for notifications
      const adminUsersResult = await client.query(
        `SELECT email, first_name, last_name 
         FROM users 
         WHERE organization_id = $1 
         AND role IN ('admin_referring', 'admin_radiology')`,
        [orgId]
      );
      
      // 5. Send notifications to all admin users
      for (const admin of adminUsersResult.rows) {
        await generalNotifications.sendNotificationEmail(
          admin.email,
          'IMPORTANT: Subscription Canceled',
          `Dear ${admin.first_name} ${admin.last_name},\n\n` +
          `We regret to inform you that your organization's subscription (${orgName}) ` +
          `has been canceled, and your account has been placed on hold.\n\n` +
          `While your account is on hold, you will have limited access to RadOrderPad features. ` +
          `To restore full access, please renew your subscription in your account settings ` +
          `or contact our support team for assistance.\n\n` +
          `Best regards,\n` +
          `The RadOrderPad Team`
        );
      }
      
      console.log(`Organization ${orgId} placed in purgatory mode due to subscription cancellation`);
    }
    
    await client.query('COMMIT');
    
    console.log(`Successfully processed subscription deletion for org ${orgId}`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing subscription deletion:', error);
    throw error;
  } finally {
    client.release();
  }
}