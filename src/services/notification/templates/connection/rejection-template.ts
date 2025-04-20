import { EmailContent, ConnectionRejectionEmailData } from '../../types.js';
import { BaseEmailTemplate } from '../email-template-base.js';

/**
 * Template for connection rejection emails
 */
export class ConnectionRejectionEmailTemplate extends BaseEmailTemplate {
  /**
   * Generate email content for connection rejection
   * @param data Connection rejection data
   * @returns Email content
   */
  generateContent(data: ConnectionRejectionEmailData): EmailContent {
    // Extract data
    const { rejectedOrgName } = data;
    
    // Create the connections link
    const frontendUrl = this.getFrontendUrl(data);
    const connectionsLink = `${frontendUrl}/connections`;
    
    // Create the text email body
    const textBody = `
Hello,

Your connection request to partner with ${rejectedOrgName} has been rejected.

You can view and manage your connections in your RadOrderPad account:
${connectionsLink}

${this.getEmailSignature()}
    `;
    
    // Create the HTML email body
    const htmlContent = `
      <p>Your connection request to partner with <strong>${rejectedOrgName}</strong> has been rejected.</p>
      <p>You can view and manage your connections in your RadOrderPad account:</p>
      <p><a href="${connectionsLink}" class="button">View Connections</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${connectionsLink}</p>
    `;
    
    const htmlBody = this.wrapHtml('Connection Request Rejected', htmlContent);
    
    return {
      subject: 'Connection Request Rejected',
      textBody,
      htmlBody
    };
  }
}

// Create and export a singleton instance
export default new ConnectionRejectionEmailTemplate();