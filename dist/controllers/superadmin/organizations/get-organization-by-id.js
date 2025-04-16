"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizationByIdController = getOrganizationByIdController;
const superadmin_1 = require("../../../services/superadmin");
/**
 * Get an organization by ID
 * GET /api/superadmin/organizations/:orgId
 */
async function getOrganizationByIdController(req, res) {
    try {
        // Extract organization ID from request parameters
        const orgId = parseInt(req.params.orgId, 10);
        if (isNaN(orgId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid organization ID'
            });
            return;
        }
        // Call the service function
        const organization = await (0, superadmin_1.getOrganizationById)(orgId);
        if (!organization) {
            res.status(404).json({
                success: false,
                message: `Organization with ID ${orgId} not found`
            });
            return;
        }
        // Return the organization
        res.status(200).json({
            success: true,
            data: organization
        });
    }
    catch (error) {
        console.error(`Error getting organization with ID ${req.params.orgId}:`, error);
        res.status(500).json({
            success: false,
            message: 'Failed to get organization',
            error: error.message
        });
    }
}
//# sourceMappingURL=get-organization-by-id.js.map