import { EmailContent, EmailTemplateData, PasswordResetEmailData } from '../types';
import { BaseEmailTemplate } from './email-template-base';

/**
 * Template for password reset emails
 */
export class PasswordResetEmailTemplate extends BaseEmailTemplate {
  /**
   * Generate email content for password reset
   * @param data Password reset data
   * @returns Email content
   */
  generateContent(data: EmailTemplateData): EmailContent {
    const resetData = data as PasswordResetEmailData;
    const { token } = resetData;
    
    // Create the reset link
    const frontendUrl = this.getFrontendUrl(data);
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;
    
    // Create the text email body
    const textBody = `
Hello,

We received a request to reset your password for your RadOrderPad account.

Please click the following link to reset your password:
${resetLink}

This link will expire in 1 hour.

If you did not request a password reset, please ignore this email or contact support if you have concerns.

${this.getEmailSignature()}
    `;
    
    // Create the HTML email body
    const htmlContent = `
      <p>We received a request to reset your password for your RadOrderPad account.</p>
      <p>Please click the button below to reset your password:</p>
      <p><a href="${resetLink}" class="button">Reset Password</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${resetLink}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
    `;
    
    const htmlBody = this.wrapHtml('Password Reset Request', htmlContent);
    
    return {
      subject: 'Password Reset Request - RadOrderPad',
      textBody,
      htmlBody
    };
  }
}

// Create and export a singleton instance
export default new PasswordResetEmailTemplate();