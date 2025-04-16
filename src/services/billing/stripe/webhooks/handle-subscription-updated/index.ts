/**
 * Export all functions related to handling subscription updated events
 */

export { mapPriceIdToTier } from './map-price-id-to-tier';
export { handleSubscriptionUpdated } from './handle-subscription-updated';

// Default export for backward compatibility
import { handleSubscriptionUpdated } from './handle-subscription-updated';
export default handleSubscriptionUpdated;