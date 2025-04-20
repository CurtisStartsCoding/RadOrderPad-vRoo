import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import config from '../../config/config';
/**
 * AWS SES Email Sender implementation
 */
export class AwsSesEmailSender {
    /**
     * Create a new AWS SES Email Sender
     */
    constructor() {
        // Initialize the SES client with AWS credentials and region
        this.sesClient = new SESClient({
            region: config.aws.region,
            credentials: {
                accessKeyId: config.aws.accessKeyId || '',
                secretAccessKey: config.aws.secretAccessKey || ''
            }
        });
        // Set the from email address and test mode
        this.fromEmail = config.aws.ses.fromEmail;
        this.testMode = config.aws.ses.testMode;
    }
    /**
     * Send an email using AWS SES
     * @param to Recipient email address
     * @param subject Email subject
     * @param textBody Plain text email body
     * @param htmlBody HTML email body (optional)
     */
    async sendEmail(to, subject, textBody, htmlBody) {
        try {
            // Log the test mode configuration
            console.log(`[NOTIFICATION] Email test mode is: ${this.testMode ? 'ENABLED' : 'DISABLED'}`);
            // Check if test mode is enabled
            if (this.testMode) {
                // In test mode, just log the email details and return successfully
                console.log(`[TEST MODE] Email send skipped for recipient: ${to}, subject: ${subject}`);
                console.log(`[TEST MODE] Email body would have been: ${textBody.substring(0, 100)}...`);
                return;
            }
            // Construct the email parameters
            const params = {
                Source: this.fromEmail,
                Destination: {
                    ToAddresses: [to]
                },
                Message: {
                    Subject: {
                        Data: subject,
                        Charset: 'UTF-8'
                    },
                    Body: {
                        Text: {
                            Data: textBody,
                            Charset: 'UTF-8'
                        },
                        ...(htmlBody && {
                            Html: {
                                Data: htmlBody,
                                Charset: 'UTF-8'
                            }
                        })
                    }
                }
            };
            // Send the email
            const command = new SendEmailCommand(params);
            await this.sesClient.send(command);
            // Log success
            console.log(`[NOTIFICATION] Email sent successfully to ${to}`);
        }
        catch (error) {
            // Log error
            console.error(`[NOTIFICATION] Failed to send email to ${to}:`, error);
            throw error;
        }
    }
}
// Create and export a singleton instance
export default new AwsSesEmailSender();
//# sourceMappingURL=email-sender.js.map