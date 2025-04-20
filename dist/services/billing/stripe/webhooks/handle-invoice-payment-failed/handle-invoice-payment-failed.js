import { getMainDbClient } from '../../../../../config/db';
import { generalNotifications } from '../../../../../services/notification/services';
import { shouldEnterPurgatory } from './should-enter-purgatory';
/**
 * Handle invoice.payment_failed event
 * This is triggered when an invoice payment fails
 */
export async function handleInvoicePaymentFailed(event) {
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
        const orgResult = await client.query(`SELECT id, name, type, status, subscription_tier 
       FROM organizations 
       WHERE billing_id = $1`, [customerId]);
        if (orgResult.rowCount === 0) {
            throw new Error(`Organization with Stripe customer ID ${customerId} not found`);
        }
        const organization = orgResult.rows[0];
        const orgId = organization.id;
        const orgName = organization.name;
        const currentStatus = organization.status;
        // Log the billing event
        await client.query(`INSERT INTO billing_events 
       (organization_id, event_type, amount_cents, currency, 
        stripe_event_id, stripe_invoice_id, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
            orgId,
            'payment_failed',
            invoice.amount_due,
            invoice.currency,
            event.id,
            invoice.id,
            `Invoice payment failed: ${invoice.number || invoice.id}`
        ]);
        // Check if the organization should enter purgatory mode
        const enterPurgatory = shouldEnterPurgatory(invoice, organization);
        // If the organization should enter purgatory and is not already in purgatory
        if (enterPurgatory && currentStatus !== 'purgatory') {
            // 1. Update organization status
            await client.query(`UPDATE organizations 
         SET status = 'purgatory' 
         WHERE id = $1`, [orgId]);
            // 2. Create purgatory event
            await client.query(`INSERT INTO purgatory_events 
         (organization_id, reason, triggered_by) 
         VALUES ($1, $2, $3)`, [
                orgId,
                'payment_failed',
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
                await generalNotifications.sendNotificationEmail(admin.email, 'URGENT: Account Payment Failure', `Dear ${admin.first_name} ${admin.last_name},\n\n` +
                    `We regret to inform you that your organization's account (${orgName}) ` +
                    `has been placed on hold due to a payment failure.\n\n` +
                    `Invoice Details:\n` +
                    `- Invoice Number: ${invoice.number || 'N/A'}\n` +
                    `- Amount Due: ${(invoice.amount_due || 0) / 100} ${invoice.currency?.toUpperCase() || 'USD'}\n\n` +
                    `While your account is on hold, you will have limited access to RadOrderPad features. ` +
                    `To restore full access, please update your payment information in your account settings ` +
                    `or contact our support team for assistance.\n\n` +
                    `Best regards,\n` +
                    `The RadOrderPad Team`);
            }
            console.log(`Organization ${orgId} placed in purgatory mode due to payment failure`);
        }
        else {
            // If not entering purgatory, just send a warning notification
            const adminUsersResult = await client.query(`SELECT email, first_name, last_name 
         FROM users 
         WHERE organization_id = $1 
         AND role IN ('admin_referring', 'admin_radiology')`, [orgId]);
            // Send notifications to all admin users
            for (const admin of adminUsersResult.rows) {
                await generalNotifications.sendNotificationEmail(admin.email, 'Payment Failure Notice', `Dear ${admin.first_name} ${admin.last_name},\n\n` +
                    `We're writing to inform you that a recent payment for your organization's account (${orgName}) ` +
                    `has failed to process.\n\n` +
                    `Invoice Details:\n` +
                    `- Invoice Number: ${invoice.number || 'N/A'}\n` +
                    `- Amount Due: ${(invoice.amount_due || 0) / 100} ${invoice.currency?.toUpperCase() || 'USD'}\n\n` +
                    `Please update your payment information in your account settings to avoid ` +
                    `any interruption to your service. If you believe this is an error or need assistance, ` +
                    `please contact our support team.\n\n` +
                    `Best regards,\n` +
                    `The RadOrderPad Team`);
            }
        }
        await client.query('COMMIT');
        console.log(`Successfully processed invoice payment failure for org ${orgId}`);
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error processing invoice payment failure:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
//# sourceMappingURL=handle-invoice-payment-failed.js.map