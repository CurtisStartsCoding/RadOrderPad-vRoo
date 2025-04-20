import config from '../../../../config/config.js';
import { connectionTerminationTemplate } from '../../templates/index.js';
import { ConnectionTerminationEmailData } from '../../types.js';
import sendTemplatedEmail from './send-email.js';

/**
 * Send a connection termination notification
 * @param email Email address of the partner organization admin
 * @param partnerOrgName Name of the partner organization
 * @param terminatingOrgName Name of the organization terminating the connection
 */
export async function sendConnectionTerminated(
  email: string,
  partnerOrgName: string,
  terminatingOrgName: string
): Promise<void> {
  // Prepare the template data
  const templateData: ConnectionTerminationEmailData = {
    email,
    partnerOrgName,
    terminatingOrgName,
    frontendUrl: config.frontendUrl
  };
  
  // Send the email using the common function
  await sendTemplatedEmail(
    email,
    connectionTerminationTemplate,
    templateData,
    'connection termination'
  );
}

export default sendConnectionTerminated;