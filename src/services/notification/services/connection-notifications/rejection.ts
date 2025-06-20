import config from '../../../../config/config';
import { connectionRejectionTemplate } from '../../templates';
import { ConnectionRejectionEmailData } from '../../types';
import sendTemplatedEmail from './send-email';

/**
 * Send a connection rejection notification
 * @param email Email address of the requesting organization admin
 * @param rejectedOrgName Name of the organization that requested the connection
 */
export async function sendConnectionRejected(
  email: string,
  rejectedOrgName: string
): Promise<void> {
  // Prepare the template data
  const templateData: ConnectionRejectionEmailData = {
    email,
    rejectedOrgName,
    frontendUrl: config.frontendUrl
  };
  
  // Send the email using the common function
  await sendTemplatedEmail(
    email,
    connectionRejectionTemplate,
    templateData,
    'connection rejection'
  );
}

export default sendConnectionRejected;