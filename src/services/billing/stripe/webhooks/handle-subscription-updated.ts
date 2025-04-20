import Stripe from 'stripe';
import { getMainDbClient } from '../../../../config/db';
import { generalNotifications } from '../../../../services/notification/services';
import { mapPriceIdToTier } from '../../../../utils/billing/map-price-id-to-tier';
import { replenishCreditsForTier } from '../../credit/replenish-credits-for-tier';
import logger from '../../../../utils/logger';
import {
  StripeWebhookError,
  OrganizationNotFoundError,
  DatabaseOperationError
} from './errors';
import { PoolClient } from 'pg';

/**
 * Organization interface
 */
interface Organization {
  id: number;
  name: string;
  type: string;
  status: string;
  subscription_tier: string | null;
  credit_balance: number;
}

/**
 * Handle customer.subscription.updated event
 * This is triggered when a subscription is updated (e.g., tier change, status change)
 */
export async function handleSubscriptionUpdated(event: Stripe.Event): Promise<void> {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;
  
  if (!customerId) {
    throw new StripeWebhookError('Missing customer ID in subscription');
  }
  
  // Get the organization by Stripe customer ID
  const client = await getMainDbClient();
  
  try {
    await client.query('BEGIN');
    
    // Check if this event has already been processed (idempotency)
    const eventResult = await client.query(
      `SELECT id FROM billing_events WHERE stripe_event_id = $1`,
      [event.id]
    );
    
    if (eventResult.rowCount && eventResult.rowCount > 0) {
      logger.info(`Stripe event ${event.id} has already been processed. Skipping.`);
      await client.query('COMMIT');
      return;
    }
    
    // Find the organization
    const organization = await findOrganizationByCustomerId(client, customerId);
    const orgId = organization.id;
    const currentStatus = organization.status;
    
    // Get the subscription status and items
    const subscriptionStatus = subscription.status;
    const subscriptionItems = subscription.items.data;
    
    // Handle tier changes if needed
    if (subscriptionItems && subscriptionItems.length > 0) {
      await handleTierChanges(
        client, 
        subscription, 
        event.id, 
        organization, 
        subscriptionItems
      );
    }
    
    // Handle subscription status changes
    if (subscriptionStatus === 'past_due' && currentStatus === 'active') {
      await handlePastDueStatus(client, event.id, organization);
    } else if (subscriptionStatus === 'active' && currentStatus === 'purgatory') {
      await handleReactivation(client, event.id, organization);
    }
    
    await client.query('COMMIT');
    
    logger.info(`Successfully processed subscription update for org ${orgId}`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error processing subscription update:', error);
    
    handleError(error, 'subscription update');
  } finally {
    client.release();
  }
}

/**
 * Find organization by Stripe customer ID
 */
async function findOrganizationByCustomerId(
  client: PoolClient,
  customerId: string
): Promise<Organization> {
  const orgResult = await client.query(
    `SELECT id, name, type, status, subscription_tier, credit_balance 
     FROM organizations 
     WHERE billing_id = $1`,
    [customerId]
  );
  
  if (orgResult.rowCount === 0) {
    throw new OrganizationNotFoundError(customerId);
  }
  
  return orgResult.rows[0];
}

/**
 * Handle tier changes in subscription
 */
async function handleTierChanges(
  client: PoolClient,
  subscription: Stripe.Subscription,
  eventId: string,
  organization: Organization,
  subscriptionItems: Stripe.SubscriptionItem[]
): Promise<void> {
  const orgId = organization.id;
  const orgType = organization.type;
  const currentTier = organization.subscription_tier;
  
  const priceId = subscriptionItems[0].price.id;
  const newTier = mapPriceIdToTier(priceId);
  
  if (newTier && newTier !== currentTier) {
    // Update the organization's subscription tier
    await client.query(
      `UPDATE organizations 
       SET subscription_tier = $1 
       WHERE id = $2`,
      [newTier, orgId]
    );
    
    // Log the tier change
    await client.query(
      `INSERT INTO billing_events 
       (organization_id, event_type, stripe_event_id, description) 
       VALUES ($1, $2, $3, $4)`,
      [
        orgId,
        'subscription_tier_change',
        eventId,
        `Subscription tier changed from ${currentTier || 'none'} to ${newTier}`
      ]
    );
    
    // If this is a referring practice, replenish credits based on the new tier
    if (orgType === 'referring_practice' && newTier) {
      await replenishCreditsForTier(orgId, newTier, client, eventId);
    }
    
    // Notify organization admins about the tier change
    await notifyAdminsAboutTierChange(client, organization, currentTier, newTier);
  }
}

/**
 * Notify admins about tier change
 */
async function notifyAdminsAboutTierChange(
  client: PoolClient,
  organization: Organization,
  currentTier: string | null,
  newTier: string
): Promise<void> {
  const adminUsersResult = await client.query(
    `SELECT email, first_name, last_name 
     FROM users 
     WHERE organization_id = $1 
     AND role IN ('admin_referring', 'admin_radiology')`,
    [organization.id]
  );
  
  for (const admin of adminUsersResult.rows) {
    await generalNotifications.sendNotificationEmail(
      admin.email,
      'Your subscription tier has changed',
      `Dear ${admin.first_name} ${admin.last_name},\n\n` +
      `Your organization's subscription tier has been updated from ${currentTier || 'none'} to ${newTier}. ` +
      `This change may affect your available features and credit allocation.\n\n` +
      `If you have any questions about this change, please contact our support team.\n\n` +
      `Best regards,\n` +
      `The RadOrderPad Team`
    );
  }
}

/**
 * Handle past due status
 */
async function handlePastDueStatus(
  client: PoolClient,
  eventId: string,
  organization: Organization
): Promise<void> {
  const orgId = organization.id;
  
  // Put organization in purgatory if subscription is past due
  await client.query(
    `UPDATE organizations 
     SET status = 'purgatory' 
     WHERE id = $1`,
    [orgId]
  );
  
  // Create purgatory event
  await client.query(
    `INSERT INTO purgatory_events 
     (organization_id, reason, triggered_by) 
     VALUES ($1, $2, $3)`,
    [
      orgId,
      'payment_past_due',
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
  
  // Log the status change
  await client.query(
    `INSERT INTO billing_events 
     (organization_id, event_type, stripe_event_id, description) 
     VALUES ($1, $2, $3, $4)`,
    [
      orgId,
      'subscription_past_due',
      eventId,
      `Subscription status changed to past_due, organization placed in purgatory`
    ]
  );
  
  // Notify organization admins
  await notifyAdminsAboutPastDue(client, organization);
}

/**
 * Notify admins about past due status
 */
async function notifyAdminsAboutPastDue(
  client: PoolClient,
  organization: Organization
): Promise<void> {
  const adminUsersResult = await client.query(
    `SELECT email, first_name, last_name 
     FROM users 
     WHERE organization_id = $1 
     AND role IN ('admin_referring', 'admin_radiology')`,
    [organization.id]
  );
  
  for (const admin of adminUsersResult.rows) {
    await generalNotifications.sendNotificationEmail(
      admin.email,
      'IMPORTANT: Payment Past Due',
      `Dear ${admin.first_name} ${admin.last_name},\n\n` +
      `We regret to inform you that your organization's subscription payment is past due, ` +
      `and your account has been placed on hold.\n\n` +
      `While your account is on hold, you will have limited access to RadOrderPad features. ` +
      `To restore full access, please update your payment information in your account settings ` +
      `or contact our support team for assistance.\n\n` +
      `Best regards,\n` +
      `The RadOrderPad Team`
    );
  }
}

/**
 * Handle reactivation
 */
async function handleReactivation(
  client: PoolClient,
  eventId: string,
  organization: Organization
): Promise<void> {
  const orgId = organization.id;
  
  // Reactivate organization if subscription is active again
  await client.query(
    `UPDATE organizations 
     SET status = 'active' 
     WHERE id = $1`,
    [orgId]
  );
  
  // Update purgatory events
  await client.query(
    `UPDATE purgatory_events
     SET status = 'resolved', resolved_at = NOW()
     WHERE organization_id = $1 AND status != 'resolved'`,
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
  
  // Log the status change
  await client.query(
    `INSERT INTO billing_events 
     (organization_id, event_type, stripe_event_id, description) 
     VALUES ($1, $2, $3, $4)`,
    [
      orgId,
      'subscription_reactivated',
      eventId,
      `Subscription status changed to active, organization reactivated`
    ]
  );
  
  // Notify organization admins
  await notifyAdminsAboutReactivation(client, organization);
}

/**
 * Notify admins about reactivation
 */
async function notifyAdminsAboutReactivation(
  client: PoolClient,
  organization: Organization
): Promise<void> {
  const adminUsersResult = await client.query(
    `SELECT email, first_name, last_name 
     FROM users 
     WHERE organization_id = $1 
     AND role IN ('admin_referring', 'admin_radiology')`,
    [organization.id]
  );
  
  for (const admin of adminUsersResult.rows) {
    await generalNotifications.sendNotificationEmail(
      admin.email,
      'Your account has been reactivated',
      `Dear ${admin.first_name} ${admin.last_name},\n\n` +
      `We're pleased to inform you that your organization's account has been reactivated ` +
      `following the successful payment of your outstanding invoice. ` +
      `Your organization now has full access to all RadOrderPad features.\n\n` +
      `Thank you for your prompt attention to this matter.\n\n` +
      `Best regards,\n` +
      `The RadOrderPad Team`
    );
  }
}

/**
 * Handle errors
 */
function handleError(error: unknown, operation: string): never {
  if (error instanceof StripeWebhookError) {
    throw error;
  } else if (error instanceof OrganizationNotFoundError) {
    throw error;
  } else if (error instanceof Error) {
    throw new DatabaseOperationError(operation, error);
  } else {
    throw new Error(`Unknown error during ${operation}: ${String(error)}`);
  }
}