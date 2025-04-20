import config from '../../../../config/config.js';
import { connectionRequestTemplate } from '../../templates/index.js';
import sendTemplatedEmail from './send-email.js';
/**
 * Send a connection request notification to an organization
 * @param email Email address of the target organization admin
 * @param requestingOrgName Name of the organization requesting the connection
 */
export async function sendConnectionRequest(email, requestingOrgName) {
    // Prepare the template data
    const templateData = {
        email,
        requestingOrgName,
        frontendUrl: config.frontendUrl
    };
    // Send the email using the common function
    await sendTemplatedEmail(email, connectionRequestTemplate, templateData, 'connection request');
}
export default sendConnectionRequest;
//# sourceMappingURL=request.js.map