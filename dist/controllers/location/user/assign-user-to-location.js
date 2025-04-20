import locationService from '../../../services/location';
import { checkAuthentication, validateUserAndLocationIds, handleControllerError } from '../types';
/**
 * Assign a user to a location
 * @param req Express request object
 * @param res Express response object
 */
export const assignUserToLocation = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!checkAuthentication(req, res)) {
            return;
        }
        // Validate user and location IDs
        if (!validateUserAndLocationIds(req, res)) {
            return;
        }
        const orgId = req.user.orgId;
        const userId = parseInt(req.params.userId);
        const locationId = parseInt(req.params.locationId);
        try {
            const success = await locationService.assignUserToLocation(userId, locationId, orgId);
            if (success) {
                res.status(200).json({
                    message: 'User assigned to location successfully',
                    userId,
                    locationId
                });
            }
            else {
                res.status(500).json({ message: 'Failed to assign user to location' });
            }
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
        handleControllerError(res, error, 'Failed to assign user to location');
    }
};
export default assignUserToLocation;
//# sourceMappingURL=assign-user-to-location.js.map