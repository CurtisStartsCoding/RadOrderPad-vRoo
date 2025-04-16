"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTestMode = handleTestMode;
const is_test_mode_enabled_1 = require("./is-test-mode-enabled");
/**
 * Handle test mode for email sending
 * @param to Recipient email address
 * @param subject Email subject
 * @param textBody Plain text email body
 * @returns true if in test mode and email sending should be skipped
 */
function handleTestMode(to, subject, textBody) {
    // Log the test mode configuration
    console.log(`[NOTIFICATION] Email test mode is: ${(0, is_test_mode_enabled_1.isTestModeEnabled)() ? 'ENABLED' : 'DISABLED'}`);
    // Check if test mode is enabled
    if ((0, is_test_mode_enabled_1.isTestModeEnabled)()) {
        // In test mode, just log the email details and return true to skip sending
        console.log(`[TEST MODE] Email send skipped for recipient: ${to}, subject: ${subject}`);
        console.log(`[TEST MODE] Email body would have been: ${textBody.substring(0, 100)}...`);
        return true;
    }
    return false;
}
//# sourceMappingURL=handle-test-mode.js.map