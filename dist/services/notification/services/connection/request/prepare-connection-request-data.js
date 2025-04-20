"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareConnectionRequestData = prepareConnectionRequestData;
const get_frontend_url_1 = require("./get-frontend-url");
/**
 * Prepare the template data for a connection request notification
 * @param email Email address of the target organization admin
 * @param requestingOrgName Name of the organization requesting the connection
 */
function prepareConnectionRequestData(email, requestingOrgName) {
    return {
        email,
        requestingOrgName,
        frontendUrl: (0, get_frontend_url_1.getFrontendUrl)()
    };
}
//# sourceMappingURL=prepare-connection-request-data.js.map