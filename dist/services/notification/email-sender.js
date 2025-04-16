"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsSesEmailSender = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
const config_1 = __importDefault(require("../../config/config"));
/**
 * AWS SES Email Sender implementation
 */
class AwsSesEmailSender {
    /**
     * Create a new AWS SES Email Sender
     */
    constructor() {
        // Initialize the SES client with AWS credentials and region
        this.sesClient = new client_ses_1.SESClient({
            region: config_1.default.aws.region,
            credentials: {
                accessKeyId: config_1.default.aws.accessKeyId || '',
                secretAccessKey: config_1.default.aws.secretAccessKey || ''
            }
        });
        // Set the from email address and test mode
        this.fromEmail = config_1.default.aws.ses.fromEmail;
        this.testMode = config_1.default.aws.ses.testMode;
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
            const command = new client_ses_1.SendEmailCommand(params);
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
exports.AwsSesEmailSender = AwsSesEmailSender;
// Create and export a singleton instance
exports.default = new AwsSesEmailSender();
//# sourceMappingURL=email-sender.js.map