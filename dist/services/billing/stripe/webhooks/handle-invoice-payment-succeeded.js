import { getMainDbClient } from '../../../../config/db';
import { generalNotifications } from '../../../../services/notification/services';
/**
 * Handle invoice.payment_succeeded event
 * This is triggered when an invoice payment succeeds,
 * either for a subscription renewal or a one-time charge
 */
export async function handleInvoicePaymentSucceeded(event) {
    const invoice = event.data.object;
    const customerId = invoice.customer;
    if (!customerId) {
        throw new Error('Missing customer ID in invoice');
    }
    // Get the organization by Stripe customer ID
    const client = await getMainDbClient();
    try {
        await client.query('BEGIN');
        // Find the organization by Stripe customer ID
        const orgResult = await client.query(`SELECT id, name, type, status, subscription_tier, credit_balance 
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
        // Determine if this is a subscription renewal or usage charge
        // Check if this is a subscription invoice by looking at the subscription field
        // Using type assertion since the Stripe types might not be fully accurate
        const isSubscriptionRenewal = Boolean(invoice.subscription);
        // Log the billing event
        await client.query(`INSERT INTO billing_events 
       (organization_id, event_type, amount_cents, currency, 
        stripe_event_id, stripe_invoice_id, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
            orgId,
            isSubscriptionRenewal ? 'subscription_payment' : 'charge',
            invoice.amount_paid,
            invoice.currency,
            event.id,
            invoice.id,
            isSubscriptionRenewal
                ? `Subscription renewal for tier: ${subscriptionTier}`
                : `Usage charge payment`
        ]);
        // If the organization is in purgatory, reactivate it
        if (currentStatus === 'purgatory') {
            // 1. Update organization status
            await client.query(`UPDATE organizations 
         SET status = 'active' 
         WHERE id = $1`, [orgId]);
            // 2. Update purgatory events
            await client.query(`UPDATE purgatory_events 
         SET status = 'resolved', resolved_at = NOW() 
         WHERE organization_id = $1 AND status = 'active'`, [orgId]);
            // 3. Update organization relationships
            await client.query(`UPDATE organization_relationships 
         SET status = 'active' 
         WHERE (organization_id = $1 OR related_organization_id = $1) 
         AND status = 'purgatory'`, [orgId]);
            // 4. Send notification to organization admins
            const adminUsersResult = await client.query(`SELECT email, first_name, last_name 
         FROM users 
         WHERE organization_id = $1 
         AND role IN ('admin_referring', 'admin_radiology')`, [orgId]);
            // Send notifications to all admin users
            for (const admin of adminUsersResult.rows) {
                await generalNotifications.sendNotificationEmail(admin.email, 'Your account has been reactivated', `Dear ${admin.first_name} ${admin.last_name},\n\n` +
                    `We're pleased to inform you that your organization's account has been reactivated ` +
                    `following the successful payment of your outstanding invoice. ` +
                    `Your organization now has full access to all RadOrderPad features.\n\n` +
                    `Thank you for your prompt attention to this matter.\n\n` +
                    `Best regards,\n` +
                    `The RadOrderPad Team`);
            }
        }
        // If this is a subscription renewal for a referring practice, replenish credits
        if (isSubscriptionRenewal && orgType === 'referring_practice') {
            // Determine credit amount based on subscription tier
            let creditAmount = 0;
            // Simple mapping of tiers to credit amounts
            // In a real implementation, this would likely be stored in a database
            if (subscriptionTier === 'tier_1') {
                creditAmount = 500;
            }
            else if (subscriptionTier === 'tier_2') {
                creditAmount = 1000;
            }
            else if (subscriptionTier === 'tier_3') {
                creditAmount = 2000;
            }
            else {
                creditAmount = 500; // Default fallback amount
            }
            // Update the organization's credit balance
            await client.query(`UPDATE organizations 
         SET credit_balance = $1 
         WHERE id = $2`, [creditAmount, orgId]);
            // Log the credit replenishment
            await client.query(`INSERT INTO billing_events 
         (organization_id, event_type, description) 
         VALUES ($1, $2, $3)`, [
                orgId,
                'credit_grant',
                `Monthly credit replenishment: ${creditAmount} credits for tier ${subscriptionTier}`
            ]);
        }
        await client.query('COMMIT');
        console.log(`Successfully processed invoice payment for org ${orgId}`);
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error processing invoice payment:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
//# sourceMappingURL=handle-invoice-payment-succeeded.js.map