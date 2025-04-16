import emailSender from '../../../email-sender';
import { connectionApprovalTemplate } from '../../../templates';
import { prepareConnectionApprovalData } from './prepare-connection-approval-data';

/**
 * Send a connection approval notification
 * @param email Email address of the requesting organization admin
 * @param approvedOrgName Name of the organization that requested the connection
 */
export async function sendConnectionApproved(
  email: string,
  approvedOrgName: string
): Promise<void> {
  // Log the attempt
  console.log(`[NOTIFICATION] Sending connection approval notification to ${email}`);
  
  // Prepare the template data
  const templateData = prepareConnectionApprovalData(email, approvedOrgName);
  
  // Generate the email content
  const emailContent = connectionApprovalTemplate.generateContent(templateData);
  
  // Send the email
  await emailSender.sendEmail(
    email,
    emailContent.subject,
    emailContent.textBody,
    emailContent.htmlBody
  );
}