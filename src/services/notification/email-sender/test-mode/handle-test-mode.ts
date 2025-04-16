import { isTestModeEnabled } from './is-test-mode-enabled';

/**
 * Handle test mode for email sending
 * @param to Recipient email address
 * @param subject Email subject
 * @param textBody Plain text email body
 * @returns true if in test mode and email sending should be skipped
 */
export function handleTestMode(
  to: string,
  subject: string,
  textBody: string
): boolean {
  // Log the test mode configuration
  console.log(`[NOTIFICATION] Email test mode is: ${isTestModeEnabled() ? 'ENABLED' : 'DISABLED'}`);
  
  // Check if test mode is enabled
  if (isTestModeEnabled()) {
    // In test mode, just log the email details and return true to skip sending
    console.log(`[TEST MODE] Email send skipped for recipient: ${to}, subject: ${subject}`);
    console.log(`[TEST MODE] Email body would have been: ${textBody.substring(0, 100)}...`);
    return true;
  }
  
  return false;
}