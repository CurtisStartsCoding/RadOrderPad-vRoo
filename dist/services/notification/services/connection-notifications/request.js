"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConnectionRequest = sendConnectionRequest;
const config_js_1 = __importDefault(require("../../../../config/config.js"));
const index_js_1 = require("../../templates/index.js");
const send_email_js_1 = __importDefault(require("./send-email.js"));
/**
 * Send a connection request notification to an organization
 * @param email Email address of the target organization admin
 * @param requestingOrgName Name of the organization requesting the connection
 */
async function sendConnectionRequest(email, requestingOrgName) {
    // Prepare the template data
    const templateData = {
        email,
        requestingOrgName,
        frontendUrl: config_js_1.default.frontendUrl
    };
    // Send the email using the common function
    await (0, send_email_js_1.default)(email, index_js_1.connectionRequestTemplate, templateData, 'connection request');
}
exports.default = sendConnectionRequest;
//# sourceMappingURL=request.js.map