import { BaseEmailTemplate } from '../email-template-base';
/**
 * Template for connection termination emails
 */
export class ConnectionTerminationEmailTemplate extends BaseEmailTemplate {
    /**
     * Generate email content for connection termination
     * @param data Connection termination data
     * @returns Email content
     */
    generateContent(data) {
        const terminationData = data;
        const { terminatingOrgName } = terminationData;
        // Create the connections link
        const frontendUrl = this.getFrontendUrl(data);
        const connectionsLink = `${frontendUrl}/connections`;
        // Create the text email body
        const textBody = `
Hello,

${terminatingOrgName} has terminated their connection with your organization on RadOrderPad.

You can view and manage your connections in your RadOrderPad account:
${connectionsLink}

${this.getEmailSignature()}
    `;
        // Create the HTML email body
        const htmlContent = `
      <p><strong>${terminatingOrgName}</strong> has terminated their connection with your organization on RadOrderPad.</p>
      <p>You can view and manage your connections in your RadOrderPad account:</p>
      <p><a href="${connectionsLink}" class="button">View Connections</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${connectionsLink}</p>
    `;
        const htmlBody = this.wrapHtml('Connection Terminated', htmlContent);
        return {
            subject: 'Connection Terminated',
            textBody,
            htmlBody
        };
    }
}
// Create and export a singleton instance
export default new ConnectionTerminationEmailTemplate();
//# sourceMappingURL=termination-template.js.map