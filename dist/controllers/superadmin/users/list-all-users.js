"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllUsersController = listAllUsersController;
const superadmin_1 = require("../../../services/superadmin");
const logger_1 = __importDefault(require("../../../utils/logger"));
/**
 * List all users with optional filtering
 * GET /api/superadmin/users
 */
async function listAllUsersController(req, res) {
    try {
        // Extract query parameters for filtering
        const filters = {};
        if (req.query.orgId) {
            filters.orgId = parseInt(req.query.orgId, 10);
        }
        if (req.query.email) {
            filters.email = req.query.email;
        }
        if (req.query.role) {
            filters.role = req.query.role;
        }
        if (req.query.status !== undefined) {
            filters.status = req.query.status === 'true';
        }
        // Call the service function
        const users = await (0, superadmin_1.listAllUsers)(filters);
        // Return the users
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    }
    catch (error) {
        logger_1.default.error('Error in listAllUsersController:', {
            error,
            queryParams: req.query
        });
        res.status(500).json({
            success: false,
            message: 'Failed to list users',
            error: error.message
        });
    }
}
//# sourceMappingURL=list-all-users.js.map