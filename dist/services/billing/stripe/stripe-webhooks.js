"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSubscriptionDeleted = exports.handleSubscriptionUpdated = exports.handleInvoicePaymentFailed = exports.handleInvoicePaymentSucceeded = exports.handleCheckoutSessionCompleted = exports.verifyWebhookSignature = void 0;
const stripe_1 = __importDefault(require("stripe"));
const db_1 = require("../../../config/db");
const services_1 = require("../../notification/services");
// Initialize Stripe with the API key from environment variables
// Initialize Stripe with the API key from environment variables
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-04-10', // Use the API version from config with type assertion
});
/**
 * Verify the Stripe webhook signature
 * @param payload Raw request body
 * @param signature Stripe signature from headers
 * @returns Verified Stripe event
 */
const verifyWebhookSignature = (payload, signature) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    }
    try {
        // Verify the event with Stripe
        return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }
    catch (error) {
        throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
};
exports.verifyWebhookSignature = verifyWebhookSignature;
/**
 * Handle checkout.session.completed event
 * This is triggered when a customer completes a checkout session,
 * typically for purchasing credit bundles
 */
const handleCheckoutSessionCompleted = async (event) => {
    const session = event.data.object;
    // Extract metadata from the session
    const metadata = session.metadata || {};
    const orgId = metadata.radorderpad_org_id ? parseInt(metadata.radorderpad_org_id, 10) : null;
    const creditBundleId = metadata.credit_bundle_price_id || null;
    if (!orgId) {
        throw new Error('Missing organization ID in checkout session metadata');
    }
    // Get credit amount based on the bundle purchased
    // This could be stored in a configuration or determined based on the price ID
    let creditAmount = 0;
    // Simple mapping of price IDs to credit amounts
    // In a real implementation, this would likely be stored in a database
    if (creditBundleId === 'price_credits_small') {
        creditAmount = 100;
    }
    else if (creditBundleId === 'price_credits_medium') {
        creditAmount = 500;
    }
    else if (creditBundleId === 'price_credits_large') {
        creditAmount = 1000;
    }
    else {
        // If no specific bundle is identified, try to extract from line items
        // This is a fallback and might require a Stripe API call to get line items
        creditAmount = 100; // Default fallback amount
    }
    // Get the payment amount in cents
    const amountCents = session.amount_total || 0;
    // Use a transaction to update the organization's credit balance and log the billing event
    const client = await (0, db_1.getMainDbClient)();
    try {
        await client.query('BEGIN');
        // 1. Update the organization's credit balance
        const updateOrgResult = await client.query(`UPDATE organizations 
       SET credit_balance = credit_balance + $1 
       WHERE id = $2 
       RETURNING credit_balance`, [creditAmount, orgId]);
        if (updateOrgResult.rowCount === 0) {
            throw new Error(`Organization with ID ${orgId} not found`);
        }
        const newCreditBalance = updateOrgResult.rows[0].credit_balance;
        // 2. Log the billing event
        await client.query(`INSERT INTO billing_events 
       (organization_id, event_type, amount_cents, currency, 
        stripe_event_id, description) 
       VALUES ($1, $2, $3, $4, $5, $6)`, [
            orgId,
            'top_up',
            amountCents,
            session.currency || 'usd',
            event.id,
            `Credit bundle purchase: ${creditAmount} credits added`
        ]);
        await client.query('COMMIT');
        console.log(`Successfully processed checkout session for org ${orgId}: Added ${creditAmount} credits, new balance: ${newCreditBalance}`);
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error processing checkout session:', error);
        throw error;
    }
    finally {
        client.release();
    }
};
exports.handleCheckoutSessionCompleted = handleCheckoutSessionCompleted;
/**
 * Handle invoice.payment_succeeded event
 * This is triggered when an invoice payment succeeds,
 * either for a subscription renewal or a one-time charge
 */
