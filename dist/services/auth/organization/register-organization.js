"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOrganization = registerOrganization;
const db_1 = require("../../../config/db");
const types_1 = require("../types");
const create_organization_1 = require("./create-organization");
const create_stripe_customer_1 = require("./create-stripe-customer");
const create_admin_user_1 = require("./create-admin-user");
const format_user_response_1 = require("../user/format-user-response");
const generate_token_1 = require("../token/generate-token");
const generate_verification_token_1 = require("../token/generate-verification-token");
// Import the notification manager
const account_1 = __importDefault(require("../../../services/notification/manager/account"));
const enhanced_logger_1 = __importDefault(require("../../../utils/enhanced-logger"));
/**
 * Register a new organization and admin user
 * Modified version that doesn't require a registration key
 */
async function registerOrganization(orgData, userData) {
    // Start a transaction
    const client = await (0, db_1.getMainDbClient)();
    try {
        // Begin transaction
        await client.query('BEGIN');
        // Check if organization with the same name already exists
        const existingOrgResult = await client.query('SELECT id FROM organizations WHERE name = $1', [orgData.name]);
        if (existingOrgResult.rows.length > 0) {
            throw new Error('Organization already exists');
        }
        // Check if user with the same email already exists
        const existingUserResult = await client.query('SELECT id FROM users WHERE email = $1', [userData.email]);
        if (existingUserResult.rows.length > 0) {
            throw new Error('Email already in use');
        }
        // Create the organization
        const organization = await (0, create_organization_1.createOrganization)(client, {
            ...orgData,
            // Set initial status to pending verification instead of active
            status: types_1.OrganizationStatus.PENDING_VERIFICATION
        });
        // Create Stripe customer
        const stripeCustomerId = await (0, create_stripe_customer_1.createStripeCustomer)(organization.id, organization.name, orgData.contact_email || userData.email);
        // Update the organization object with the billing_id
        if (stripeCustomerId) {
            organization.billing_id = stripeCustomerId;
            // Update the organization record with the billing_id
            await client.query('UPDATE organizations SET billing_id = $1 WHERE id = $2', [stripeCustomerId, organization.id]);
        }
        // Create the admin user
        const user = await (0, create_admin_user_1.createAdminUser)(client, userData, organization.id);
        // Generate email verification token
        const verificationToken = await (0, generate_verification_token_1.generateVerificationToken)(client, user.id);
        // Commit the transaction
        await client.query('COMMIT');
        // Generate JWT token
        const token = (0, generate_token_1.generateToken)(user);
        // Prepare the response
        const userResponse = (0, format_user_response_1.formatUserResponse)(user);
        // Send verification email
        try {
            await account_1.default.sendVerificationEmail(userData.email, verificationToken, {
                firstName: userData.first_name,
                organizationName: orgData.name
            });
        }
        catch (emailError) {
            enhanced_logger_1.default.error('Failed to send verification email:', emailError);
            // Continue with registration even if email sending fails
        }
        return {
            token,
            user: userResponse,
            organization,
            message: 'Registration successful. Please check your email to verify your account.'
        };
    }
    catch (error) {
        // Rollback the transaction in case of error
        await client.query('ROLLBACK');
        throw error;
    }
    finally {
        // Release the client back to the pool
        client.release();
    }
}
//# sourceMappingURL=register-organization.js.map