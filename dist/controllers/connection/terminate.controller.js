"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminateConnection = terminateConnection;
const connection_1 = __importDefault(require("../../services/connection"));
const auth_utils_1 = require("./auth-utils");
const error_utils_1 = require("./error-utils");
const validation_utils_1 = require("./validation-utils");
/**
 * Terminate an active connection
 * @param req Express request object
 * @param res Express response object
 */
async function terminateConnection(req, res) {
    try {
        // Authenticate user
        const user = (0, auth_utils_1.authenticateUser)(req, res);
        if (!user)
            return;
        // Validate relationship ID
        const relationshipId = (0, validation_utils_1.validateRelationshipId)(req, res);
        if (relationshipId === null)
            return;
        // Create termination parameters
        const params = {
            relationshipId,
            terminatingUserId: user.userId,
            terminatingOrgId: user.orgId
        };
        try {
            // Terminate connection
            const result = await connection_1.default.terminateConnection(params);
            // Return response
            res.status(200).json(result);
        }
        catch (error) {
            // Handle not found or not authorized
            if (error instanceof Error &&
                (error.message.includes('not found') ||
                    error.message.includes('not authorized'))) {
                res.status(404).json({ message: error.message });
            }
            else {
                throw error;
            }
        }
    }
    catch (error) {
        (0, error_utils_1.handleConnectionError)(error, res, 'terminateConnection');
    }
}
exports.default = {
    terminateConnection
};
//# sourceMappingURL=terminate.controller.js.map