const handleInvoicePaymentSucceeded = async (event) => {
    const invoice = event.data.object;
    const customerId = invoice.customer;
    if (!customerId) {
        throw new Error('Missing customer ID in invoice');
    }
    // Use a transaction to update the organization and log the billing event
    const client = await (0, db_1.getMainDbClient)();
    try {
        await client.query('BEGIN');
        // 1. Find the organization by Stripe customer ID
        const orgResult = await client.query(`SELECT id, type, status, subscription_tier 
       FROM organizations 
       WHERE billing_id = $1`, [customerId]);
        if (orgResult.rowCount === 0) {
            throw new Error(`Organization with Stripe customer ID ${customerId} not found`);
        }
        const organization = orgResult.rows[0];
        const orgId = organization.id;
        const orgType = organization.type;
        const currentStatus = organization.status;
        const subscriptionTier = organization.subscription_tier;
        // 2. Determine if this is a subscription renewal
        // Check if this invoice is related to a subscription
        const isSubscriptionRenewal = 'subscription' in invoice && invoice.subscription ? true : false;
        // Variables to track changes
        let creditReplenishAmount = 0;
        let statusChanged = false;
        // 3. If this is a subscription renewal for a referring practice, replenish credits
        if (isSubscriptionRenewal && orgType === 'referring_practice') {
            // Determine credit amount based on subscription tier
            switch (subscriptionTier) {
                case 'tier_1':
                    creditReplenishAmount = 500; // Example: Tier 1 gets 500 credits/month
                    break;
                case 'tier_2':
                    creditReplenishAmount = 1500; // Example: Tier 2 gets 1500 credits/month
                    break;
                case 'tier_3':
                    creditReplenishAmount = 5000; // Example: Tier 3 gets 5000 credits/month
                    break;
                default:
                    creditReplenishAmount = 100; // Default fallback
            }
            // Update credit balance
            if (creditReplenishAmount > 0) {
                await client.query(`UPDATE organizations 
           SET credit_balance = $1 
           WHERE id = $2`, [creditReplenishAmount, orgId]);
            }
        }
        // 4. If organization is in purgatory, reactivate it
        if (currentStatus === 'purgatory') {
            // Update organization status
            await client.query(`UPDATE organizations 
         SET status = 'active' 
         WHERE id = $1`, [orgId]);
            // Update purgatory events
            await client.query(`UPDATE purgatory_events 
         SET status = 'resolved', resolved_at = NOW() 
         WHERE organization_id = $1 AND status = 'active'`, [orgId]);
            // Update organization relationships
            await client.query(`UPDATE organization_relationships 
         SET status = 'active' 
         WHERE (organization_id = $1 OR related_organization_id = $1) 
         AND status = 'purgatory'`, [orgId]);
            statusChanged = true;
        }
        // 5. Log the billing event
        await client.query(`INSERT INTO billing_events 
       (organization_id, event_type, amount_cents, currency, 
        stripe_event_id, stripe_invoice_id, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
            orgId,
            isSubscriptionRenewal ? 'subscription_payment' : 'charge',
            invoice.amount_paid || 0,
            invoice.currency || 'usd',
            event.id,
            invoice.id,
            isSubscriptionRenewal
                ? `Subscription payment: ${subscriptionTier || 'unknown tier'}${creditReplenishAmount > 0 ? `, ${creditReplenishAmount} credits replenished` : ''}`
                : `Payment for invoice ${invoice.number || invoice.id}`
        ]);
        await client.query('COMMIT');
        console.log(`Successfully processed payment for org ${orgId}`);
        // 6. Send notification if status changed
        if (statusChanged) {
            // Get admin users for the organization
            const adminsResult = await client.query(`SELECT email FROM users 
         WHERE organization_id = $1 
         AND role IN ('admin_referring', 'admin_radiology')`, [orgId]);
            const adminEmails = adminsResult.rows.map(row => row.email);
            if (adminEmails.length > 0) {
                // Send notification about account reactivation
                for (const email of adminEmails) {
                    await services_1.generalNotifications.sendNotificationEmail(email, 'Account Reactivated', `Your organization (ID: ${orgId}) has been reactivated after successful payment.`);
                }
            }
        }
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error processing invoice payment:', error);
        throw error;
    }
    finally {
        client.release();
    }
};
exports.handleInvoicePaymentSucceeded = handleInvoicePaymentSucceeded;
/**
 * Handle invoice.payment_failed event
 * This is triggered when an invoice payment fails
 */
const handleInvoicePaymentFailed = async (event) => {
    const invoice = event.data.object;
    const customerId = invoice.customer;
    if (!customerId) {
        throw new Error('Missing customer ID in invoice');
    }
    // Use a transaction to update the organization and log the billing event
    const client = await (0, db_1.getMainDbClient)();
    try {
        await client.query('BEGIN');
        // 1. Find the organization by Stripe customer ID
        const orgResult = await client.query(`SELECT id, name, status, 
              (SELECT COUNT(*) FROM purgatory_events 
               WHERE organization_id = organizations.id 
               AND created_at > NOW() - INTERVAL '30 days') as recent_failures 
       FROM organizations 
       WHERE billing_id = $1`, [customerId]);
        if (orgResult.rowCount === 0) {
            throw new Error(`Organization with Stripe customer ID ${customerId} not found`);
        }
        const organization = orgResult.rows[0];
        const orgId = organization.id;
        const orgName = organization.name;
        const currentStatus = organization.status;
        const recentFailures = parseInt(organization.recent_failures, 10);
        // 2. Log the billing event
        await client.query(`INSERT INTO billing_events 
       (organization_id, event_type, amount_cents, currency, 
        stripe_event_id, stripe_invoice_id, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
            orgId,
            'payment_failed',
            invoice.amount_due || 0,
            invoice.currency || 'usd',
            event.id,
            invoice.id,
            `Payment failed for invoice ${invoice.number || invoice.id}`
        ]);
        // 3. Determine if the organization should be put in purgatory
        // Criteria: Either this is the 3rd recent failure, or it's already had a warning
        const shouldEnterPurgatory = recentFailures >= 2 ||
            (invoice.attempt_count && invoice.attempt_count > 2);
        // 4. If criteria met and not already in purgatory, put organization in purgatory
        if (shouldEnterPurgatory && currentStatus !== 'purgatory') {
            // Update organization status
            await client.query(`UPDATE organizations 
         SET status = 'purgatory' 
         WHERE id = $1`, [orgId]);
            // Create purgatory event
            await client.query(`INSERT INTO purgatory_events 
         (organization_id, reason, triggered_by, status) 
         VALUES ($1, $2, $3, $4)`, [
                orgId,
                'payment_failed',
                'stripe_webhook',
                'active'
            ]);
            // Update organization relationships
            await client.query(`UPDATE organization_relationships 
         SET status = 'purgatory' 
         WHERE (organization_id = $1 OR related_organization_id = $1) 
         AND status = 'active'`, [orgId]);
            await client.query('COMMIT');
            console.log(`Organization ${orgId} placed in purgatory due to payment failures`);
            // 5. Get admin users for the organization
            const adminsResult = await client.query(`SELECT email FROM users 
         WHERE organization_id = $1 
         AND role IN ('admin_referring', 'admin_radiology')`, [orgId]);
            const adminEmails = adminsResult.rows.map(row => row.email);
            if (adminEmails.length > 0) {
                // Send notification about account suspension
                for (const email of adminEmails) {
                    await services_1.generalNotifications.sendNotificationEmail(email, 'Account Suspended - Payment Failed', `Your organization ${orgName} (ID: ${orgId}) has been suspended due to payment failure.`);
                }
            }
        }
        else {
            await client.query('COMMIT');
            // If not entering purgatory yet, still send a warning notification
            if (currentStatus !== 'purgatory') {
                // Get admin users for the organization
                const adminsResult = await client.query(`SELECT email FROM users 
           WHERE organization_id = $1 
           AND role IN ('admin_referring', 'admin_radiology')`, [orgId]);
                const adminEmails = adminsResult.rows.map(row => row.email);
                if (adminEmails.length > 0) {
                    // Send notification about payment failure
                    for (const email of adminEmails) {
                        await services_1.generalNotifications.sendNotificationEmail(email, 'Payment Failure Warning', `Payment failed for invoice ${invoice.id} for organization ${orgName} (ID: ${orgId}). This is attempt ${invoice.attempt_count || 1}.`);
                    }
                }
            }
        }
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error processing invoice payment failure:', error);
        throw error;
    }
    finally {
        client.release();
    }
};
exports.handleInvoicePaymentFailed = handleInvoicePaymentFailed;
/**
 * Handle customer.subscription.updated event
 * This is triggered when a subscription is updated (e.g., plan change, status change)
 */
