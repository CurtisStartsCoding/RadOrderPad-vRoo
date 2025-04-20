/**
 * Order status enum
 */
export var OrderStatus;
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
})(OrderStatus || (OrderStatus = {}));
/**
 * Order priority enum
 */
export var OrderPriority;
(function (OrderPriority) {
    OrderPriority["ROUTINE"] = "routine";
    OrderPriority["STAT"] = "stat";
})(OrderPriority || (OrderPriority = {}));
//# sourceMappingURL=order-types.js.map