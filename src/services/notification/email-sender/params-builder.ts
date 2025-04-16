import { SendEmailCommandInput } from '@aws-sdk/client-ses';
import config from '../../../config/config';

/**
 * Build the email parameters for AWS SES
 * @param to Recipient email address
 * @param subject Email subject
 * @param textBody Plain text email body
 * @param htmlBody HTML email body (optional)
 * @returns SendEmailCommandInput object
 */
export function buildEmailParams(
  to: string,
  subject: string,
  textBody: string,
  htmlBody?: string
): SendEmailCommandInput {
  const fromEmail = config.aws.ses.fromEmail;
  
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