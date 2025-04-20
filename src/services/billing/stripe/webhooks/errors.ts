/**
 * Custom error classes for Stripe webhook handlers
 */

/**
 * Base error class for Stripe webhook errors
 */
export class StripeWebhookError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StripeWebhookError';
  }
}

/**
 * Error thrown when an organization is not found by Stripe customer ID
 */
export class OrganizationNotFoundError extends StripeWebhookError {
  customerId: string;

  constructor(customerId: string) {
    super(`Organization with Stripe customer ID ${customerId} not found`);
    this.name = 'OrganizationNotFoundError';
    this.customerId = customerId;
  }
}

/**
 * Error thrown when a database operation fails
 */
export class DatabaseOperationError extends StripeWebhookError {
  originalError: Error;
  operation: string;

  constructor(operation: string, originalError: Error) {
    super(`Database operation failed during ${operation}: ${originalError.message}`);
    this.name = 'DatabaseOperationError';
    this.originalError = originalError;
    this.operation = operation;
  }
}

/**
 * Error thrown when a subscription is not found
 */
export class SubscriptionNotFoundError extends StripeWebhookError {
  subscriptionId: string;

  constructor(subscriptionId: string) {
    super(`Subscription with ID ${subscriptionId} not found`);
    this.name = 'SubscriptionNotFoundError';
    this.subscriptionId = subscriptionId;
  }
}

/**
 * Error thrown when a price ID cannot be mapped to a tier
 */
export class TierMappingError extends StripeWebhookError {
  priceId: string;

  constructor(priceId: string) {
    super(`Could not map price ID ${priceId} to a subscription tier`);
    this.name = 'TierMappingError';
    this.priceId = priceId;
  }
}

/**
 * Error thrown when a notification fails to send
 */
export class NotificationError extends StripeWebhookError {
  recipient: string;
  originalError: Error;

  constructor(recipient: string, originalError: Error) {
    super(`Failed to send notification to ${recipient}: ${originalError.message}`);
    this.name = 'NotificationError';
    this.recipient = recipient;
    this.originalError = originalError;
  }
}