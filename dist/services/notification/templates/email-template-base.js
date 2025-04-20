/**
 * Base class for email templates
 */
export class BaseEmailTemplate {
    /**
     * Get the frontend URL from environment or use default
     * @returns Frontend URL
     */
    getFrontendUrl(data) {
        return data.frontendUrl || process.env.FRONTEND_URL || 'https://app.radorderpad.com';
    }
    /**
     * Generate common HTML header styles
     * @returns HTML style string
     */
    getHtmlStyles() {
        return `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #0066cc; color: white; padding: 10px 20px; }
      .content { padding: 20px; }
      .button { display: inline-block; background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
      .footer { font-size: 12px; color: #666; margin-top: 30px; }
    </style>`;
    }
    /**
     * Generate common HTML footer
     * @returns HTML footer string
     */
    getHtmlFooter() {
        return `
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>`;
    }
    /**
     * Generate common email signature
     * @returns Email signature string
     */
    getEmailSignature() {
        return `
Best regards,
The RadOrderPad Team`;
    }
    /**
     * Generate HTML wrapper for email content
     * @param title Email title
     * @param content Email content
     * @returns Complete HTML email
     */
    wrapHtml(title, content) {
        return `
<html>
<head>
  ${this.getHtmlStyles()}
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>${title}</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      ${content}
      <p>Best regards,<br>The RadOrderPad Team</p>
    </div>
    ${this.getHtmlFooter()}
  </div>
</body>
</html>`;
    }
}
//# sourceMappingURL=email-template-base.js.map