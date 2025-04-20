"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareConnectionRejectionData = prepareConnectionRejectionData;
const request_1 = require("../request");
/**
 * Prepare the template data for a connection rejection notification
 * @param email Email address of the requesting organization admin
 * @param rejectedOrgName Name of the organization that requested the connection
 */
function prepareConnectionRejectionData(email, rejectedOrgName) {
    return {
        email,
        rejectedOrgName,
        frontendUrl: (0, request_1.getFrontendUrl)()
    };
}
//# sourceMappingURL=prepare-connection-rejection-data.js.map