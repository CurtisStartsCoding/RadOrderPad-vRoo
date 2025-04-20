import { getMainDbClient } from '../../../../../config/db';
import { mapPriceIdToTier } from './map-price-id-to-tier';
import { replenishCreditsForTier } from '../../../../../services/billing/credit-management';
import { handlePurgatoryTransition, handleReactivationTransition } from './status-transitions';
import { sendTierChangeNotifications } from './notifications';
import { StripeWebhookError, OrganizationNotFoundError, DatabaseOperationError } from '../errors';
/**
 * Handle customer.subscription.updated event
 * This is triggered when a subscription is updated (e.g., plan change, status change)
 */
export async function handleSubscriptionUpdated(event) {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    if (!customerId) {
        throw new Error('Missing customer ID in subscription');
    }
    // Get the organization by Stripe customer ID
    const client = await getMainDbClient();
    try {
        await client.query('BEGIN');
        // Find the organization by Stripe customer ID
        const orgResult = await client.query(`SELECT id, name, type, status, subscription_tier 
       FROM organizations 
       WHERE billing_id = $1`, [customerId]);
        if (orgResult.rowCount === 0) {
            throw new OrganizationNotFoundError(customerId);
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
        }
        else if (subscriptionStatus === 'past_due' && currentStatus === 'active') {
            // Subscription is past due but org is active - consider purgatory
            // In a real implementation, you might want more complex logic here
            // For now, we'll leave it active and let the invoice.payment_failed handler
            // determine when to put the organization in purgatory
        }
        else if (subscriptionStatus === 'canceled' && currentStatus === 'active') {
            // Subscription is canceled but org is active - put in purgatory
            newStatus = 'purgatory';
            statusChanged = true;
        }
        // Update organization if tier or status changed
        if (tierChanged || statusChanged) {
            await client.query(`UPDATE organizations
         SET subscription_tier = $1, status = $2
         WHERE id = $3`, [newTier, newStatus, orgId]);
            // Replenish credits if tier changed or status changed to active
            if (tierChanged || (statusChanged && newStatus === 'active')) {
                // Only replenish credits for referring organizations (they use credits)
                if (organization.type === 'referring_practice') {
                    await replenishCreditsForTier(orgId, newTier, client, event.id);
                }
            }
            // Log the billing event
            await client.query(`INSERT INTO billing_events 
         (organization_id, event_type, stripe_event_id, description) 
         VALUES ($1, $2, $3, $4)`, [
                orgId,
                'subscription_updated',
                event.id,
                `Subscription updated: status=${subscriptionStatus}, tier=${newTier}`
            ]);
            // Handle status transitions
            if (statusChanged && newStatus === 'purgatory') {
                // Handle transition to purgatory
                await handlePurgatoryTransition(client, orgId, orgName);
            }
            else if (statusChanged && newStatus === 'active') {
                // Handle transition to active (reactivation)
                await handleReactivationTransition(client, orgId, orgName);
            }
            // Handle tier change notifications
            if (tierChanged) {
                await sendTierChangeNotifications(client, orgId, orgName, currentTier, newTier);
            }
        }
        await client.query('COMMIT');
        console.log(`Successfully processed subscription update for org ${orgId}`);
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error processing subscription update:', error);
        // Rethrow as a more specific error if possible
        if (error instanceof StripeWebhookError) {
            throw error;
        }
        else if (error instanceof Error) {
            throw new DatabaseOperationError('subscription update', error);
        }
        else {
            throw new Error(`Unknown error during subscription update: ${String(error)}`);
        }
    }
    finally {
        client.release();
    }
}
//# sourceMappingURL=handle-subscription-updated.js.map