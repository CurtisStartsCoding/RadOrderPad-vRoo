import emailSender from '../../email-sender.js';
/**
 * Common function to send an email using a template
 * @param email Email address to send to
 * @param template Email template to use
 * @param templateData Data to populate the template with
 * @param notificationType Type of notification for logging
 */
export async function sendTemplatedEmail(email, template, templateData, notificationType) {
    // Log the attempt
    console.log(`[NOTIFICATION] Sending ${notificationType} notification to ${email}`);
    // Generate the email content
    const emailContent = template.generateContent(templateData);
    // Send the email
    await emailSender.sendEmail(email, emailContent.subject, emailContent.textBody, emailContent.htmlBody);
}
export default sendTemplatedEmail;
//# sourceMappingURL=send-email.js.map