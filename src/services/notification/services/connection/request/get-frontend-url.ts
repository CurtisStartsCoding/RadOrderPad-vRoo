import config from '../../../../../config/config';

/**
 * Get the frontend URL from environment variables
 */
export function getFrontendUrl(): string {
  return config.frontendUrl;
}