import locationService from '../../../services/location';
import { checkAuthentication, validateLocationId, handleControllerError } from '../types';
/**
 * Deactivate a location (soft delete)
 * @param req Express request object
 * @param res Express response object
 */
export const deactivateLocation = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!checkAuthentication(req, res)) {
            return;
        }
        // Validate location ID
        if (!validateLocationId(req, res)) {
            return;
        }
        const orgId = req.user.orgId;
        const locationId = parseInt(req.params.locationId);
        try {
            const success = await locationService.deactivateLocation(locationId, orgId);
            if (success) {
                res.status(200).json({
                    message: 'Location deactivated successfully',
                    locationId
                });
            }
            else {
                res.status(404).json({ message: 'Location not found or already deactivated' });
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
        handleControllerError(res, error, 'Failed to deactivate location');
    }
};
export default deactivateLocation;
//# sourceMappingURL=deactivate-location.js.map