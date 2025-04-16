"use strict";
/**
 * Export all functions related to handling invoice payment failed events
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInvoicePaymentFailed = exports.shouldEnterPurgatory = void 0;
var should_enter_purgatory_1 = require("./should-enter-purgatory");
Object.defineProperty(exports, "shouldEnterPurgatory", { enumerable: true, get: function () { return should_enter_purgatory_1.shouldEnterPurgatory; } });
var handle_invoice_payment_failed_1 = require("./handle-invoice-payment-failed");
Object.defineProperty(exports, "handleInvoicePaymentFailed", { enumerable: true, get: function () { return handle_invoice_payment_failed_1.handleInvoicePaymentFailed; } });
// Default export for backward compatibility
const handle_invoice_payment_failed_2 = require("./handle-invoice-payment-failed");
exports.default = handle_invoice_payment_failed_2.handleInvoicePaymentFailed;
//# sourceMappingURL=index.js.map