import { getUserById } from '../../../services/superadmin';
/**
 * Get a user by ID
 * GET /api/superadmin/users/:userId
 */
export async function getUserByIdController(req, res) {
    try {
        // Extract user ID from request parameters
        const userId = parseInt(req.params.userId, 10);
        if (isNaN(userId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
            return;
        }
        // Call the service function
        const user = await getUserById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: `User with ID ${userId} not found`
            });
            return;
        }
        // Return the user
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (error) {
        console.error(`Error getting user with ID ${req.params.userId}:`, error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user',
            error: error.message
        });
    }
}
//# sourceMappingURL=get-user-by-id.js.map