const handleSubscriptionUpdated = async (event) => {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    if (!customerId) {
        throw new Error('Missing customer ID in subscription');
    }
    // Use a transaction to update the organization and log the billing event
    const client = await (0, db_1.getMainDbClient)();
    try {
        await client.query('BEGIN');
        // 1. Find the organization by Stripe customer ID
        const orgResult = await client.query(`SELECT id, type, subscription_tier 
       FROM organizations 
       WHERE billing_id = $1`, [customerId]);
        if (orgResult.rowCount === 0) {
            throw new Error(`Organization with Stripe customer ID ${customerId} not found`);
        }
        const organization = orgResult.rows[0];
        const orgId = organization.id;
        const orgType = organization.type;
        const currentTier = organization.subscription_tier;
        // Only process for referring practices
        if (orgType !== 'referring_practice') {
            await client.query('ROLLBACK');
            return;
        }
        // 2. Determine the new subscription tier based on the price ID
        // This mapping would ideally come from a configuration
        let newTier = currentTier;
        const priceId = subscription.items.data[0]?.price.id;
        if (priceId === 'price_tier_1') {
            newTier = 'tier_1';
        }
        else if (priceId === 'price_tier_2') {
            newTier = 'tier_2';
        }
        else if (priceId === 'price_tier_3') {
            newTier = 'tier_3';
        }
        // 3. Update the organization's subscription tier if it changed
        if (newTier !== currentTier) {
            await client.query(`UPDATE organizations 
         SET subscription_tier = $1 
         WHERE id = $2`, [newTier, orgId]);
        }
        // 4. Handle subscription status changes
        const status = subscription.status;
        if (status === 'past_due' || status === 'unpaid' || status === 'canceled') {
            // If subscription is in a problematic state, log it but don't take action yet
            // The invoice.payment_failed event will handle putting the org in purgatory if needed
            console.log(`Organization ${orgId} subscription status changed to ${status}`);
        }
        // 5. Log the billing event
        await client.query(`INSERT INTO billing_events 
       (organization_id, event_type, stripe_event_id, description) 
       VALUES ($1, $2, $3, $4)`, [
            orgId,
            'subscription_updated',
            event.id,
            `Subscription updated: ${currentTier || 'unknown'} -> ${newTier || 'unknown'}, status: ${status}`
        ]);
        await client.query('COMMIT');
        console.log(`Successfully processed subscription update for org ${orgId}`);
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error processing subscription update:', error);
        throw error;
    }
    finally {
        client.release();
    }
};
exports.handleSubscriptionUpdated = handleSubscriptionUpdated;
/**
 * Handle customer.subscription.deleted event
 * This is triggered when a subscription is canceled
 */
