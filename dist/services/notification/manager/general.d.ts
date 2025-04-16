/**
 * General notification manager functions
 */
export declare class GeneralNotificationManager {
    /**
     * Send a notification email
     * @param email Email address to send the notification to
     * @param subject Email subject
     * @param message Email message
     */
    sendNotificationEmail(email: string, subject: string, message: string): Promise<void>;
}
declare const _default: GeneralNotificationManager;
export default _default;
