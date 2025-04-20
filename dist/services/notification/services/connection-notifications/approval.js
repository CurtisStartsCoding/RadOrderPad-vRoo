import config from '../../../../config/config';
import { connectionApprovalTemplate } from '../../templates';
import sendTemplatedEmail from './send-email';
/**
 * Send a connection approval notification
 * @param email Email address of the requesting organization admin
 * @param approvedOrgName Name of the organization that requested the connection
 */
export async function sendConnectionApproved(email, approvedOrgName) {
    // Prepare the template data
    const templateData = {
        email,
        approvedOrgName,
        frontendUrl: config.frontendUrl
    };
    // Send the email using the common function
    await sendTemplatedEmail(email, connectionApprovalTemplate, templateData, 'connection approval');
}
export default sendConnectionApproved;
//# sourceMappingURL=approval.js.map