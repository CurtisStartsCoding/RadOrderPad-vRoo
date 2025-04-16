import { sendEmail } from './send';
import { EmailSender } from '../types';

/**
 * AWS SES Email Sender implementation
 */
export class AwsSesEmailSender implements EmailSender {
  /**
   * Send an email using AWS SES
   * @param to Recipient email address
   * @param subject Email subject
   * @param textBody Plain text email body
   * @param htmlBody HTML email body (optional)
   */
  async sendEmail(
    to: string,
    subject: string,
    textBody: string,
    htmlBody?: string
  ): Promise<void> {
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