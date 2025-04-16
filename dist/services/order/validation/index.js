"use strict";
/**
 * Validation request handling module
 *
 * This module provides functionality for handling validation requests,
 * creating draft orders, and tracking validation attempts.
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
exports.handleValidationRequest = exports.logValidationAttempt = exports.getNextAttemptNumber = exports.createDraftOrder = void 0;
// Export types
__exportStar(require("./types"), exports);
// Export draft order functionality
var draft_order_1 = require("./draft-order");
Object.defineProperty(exports, "createDraftOrder", { enumerable: true, get: function () { return draft_order_1.createDraftOrder; } });
// Export attempt tracking functionality
var attempt_tracking_1 = require("./attempt-tracking");
Object.defineProperty(exports, "getNextAttemptNumber", { enumerable: true, get: function () { return attempt_tracking_1.getNextAttemptNumber; } });
Object.defineProperty(exports, "logValidationAttempt", { enumerable: true, get: function () { return attempt_tracking_1.logValidationAttempt; } });
// Export main handler
var handler_1 = require("./handler");
Object.defineProperty(exports, "handleValidationRequest", { enumerable: true, get: function () { return handler_1.handleValidationRequest; } });
// For backward compatibility, re-export handleValidationRequest as default
const handler_2 = require("./handler");
exports.default = handler_2.handleValidationRequest;
//# sourceMappingURL=index.js.map