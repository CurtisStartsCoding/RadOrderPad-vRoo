"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logLLMUsage = logLLMUsage;
/**
 * LLM usage logging functionality
 */
const db_1 = require("../../config/db");
/**
 * Log LLM usage details
 */
async function logLLMUsage(llmResponse) {
    try {
        // Log LLM usage details
        await (0, db_1.queryPhiDb)(`INSERT INTO llm_validation_logs (
        provider,
        model,
        prompt_tokens,
        completion_tokens,
        total_tokens,
        latency_ms,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id`, [
            llmResponse.provider,
            llmResponse.model,
            llmResponse.promptTokens || 0,
            llmResponse.completionTokens || 0,
            llmResponse.totalTokens || 0,
            llmResponse.latencyMs
        ]);
    }
    catch (error) {
        // If the table doesn't exist, log the error but don't fail the validation
        const err = error;
        if (err.message && err.message.includes('relation "llm_validation_logs" does not exist')) {
            // eslint-disable-next-line no-console
            console.log('Database setup: llm_validation_logs table does not exist');
            // Create the table if it doesn't exist
            try {
                await (0, db_1.queryPhiDb)(`
          CREATE TABLE IF NOT EXISTS llm_validation_logs (
            id SERIAL PRIMARY KEY,
            provider VARCHAR(50) NOT NULL,
            model VARCHAR(100) NOT NULL,
            prompt_tokens INTEGER,
            completion_tokens INTEGER,
            total_tokens INTEGER,
            latency_ms INTEGER,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `);
                // eslint-disable-next-line no-console
                console.log('Database setup: llm_validation_logs table created successfully');
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            }
            catch (_) {
                // eslint-disable-next-line no-console
                console.error('Database setup error: Failed to create llm_validation_logs table');
            }
        }
        else {
            // eslint-disable-next-line no-console
            console.error('LLM usage logging failed - check server logs for details');
        }
    }
}
//# sourceMappingURL=llm-logging.js.map