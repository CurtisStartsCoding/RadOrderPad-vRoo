"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSubscriptionDeleted = handleSubscriptionDeleted;
const db_1 = require("../../../../config/db");
const services_1 = require("../../../../services/notification/services");
const logger_1 = __importDefault(require("../../../../utils/logger"));
const errors_1 = require("./errors");
/**
 * Handle customer.subscription.deleted event
 * This is triggered when a subscription is canceled
 */
async function handleSubscriptionDeleted(event) {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    if (!customerId) {
        throw new errors_1.StripeWebhookError('Missing customer ID in subscription');
    }
    // Get the organization by Stripe customer ID
    const client = await (0, db_1.getMainDbClient)();
    try {
        await client.query('BEGIN');
        // Check if this event has already been processed (idempotency)
        const eventResult = await client.query(`SELECT id FROM billing_events WHERE stripe_event_id = $1`, [event.id]);
        if (eventResult.rowCount && eventResult.rowCount > 0) {
            logger_1.default.info(`Stripe event ${event.id} has already been processed. Skipping.`);
            await client.query('COMMIT');
            return;
        }
        // Find the organization by Stripe customer ID
        const orgResult = await client.query(`SELECT id, name, type, status
       FROM organizations
       WHERE billing_id = $1`, [customerId]);
        if (orgResult.rowCount === 0) {
            throw new errors_1.OrganizationNotFoundError(customerId);
        }
        const organization = orgResult.rows[0];
        const orgId = organization.id;
        const orgName = organization.name;
        const currentStatus = organization.status;
        // Log the billing event
        await client.query(`INSERT INTO billing_events 
       (organization_id, event_type, stripe_event_id, description) 
       VALUES ($1, $2, $3, $4)`, [
            orgId,
            'subscription_deleted',
            event.id,
            `Subscription canceled: ${subscription.id}`
        ]);
        // If the organization is not already in purgatory, put it in purgatory
        if (currentStatus !== 'purgatory') {
            // 1. Update organization status and set subscription_tier to null
            await client.query(`UPDATE organizations
         SET status = 'purgatory', subscription_tier = NULL
         WHERE id = $1`, [orgId]);
            // 2. Create purgatory event
            await client.query(`INSERT INTO purgatory_events 
         (organization_id, reason, triggered_by) 
         VALUES ($1, $2, $3)`, [
                orgId,
                'subscription_canceled',
                'stripe_webhook'
            ]);
            // 3. Update organization relationships
            await client.query(`UPDATE organization_relationships 
         SET status = 'purgatory' 
         WHERE (organization_id = $1 OR related_organization_id = $1) 
         AND status = 'active'`, [orgId]);
            // 4. Get admin users for notifications
            const adminUsersResult = await client.query(`SELECT email, first_name, last_name 
         FROM users 
         WHERE organization_id = $1 
         AND role IN ('admin_referring', 'admin_radiology')`, [orgId]);
            // 5. Send notifications to all admin users
            for (const admin of adminUsersResult.rows) {
                try {
                    await services_1.generalNotifications.sendNotificationEmail(admin.email, 'IMPORTANT: Subscription Canceled', `Dear ${admin.first_name} ${admin.last_name},\n\n` +
                        `We regret to inform you that your organization's subscription (${orgName}) ` +
                        `has been canceled, and your account has been placed on hold.\n\n` +
                        `While your account is on hold, you will have limited access to RadOrderPad features. ` +
                        `To restore full access, please renew your subscription in your account settings ` +
                        `or contact our support team for assistance.\n\n` +
                        `Best regards,\n` +
                        `The RadOrderPad Team`);
                }
                catch (notificationError) {
                    logger_1.default.error(`Failed to send notification to ${admin.email}:`, notificationError);
                    // Continue processing other admins even if one notification fails
                }
            }
            logger_1.default.info(`Organization ${orgId} placed in purgatory mode due to subscription cancellation`);
        }
        await client.query('COMMIT');
        logger_1.default.info(`Successfully processed subscription deletion for org ${orgId}`);
    }
    catch (error) {
        await client.query('ROLLBACK');
        logger_1.default.error('Error processing subscription deletion:', error);
        handleError(error, 'subscription deletion');
    }
    finally {
        client.release();
    }
}
/**
 * Handle errors
 */
function handleError(error, operation) {
    if (error instanceof errors_1.StripeWebhookError) {
        throw error;
    }
    else if (error instanceof errors_1.OrganizationNotFoundError) {
        throw error;
    }
    else if (error instanceof Error) {
        throw new errors_1.DatabaseOperationError(operation, error);
    }
    else {
        throw new Error(`Unknown error during ${operation}: ${String(error)}`);
    }
}
//# sourceMappingURL=handle-subscription-deleted.js.map