import locationService from '../../../services/location';
import { checkAuthentication, validateUserId, handleControllerError } from '../types';
/**
 * List locations assigned to a user
 * @param req Express request object
 * @param res Express response object
 */
export const listUserLocations = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!checkAuthentication(req, res)) {
            return;
        }
        // Validate user ID
        if (!validateUserId(req, res)) {
            return;
        }
        const orgId = req.user.orgId;
        const userId = parseInt(req.params.userId);
        try {
            const locations = await locationService.listUserLocations(userId, orgId);
            res.status(200).json({ locations });
        }
        catch (error) {
            // Handle not found or not authorized
            if (error.message.includes('not found or not authorized')) {
                res.status(404).json({ message: error.message });
            }
            else {
                throw error;
            }
        }
    }
    catch (error) {
        handleControllerError(res, error, 'Failed to list user locations');
    }
};
export default listUserLocations;
//# sourceMappingURL=list-user-locations.js.map