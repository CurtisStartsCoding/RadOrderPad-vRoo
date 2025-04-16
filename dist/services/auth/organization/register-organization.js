"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOrganization = registerOrganization;
const db_1 = require("../../../config/db");
const verify_registration_key_1 = require("./verify-registration-key");
const create_organization_1 = require("./create-organization");
const create_stripe_customer_1 = require("./create-stripe-customer");
const create_admin_user_1 = require("./create-admin-user");
const format_user_response_1 = require("../user/format-user-response");
const generate_token_1 = require("../token/generate-token");
/**
 * Register a new organization and admin user
 */
async function registerOrganization(orgData, userData) {
    // Verify registration key
    if (!(0, verify_registration_key_1.verifyRegistrationKey)(orgData.registration_key)) {
        throw new Error('Invalid registration key');
    }
    // Start a transaction
    const client = await (0, db_1.queryMainDb)('BEGIN');
    try {
        // Create the organization
        const organization = await (0, create_organization_1.createOrganization)(client, orgData);
        // Create Stripe customer
        const stripeCustomerId = await (0, create_stripe_customer_1.createStripeCustomer)(organization.id, organization.name, orgData.contact_email || userData.email);
        // Update the organization object with the billing_id
        if (stripeCustomerId) {
            organization.billing_id = stripeCustomerId;
        }
        // Create the admin user
        const user = await (0, create_admin_user_1.createAdminUser)(client, userData, organization.id);
        // Commit the transaction
        await client.query('COMMIT');
        // Generate JWT token
        const token = (0, generate_token_1.generateToken)(user);
        // Prepare the response
        const userResponse = (0, format_user_response_1.formatUserResponse)(user);
        return {
            token,
            user: userResponse,
            organization
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