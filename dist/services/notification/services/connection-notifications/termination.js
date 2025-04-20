import config from '../../../../config/config';
import { connectionTerminationTemplate } from '../../templates';
import sendTemplatedEmail from './send-email';
/**
 * Send a connection termination notification
 * @param email Email address of the partner organization admin
 * @param partnerOrgName Name of the partner organization
 * @param terminatingOrgName Name of the organization terminating the connection
 */
export async function sendConnectionTerminated(email, partnerOrgName, terminatingOrgName) {
    // Prepare the template data
    const templateData = {
        email,
        partnerOrgName,
        terminatingOrgName,
        frontendUrl: config.frontendUrl
    };
    // Send the email using the common function
    await sendTemplatedEmail(email, connectionTerminationTemplate, templateData, 'connection termination');
}
export default sendConnectionTerminated;
//# sourceMappingURL=termination.js.map