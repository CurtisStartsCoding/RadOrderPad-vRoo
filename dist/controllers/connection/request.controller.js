"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestConnection = requestConnection;
const connection_1 = __importDefault(require("../../services/connection"));
const auth_utils_1 = require("./auth-utils");
const error_utils_1 = require("./error-utils");
const validation_utils_1 = require("./validation-utils");
/**
 * Request a connection to another organization
 * @param req Express request object
 * @param res Express response object
 */
async function requestConnection(req, res) {
    try {
        // Authenticate user
        const user = (0, auth_utils_1.authenticateUser)(req, res);
        if (!user)
            return;
        // Validate target organization ID
        const targetOrgId = (0, validation_utils_1.validateTargetOrgId)(req, res, user.orgId);
        if (targetOrgId === null)
            return;
        // Extract notes from request body
        const { notes } = req.body;
        // Create request parameters
        const params = {
            initiatingOrgId: user.orgId,
            targetOrgId,
            initiatingUserId: user.userId,
            notes
        };
        // Request connection
        const result = await connection_1.default.requestConnection(params);
        // Return response
        if (result.success) {
            res.status(201).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        (0, error_utils_1.handleConnectionError)(error, res, 'requestConnection');
    }
}
exports.default = {
    requestConnection
};
//# sourceMappingURL=request.controller.js.map