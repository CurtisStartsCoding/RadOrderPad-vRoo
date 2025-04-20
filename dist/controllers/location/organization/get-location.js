import locationService from '../../../services/location';
import { checkAuthentication, validateLocationId, handleControllerError } from '../types';
/**
 * Get details of a specific location
 * @param req Express request object
 * @param res Express response object
 */
export const getLocation = async (req, res) => {
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
            const location = await locationService.getLocation(locationId, orgId);
            res.status(200).json({ location });
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
        handleControllerError(res, error, 'Failed to get location');
    }
};
export default getLocation;
//# sourceMappingURL=get-location.js.map