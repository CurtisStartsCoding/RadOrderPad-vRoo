import config from '../../../../config/config';
import { connectionRequestTemplate } from '../../templates';
import sendTemplatedEmail from './send-email';
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