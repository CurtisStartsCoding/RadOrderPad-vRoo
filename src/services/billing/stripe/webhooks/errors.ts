/**
 * Custom error types for Stripe webhook handlers
 */

/**
 * Base class for Stripe webhook errors
 */
export class StripeWebhookError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StripeWebhookError';
  }
}

/**
 * Error thrown when an organization cannot be found by Stripe customer ID
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
  operation: string;
  originalError: Error;
  
  constructor(operation: string, originalError: Error) {
    super(`Database operation failed: ${operation}`);
    this.name = 'DatabaseOperationError';
    this.operation = operation;
    this.originalError = originalError;
  }
}

/**
 * Error thrown when a notification fails to send
 */
export class NotificationError extends StripeWebhookError {
  recipient: string;
  originalError: Error;
  
  constructor(recipient: string, originalError: Error) {
    super(`Failed to send notification to ${recipient}`);
    this.name = 'NotificationError';
    this.recipient = recipient;
    this.originalError = originalError;
  }
}