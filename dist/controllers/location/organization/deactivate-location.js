"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateLocation = void 0;
const location_1 = __importDefault(require("../../../services/location"));
const types_1 = require("../types");
/**
 * Deactivate a location (soft delete)
 * @param req Express request object
 * @param res Express response object
 */
const deactivateLocation = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!(0, types_1.checkAuthentication)(req, res)) {
            return;
        }
        // Validate location ID
        if (!(0, types_1.validateLocationId)(req, res)) {
            return;
        }
        const orgId = req.user.orgId;
        const locationId = parseInt(req.params.locationId);
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
        (0, types_1.handleControllerError)(res, error, 'Failed to deactivate location');
    }
};
exports.deactivateLocation = deactivateLocation;
exports.default = exports.deactivateLocation;
//# sourceMappingURL=deactivate-location.js.map