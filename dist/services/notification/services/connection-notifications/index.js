"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionNotificationService = void 0;
const request_1 = __importDefault(require("./request"));
const approval_1 = __importDefault(require("./approval"));
const rejection_1 = __importDefault(require("./rejection"));
const termination_1 = __importDefault(require("./termination"));
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
        return (0, request_1.default)(email, requestingOrgName);
    }
    /**
     * Send a connection approval notification
     * @param email Email address of the requesting organization admin
     * @param approvedOrgName Name of the organization that requested the connection
     */
    async sendConnectionApproved(email, approvedOrgName) {
        return (0, approval_1.default)(email, approvedOrgName);
    }
    /**
     * Send a connection rejection notification
     * @param email Email address of the requesting organization admin
     * @param rejectedOrgName Name of the organization that requested the connection
     */
    async sendConnectionRejected(email, rejectedOrgName) {
        return (0, rejection_1.default)(email, rejectedOrgName);
    }
    /**
     * Send a connection termination notification
     * @param email Email address of the partner organization admin
     * @param partnerOrgName Name of the partner organization
     * @param terminatingOrgName Name of the organization terminating the connection
     */
    async sendConnectionTerminated(email, partnerOrgName, terminatingOrgName) {
        return (0, termination_1.default)(email, partnerOrgName, terminatingOrgName);
    }
}
exports.ConnectionNotificationService = ConnectionNotificationService;
// Create and export a singleton instance
exports.default = new ConnectionNotificationService();
//# sourceMappingURL=index.js.map