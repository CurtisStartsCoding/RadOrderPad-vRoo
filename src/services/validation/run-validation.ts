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

/**
 * Run validation on the provided text and context
 */
export async function runValidation(
  text: string, 
  context: ValidationContext = {}, 
  options: ValidationOptions = {}
): Promise<ValidationResult> {
  try {
    // eslint-disable-next-line no-console
    console.log('Starting validation process...');
    
    // 1. Strip PHI from the text
    const sanitizedText = stripPHI(text);
    // eslint-disable-next-line no-console
    console.log('PHI sanitization completed');
    
    // 2. Extract medical keywords for context generation
    const keywords = extractMedicalKeywords(sanitizedText);
    // eslint-disable-next-line no-console
    console.log('Extracted keywords count:', keywords.length);
    
    // 3. Get the active default prompt template
    const promptTemplate = await getActivePromptTemplate();
    // eslint-disable-next-line no-console
    console.log('Using prompt template ID:', promptTemplate.id);
    
    // 4. Generate database context based on keywords using RedisSearch
    const databaseContext = await generateDatabaseContextWithRedis(keywords);
    // eslint-disable-next-line no-console
    console.log('Database context generation completed');
    
    // 5. Construct the prompt with hard-coded word limit of 33
    // eslint-disable-next-line no-console
    console.log('Using word count limit: 33');
    
    const prompt = constructPrompt(
      promptTemplate.content_template,
      sanitizedText,
      databaseContext,
      33, // Hard-coded to 33 words
      context.isOverrideValidation || false
    );
    // eslint-disable-next-line no-console
    console.log('Prompt construction completed');
    
    // 7. Call LLM with fallback logic
    const llmResponse = await callLLMWithFallback(prompt);
    // eslint-disable-next-line no-console
    console.log(`LLM call completed using ${llmResponse.provider}`);
    // eslint-disable-next-line no-console
    console.log(`Performance metrics - Tokens: ${llmResponse.totalTokens}, Latency: ${llmResponse.latencyMs}ms`);
    
    // 8. Process the LLM response
    const validationResult = processLLMResponse(llmResponse.content);
    // eslint-disable-next-line no-console
    console.log('Response processing completed');
    
    // 9. Log the validation attempt to the PHI database (skip if in test mode)
    if (!options.testMode) {
      await logValidationAttempt(
        text,
        validationResult,
        llmResponse,
        context.orderId,
        context.userId || 1 // Default to user ID 1 if not provided
      );
      // eslint-disable-next-line no-console
      console.log('Validation attempt logging completed');
    } else {
      // eslint-disable-next-line no-console
      console.log('Test mode active: Validation logging skipped');
    }
    
    // 10. Return the validation result
    return validationResult;
  } catch (error) {
    // Log error without including potentially sensitive details
    // eslint-disable-next-line no-console
    console.error('Error in validation process - check server logs for details');
    
    // Still throw the error for proper error handling up the chain
    throw error;
  }
}