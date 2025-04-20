"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listConnections = listConnections;
const connection_1 = __importDefault(require("../../../services/connection"));
const auth_utils_1 = require("../auth-utils");
const error_utils_1 = require("../error-utils");
/**
 * List connections for the authenticated user's organization
 * @param req Express request object
 * @param res Express response object
 */
async function listConnections(req, res) {
    try {
        // Authenticate user
        const user = (0, auth_utils_1.authenticateUser)(req, res);
        if (!user)
            return;
        // Get connections
        const connections = await connection_1.default.listConnections(user.orgId);
        // Return response
        res.status(200).json({ connections });
    }
    catch (error) {
        (0, error_utils_1.handleConnectionError)(error, res, 'listConnections');
    }
}
//# sourceMappingURL=list-connections.js.map