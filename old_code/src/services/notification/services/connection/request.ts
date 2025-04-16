import emailSender from '../../email-sender';
import { connectionRequestTemplate } from '../../templates';
import { ConnectionRequestEmailData } from '../../types';
import config from '../../../../config/config';

/**
 * Get the frontend URL from environment variables
 */
export function getFrontendUrl(): string {
  return config.frontendUrl;
}

/**
 * Prepare the template data for a connection request notification
 * @param email Email address of the target organization admin
 * @param requestingOrgName Name of the organization requesting the connection
 */
export function prepareConnectionRequestData(
  email: string,
  requestingOrgName: string
): ConnectionRequestEmailData {
  return {
    email,
    requestingOrgName,
    frontendUrl: getFrontendUrl()
  };
}

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