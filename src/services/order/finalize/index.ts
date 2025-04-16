/**
 * Order Finalization Module
 * 
 * This module provides functionality for finalizing orders, including
 * updating order data, handling signatures, and managing database transactions.
 */

// Export types
export * from './types';

// Export authorization functions
export * from './authorization';

// Export update functions
export * from './update';

// Export signature functions
export * from './signature';

// Export transaction functions
export * from './transaction';

// Export handler function
export { handleFinalizeOrder } from './handler';

// Default export for backward compatibility
export { handleFinalizeOrder as default } from './handler';