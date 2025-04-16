"use strict";
/**
 * Connection rejection notification utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConnectionRejected = exports.prepareConnectionRejectionData = void 0;
// Import functions
const prepare_connection_rejection_data_1 = require("./prepare-connection-rejection-data");
Object.defineProperty(exports, "prepareConnectionRejectionData", { enumerable: true, get: function () { return prepare_connection_rejection_data_1.prepareConnectionRejectionData; } });
const send_connection_rejected_1 = require("./send-connection-rejected");
Object.defineProperty(exports, "sendConnectionRejected", { enumerable: true, get: function () { return send_connection_rejected_1.sendConnectionRejected; } });
// Default export for backward compatibility
exports.default = {
    prepareConnectionRejectionData: prepare_connection_rejection_data_1.prepareConnectionRejectionData,
    sendConnectionRejected: send_connection_rejected_1.sendConnectionRejected
};
//# sourceMappingURL=index.js.map