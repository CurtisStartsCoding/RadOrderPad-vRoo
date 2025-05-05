/**
 * Rate Limiting Middleware
 * 
 * This module provides middleware for rate limiting API requests using Redis.
 * It includes a configurable rate limiter factory and various identifier strategies.
 */

export { createRateLimiter } from './rate-limiter';
export {
  getIpIdentifier,
  getUserIdentifier,
  getApiKeyIdentifier,
  getCompositeIdentifier
} from './identifier-strategies';