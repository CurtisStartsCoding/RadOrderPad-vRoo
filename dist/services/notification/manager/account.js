"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountNotificationManager = void 0;
const services_1 = require("../services");
/**
 * Account-related notification manager functions
 */
class AccountNotificationManager {
    /**
     * Send an invitation email to a user
     * @param email Email address to send the invitation to
     * @param token Invitation token
     * @param organizationName Name of the organization
     * @param inviterName Name of the user who sent the invitation
     */
    async sendInviteEmail(email, token, organizationName, inviterName) {
        return services_1.accountNotifications.sendInviteEmail(email, token, organizationName, inviterName);
    }
    /**
     * Send a password reset email to a user
     * @param email Email address to send the reset link to
     * @param token Reset token
     */
    async sendPasswordResetEmail(email, token) {
        return services_1.accountNotifications.sendPasswordResetEmail(email, token);
    }
}
exports.AccountNotificationManager = AccountNotificationManager;
// Create and export a singleton instance
exports.default = new AccountNotificationManager();
//# sourceMappingURL=account.js.map