const handleSubscriptionDeleted = async (event) => {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    if (!customerId) {
        throw new Error('Missing customer ID in subscription');
    }
    // Use a transaction to update the organization and log the billing event
    const client = await (0, db_1.getMainDbClient)();
    try {
        await client.query('BEGIN');
        // 1. Find the organization by Stripe customer ID
        const orgResult = await client.query(`SELECT id, name, type, status 
       FROM organizations 
       WHERE billing_id = $1`, [customerId]);
        if (orgResult.rowCount === 0) {
            throw new Error(`Organization with Stripe customer ID ${customerId} not found`);
        }
        const organization = orgResult.rows[0];
        const orgId = organization.id;
        const orgName = organization.name;
        const orgType = organization.type;
        const currentStatus = organization.status;
        // Only process for referring practices
        if (orgType !== 'referring_practice') {
            await client.query('ROLLBACK');
            return;
        }
        // 2. If not already in purgatory, put organization in purgatory
        if (currentStatus !== 'purgatory') {
            // Update organization status
            await client.query(`UPDATE organizations 
         SET status = 'purgatory', subscription_tier = NULL 
         WHERE id = $1`, [orgId]);
            // Create purgatory event
            await client.query(`INSERT INTO purgatory_events 
         (organization_id, reason, triggered_by, status) 
         VALUES ($1, $2, $3, $4)`, [
                orgId,
                'subscription_canceled',
                'stripe_webhook',
                'active'
            ]);
            // Update organization relationships
            await client.query(`UPDATE organization_relationships 
         SET status = 'purgatory' 
         WHERE (organization_id = $1 OR related_organization_id = $1) 
         AND status = 'active'`, [orgId]);
        }
        // 3. Log the billing event
        await client.query(`INSERT INTO billing_events 
       (organization_id, event_type, stripe_event_id, description) 
       VALUES ($1, $2, $3, $4)`, [
            orgId,
            'subscription_canceled',
            event.id,
            `Subscription canceled`
        ]);
        await client.query('COMMIT');
        console.log(`Successfully processed subscription cancellation for org ${orgId}`);
        // 4. Send notification to organization admins
        // Get admin users for the organization
        const adminsResult = await client.query(`SELECT email FROM users 
       WHERE organization_id = $1 
       AND role IN ('admin_referring', 'admin_radiology')`, [orgId]);
        const adminEmails = adminsResult.rows.map(row => row.email);
        if (adminEmails.length > 0) {
            // Send notification about subscription cancellation
            for (const email of adminEmails) {
                await services_1.generalNotifications.sendNotificationEmail(email, 'Subscription Canceled', `The subscription for organization ${orgName} (ID: ${orgId}) has been canceled.`);
            }
        }
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error processing subscription cancellation:', error);
        throw error;
    }
    finally {
        client.release();
    }
};
exports.handleSubscriptionDeleted = handleSubscriptionDeleted;
//# sourceMappingURL=stripe-webhooks.js.map