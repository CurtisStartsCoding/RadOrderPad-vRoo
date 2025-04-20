import emailSender from '../email-sender';
import { inviteTemplate, passwordResetTemplate } from '../templates';
/**
 * Service for handling account-related notifications
 */
export class AccountNotificationService {
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
        const emailContent = inviteTemplate.generateContent(templateData);
        // Send the email
        await emailSender.sendEmail(email, emailContent.subject, emailContent.textBody, emailContent.htmlBody);
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
        const emailContent = passwordResetTemplate.generateContent(templateData);
        // Send the email
        await emailSender.sendEmail(email, emailContent.subject, emailContent.textBody, emailContent.htmlBody);
    }
}
// Create and export a singleton instance
export default new AccountNotificationService();
//# sourceMappingURL=account-notifications.js.map