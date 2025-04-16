import emailSender from '../../../email-sender';
import { connectionTerminationTemplate } from '../../../templates';
import { prepareConnectionTerminationData } from './prepare-connection-termination-data';

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
  // Log the attempt
  console.log(`[NOTIFICATION] Sending connection termination notification to ${email}`);
  
  // Prepare the template data
  const templateData = prepareConnectionTerminationData(
    email,
    partnerOrgName,
    terminatingOrgName
  );
  
  // Generate the email content
  const emailContent = connectionTerminationTemplate.generateContent(templateData);
  
  // Send the email
  await emailSender.sendEmail(
    email,
    emailContent.subject,
    emailContent.textBody,
    emailContent.htmlBody
  );
}