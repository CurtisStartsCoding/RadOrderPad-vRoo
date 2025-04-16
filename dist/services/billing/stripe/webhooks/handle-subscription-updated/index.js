"use strict";
/**
 * Export all functions related to handling subscription updated events
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSubscriptionUpdated = exports.mapPriceIdToTier = void 0;
var map_price_id_to_tier_1 = require("./map-price-id-to-tier");
Object.defineProperty(exports, "mapPriceIdToTier", { enumerable: true, get: function () { return map_price_id_to_tier_1.mapPriceIdToTier; } });
var handle_subscription_updated_1 = require("./handle-subscription-updated");
Object.defineProperty(exports, "handleSubscriptionUpdated", { enumerable: true, get: function () { return handle_subscription_updated_1.handleSubscriptionUpdated; } });
// Default export for backward compatibility
const handle_subscription_updated_2 = require("./handle-subscription-updated");
exports.default = handle_subscription_updated_2.handleSubscriptionUpdated;
//# sourceMappingURL=index.js.map