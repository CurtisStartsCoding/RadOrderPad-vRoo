"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterController = void 0;
const auth_1 = __importDefault(require("../../services/auth"));
const error_handler_1 = require("./error-handler");
/**
 * Controller for handling organization and user registration
 */
class RegisterController {
    /**
     * Register a new organization and admin user
     */
    async register(req, res) {
        try {
            const { organization, user } = req.body;
            // Validate request body
            if (!organization || !user) {
                res.status(400).json({ message: 'Organization and user data are required' });
                return;
            }
            // Validate required fields
            if (!organization.name || !organization.type) {
                res.status(400).json({ message: 'Organization name and type are required' });
                return;
            }
            if (!user.email || !user.password || !user.first_name || !user.last_name || !user.role) {
                res.status(400).json({ message: 'User email, password, first name, last name, and role are required' });
                return;
            }
            const orgData = {
                name: organization.name,
                type: organization.type,
                npi: organization.npi,
                tax_id: organization.tax_id,
                address_line1: organization.address_line1,
                address_line2: organization.address_line2,
                city: organization.city,
                state: organization.state,
                zip_code: organization.zip_code,
                phone_number: organization.phone_number,
                fax_number: organization.fax_number,
                contact_email: organization.contact_email,
                website: organization.website,
                registration_key: organization.registration_key
            };
            const userData = {
                email: user.email,
                password: user.password,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                npi: user.npi,
                specialty: user.specialty,
                phone_number: user.phone_number
            };
            const result = await auth_1.default.registerOrganization(orgData, userData);
            res.status(201).json(result);
        }
        catch (error) {
            (0, error_handler_1.handleAuthError)(error, res, 'Registration', error_handler_1.registrationErrorMap, 'An error occurred during registration');
        }
    }
}
exports.RegisterController = RegisterController;
exports.default = new RegisterController();
//# sourceMappingURL=register.controller.js.map