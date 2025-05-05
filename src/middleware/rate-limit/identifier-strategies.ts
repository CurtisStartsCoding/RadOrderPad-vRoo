import { Request } from 'express';

/**
 * Generates a rate limit key based on the client's IP address
 * @param req Express request object
 * @returns A string identifier based on IP
 */
export function getIpIdentifier(req: Request): string {
  return `ip:${req.ip || req.socket.remoteAddress || 'unknown'}`;
}

/**
 * Generates a rate limit key based on the user's ID if authenticated,
 * or falls back to IP address for unauthenticated requests
 * @param req Express request object
 * @returns A string identifier based on user ID or IP
 */
export function getUserIdentifier(req: Request): string {
  // Check if user is authenticated and has an ID
  if (req.user && 'id' in req.user) {
    return `user:${req.user.id}`;
  }
  
  // Fall back to IP-based identifier
  return getIpIdentifier(req);
}

/**
 * Generates a rate limit key based on API key if present,
 * or falls back to user ID or IP address
 * @param req Express request object
 * @returns A string identifier based on API key, user ID, or IP
 */
export function getApiKeyIdentifier(req: Request): string {
  // Check for API key in headers
  const apiKey = req.headers['x-api-key'];
  if (apiKey && typeof apiKey === 'string') {
    return `apikey:${apiKey}`;
  }
  
  // Fall back to user-based identifier
  return getUserIdentifier(req);
}

/**
 * Generates a composite rate limit key based on both user ID and IP address
 * This helps prevent abuse where a single user might use multiple IPs
 * @param req Express request object
 * @returns A string identifier combining user ID and IP
 */
export function getCompositeIdentifier(req: Request): string {
  const userId = req.user && 'id' in req.user ? req.user.id : 'anonymous';
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  
  return `composite:${userId}:${ip}`;
}