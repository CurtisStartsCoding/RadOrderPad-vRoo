"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listIncomingRequests = listIncomingRequests;
const connection_1 = __importDefault(require("../../../services/connection"));
const auth_utils_1 = require("../auth-utils");
const error_utils_1 = require("../error-utils");
/**
 * List pending incoming connection requests
 * @param req Express request object
 * @param res Express response object
 */
async function listIncomingRequests(req, res) {
    try {
        // Authenticate user
        const user = (0, auth_utils_1.authenticateUser)(req, res);
        if (!user)
            return;
        // Get incoming requests
        const requests = await connection_1.default.listIncomingRequests(user.orgId);
        // Return response
        res.status(200).json({ requests });
    }
    catch (error) {
        (0, error_utils_1.handleConnectionError)(error, res, 'listIncomingRequests');
    }
}
//# sourceMappingURL=list-incoming-requests.js.map