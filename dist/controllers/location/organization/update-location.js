import locationService from '../../../services/location';
import { checkAuthentication, validateLocationId, handleControllerError } from '../types';
/**
 * Update a location
 * @param req Express request object
 * @param res Express response object
 */
export const updateLocation = async (req, res) => {
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
        const locationData = req.body;
        // Validate required fields
        if (!locationData.name) {
            res.status(400).json({ message: 'Location name is required' });
            return;
        }
        try {
            const location = await locationService.updateLocation(locationId, orgId, locationData);
            res.status(200).json({
                message: 'Location updated successfully',
                location
            });
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
        handleControllerError(res, error, 'Failed to update location');
    }
};
export default updateLocation;
//# sourceMappingURL=update-location.js.map