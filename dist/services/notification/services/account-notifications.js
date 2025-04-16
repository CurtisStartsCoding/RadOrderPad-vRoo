"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountNotificationService = void 0;
const email_sender_1 = __importDefault(require("../email-sender"));
const templates_1 = require("../templates");
/**
 * Service for handling account-related notifications
 */
class AccountNotificationService {
    /**
     * Send an invitation email to a user
     * @param email Email address to send the invitation to
     * @param token Invitation token
     * @param organizationName Name of the organization
     * @param inviterName Name of the user who sent the invitation
     */
    async sendInviteEmail(email, token, organizationName, inviterName) {
        // Log the attempt
        console.log(`[NOTIFICATION] Sending invitation email to ${email}`);
        // Prepare the template data
        const templateData = {
            email,
            token,
            organizationName,
            inviterName,
            frontendUrl: process.env.FRONTEND_URL || 'https://app.radorderpad.com'
        };
        // Generate the email content
        const emailContent = templates_1.inviteTemplate.generateContent(templateData);
        // Send the email
        await email_sender_1.default.sendEmail(email, emailContent.subject, emailContent.textBody, emailContent.htmlBody);
    }
    /**
     * Send a password reset email to a user
     * @param email Email address to send the reset link to
     * @param token Reset token
     */
    async sendPasswordResetEmail(email, token) {
        // Log the attempt
        console.log(`[NOTIFICATION] Sending password reset email to ${email}`);
        // Prepare the template data
        const templateData = {
            email,
            token,
            frontendUrl: process.env.FRONTEND_URL || 'https://app.radorderpad.com'
        };
        // Generate the email content
        const emailContent = templates_1.passwordResetTemplate.generateContent(templateData);
        // Send the email
        await email_sender_1.default.sendEmail(email, emailContent.subject, emailContent.textBody, emailContent.htmlBody);
    }
}
exports.AccountNotificationService = AccountNotificationService;
// Create and export a singleton instance
exports.default = new AccountNotificationService();
//# sourceMappingURL=account-notifications.js.map