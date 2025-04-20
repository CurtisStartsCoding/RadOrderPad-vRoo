/**
 * Main validation logic
 */
import { ValidationResult } from '../../models';
import { stripPHI, extractMedicalKeywords } from '../../utils/text-processing';
import { callLLMWithFallback } from '../../utils/llm';
import {
  getActivePromptTemplate,
  generateDatabaseContextWithRedis,
  constructPrompt,
  getUserSpecialty,
  getSpecialtyWordCount
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
    console.log('Starting validation process...');
    
    // 1. Strip PHI from the text
    const sanitizedText = stripPHI(text);
    console.log('PHI stripped from text');
    
    // 2. Extract medical keywords for context generation
    const keywords = extractMedicalKeywords(sanitizedText);
    console.log('Extracted keywords:', keywords);
    
    // 3. Get the active default prompt template
    const promptTemplate = await getActivePromptTemplate();
    console.log('Using prompt template:', promptTemplate.name);
    
    // 4. Generate database context based on keywords using RedisSearch
    const databaseContext = await generateDatabaseContextWithRedis(keywords);
    console.log('Generated database context using RedisSearch');
    
    // 5. Construct the prompt with hard-coded word limit of 33
    console.log('Using hard-coded word count: 33');
    
    const prompt = constructPrompt(
      promptTemplate.content_template,
      sanitizedText,
      databaseContext,
      33, // Hard-coded to 33 words
      context.isOverrideValidation || false
    );
    console.log('Constructed prompt');
    
    // 7. Call LLM with fallback logic
    const llmResponse = await callLLMWithFallback(prompt);
    console.log(`LLM call successful using ${llmResponse.provider} (${llmResponse.model})`);
    console.log(`Tokens used: ${llmResponse.totalTokens}, Latency: ${llmResponse.latencyMs}ms`);
    
    // 8. Process the LLM response
    const validationResult = processLLMResponse(llmResponse.content);
    console.log('Processed LLM response');
    
    // 9. Log the validation attempt to the PHI database (skip if in test mode)
    if (!options.testMode) {
      await logValidationAttempt(
        text,
        validationResult,
        llmResponse,
        context.orderId,
        context.userId || 1 // Default to user ID 1 if not provided
      );
      console.log('Logged validation attempt to PHI database');
    } else {
      console.log('Test mode: Skipping validation attempt logging');
    }
    
    // 10. Return the validation result
    return validationResult;
  } catch (error) {
    console.error('Error in validation process:', error);
    throw error;
  }
}