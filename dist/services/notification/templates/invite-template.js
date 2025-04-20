import { BaseEmailTemplate } from './email-template-base.js';
/**
 * Template for invitation emails
 */
export class InviteEmailTemplate extends BaseEmailTemplate {
    /**
     * Generate email content for invitation
     * @param data Invitation data
     * @returns Email content
     */
    generateContent(data) {
        const inviteData = data;
        const { token, organizationName, inviterName } = inviteData;
        // Create the invitation link
        const frontendUrl = this.getFrontendUrl(data);
        const invitationLink = `${frontendUrl}/accept-invitation?token=${token}`;
        // Create the text email body
        const textBody = `
Hello,

You have been invited by ${inviterName} to join ${organizationName} on RadOrderPad.

Please click the following link to accept the invitation:
${invitationLink}

This invitation link will expire in 7 days.

If you have any questions, please contact ${inviterName}.

${this.getEmailSignature()}
    `;
        // Create the HTML email body
        const htmlContent = `
      <p>You have been invited by <strong>${inviterName}</strong> to join <strong>${organizationName}</strong> on RadOrderPad.</p>
      <p>Please click the button below to accept the invitation:</p>
      <p><a href="${invitationLink}" class="button">Accept Invitation</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${invitationLink}</p>
      <p>This invitation link will expire in 7 days.</p>
      <p>If you have any questions, please contact ${inviterName}.</p>
    `;
        const htmlBody = this.wrapHtml('RadOrderPad Invitation', htmlContent);
        return {
            subject: `Invitation to join ${organizationName} on RadOrderPad`,
            textBody,
            htmlBody
        };
    }
}
// Create and export a singleton instance
export default new InviteEmailTemplate();
//# sourceMappingURL=invite-template.js.map