import { sendEmail } from './send';
/**
 * AWS SES Email Sender implementation
 */
export class AwsSesEmailSender {
    /**
     * Send an email using AWS SES
     * @param to Recipient email address
     * @param subject Email subject
     * @param textBody Plain text email body
     * @param htmlBody HTML email body (optional)
     */
    async sendEmail(to, subject, textBody, htmlBody) {
        return sendEmail(to, subject, textBody, htmlBody);
    }
}
// Export individual components for direct use
export * from './client';
export * from './test-mode';
export * from './params-builder';
export * from './send';
// Create and export a singleton instance
export default new AwsSesEmailSender();
//# sourceMappingURL=index.js.map