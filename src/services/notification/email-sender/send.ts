import { SendEmailCommand } from '@aws-sdk/client-ses';
import { sesClient } from './client';
import { handleTestMode } from './test-mode';
import { buildEmailParams } from './params-builder';

/**
 * Send an email using AWS SES
 * @param to Recipient email address
 * @param subject Email subject
 * @param textBody Plain text email body
 * @param htmlBody HTML email body (optional)
 */
export async function sendEmail(
  to: string,
  subject: string,
  textBody: string,
  htmlBody?: string
): Promise<void> {
  try {
    // Check if we're in test mode and should skip sending
    if (handleTestMode(to, subject, textBody)) {
      return;
    }

    // Build the email parameters
    const params = buildEmailParams(to, subject, textBody, htmlBody);

    // Create the command
    const command = new SendEmailCommand(params);
    
    // Send the email
    await sesClient.send(command);
    
    // Log success
    console.log(`[NOTIFICATION] Email sent successfully to ${to}`);
  } catch (error) {
    // Log error
    console.error(`[NOTIFICATION] Failed to send email to ${to}:`, error);
    throw error;
  }
}