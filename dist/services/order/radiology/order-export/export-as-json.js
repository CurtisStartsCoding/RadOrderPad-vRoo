"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportAsJson = exportAsJson;
/**
 * Export order data as JSON
 * @param orderDetails Order details object
 * @returns JSON object
 */
function exportAsJson(orderDetails) {
    // Simply return the complete order details object
    // The controller will handle setting the Content-Type header to application/json
    return orderDetails;
}
exports.default = exportAsJson;
//# sourceMappingURL=export-as-json.js.map