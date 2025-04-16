import emailSender from '../../../email-sender';
import { connectionRequestTemplate } from '../../../templates';
import { prepareConnectionRequestData } from './prepare-connection-request-data';

/**
 * Send a connection request notification to an organization
 * @param email Email address of the target organization admin
 * @param requestingOrgName Name of the organization requesting the connection
 */
export async function sendConnectionRequest(
  email: string,
  requestingOrgName: string
): Promise<void> {
  // Log the attempt
  console.log(`[NOTIFICATION] Sending connection request notification to ${email}`);
  
  // Prepare the template data
  const templateData = prepareConnectionRequestData(email, requestingOrgName);
  
  // Generate the email content
  const emailContent = connectionRequestTemplate.generateContent(templateData);
  
  // Send the email
  await emailSender.sendEmail(
    email,
    emailContent.subject,
    emailContent.textBody,
    emailContent.htmlBody
  );
}