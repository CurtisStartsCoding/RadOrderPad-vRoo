"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsSesEmailSender = void 0;
const send_1 = require("./send");
/**
 * AWS SES Email Sender implementation
 */
class AwsSesEmailSender {
    /**
     * Send an email using AWS SES
     * @param to Recipient email address
     * @param subject Email subject
     * @param textBody Plain text email body
     * @param htmlBody HTML email body (optional)
     */
    async sendEmail(to, subject, textBody, htmlBody) {
        return (0, send_1.sendEmail)(to, subject, textBody, htmlBody);
    }
}
exports.AwsSesEmailSender = AwsSesEmailSender;
// Export individual components for direct use
__exportStar(require("./client"), exports);
__exportStar(require("./test-mode"), exports);
__exportStar(require("./params-builder"), exports);
__exportStar(require("./send"), exports);
// Create and export a singleton instance
exports.default = new AwsSesEmailSender();
//# sourceMappingURL=index.js.map