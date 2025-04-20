"use strict";
/**
 * Order Finalization Module
 *
 * This module provides functionality for finalizing orders, including
 * updating order data, handling signatures, and managing database transactions.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.handleFinalizeOrder = void 0;
// Export types
__exportStar(require("./types"), exports);
// Export authorization functions
__exportStar(require("./authorization"), exports);
// Export update functions
__exportStar(require("./update"), exports);
// Export signature functions
__exportStar(require("./signature"), exports);
// Export transaction functions
__exportStar(require("./transaction"), exports);
// Export handler function
var handler_1 = require("./handler");
Object.defineProperty(exports, "handleFinalizeOrder", { enumerable: true, get: function () { return handler_1.handleFinalizeOrder; } });
// Default export for backward compatibility
var handler_2 = require("./handler");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return handler_2.handleFinalizeOrder; } });
//# sourceMappingURL=index.js.map