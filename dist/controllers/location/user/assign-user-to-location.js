"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignUserToLocation = void 0;
const location_1 = __importDefault(require("../../../services/location"));
const types_1 = require("../types");
/**
 * Assign a user to a location
 * @param req Express request object
 * @param res Express response object
 */
const assignUserToLocation = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!(0, types_1.checkAuthentication)(req, res)) {
            return;
        }
        // Validate user and location IDs
        if (!(0, types_1.validateUserAndLocationIds)(req, res)) {
            return;
        }
        const orgId = req.user.orgId;
        const userId = parseInt(req.params.userId);
        const locationId = parseInt(req.params.locationId);
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
        (0, types_1.handleControllerError)(res, error, 'Failed to assign user to location');
    }
};
exports.assignUserToLocation = assignUserToLocation;
exports.default = exports.assignUserToLocation;
//# sourceMappingURL=assign-user-to-location.js.map