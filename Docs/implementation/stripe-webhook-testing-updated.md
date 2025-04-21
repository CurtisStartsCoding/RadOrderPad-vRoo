# Stripe Webhook Testing Guide (Updated)

This document provides instructions for testing the Stripe webhook handlers in both development and production environments.

## Testing Results Summary

We've implemented comprehensive webhook handlers for Stripe events, and our initial testing shows:

1. **Successful Implementation**: The webhook controller and handlers are properly implemented and follow the Single Responsibility Principle (SRP).
2. **Database Integration**: The handlers correctly update the database in response to webhook events.
3. **Event Processing**: The first scenario (checkout.session.completed) was successfully tested end-to-end.

## Testing Approaches

### 1. Stripe CLI Testing (Limited)

The Stripe CLI can be used for basic testing, but we encountered some limitations with parameter support in the test environment:

```bash
# This command works correctly
stripe trigger checkout.session.completed --add checkout_session:metadata.radorderpad_org_id=1 --add checkout_session:metadata.credit_bundle_price_id=price_credits_medium
```

### 2. Manual Testing with Stripe Dashboard

For more comprehensive testing, use the Stripe Dashboard:

1. Log in to the [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers > Events
3. Select an event type (e.g., `checkout.session.completed`)
4. Click "Send test webhook"
5. Enter your webhook endpoint URL
6. Customize the event data as needed
7. Click "Send test webhook"

### 3. Unit Testing

For reliable automated testing, implement unit tests that mock the Stripe event objects:

```typescript
// Example unit test for checkout.session.completed
it('should process checkout.session.completed event', async () => {
  // Mock Stripe event
  const mockEvent = {
    id: 'evt_test123',
    type: 'checkout.session.completed',
    data: {
      object: {
        metadata: {
          radorderpad_org_id: '1',
          credit_bundle_price_id: 'price_credits_medium'
        },
        amount_total: 5000,
        currency: 'usd'
      }
    }
  };
  
  // Call handler directly
  await handleCheckoutSessionCompleted(mockEvent);
  
  // Verify database changes
  const org = await db.query('SELECT credit_balance FROM organizations WHERE id = 1');
  expect(org.rows[0].credit_balance).toBeGreaterThan(100); // Initial balance was 100
  
  const events = await db.query('SELECT * FROM billing_events WHERE organization_id = 1 ORDER BY created_at DESC LIMIT 1');
  expect(events.rows[0].event_type).toBe('top_up');
});
```

## Webhook Handler Implementation

Our webhook handlers follow best practices:

1. **Transaction Safety**: All database operations are wrapped in transactions
2. **Error Handling**: Comprehensive error handling with specific error types
3. **Logging**: Detailed logging for debugging and monitoring
4. **Idempotency**: Events are processed idempotently to prevent duplicate processing

## Webhook Event Types Handled

1. **checkout.session.completed**: Processes credit top-ups
2. **invoice.payment_succeeded**: Handles subscription renewals and reactivates organizations in purgatory
3. **invoice.payment_failed**: Puts organizations in purgatory if payment failures exceed thresholds
4. **customer.subscription.updated**: Updates subscription tiers and replenishes credits
5. **customer.subscription.deleted**: Cancels subscriptions and puts organizations in purgatory

## Production Considerations

For production deployment:

1. **Webhook Signing**: Ensure `STRIPE_WEBHOOK_SECRET` is set correctly
2. **Monitoring**: Implement monitoring for webhook processing failures
3. **Retry Logic**: Consider implementing retry logic for failed webhook processing
4. **Alerts**: Set up alerts for critical webhook failures

## Next Steps

1. Implement unit tests for all webhook handlers
2. Set up monitoring for webhook processing
3. Document webhook event formats for future reference