"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldEnterPurgatory = shouldEnterPurgatory;
/**
 * Determine if an organization should be placed in purgatory mode
 * based on payment failure criteria
 *
 * @param invoice The Stripe invoice object
 * @param organization The organization data from the database
 * @returns boolean indicating whether to place in purgatory
 */
function shouldEnterPurgatory(invoice, organization) {
    // In a real implementation, this would have more complex logic based on:
    // 1. Number of consecutive failures
    // 2. Total amount outstanding
    // 3. Duration of delinquency
    // 4. Organization type and history
    // For this implementation, we'll use a simple approach:
    // Enter purgatory if the invoice has been attempted 3 or more times
    // or if the amount is significant (over $100)
    const attemptCount = invoice.attempt_count || 1;
    const amountDue = invoice.amount_due || 0;
    return attemptCount >= 3 || amountDue >= 10000; // $100 in cents
}
//# sourceMappingURL=should-enter-purgatory.js.map