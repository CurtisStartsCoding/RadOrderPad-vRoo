import { BaseEmailTemplate } from '../email-template-base.js';
/**
 * Template for connection request emails
 */
export class ConnectionRequestEmailTemplate extends BaseEmailTemplate {
    /**
     * Generate email content for connection request
     * @param data Connection request data
     * @returns Email content
     */
    generateContent(data) {
        const { requestingOrgName } = data;
        // Create the connections link
        const frontendUrl = this.getFrontendUrl(data);
        const connectionsLink = `${frontendUrl}/connections/requests`;
        // Create the text email body
        const textBody = `
Hello,

${requestingOrgName} has requested to connect with your organization on RadOrderPad.

Please log in to your RadOrderPad account to review and respond to this connection request:
${connectionsLink}

${this.getEmailSignature()}
    `;
        // Create the HTML email body
        const htmlContent = `
      <p><strong>${requestingOrgName}</strong> has requested to connect with your organization on RadOrderPad.</p>
      <p>Please log in to your RadOrderPad account to review and respond to this connection request:</p>
      <p><a href="${connectionsLink}" class="button">View Connection Requests</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${connectionsLink}</p>
    `;
        const htmlBody = this.wrapHtml('New Connection Request', htmlContent);
        return {
            subject: `New Connection Request from ${requestingOrgName}`,
            textBody,
            htmlBody
        };
    }
}
// Create and export a singleton instance
export default new ConnectionRequestEmailTemplate();
//# sourceMappingURL=request-template.js.map