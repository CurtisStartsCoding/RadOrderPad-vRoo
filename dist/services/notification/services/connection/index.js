"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionNotificationService = void 0;
const request_1 = require("./request/");
const approval_1 = require("./approval");
const rejection_1 = require("./rejection");
const termination_1 = require("./termination");
/**
 * Service for handling connection-related notifications
 */
class ConnectionNotificationService {
    /**
     * Send a connection request notification to an organization
     * @param email Email address of the target organization admin
     * @param requestingOrgName Name of the organization requesting the connection
     */
    async sendConnectionRequest(email, requestingOrgName) {
        return (0, request_1.sendConnectionRequest)(email, requestingOrgName);
    }
    /**
     * Send a connection approval notification
     * @param email Email address of the requesting organization admin
     * @param approvedOrgName Name of the organization that requested the connection
     */
    async sendConnectionApproved(email, approvedOrgName) {
        return (0, approval_1.sendConnectionApproved)(email, approvedOrgName);
    }
    /**
     * Send a connection rejection notification
     * @param email Email address of the requesting organization admin
     * @param rejectedOrgName Name of the organization that requested the connection
     */
    async sendConnectionRejected(email, rejectedOrgName) {
        return (0, rejection_1.sendConnectionRejected)(email, rejectedOrgName);
    }
    /**
     * Send a connection termination notification
     * @param email Email address of the partner organization admin
     * @param partnerOrgName Name of the partner organization
     * @param terminatingOrgName Name of the organization terminating the connection
     */
    async sendConnectionTerminated(email, partnerOrgName, terminatingOrgName) {
        return (0, termination_1.sendConnectionTerminated)(email, partnerOrgName, terminatingOrgName);
    }
}
exports.ConnectionNotificationService = ConnectionNotificationService;
// Export individual functions for direct use
__exportStar(require("./request/"), exports);
__exportStar(require("./approval"), exports);
__exportStar(require("./rejection"), exports);
__exportStar(require("./termination"), exports);
// Create and export a singleton instance
exports.default = new ConnectionNotificationService();
//# sourceMappingURL=index.js.map