import emailSender from '../../../email-sender';
import { connectionRejectionTemplate } from '../../../templates';
import { prepareConnectionRejectionData } from './prepare-connection-rejection-data';

/**
 * Send a connection rejection notification
 * @param email Email address of the requesting organization admin
 * @param rejectedOrgName Name of the organization that requested the connection
 */
export async function sendConnectionRejected(
  email: string,
  rejectedOrgName: string
): Promise<void> {
  // Log the attempt
  console.log(`[NOTIFICATION] Sending connection rejection notification to ${email}`);
  
  // Prepare the template data
  const templateData = prepareConnectionRejectionData(email, rejectedOrgName);
  
  // Generate the email content
  const emailContent = connectionRejectionTemplate.generateContent(templateData);
  
  // Send the email
  await emailSender.sendEmail(
    email,
    emailContent.subject,
    emailContent.textBody,
    emailContent.htmlBody
  );
}