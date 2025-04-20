"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConnectionTerminated = sendConnectionTerminated;
const config_js_1 = __importDefault(require("../../../../config/config.js"));
const index_js_1 = require("../../templates/index.js");
const send_email_js_1 = __importDefault(require("./send-email.js"));
/**
 * Send a connection termination notification
 * @param email Email address of the partner organization admin
 * @param partnerOrgName Name of the partner organization
 * @param terminatingOrgName Name of the organization terminating the connection
 */
async function sendConnectionTerminated(email, partnerOrgName, terminatingOrgName) {
    // Prepare the template data
    const templateData = {
        email,
        partnerOrgName,
        terminatingOrgName,
        frontendUrl: config_js_1.default.frontendUrl
    };
    // Send the email using the common function
    await (0, send_email_js_1.default)(email, index_js_1.connectionTerminationTemplate, templateData, 'connection termination');
}
exports.default = sendConnectionTerminated;
//# sourceMappingURL=termination.js.map