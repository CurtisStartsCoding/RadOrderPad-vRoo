import { listAllUsers } from '../../../services/superadmin';
/**
 * List all users with optional filtering
 * GET /api/superadmin/users
 */
export async function listAllUsersController(req, res) {
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
        const users = await listAllUsers(filters);
        // Return the users
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    }
    catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to list users',
            error: error.message
        });
    }
}
//# sourceMappingURL=list-all-users.js.map