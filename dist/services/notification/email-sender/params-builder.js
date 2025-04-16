"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEmailParams = buildEmailParams;
const config_1 = __importDefault(require("../../../config/config"));
/**
 * Build the email parameters for AWS SES
 * @param to Recipient email address
 * @param subject Email subject
 * @param textBody Plain text email body
 * @param htmlBody HTML email body (optional)
 * @returns SendEmailCommandInput object
 */
function buildEmailParams(to, subject, textBody, htmlBody) {
    const fromEmail = config_1.default.aws.ses.fromEmail;
    return {
        Source: fromEmail,
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
}
//# sourceMappingURL=params-builder.js.map