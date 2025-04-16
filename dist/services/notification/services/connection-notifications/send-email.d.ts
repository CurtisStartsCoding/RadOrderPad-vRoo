import { EmailTemplate, EmailTemplateData } from '../../types';
/**
 * Common function to send an email using a template
 * @param email Email address to send to
 * @param template Email template to use
 * @param templateData Data to populate the template with
 * @param notificationType Type of notification for logging
 */
export declare function sendTemplatedEmail(email: string, template: EmailTemplate, templateData: EmailTemplateData, notificationType: string): Promise<void>;
export default sendTemplatedEmail;
