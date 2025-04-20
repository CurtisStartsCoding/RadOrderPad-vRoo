"use strict";
/**
 * Clinical record manager services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOrderStatus = exports.saveSupplementalDocument = exports.saveEmrSummary = void 0;
// Import functions
const save_emr_summary_1 = require("./save-emr-summary");
Object.defineProperty(exports, "saveEmrSummary", { enumerable: true, get: function () { return save_emr_summary_1.saveEmrSummary; } });
const save_supplemental_document_1 = require("./save-supplemental-document");
Object.defineProperty(exports, "saveSupplementalDocument", { enumerable: true, get: function () { return save_supplemental_document_1.saveSupplementalDocument; } });
const verify_order_status_1 = require("./verify-order-status");
Object.defineProperty(exports, "verifyOrderStatus", { enumerable: true, get: function () { return verify_order_status_1.verifyOrderStatus; } });
// Default export for backward compatibility
exports.default = {
    saveEmrSummary: save_emr_summary_1.saveEmrSummary,
    saveSupplementalDocument: save_supplemental_document_1.saveSupplementalDocument,
    verifyOrderStatus: verify_order_status_1.verifyOrderStatus
};
//# sourceMappingURL=index.js.map