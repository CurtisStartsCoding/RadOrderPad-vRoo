/**
 * Authentication controller
 * This file re-exports everything from the auth directory for backward compatibility
 */

// Re-export everything from the auth directory
export * from './auth';

// Default export for backward compatibility
import authController from './auth';
export default authController;