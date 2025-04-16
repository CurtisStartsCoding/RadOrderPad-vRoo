"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTestModeEnabled = isTestModeEnabled;
exports.handleTestMode = handleTestMode;
const config_1 = __importDefault(require("../../../config/config"));
/**
 * Check if email test mode is enabled
 */
function isTestModeEnabled() {
    return config_1.default.aws.ses.testMode;
}
/**
 * Handle test mode for email sending
 * @param to Recipient email address
 * @param subject Email subject
 * @param textBody Plain text email body
 * @returns true if in test mode and email sending should be skipped
 */
function handleTestMode(to, subject, textBody) {
    // Log the test mode configuration
    console.log(`[NOTIFICATION] Email test mode is: ${isTestModeEnabled() ? 'ENABLED' : 'DISABLED'}`);
    // Check if test mode is enabled
    if (isTestModeEnabled()) {
        // In test mode, just log the email details and return true to skip sending
        console.log(`[TEST MODE] Email send skipped for recipient: ${to}, subject: ${subject}`);
        console.log(`[TEST MODE] Email body would have been: ${textBody.substring(0, 100)}...`);
        return true;
    }
    return false;
}
//# sourceMappingURL=test-mode.js.map