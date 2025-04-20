/**
 * Export all functions related to handling invoice payment failed events
 */
export { shouldEnterPurgatory } from './should-enter-purgatory';
export { handleInvoicePaymentFailed } from './handle-invoice-payment-failed';
// Default export for backward compatibility
import { handleInvoicePaymentFailed } from './handle-invoice-payment-failed';
export default handleInvoicePaymentFailed;
//# sourceMappingURL=index.js.map