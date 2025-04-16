"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPriority = exports.OrderStatus = void 0;
/**
 * Order status enum
 */
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["DRAFT"] = "draft";
    OrderStatus["PENDING_VALIDATION"] = "pending_validation";
    OrderStatus["PENDING_ADMIN"] = "pending_admin";
    OrderStatus["PENDING_RADIOLOGY"] = "pending_radiology";
    OrderStatus["OVERRIDE_PENDING_SIGNATURE"] = "override_pending_signature";
    OrderStatus["SCHEDULED"] = "scheduled";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["RESULTS_AVAILABLE"] = "results_available";
    OrderStatus["RESULTS_ACKNOWLEDGED"] = "results_acknowledged";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
/**
 * Order priority enum
 */
var OrderPriority;
(function (OrderPriority) {
    OrderPriority["ROUTINE"] = "routine";
    OrderPriority["STAT"] = "stat";
})(OrderPriority || (exports.OrderPriority = OrderPriority = {}));
//# sourceMappingURL=order-types.js.map