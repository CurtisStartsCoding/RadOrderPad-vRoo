/**
 * LLM usage logging functionality
 */
import { queryPhiDb } from '../../config/db';
import { LLMResponse } from '../../utils/llm';

/**
 * Log LLM usage details
 */
export async function logLLMUsage(llmResponse: LLMResponse): Promise<void> {
  try {
    // Log LLM usage details
    await queryPhiDb(
      `INSERT INTO llm_validation_logs (
        provider,
        model,
        prompt_tokens,
        completion_tokens,
        total_tokens,
        latency_ms,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id`,
      [
        llmResponse.provider,
        llmResponse.model,
        llmResponse.promptTokens || 0,
        llmResponse.completionTokens || 0,
        llmResponse.totalTokens || 0,
        llmResponse.latencyMs
      ]
    );
  } catch (error) {
    // If the table doesn't exist, log the error but don't fail the validation
    const err = error as Error;
    if (err.message && err.message.includes('relation "llm_validation_logs" does not exist')) {
      console.log('llm_validation_logs table does not exist. Skipping LLM usage logging.');
      
      // Create the table if it doesn't exist
      try {
        await queryPhiDb(`
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
        console.log('Created llm_validation_logs table');
      } catch (createError) {
        console.error('Error creating llm_validation_logs table:', createError);
      }
    } else {
      console.error('Error logging LLM usage:', error);
    }
  }
}