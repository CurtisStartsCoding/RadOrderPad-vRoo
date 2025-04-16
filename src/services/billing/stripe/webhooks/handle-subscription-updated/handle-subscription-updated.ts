import Stripe from 'stripe';
import { getMainDbClient } from '../../../../../config/db';
import { generalNotifications } from '../../../../../services/notification/services';
import { mapPriceIdToTier } from './map-price-id-to-tier';

/**
 * Handle customer.subscription.updated event
 * This is triggered when a subscription is updated (e.g., plan change, status change)
 */
export async function handleSubscriptionUpdated(event: Stripe.Event): Promise<void> {
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
      `SELECT id, name, type, status, subscription_tier 
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
    const currentTier = organization.subscription_tier;
    
    // Get subscription status and items
    const subscriptionStatus = subscription.status;
    const subscriptionItems = subscription.items?.data || [];
    
    // Determine if there's a tier change by looking at the price ID
    // of the first subscription item (assuming one item per subscription)
    let newTier = currentTier;
    let tierChanged = false;
    
    if (subscriptionItems.length > 0 && subscriptionItems[0].price?.id) {
      const priceId = subscriptionItems[0].price.id;
      newTier = mapPriceIdToTier(priceId);
      tierChanged = newTier !== currentTier;
    }
    
    // Handle subscription status changes
    let statusChanged = false;
    let newStatus = currentStatus;
    
    if (subscriptionStatus === 'active' && currentStatus === 'purgatory') {
      // Subscription is active but org is in purgatory - reactivate
      newStatus = 'active';
      statusChanged = true;
    } else if (subscriptionStatus === 'past_due' && currentStatus === 'active') {
      // Subscription is past due but org is active - consider purgatory
      // In a real implementation, you might want more complex logic here
      // For now, we'll leave it active and let the invoice.payment_failed handler
      // determine when to put the organization in purgatory
    } else if (subscriptionStatus === 'canceled' && currentStatus === 'active') {
      // Subscription is canceled but org is active - put in purgatory
      newStatus = 'purgatory';
      statusChanged = true;
    }
    
    // Update organization if tier or status changed
    if (tierChanged || statusChanged) {
      await client.query(
        `UPDATE organizations 
         SET subscription_tier = $1, status = $2 
         WHERE id = $3`,
        [newTier, newStatus, orgId]
      );
      
      // Log the billing event
      await client.query(
        `INSERT INTO billing_events 
         (organization_id, event_type, stripe_event_id, description) 
         VALUES ($1, $2, $3, $4)`,
        [
          orgId,
          'subscription_updated',
          event.id,
          `Subscription updated: status=${subscriptionStatus}, tier=${newTier}`
        ]
      );
      
      // If status changed to purgatory, create purgatory event and update relationships
      if (statusChanged && newStatus === 'purgatory') {
        // Create purgatory event
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
        
        // Update organization relationships
        await client.query(
          `UPDATE organization_relationships 
           SET status = 'purgatory' 
           WHERE (organization_id = $1 OR related_organization_id = $1) 
           AND status = 'active'`,
          [orgId]
        );
        
        // Notify admins about purgatory status
        const adminUsersResult = await client.query(
          `SELECT email, first_name, last_name 
           FROM users 
           WHERE organization_id = $1 
           AND role IN ('admin_referring', 'admin_radiology')`,
          [orgId]
        );
        
        for (const admin of adminUsersResult.rows) {
          await generalNotifications.sendNotificationEmail(
            admin.email,
            'IMPORTANT: Account Status Change',
            `Dear ${admin.first_name} ${admin.last_name},\n\n` +
            `We regret to inform you that your organization's account (${orgName}) ` +
            `has been placed on hold due to subscription cancellation.\n\n` +
            `While your account is on hold, you will have limited access to RadOrderPad features. ` +
            `To restore full access, please renew your subscription in your account settings ` +
            `or contact our support team for assistance.\n\n` +
            `Best regards,\n` +
            `The RadOrderPad Team`
          );
        }
      } else if (statusChanged && newStatus === 'active') {
        // If status changed to active, update purgatory events and relationships
        
        // Update purgatory events
        await client.query(
          `UPDATE purgatory_events 
           SET status = 'resolved', resolved_at = NOW() 
           WHERE organization_id = $1 AND status = 'active'`,
          [orgId]
        );
        
        // Update organization relationships
        await client.query(
          `UPDATE organization_relationships 
           SET status = 'active' 
           WHERE (organization_id = $1 OR related_organization_id = $1) 
           AND status = 'purgatory'`,
          [orgId]
        );
        
        // Notify admins about reactivation
        const adminUsersResult = await client.query(
          `SELECT email, first_name, last_name 
           FROM users 
           WHERE organization_id = $1 
           AND role IN ('admin_referring', 'admin_radiology')`,
          [orgId]
        );
        
        for (const admin of adminUsersResult.rows) {
          await generalNotifications.sendNotificationEmail(
            admin.email,
            'Account Reactivated',
            `Dear ${admin.first_name} ${admin.last_name},\n\n` +
            `We're pleased to inform you that your organization's account (${orgName}) ` +
            `has been reactivated. You now have full access to all RadOrderPad features.\n\n` +
            `Thank you for your continued partnership.\n\n` +
            `Best regards,\n` +
            `The RadOrderPad Team`
          );
        }
      }
      
      // If tier changed, notify admins
      if (tierChanged) {
        const adminUsersResult = await client.query(
          `SELECT email, first_name, last_name 
           FROM users 
           WHERE organization_id = $1 
           AND role IN ('admin_referring', 'admin_radiology')`,
          [orgId]
        );
        
        for (const admin of adminUsersResult.rows) {
          await generalNotifications.sendNotificationEmail(
            admin.email,
            'Subscription Tier Change',
            `Dear ${admin.first_name} ${admin.last_name},\n\n` +
            `Your organization's subscription tier has been updated from ${currentTier} to ${newTier}.\n\n` +
            `This change may affect your monthly credit allocation and billing amount. ` +
            `Please review your account settings for more details.\n\n` +
            `Best regards,\n` +
            `The RadOrderPad Team`
          );
        }
      }
    }
    
    await client.query('COMMIT');
    
    console.log(`Successfully processed subscription update for org ${orgId}`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing subscription update:', error);
    throw error;
  } finally {
    client.release();
  }
}