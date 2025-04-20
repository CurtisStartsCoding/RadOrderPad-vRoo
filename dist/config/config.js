import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
export default {
    // Server configuration
    port: process.env.PORT || 3000,
    frontendUrl: process.env.FRONTEND_URL || 'https://app.radorderpad.com',
    nodeEnv: process.env.NODE_ENV || 'development',
    // Database configuration
    mainDatabaseUrl: process.env.MAIN_DATABASE_URL,
    phiDatabaseUrl: process.env.PHI_DATABASE_URL,
    // JWT configuration
    jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_key_change_in_production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    // Bcrypt configuration
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'),
    // Registration configuration
    registrationKey: process.env.REGISTRATION_KEY || 'default_registration_key_change_in_production',
    // AWS configuration
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-2',
        s3: {
            bucketName: process.env.S3_BUCKET_NAME
        },
        ses: {
            fromEmail: process.env.SES_FROM_EMAIL || 'no-reply@radorderpad.com',
            testMode: process.env.EMAIL_TEST_MODE === 'true' || false
        }
    },
    // Stripe configuration
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        apiVersion: '2024-04-10', // Fixed API version
        creditBundlePriceId: process.env.STRIPE_PRICE_ID_CREDIT_BUNDLE,
        frontendSuccessUrl: process.env.FRONTEND_CHECKOUT_SUCCESS_URL || 'https://radorderpad.com/billing?success=true&session_id={CHECKOUT_SESSION_ID}',
        frontendCancelUrl: process.env.FRONTEND_CHECKOUT_CANCEL_URL || 'https://radorderpad.com/billing?canceled=true'
    },
    // Test mode configuration
    testMode: {
        email: process.env.EMAIL_TEST_MODE === 'true' || false,
        billing: process.env.BILLING_TEST_MODE === 'true' || false
    },
    // LLM configuration
    llm: {
        // API keys
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        grokApiKey: process.env.GROK_API_KEY,
        openaiApiKey: process.env.OPENAI_API_KEY,
        // Model names
        claudeModelName: process.env.CLAUDE_MODEL_NAME || 'claude-3-opus-20240229',
        grokModelName: process.env.GROK_MODEL_NAME || 'grok-1',
        gptModelName: process.env.GPT_MODEL_NAME || 'gpt-4-turbo',
        // Other LLM settings
        maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '4000'),
        timeout: parseInt(process.env.LLM_TIMEOUT || '30000') // 30 seconds
    }
};
//# sourceMappingURL=config.js.map