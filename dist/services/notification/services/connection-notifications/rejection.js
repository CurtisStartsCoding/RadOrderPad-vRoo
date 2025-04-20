"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConnectionRejected = sendConnectionRejected;
const config_js_1 = __importDefault(require("../../../../config/config.js"));
const index_js_1 = require("../../templates/index.js");
const send_email_js_1 = __importDefault(require("./send-email.js"));
/**
 * Send a connection rejection notification
 * @param email Email address of the requesting organization admin
 * @param rejectedOrgName Name of the organization that requested the connection
 */
async function sendConnectionRejected(email, rejectedOrgName) {
    // Prepare the template data
    const templateData = {
        email,
        rejectedOrgName,
        frontendUrl: config_js_1.default.frontendUrl
    };
    // Send the email using the common function
    await (0, send_email_js_1.default)(email, index_js_1.connectionRejectionTemplate, templateData, 'connection rejection');
}
exports.default = sendConnectionRejected;
//# sourceMappingURL=rejection.js.map