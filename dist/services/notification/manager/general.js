"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralNotificationManager = void 0;
const services_1 = require("../services");
/**
 * General notification manager functions
 */
class GeneralNotificationManager {
    /**
     * Send a notification email
     * @param email Email address to send the notification to
     * @param subject Email subject
     * @param message Email message
     */
    async sendNotificationEmail(email, subject, message) {
        return services_1.generalNotifications.sendNotificationEmail(email, subject, message);
    }
}
exports.GeneralNotificationManager = GeneralNotificationManager;
// Create and export a singleton instance
exports.default = new GeneralNotificationManager();
//# sourceMappingURL=general.js.map