"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareConnectionTerminationData = prepareConnectionTerminationData;
const request_1 = require("../request");
/**
 * Prepare the template data for a connection termination notification
 * @param email Email address of the partner organization admin
 * @param partnerOrgName Name of the partner organization
 * @param terminatingOrgName Name of the organization terminating the connection
 */
function prepareConnectionTerminationData(email, partnerOrgName, terminatingOrgName) {
    return {
        email,
        partnerOrgName,
        terminatingOrgName,
        frontendUrl: (0, request_1.getFrontendUrl)()
    };
}
//# sourceMappingURL=prepare-connection-termination-data.js.map