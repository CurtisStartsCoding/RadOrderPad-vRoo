/**
 * Handle test mode for email sending
 * @param to Recipient email address
 * @param subject Email subject
 * @param textBody Plain text email body
 * @returns true if in test mode and email sending should be skipped
 */
export declare function handleTestMode(to: string, subject: string, textBody: string): boolean;
