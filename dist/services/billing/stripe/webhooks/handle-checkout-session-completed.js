import { getMainDbClient } from '../../../../config/db';
/**
 * Handle checkout.session.completed event
 * This is triggered when a customer completes a checkout session,
 * typically for purchasing credit bundles
 */
export async function handleCheckoutSessionCompleted(event) {
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
    const client = await getMainDbClient();
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
}
//# sourceMappingURL=handle-checkout-session-completed.js.map