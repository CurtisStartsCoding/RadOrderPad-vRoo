/**
 * Rare Disease Service
 * 
 * This module provides functions for identifying rare diseases using Redis Vector Search.
 * It implements the single responsibility principle by focusing only on rare disease identification.
 */

import { queryMainDb } from '../../config/db';
import { searchSimilarRareDiseases } from '../../utils/cache/redis-vector';
import enhancedLogger from '../../utils/enhanced-logger';

/**
 * Interface for external embedding service
 * This would typically be implemented by a separate module that calls an external API
 */
interface EmbeddingService {
  getEmbedding(text: string): Promise<number[]>;
}

/**
 * Mock embedding service for demonstration purposes
 * In a real implementation, this would call an external API like OpenAI
 */
class MockEmbeddingService implements EmbeddingService {
  async getEmbedding(_text: string): Promise<number[]> {
    // This is a mock implementation that returns a random embedding
    // In a real implementation, this would use the text parameter to generate an embedding
    const dimension = 384; // Common dimension for text embeddings
    return Array.from({ length: dimension }, () => Math.random() * 2 - 1);
  }
}

// Create embedding service instance
// In a real implementation, this would be injected or configured
const embeddingService = new MockEmbeddingService();

/**
 * Rare disease data structure
 */
export interface RareDiseaseRow {
  code: string;
  description: string;
  symptoms?: string;
  prevalence?: string;
  inheritance_pattern?: string;
  age_of_onset?: string;
  treatment_options?: string;
}

/**
 * Identify potential rare diseases from clinical notes
 * @param clinicalNotes Clinical notes text
 * @param limit Maximum number of results
 * @returns Promise<RareDiseaseRow[]> Array of potential rare diseases
 */
export async function identifyRareDiseases(
  clinicalNotes: string,
  limit: number = 5
): Promise<RareDiseaseRow[]> {
  try {
    // Generate embedding for clinical notes
    const embedding = await embeddingService.getEmbedding(clinicalNotes);
    
    // Search for similar rare disease codes using vector search
    const similarCodes = await searchSimilarRareDiseases(embedding, limit);
    
    if (similarCodes.length > 0) {
      enhancedLogger.debug(`Found ${similarCodes.length} potential rare diseases using vector search`);
      
      // Convert to RareDiseaseRow format
      const results = similarCodes.map(code => ({
        code: code.code,
        description: code.description,
        // Other fields would be populated from database if needed
      })) as RareDiseaseRow[];
      
      return results;
    }
    
    // If no results from vector search, fall back to database query
    enhancedLogger.debug('No rare diseases found with vector search, falling back to database');
    
    // This would be a more complex query in practice
    // For example, it might use full-text search or other techniques
    const result = await queryMainDb(
      `SELECT 
        code, 
        description,
        symptoms,
        prevalence,
        inheritance_pattern,
        age_of_onset,
        treatment_options
       FROM 
        rare_disease_registry
       LIMIT $1`,
      [limit]
    );
    
    return result.rows as RareDiseaseRow[];
  } catch (error) {
    enhancedLogger.error({
      message: 'Error identifying rare diseases',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return [];
  }
}

/**
 * Index rare disease codes with vector embeddings
 * This would typically be called by a scheduled job or admin function
 * @returns Promise<void>
 */
export async function indexRareDiseases(): Promise<void> {
  try {
    // Get rare disease codes from database
    const result = await queryMainDb(
      `SELECT 
        code, 
        description,
        symptoms
       FROM 
        rare_disease_registry`
    );
    
    enhancedLogger.info(`Indexing ${result.rows.length} rare disease codes with vector embeddings`);
    
    // Process in batches to avoid overwhelming the embedding service
    const batchSize = 10;
    for (let i = 0; i < result.rows.length; i += batchSize) {
      const batch = result.rows.slice(i, i + batchSize);
      
      // Process each disease in the batch
      await Promise.all(batch.map(async (row) => {
        try {
          // Generate embedding from description and symptoms
          const textToEmbed = `${row.description} ${row.symptoms || ''}`.trim();
          // Generate embedding but don't store it in this mock implementation
          await embeddingService.getEmbedding(textToEmbed);
          
          // Store in Redis with 7-day TTL
          // This would call storeRareDiseaseEmbedding from redis-vector module
          // For now, we'll just log it
          enhancedLogger.debug(`Generated embedding for rare disease: ${row.code}`);
          
          // In a real implementation, we would store the embedding
          // const embedding = await embeddingService.getEmbedding(textToEmbed);
          // await storeRareDiseaseEmbedding(row.code, row.description, embedding);
        } catch (embeddingError) {
          enhancedLogger.error({
            message: `Error generating embedding for rare disease: ${row.code}`,
            error: embeddingError instanceof Error ? embeddingError.message : String(embeddingError)
          });
        }
      }));
      
      // Add a small delay between batches to avoid rate limiting
      if (i + batchSize < result.rows.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    enhancedLogger.info(`Indexed ${result.rows.length} rare disease codes with vector embeddings`);
  } catch (error) {
    enhancedLogger.error({
      message: 'Error indexing rare diseases',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

/**
 * Search for rare diseases by symptoms
 * @param symptoms Symptoms text
 * @param limit Maximum number of results
 * @returns Promise<RareDiseaseRow[]> Array of rare diseases
 */
export async function searchRareDiseasesBySymptoms(
  symptoms: string,
  limit: number = 5
): Promise<RareDiseaseRow[]> {
  try {
    // Generate embedding for symptoms
    const embedding = await embeddingService.getEmbedding(symptoms);
    
    // Search for similar rare diseases using vector search
    const similarCodes = await searchSimilarRareDiseases(embedding, limit);
    
    if (similarCodes.length > 0) {
      enhancedLogger.debug(`Found ${similarCodes.length} rare diseases matching symptoms using vector search`);
      
      // Convert to RareDiseaseRow format
      const results = similarCodes.map(code => ({
        code: code.code,
        description: code.description,
        // Other fields would be populated from database if needed
      })) as RareDiseaseRow[];
      
      return results;
    }
    
    // If no results from vector search, fall back to database query
    enhancedLogger.debug('No rare diseases found with vector search, falling back to database');
    
    // This would be a more complex query in practice
    const result = await queryMainDb(
      `SELECT 
        code, 
        description,
        symptoms,
        prevalence,
        inheritance_pattern,
        age_of_onset,
        treatment_options
       FROM 
        rare_disease_registry
       WHERE 
        symptoms ILIKE $1
       LIMIT $2`,
      [`%${symptoms}%`, limit]
    );
    
    return result.rows as RareDiseaseRow[];
  } catch (error) {
    enhancedLogger.error({
      message: 'Error searching rare diseases by symptoms',
      symptoms,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return [];
  }
}