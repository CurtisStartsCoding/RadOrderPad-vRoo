"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationController = void 0;
const location_1 = __importDefault(require("../services/location"));
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
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const orgId = req.user.orgId;
            const locations = await location_1.default.listLocations(orgId);
            res.status(200).json({ locations });
        }
        catch (error) {
            console.error('Error in listLocations controller:', error);
            res.status(500).json({ message: 'Failed to list locations', error: error.message });
        }
    }
    /**
     * Create a new location for the authenticated user's organization
     * @param req Express request object
     * @param res Express response object
     */
    async createLocation(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const orgId = req.user.orgId;
            const locationData = req.body;
            // Validate required fields
            if (!locationData.name) {
                res.status(400).json({ message: 'Location name is required' });
                return;
            }
            const location = await location_1.default.createLocation(orgId, locationData);
            res.status(201).json({
                message: 'Location created successfully',
                location
            });
        }
        catch (error) {
            console.error('Error in createLocation controller:', error);
            res.status(500).json({ message: 'Failed to create location', error: error.message });
        }
    }
    /**
     * Get details of a specific location
     * @param req Express request object
     * @param res Express response object
     */
    async getLocation(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const orgId = req.user.orgId;
            const locationId = parseInt(req.params.locationId);
            if (isNaN(locationId)) {
                res.status(400).json({ message: 'Invalid location ID' });
                return;
            }
            try {
                const location = await location_1.default.getLocation(locationId, orgId);
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
            console.error('Error in getLocation controller:', error);
            res.status(500).json({ message: 'Failed to get location', error: error.message });
        }
    }
    /**
     * Update a location
     * @param req Express request object
     * @param res Express response object
     */
    async updateLocation(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const orgId = req.user.orgId;
            const locationId = parseInt(req.params.locationId);
            const locationData = req.body;
            if (isNaN(locationId)) {
                res.status(400).json({ message: 'Invalid location ID' });
                return;
            }
            // Validate required fields
            if (!locationData.name) {
                res.status(400).json({ message: 'Location name is required' });
                return;
            }
            try {
                const location = await location_1.default.updateLocation(locationId, orgId, locationData);
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
            console.error('Error in updateLocation controller:', error);
            res.status(500).json({ message: 'Failed to update location', error: error.message });
        }
    }
    /**
     * Deactivate a location (soft delete)
     * @param req Express request object
     * @param res Express response object
     */
    async deactivateLocation(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const orgId = req.user.orgId;
            const locationId = parseInt(req.params.locationId);
            if (isNaN(locationId)) {
                res.status(400).json({ message: 'Invalid location ID' });
                return;
            }
            try {
                const success = await location_1.default.deactivateLocation(locationId, orgId);
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
            console.error('Error in deactivateLocation controller:', error);
            res.status(500).json({ message: 'Failed to deactivate location', error: error.message });
        }
    }
    /**
     * List locations assigned to a user
     * @param req Express request object
     * @param res Express response object
     */
    async listUserLocations(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const orgId = req.user.orgId;
            const userId = parseInt(req.params.userId);
            if (isNaN(userId)) {
                res.status(400).json({ message: 'Invalid user ID' });
                return;
            }
            try {
                const locations = await location_1.default.listUserLocations(userId, orgId);
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
            console.error('Error in listUserLocations controller:', error);
            res.status(500).json({ message: 'Failed to list user locations', error: error.message });
        }
    }
    /**
     * Assign a user to a location
     * @param req Express request object
     * @param res Express response object
     */
    async assignUserToLocation(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const orgId = req.user.orgId;
            const userId = parseInt(req.params.userId);
            const locationId = parseInt(req.params.locationId);
            if (isNaN(userId) || isNaN(locationId)) {
                res.status(400).json({ message: 'Invalid user ID or location ID' });
                return;
            }
            try {
                const success = await location_1.default.assignUserToLocation(userId, locationId, orgId);
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
            console.error('Error in assignUserToLocation controller:', error);
            res.status(500).json({ message: 'Failed to assign user to location', error: error.message });
        }
    }
    /**
     * Unassign a user from a location
     * @param req Express request object
     * @param res Express response object
     */
    async unassignUserFromLocation(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const orgId = req.user.orgId;
            const userId = parseInt(req.params.userId);
            const locationId = parseInt(req.params.locationId);
            if (isNaN(userId) || isNaN(locationId)) {
                res.status(400).json({ message: 'Invalid user ID or location ID' });
                return;
            }
            try {
                const success = await location_1.default.unassignUserFromLocation(userId, locationId, orgId);
                if (success) {
                    res.status(200).json({
                        message: 'User unassigned from location successfully',
                        userId,
                        locationId
                    });
                }
                else {
                    res.status(404).json({ message: 'User-location assignment not found' });
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
            console.error('Error in unassignUserFromLocation controller:', error);
            res.status(500).json({ message: 'Failed to unassign user from location', error: error.message });
        }
    }
}
exports.LocationController = LocationController;
exports.default = new LocationController();
//# sourceMappingURL=location.controller.js.map