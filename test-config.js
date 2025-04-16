/**
 * Centralized configuration for test scripts
 */

module.exports = {
    // API settings
    api: {
        baseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
        jwtSecret: process.env.JWT_SECRET || '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112'
    },
    
    // Database settings
    database: {
        container: process.env.DB_CONTAINER || 'radorderpad-postgres',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5433,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres123',
        mainDb: process.env.MAIN_DB || 'radorder_main',
        phiDb: process.env.PHI_DB || 'radorder_phi'
    },
    
    // LLM settings
    llm: {
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        grokApiKey: process.env.GROK_API_KEY,
        openaiApiKey: process.env.OPENAI_API_KEY,
        claudeModelName: process.env.CLAUDE_MODEL_NAME || 'claude-3-7-sonnet-20250219',
        grokModelName: process.env.GROK_MODEL_NAME || 'grok-3',
        gptModelName: process.env.GPT_MODEL_NAME || 'gpt-4-turbo'
    }
};