import Stripe from 'stripe';
/**
 * Initialize Stripe with the API key from environment variables
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-04-10', // Use the API version from config with type assertion
});
//# sourceMappingURL=utils.js.map