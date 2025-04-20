"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareConnectionApprovalData = prepareConnectionApprovalData;
const request_1 = require("../request");
/**
 * Prepare the template data for a connection approval notification
 * @param email Email address of the requesting organization admin
 * @param approvedOrgName Name of the organization that requested the connection
 */
function prepareConnectionApprovalData(email, approvedOrgName) {
    return {
        email,
        approvedOrgName,
        frontendUrl: (0, request_1.getFrontendUrl)()
    };
}
//# sourceMappingURL=prepare-connection-approval-data.js.map