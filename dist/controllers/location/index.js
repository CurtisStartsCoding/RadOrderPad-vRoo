import * as organizationControllers from './organization';
import * as userControllers from './user';
/**
 * Controller for handling location-related requests
 */
class LocationController {
    /**
     * List locations for the authenticated user's organization
     * @param req Express request object
     * @param res Express response object
     */
    async listLocations(req, res) {
        return organizationControllers.listLocations(req, res);
    }
    /**
     * Create a new location for the authenticated user's organization
     * @param req Express request object
     * @param res Express response object
     */
    async createLocation(req, res) {
        return organizationControllers.createLocation(req, res);
    }
    /**
     * Get details of a specific location
     * @param req Express request object
     * @param res Express response object
     */
    async getLocation(req, res) {
        return organizationControllers.getLocation(req, res);
    }
    /**
     * Update a location
     * @param req Express request object
     * @param res Express response object
     */
    async updateLocation(req, res) {
        return organizationControllers.updateLocation(req, res);
    }
    /**
     * Deactivate a location (soft delete)
     * @param req Express request object
     * @param res Express response object
     */
    async deactivateLocation(req, res) {
        return organizationControllers.deactivateLocation(req, res);
    }
    /**
     * List locations assigned to a user
     * @param req Express request object
     * @param res Express response object
     */
    async listUserLocations(req, res) {
        return userControllers.listUserLocations(req, res);
    }
    /**
     * Assign a user to a location
     * @param req Express request object
     * @param res Express response object
     */
    async assignUserToLocation(req, res) {
        return userControllers.assignUserToLocation(req, res);
    }
    /**
     * Unassign a user from a location
     * @param req Express request object
     * @param res Express response object
     */
    async unassignUserFromLocation(req, res) {
        return userControllers.unassignUserFromLocation(req, res);
    }
}
export default new LocationController();
// Also export the individual controllers for direct use
export { organizationControllers, userControllers };
//# sourceMappingURL=index.js.map