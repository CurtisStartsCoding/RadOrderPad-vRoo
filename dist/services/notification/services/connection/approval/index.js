"use strict";
/**
 * Connection approval notification utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConnectionApproved = exports.prepareConnectionApprovalData = void 0;
// Import functions
const prepare_connection_approval_data_1 = require("./prepare-connection-approval-data");
Object.defineProperty(exports, "prepareConnectionApprovalData", { enumerable: true, get: function () { return prepare_connection_approval_data_1.prepareConnectionApprovalData; } });
const send_connection_approved_1 = require("./send-connection-approved");
Object.defineProperty(exports, "sendConnectionApproved", { enumerable: true, get: function () { return send_connection_approved_1.sendConnectionApproved; } });
// Default export for backward compatibility
exports.default = {
    prepareConnectionApprovalData: prepare_connection_approval_data_1.prepareConnectionApprovalData,
    sendConnectionApproved: send_connection_approved_1.sendConnectionApproved
};
//# sourceMappingURL=index.js.map