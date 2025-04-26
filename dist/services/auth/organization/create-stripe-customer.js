"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStripeCustomer = createStripeCustomer;
const billing_1 = __importDefault(require("../../../services/billing"));
const logger_1 = __importDefault(require("../../../utils/logger"));
/**
 * Create a Stripe customer for an organization
 */
async function createStripeCustomer(organizationId, organizationName, contactEmail) {
    try {
        const stripeCustomerId = await billing_1.default.createStripeCustomerForOrg({
            organizationId: organizationId,
            name: organizationName,
            email: contactEmail
        });
        return stripeCustomerId;
    }
    catch (error) {
        logger_1.default.error('Error creating Stripe customer:', {
            error,
            organizationId,
            organizationName,
            contactEmail
        });
        // Continue with registration even if Stripe customer creation fails
        // The billing_id can be updated later
        return null;
    }
}
//# sourceMappingURL=create-stripe-customer.js.map