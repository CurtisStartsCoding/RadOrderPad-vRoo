"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllOrganizationsController = listAllOrganizationsController;
const superadmin_1 = require("../../../services/superadmin");
/**
 * List all organizations with optional filtering
 * GET /api/superadmin/organizations
 */
async function listAllOrganizationsController(req, res) {
    try {
        // Extract query parameters for filtering
        const filters = {
            name: req.query.name,
            type: req.query.type,
            status: req.query.status
        };
        // Call the service function
        const organizations = await (0, superadmin_1.listAllOrganizations)(filters);
        // Return the organizations
        res.status(200).json({
            success: true,
            count: organizations.length,
            data: organizations
        });
    }
    catch (error) {
        console.error('Error listing organizations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to list organizations',
            error: error.message
        });
    }
}
//# sourceMappingURL=list-all-organizations.js.map