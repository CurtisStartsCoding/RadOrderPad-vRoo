/**
 * Main validation logic
 */
import { ValidationResult } from '../../models';
import { stripPHI, extractMedicalKeywords } from '../../utils/text-processing';
import { callLLMWithFallback } from '../../utils/llm';
import {
  getActivePromptTemplate,
  generateDatabaseContextWithRedis,
  constructPrompt
  // Commented out unused imports that may be needed in the future
  // getUserSpecialty,
  // getSpecialtyWordCount
} from '../../utils/database';
import { processLLMResponse } from '../../utils/response';
import { ValidationContext, ValidationOptions } from './types';
import { logValidationAttempt } from './logging';
import config from '../../config/config';
import enhancedLogger from '../../utils/enhanced-logger';

/**
 * Run validation on the provided text and context
 */
export async function runValidation(
  text: string, 
  context: ValidationContext = {}, 
  options: ValidationOptions = {}
): Promise<ValidationResult> {
  try {
    enhancedLogger.info('Starting validation process...');
    
    // 1. Strip PHI from the text
    const sanitizedText = stripPHI(text);
    enhancedLogger.info('PHI sanitization completed');
    
    // 2. Extract medical keywords for context generation
    const keywords = extractMedicalKeywords(sanitizedText);
    enhancedLogger.info(`Extracted keywords count: ${keywords.length}`);
    
    // 3. Get the active default prompt template
    const promptTemplate = await getActivePromptTemplate();
    enhancedLogger.info(`Using prompt template ID: ${promptTemplate.id}`);
    
    // 4. Generate database context based on keywords using RedisSearch
    const databaseContext = await generateDatabaseContextWithRedis(keywords);
    enhancedLogger.info('Database context generation completed');
    
    // Log database context if enabled
    if (config.llm.logLlmContext) {
      enhancedLogger.info('--- START GENERATED DATABASE CONTEXT ---');
      enhancedLogger.info(`Context Length: ${databaseContext.length} characters`);
      enhancedLogger.info(databaseContext);
      enhancedLogger.info('--- END GENERATED DATABASE CONTEXT ---');
    }
    
    // 5. Construct the prompt with hard-coded word limit of 33
    enhancedLogger.info('Using word count limit: 33');
    
    const prompt = constructPrompt(
      promptTemplate.content_template,
      sanitizedText,
      databaseContext,
      33, // Hard-coded to 33 words
      context.isOverrideValidation || false
    );
    enhancedLogger.info('Prompt construction completed');
    
    // Log final LLM prompt if enabled
    if (config.llm.logLlmContext) {
      enhancedLogger.info('--- START FINAL LLM PROMPT ---');
      enhancedLogger.info(`Prompt Length: ${prompt.length} characters`);
      enhancedLogger.info(prompt);
      enhancedLogger.info('--- END FINAL LLM PROMPT ---');
    }
    
    // 7. Call LLM with fallback logic
    const llmResponse = await callLLMWithFallback(prompt);
    enhancedLogger.info(`LLM call completed using ${llmResponse.provider}`);
    enhancedLogger.info(`Performance metrics - Tokens: ${llmResponse.totalTokens}, Latency: ${llmResponse.latencyMs}ms`);
    
    // 8. Process the LLM response
    const validationResult = processLLMResponse(llmResponse.content);
    enhancedLogger.info('Response processing completed');
    
    // 9. Log the validation attempt to the PHI database (skip if in test mode)
    if (!options.testMode) {
      await logValidationAttempt(
        text,
        validationResult,
        llmResponse,
        context.orderId,
        context.userId || 1 // Default to user ID 1 if not provided
      );
      enhancedLogger.info('Validation attempt logging completed');
    } else {
      enhancedLogger.info('Test mode active: Validation logging skipped');
    }
    
    // 10. Return the validation result
    return validationResult;
  } catch (error) {
    // Log error without including potentially sensitive details
    enhancedLogger.error('Error in validation process - check server logs for details', error);
    
    // Still throw the error for proper error handling up the chain
    throw error;
  }
}